const vendorRepo = require("../repositories/vendor.repository");
const regionalRepo = require("../repositories/regional.repository");
const productRepo = require("../repositories/product.repository");
const {
  AppError,
  ensureString,
  optionalInt,
  ensureNonNegativeInt,
} = require("../utils/validation");

const listVendors = (query) =>
  vendorRepo.getVendors({
    regionalId: optionalInt(query.regionalId, "regionalId"),
    search: query.search?.trim() || undefined,
  });

const getVendor = async (vendorId) => {
  const vendor = await vendorRepo.getVendorById(vendorId);

  if (!vendor) {
    throw new AppError("Vendor not found", 404);
  }

  return vendor;
};

const createVendor = async (payload) => {
  const name = ensureString(payload.name, "name");
  const location = ensureString(payload.location, "location");
  const phone = ensureString(payload.phone, "phone");
  const regionalId = optionalInt(payload.regionalId, "regionalId");

  if (regionalId === undefined) {
    throw new AppError("regionalId is required");
  }

  const regional = await regionalRepo.getRegionalById(regionalId);

  if (!regional) {
    throw new AppError("Regional not found", 404);
  }

  return vendorRepo.createVendor({
    name,
    location,
    phone,
    regionalId,
  });
};

const updateVendor = async (vendorId, payload) => {
  await getVendor(vendorId);

  const data = {};

  if (payload.name !== undefined) {
    data.name = ensureString(payload.name, "name");
  }

  if (payload.location !== undefined) {
    data.location = ensureString(payload.location, "location");
  }

  if (payload.phone !== undefined) {
    data.phone = ensureString(payload.phone, "phone");
  }

  if (payload.regionalId !== undefined) {
    const regionalId = optionalInt(payload.regionalId, "regionalId");
    const regional = await regionalRepo.getRegionalById(regionalId);

    if (!regional) {
      throw new AppError("Regional not found", 404);
    }

    data.regionalId = regionalId;
  }

  if (Object.keys(data).length === 0) {
    throw new AppError("No valid fields provided for update");
  }

  return vendorRepo.updateVendor(vendorId, data);
};

const deleteVendor = async (vendorId) => {
  await getVendor(vendorId);
  await vendorRepo.deleteVendor(vendorId);
};

const fetchVendorProducts = async (vendorId) => {
  await getVendor(vendorId);
  return vendorRepo.getVendorProducts(vendorId);
};

const assignVendorProduct = async (vendorId, productId, stock) => {
  await getVendor(vendorId);

  const product = await productRepo.getProductById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return vendorRepo.upsertVendorProduct(
    vendorId,
    productId,
    ensureNonNegativeInt(stock, "stock")
  );
};

const removeVendorProduct = async (vendorId, productId) => {
  await getVendor(vendorId);

  const vendorProduct = await vendorRepo.getVendorProduct(vendorId, productId);

  if (!vendorProduct) {
    throw new AppError("Vendor inventory item not found", 404);
  }

  await vendorRepo.deleteVendorProduct(vendorId, productId);
};

module.exports = {
  listVendors,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor,
  fetchVendorProducts,
  assignVendorProduct,
  removeVendorProduct,
};
