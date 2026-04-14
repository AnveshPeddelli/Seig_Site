const prisma = require("../config/prisma");
const orderRepo = require("../repositories/order.repository");
const vendorRepo = require("../repositories/vendor.repository");
const regionalRepo = require("../repositories/regional.repository");
const {
  AppError,
  ensureInt,
  optionalInt,
  ensureString,
  ensurePositiveNumber,
  ensureOrderItems,
  normalizeStatus,
} = require("../utils/validation");

const FINAL_STOCK_HOLD_STATUSES = new Set(["PENDING", "CONFIRMED", "PAID", "PARTIALLY_PAID"]);
const ALLOWED_ORDER_STATUSES = new Set([
  "PENDING",
  "CONFIRMED",
  "PARTIALLY_PAID",
  "PAID",
  "FULFILLED",
  "CANCELLED",
]);
const ALLOWED_PAYMENT_STATUSES = new Set(["PENDING", "SUCCESS", "FAILED"]);

const listOrders = (query) =>
  orderRepo.getOrders({
    vendorId: query.vendorId !== undefined ? optionalInt(query.vendorId, "vendorId") : undefined,
    regionalId:
      query.regionalId !== undefined ? optionalInt(query.regionalId, "regionalId") : undefined,
    status: query.status ? normalizeStatus(query.status, "status") : undefined,
  });

const getOrder = async (orderId) => {
  const order = await orderRepo.getOrderById(orderId);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return order;
};

const createOrder = async (payload) => {
  const vendorId = ensureInt(payload.vendorId, "vendorId");
  const regionalId = ensureInt(payload.regionalId, "regionalId");
  const customerName = ensureString(payload.customerName, "customerName");
  const customerPhone = ensureString(payload.customerPhone, "customerPhone");
  const normalizedItems = ensureOrderItems(payload.items);
  const itemMap = new Map();

  for (const item of normalizedItems) {
    const existing = itemMap.get(item.productId);
    itemMap.set(item.productId, {
      productId: item.productId,
      quantity: (existing?.quantity || 0) + item.quantity,
    });
  }

  const items = [...itemMap.values()];

  const vendor = await vendorRepo.getVendorById(vendorId);

  if (!vendor) {
    throw new AppError("Vendor not found", 404);
  }

  const regional = await regionalRepo.getRegionalById(regionalId);

  if (!regional) {
    throw new AppError("Regional not found", 404);
  }

  if (vendor.regionalId !== regionalId) {
    throw new AppError("Vendor does not belong to the provided regional");
  }

  const productIds = [...new Set(items.map((item) => item.productId))];
  const vendorInventory = await vendorRepo.getVendorInventoryForProducts(vendorId, productIds);
  const inventoryByProductId = new Map(
    vendorInventory.map((inventoryItem) => [inventoryItem.productId, inventoryItem])
  );

  let totalAmount = 0;

  for (const item of items) {
    const inventoryItem = inventoryByProductId.get(item.productId);

    if (!inventoryItem) {
      throw new AppError(`Product ${item.productId} is not stocked by this vendor`);
    }

    if (inventoryItem.stock < item.quantity) {
      throw new AppError(`Insufficient stock for product ${inventoryItem.product.name}`);
    }

    totalAmount += inventoryItem.product.price * item.quantity;
  }

  return prisma.$transaction(async (tx) => {
    for (const item of items) {
      const inventoryItem = inventoryByProductId.get(item.productId);

      await tx.vendorProduct.update({
        where: {
          vendorId_productId: {
            vendorId,
            productId: item.productId,
          },
        },
        data: {
          stock: inventoryItem.stock - item.quantity,
        },
      });
    }

    return orderRepo.createOrder(tx, {
      vendorId,
      regionalId,
      customerName,
      customerPhone,
      totalAmount,
      status: "PENDING",
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
    });
  });
};

const updateOrderStatus = async (orderId, nextStatusRaw) => {
  const nextStatus = normalizeStatus(nextStatusRaw, "status");

  if (!ALLOWED_ORDER_STATUSES.has(nextStatus)) {
    throw new AppError("Invalid order status");
  }

  const existingOrder = await getOrder(orderId);
  const currentStatus = existingOrder.status.toUpperCase();

  if (currentStatus === nextStatus) {
    return existingOrder;
  }

  return prisma.$transaction(async (tx) => {
    if (currentStatus !== "CANCELLED" && nextStatus === "CANCELLED") {
      for (const item of existingOrder.items) {
        const currentInventory = await tx.vendorProduct.findUnique({
          where: {
            vendorId_productId: {
              vendorId: existingOrder.vendorId,
              productId: item.productId,
            },
          },
        });

        await tx.vendorProduct.update({
          where: {
            vendorId_productId: {
              vendorId: existingOrder.vendorId,
              productId: item.productId,
            },
          },
          data: {
            stock: (currentInventory?.stock || 0) + item.quantity,
          },
        });
      }
    }

    if (currentStatus === "CANCELLED" && FINAL_STOCK_HOLD_STATUSES.has(nextStatus)) {
      for (const item of existingOrder.items) {
        const currentInventory = await tx.vendorProduct.findUnique({
          where: {
            vendorId_productId: {
              vendorId: existingOrder.vendorId,
              productId: item.productId,
            },
          },
        });

        if (!currentInventory || currentInventory.stock < item.quantity) {
          throw new AppError(`Insufficient stock to reactivate order item ${item.product.name}`);
        }

        await tx.vendorProduct.update({
          where: {
            vendorId_productId: {
              vendorId: existingOrder.vendorId,
              productId: item.productId,
            },
          },
          data: {
            stock: currentInventory.stock - item.quantity,
          },
        });
      }
    }

    return orderRepo.updateOrder(tx, orderId, { status: nextStatus });
  });
};

const createPayment = async (orderId, payload) => {
  const order = await getOrder(orderId);
  const amount = ensurePositiveNumber(payload.amount, "amount");
  const paidTo = ensureString(payload.paidTo, "paidTo");
  const status = normalizeStatus(payload.status || "SUCCESS", "status");

  if (!ALLOWED_PAYMENT_STATUSES.has(status)) {
    throw new AppError("Invalid payment status");
  }

  return prisma.$transaction(async (tx) => {
    await orderRepo.createPayment(tx, {
      orderId,
      amount,
      paidTo,
      status,
    });

    const refreshedOrder = await orderRepo.getOrderById(orderId, tx);
    const successfulTotal = refreshedOrder.payments
      .filter((payment) => payment.status.toUpperCase() === "SUCCESS")
      .reduce((sum, payment) => sum + payment.amount, 0);

    if (order.status.toUpperCase() !== "CANCELLED") {
      let nextOrderStatus = refreshedOrder.status;

      if (successfulTotal >= refreshedOrder.totalAmount) {
        nextOrderStatus = "PAID";
      } else if (successfulTotal > 0) {
        nextOrderStatus = "PARTIALLY_PAID";
      }

      if (nextOrderStatus !== refreshedOrder.status) {
        return orderRepo.updateOrder(tx, orderId, { status: nextOrderStatus });
      }
    }

    return orderRepo.getOrderById(orderId, tx);
  });
};

const listPayments = async (orderId) => {
  await getOrder(orderId);
  return orderRepo.getPaymentsForOrder(orderId);
};

module.exports = {
  listOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  createPayment,
  listPayments,
};
