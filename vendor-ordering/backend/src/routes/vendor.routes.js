const express = require("express");
const vendorController = require("../controllers/vendor.controller");

const router = express.Router();

router.get("/", vendorController.listVendors);
router.post("/", vendorController.createVendor);
router.get("/:id", vendorController.getVendor);
router.patch("/:id", vendorController.updateVendor);
router.delete("/:id", vendorController.deleteVendor);
router.get("/:id/products", vendorController.getVendorProducts);
router.put("/:id/products/:productId", vendorController.assignVendorProduct);
router.delete("/:id/products/:productId", vendorController.removeVendorProduct);

module.exports = router;
