const prisma = require("../config/prisma");

const productInclude = {
  specs: {
    include: {
      specification: true,
    },
  },
  vendors: {
    include: {
      vendor: {
        include: {
          regional: true,
        },
      },
    },
  },
};

const getProducts = (filters = {}) =>
  prisma.product.findMany({
    where: {
      ...(filters.search
        ? {
            name: {
              contains: filters.search,
              mode: "insensitive",
            },
          }
        : {}),
      ...(filters.minPrice !== undefined || filters.maxPrice !== undefined
        ? {
            price: {
              ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
              ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
            },
          }
        : {}),
      ...(filters.specValueIds && filters.specValueIds.length > 0
        ? {
            specs: {
              some: {
                id: {
                  in: filters.specValueIds,
                },
              },
            },
          }
        : {}),
    },
    include: productInclude,
  });

const getProductById = (id) =>
  prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });

const getProductsByIds = (ids) =>
  prisma.product.findMany({
    where: { id: { in: ids } },
    include: {
      specs: {
        include: {
          specification: true,
        },
      },
    },
  });

const createProduct = (data) =>
  prisma.product.create({
    data,
    include: productInclude,
  });

const updateProduct = (id, data) =>
  prisma.product.update({
    where: { id },
    data,
    include: productInclude,
  });

const deleteProduct = (id) => prisma.product.delete({ where: { id } });

const getOptionsWithProducts = (optionIds) =>
  prisma.option.findMany({
    where: {
      id: { in: optionIds },
    },
    include: {
      products: {
        include: {
          specs: {
            include: {
              specification: true,
            },
          },
        },
      },
    },
  });

module.exports = {
  getProducts,
  getProductById,
  getProductsByIds,
  createProduct,
  updateProduct,
  deleteProduct,
  getOptionsWithProducts,
};
