const prisma = require("../config/prisma");

const orderInclude = {
  vendor: {
    include: {
      regional: true,
    },
  },
  items: {
    include: {
      product: {
        include: {
          specs: {
            include: {
              specification: true,
            },
          },
        },
      },
    },
  },
  payments: {
    orderBy: {
      createdAt: "asc",
    },
  },
};

const getOrders = (filters = {}) =>
  prisma.order.findMany({
    where: {
      ...(filters.vendorId !== undefined ? { vendorId: filters.vendorId } : {}),
      ...(filters.regionalId !== undefined ? { regionalId: filters.regionalId } : {}),
      ...(filters.status ? { status: filters.status } : {}),
    },
    include: orderInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

const getOrderById = (id, db = prisma) =>
  db.order.findUnique({
    where: { id },
    include: orderInclude,
  });

const createOrder = (db, data) =>
  db.order.create({
    data,
    include: orderInclude,
  });

const updateOrder = (db, id, data) =>
  db.order.update({
    where: { id },
    data,
    include: orderInclude,
  });

const createPayment = (db, data) =>
  db.payment.create({
    data,
  });

const getPaymentsForOrder = (orderId, db = prisma) =>
  db.payment.findMany({
    where: { orderId },
    orderBy: {
      createdAt: "asc",
    },
  });

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  createPayment,
  getPaymentsForOrder,
};
