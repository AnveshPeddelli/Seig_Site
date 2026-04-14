const prisma = require("../config/prisma");

const vendorInclude = {
  regional: true,
  products: {
    include: {
      product: {
        include: {
          specs: {
            include: {
              specification: true,
            },
          },
        },
      },
    },
  },
};

const getVendors = (filters = {}) =>
  prisma.vendor.findMany({
    where: {
      regionalId: filters.regionalId,
      ...(filters.search
        ? {
            OR: [
              { name: { contains: filters.search, mode: "insensitive" } },
              { location: { contains: filters.search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: vendorInclude,
  });

const getVendorById = (id) =>
  prisma.vendor.findUnique({
    where: { id },
    include: vendorInclude,
  });

const createVendor = (data) =>
  prisma.vendor.create({
    data,
    include: vendorInclude,
  });

const updateVendor = (id, data) =>
  prisma.vendor.update({
    where: { id },
    data,
    include: vendorInclude,
  });

const deleteVendor = (id) => prisma.vendor.delete({ where: { id } });

const getVendorProducts = (vendorId) =>
  prisma.vendorProduct.findMany({
    where: { vendorId },
    include: {
      product: {
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

const getVendorProduct = (vendorId, productId) =>
  prisma.vendorProduct.findFirst({
    where: { vendorId, productId },
    include: {
      product: true,
      vendor: true,
    },
  });

const upsertVendorProduct = (vendorId, productId, stock) =>
  prisma.vendorProduct.upsert({
    where: {
      vendorId_productId: {
        vendorId,
        productId,
      },
    },
    update: { stock },
    create: { vendorId, productId, stock },
    include: {
      product: true,
      vendor: true,
    },
  });

const deleteVendorProduct = (vendorId, productId) =>
  prisma.vendorProduct.delete({
    where: {
      vendorId_productId: {
        vendorId,
        productId,
      },
    },
  });

const getVendorInventoryForProducts = (vendorId, productIds) =>
  prisma.vendorProduct.findMany({
    where: {
      vendorId,
      productId: { in: productIds },
    },
    include: {
      product: true,
    },
  });

module.exports = {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
  getVendorProducts,
  getVendorProduct,
  upsertVendorProduct,
  deleteVendorProduct,
  getVendorInventoryForProducts,
};
