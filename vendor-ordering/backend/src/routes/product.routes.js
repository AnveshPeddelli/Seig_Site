const express = require("express");
const productController = require("../controllers/product.controller");

const router = express.Router();

router.get("/", productController.listProducts);
router.post("/", productController.createProduct);
router.post("/recommend", productController.recommendProducts);
router.get("/:id", productController.getProduct);
router.patch("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
