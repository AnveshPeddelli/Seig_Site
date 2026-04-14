const express = require("express");
const orderController = require("../controllers/order.controller");

const router = express.Router();

router.get("/", orderController.listOrders);
router.post("/", orderController.createOrder);
router.get("/:id", orderController.getOrder);
router.patch("/:id/status", orderController.updateOrderStatus);
router.get("/:id/payments", orderController.listPayments);
router.post("/:id/payments", orderController.createPayment);

module.exports = router;
