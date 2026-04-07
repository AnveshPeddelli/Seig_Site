const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendor.controller");

router.get("/:id/products", vendorController.getVendorProducts);

module.exports = router;