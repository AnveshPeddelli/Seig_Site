const prisma = require("../config/prisma");

const regionalInclude = {
  vendors: {
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
  },
};

const getRegionals = () => prisma.regional.findMany({ include: regionalInclude });

const getRegionalById = (id) =>
  prisma.regional.findUnique({
    where: { id },
    include: regionalInclude,
  });

const createRegional = (data) => prisma.regional.create({ data });

const updateRegional = (id, data) =>
  prisma.regional.update({
    where: { id },
    data,
    include: regionalInclude,
  });

const deleteRegional = (id) => prisma.regional.delete({ where: { id } });

const getRegionalVendors = (id) =>
  prisma.vendor.findMany({
    where: { regionalId: id },
    include: {
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
    },
  });

module.exports = {
  getRegionals,
  getRegionalById,
  createRegional,
  updateRegional,
  deleteRegional,
  getRegionalVendors,
};
