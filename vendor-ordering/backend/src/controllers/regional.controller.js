const regionalService = require("../services/regional.service");
const asyncHandler = require("../utils/async-handler");
const { ensureInt } = require("../utils/validation");

const listRegionals = asyncHandler(async (req, res) => {
  const regionals = await regionalService.listRegionals();
  res.json(regionals);
});

const getRegional = asyncHandler(async (req, res) => {
  const regional = await regionalService.getRegional(ensureInt(req.params.id, "regionalId"));
  res.json(regional);
});

const createRegional = asyncHandler(async (req, res) => {
  const regional = await regionalService.createRegional(req.body);
  res.status(201).json(regional);
});

const updateRegional = asyncHandler(async (req, res) => {
  const regional = await regionalService.updateRegional(
    ensureInt(req.params.id, "regionalId"),
    req.body
  );
  res.json(regional);
});

const deleteRegional = asyncHandler(async (req, res) => {
  await regionalService.deleteRegional(ensureInt(req.params.id, "regionalId"));
  res.status(204).send();
});

const getRegionalVendors = asyncHandler(async (req, res) => {
  const vendors = await regionalService.listRegionalVendors(ensureInt(req.params.id, "regionalId"));
  res.json(vendors);
});

module.exports = {
  listRegionals,
  getRegional,
  createRegional,
  updateRegional,
  deleteRegional,
  getRegionalVendors,
};
