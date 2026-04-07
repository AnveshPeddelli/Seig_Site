const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

router.post("/recommend", productController.recommendProducts);

module.exports = router;