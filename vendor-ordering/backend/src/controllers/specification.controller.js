const specificationService = require("../services/specification.service");
const asyncHandler = require("../utils/async-handler");
const { ensureInt } = require("../utils/validation");

const listSpecifications = asyncHandler(async (req, res) => {
  const specifications = await specificationService.listSpecifications();
  res.json(specifications);
});

const getSpecification = asyncHandler(async (req, res) => {
  const specification = await specificationService.getSpecification(
    ensureInt(req.params.id, "specificationId")
  );
  res.json(specification);
});

const createSpecification = asyncHandler(async (req, res) => {
  const specification = await specificationService.createSpecification(req.body);
  res.status(201).json(specification);
});

const updateSpecification = asyncHandler(async (req, res) => {
  const specification = await specificationService.updateSpecification(
    ensureInt(req.params.id, "specificationId"),
    req.body
  );
  res.json(specification);
});

const deleteSpecification = asyncHandler(async (req, res) => {
  await specificationService.deleteSpecification(ensureInt(req.params.id, "specificationId"));
  res.status(204).send();
});

module.exports = {
  listSpecifications,
  getSpecification,
  createSpecification,
  updateSpecification,
  deleteSpecification,
};
