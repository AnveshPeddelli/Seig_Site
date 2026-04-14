const productRepo = require("../repositories/product.repository");
const {
  AppError,
  ensureString,
  ensurePositiveNumber,
  optionalPositiveNumber,
  optionalIntArray,
  ensureIntArray,
} = require("../utils/validation");

const listProducts = (query) =>
  productRepo.getProducts({
    search: query.search?.trim() || undefined,
    minPrice: optionalPositiveNumber(query.minPrice, "minPrice"),
    maxPrice: optionalPositiveNumber(query.maxPrice, "maxPrice"),
    specValueIds: query.specValueIds
      ? optionalIntArray(String(query.specValueIds).split(","), "specValueIds")
      : undefined,
  });

const getProduct = async (productId) => {
  const product = await productRepo.getProductById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

const createProduct = async (payload) => {
  const name = ensureString(payload.name, "name");
  const price = ensurePositiveNumber(payload.price, "price");
  const specValueIds = optionalIntArray(payload.specValueIds, "specValueIds");

  return productRepo.createProduct({
    name,
    price,
    ...(specValueIds && specValueIds.length > 0
      ? {
          specs: {
            connect: specValueIds.map((id) => ({ id })),
          },
        }
      : {}),
  });
};

const updateProduct = async (productId, payload) => {
  await getProduct(productId);

  const data = {};

  if (payload.name !== undefined) {
    data.name = ensureString(payload.name, "name");
  }

  if (payload.price !== undefined) {
    data.price = ensurePositiveNumber(payload.price, "price");
  }

  if (payload.specValueIds !== undefined) {
    const specValueIds = optionalIntArray(payload.specValueIds, "specValueIds") || [];
    data.specs = {
      set: specValueIds.map((id) => ({ id })),
    };
  }

  if (Object.keys(data).length === 0) {
    throw new AppError("No valid fields provided for update");
  }

  return productRepo.updateProduct(productId, data);
};

const deleteProduct = async (productId) => {
  await getProduct(productId);
  await productRepo.deleteProduct(productId);
};

const recommendProducts = async (optionIds, specValueIds) => {
  const normalizedOptionIds = ensureIntArray(optionIds, "optionIds");
  const normalizedSpecValueIds = specValueIds
    ? optionalIntArray(specValueIds, "specValueIds")
    : undefined;

  const options = await productRepo.getOptionsWithProducts(normalizedOptionIds);

  if (options.length !== normalizedOptionIds.length) {
    throw new AppError("One or more optionIds are invalid", 404);
  }

  const productLists = options.map((option) => option.products);
  let result = productLists[0] || [];

  for (let index = 1; index < productLists.length; index += 1) {
    const allowedIds = new Set(productLists[index].map((product) => product.id));
    result = result.filter((product) => allowedIds.has(product.id));
  }

  if (normalizedSpecValueIds && normalizedSpecValueIds.length > 0) {
    result = result.filter((product) =>
      product.specs.some((specValue) => normalizedSpecValueIds.includes(specValue.id))
    );
  }

  return result;
};

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  recommendProducts,
};
