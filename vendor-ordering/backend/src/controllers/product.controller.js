const productService = require("../services/product.service");
const asyncHandler = require("../utils/async-handler");
const { ensureInt, optionalIntArray } = require("../utils/validation");

const listProducts = asyncHandler(async (req, res) => {
  const products = await productService.listProducts(req.query);
  res.json(products);
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProduct(ensureInt(req.params.id, "productId"));
  res.json(product);
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(ensureInt(req.params.id, "productId"), req.body);
  res.json(product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(ensureInt(req.params.id, "productId"));
  res.status(204).send();
});

const recommendProducts = asyncHandler(async (req, res) => {
  const products = await productService.recommendProducts(
    req.body.optionIds,
    optionalIntArray(req.body.specValueIds, "specValueIds")
  );
  res.json(products);
});

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  recommendProducts,
};
