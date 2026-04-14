const express = require("express");
const regionalController = require("../controllers/regional.controller");

const router = express.Router();

router.get("/", regionalController.listRegionals);
router.post("/", regionalController.createRegional);
router.get("/:id", regionalController.getRegional);
router.patch("/:id", regionalController.updateRegional);
router.delete("/:id", regionalController.deleteRegional);
router.get("/:id/vendors", regionalController.getRegionalVendors);

module.exports = router;
