const express = require("express");
const specificationController = require("../controllers/specification.controller");

const router = express.Router();

router.get("/", specificationController.listSpecifications);
router.post("/", specificationController.createSpecification);
router.get("/:id", specificationController.getSpecification);
router.patch("/:id", specificationController.updateSpecification);
router.delete("/:id", specificationController.deleteSpecification);

module.exports = router;
