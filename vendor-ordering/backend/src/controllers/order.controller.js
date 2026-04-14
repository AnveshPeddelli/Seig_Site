const orderService = require("../services/order.service");
const asyncHandler = require("../utils/async-handler");
const { ensureInt } = require("../utils/validation");

const listOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.listOrders(req.query);
  res.json(orders);
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrder(ensureInt(req.params.id, "orderId"));
  res.json(order);
});

const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.body);
  res.status(201).json(order);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(
    ensureInt(req.params.id, "orderId"),
    req.body.status
  );
  res.json(order);
});

const createPayment = asyncHandler(async (req, res) => {
  const order = await orderService.createPayment(ensureInt(req.params.id, "orderId"), req.body);
  res.json(order);
});

const listPayments = asyncHandler(async (req, res) => {
  const payments = await orderService.listPayments(ensureInt(req.params.id, "orderId"));
  res.json(payments);
});

module.exports = {
  listOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  createPayment,
  listPayments,
};
