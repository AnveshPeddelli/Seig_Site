const prisma = require("../config/prisma");

const specificationInclude = {
  values: {
    orderBy: {
      id: "asc",
    },
  },
};

const getSpecifications = () =>
  prisma.specification.findMany({
    include: specificationInclude,
    orderBy: {
      id: "asc",
    },
  });

const getSpecificationById = (id) =>
  prisma.specification.findUnique({
    where: { id },
    include: specificationInclude,
  });

const createSpecification = (data) =>
  prisma.specification.create({
    data,
    include: specificationInclude,
  });

const updateSpecification = (id, data) =>
  prisma.specification.update({
    where: { id },
    data,
    include: specificationInclude,
  });

const deleteSpecification = (id) => prisma.specification.delete({ where: { id } });

module.exports = {
  getSpecifications,
  getSpecificationById,
  createSpecification,
  updateSpecification,
  deleteSpecification,
};
