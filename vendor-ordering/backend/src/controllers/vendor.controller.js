const vendorService = require("../services/vendor.service");
const asyncHandler = require("../utils/async-handler");
const { ensureInt } = require("../utils/validation");

const listVendors = asyncHandler(async (req, res) => {
  const vendors = await vendorService.listVendors(req.query);
  res.json(vendors);
});

const getVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorService.getVendor(ensureInt(req.params.id, "vendorId"));
  res.json(vendor);
});

const createVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorService.createVendor(req.body);
  res.status(201).json(vendor);
});

const updateVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorService.updateVendor(ensureInt(req.params.id, "vendorId"), req.body);
  res.json(vendor);
});

const deleteVendor = asyncHandler(async (req, res) => {
  await vendorService.deleteVendor(ensureInt(req.params.id, "vendorId"));
  res.status(204).send();
});

const getVendorProducts = asyncHandler(async (req, res) => {
  const products = await vendorService.fetchVendorProducts(ensureInt(req.params.id, "vendorId"));
  res.json(products);
});

const assignVendorProduct = asyncHandler(async (req, res) => {
  const vendorProduct = await vendorService.assignVendorProduct(
    ensureInt(req.params.id, "vendorId"),
    ensureInt(req.params.productId, "productId"),
    req.body.stock
  );
  res.json(vendorProduct);
});

const removeVendorProduct = asyncHandler(async (req, res) => {
  await vendorService.removeVendorProduct(
    ensureInt(req.params.id, "vendorId"),
    ensureInt(req.params.productId, "productId")
  );
  res.status(204).send();
});

module.exports = {
  listVendors,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor,
  getVendorProducts,
  assignVendorProduct,
  removeVendorProduct,
};
