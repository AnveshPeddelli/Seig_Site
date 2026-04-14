const specificationRepo = require("../repositories/specification.repository");
const { AppError, ensureString } = require("../utils/validation");

const mapValues = (values) => {
  if (!Array.isArray(values) || values.length === 0) {
    throw new AppError("values must be a non-empty array");
  }

  return values.map((value, index) => ({
    value: ensureString(value, `values[${index}]`),
  }));
};

const listSpecifications = () => specificationRepo.getSpecifications();

const getSpecification = async (id) => {
  const specification = await specificationRepo.getSpecificationById(id);

  if (!specification) {
    throw new AppError("Specification not found", 404);
  }

  return specification;
};

const createSpecification = async (payload) => {
  const name = ensureString(payload.name, "name");
  const data = { name };

  if (payload.values !== undefined) {
    data.values = {
      create: mapValues(payload.values),
    };
  }

  return specificationRepo.createSpecification(data);
};

const updateSpecification = async (id, payload) => {
  await getSpecification(id);

  const data = {};

  if (payload.name !== undefined) {
    data.name = ensureString(payload.name, "name");
  }

  if (payload.values !== undefined) {
    data.values = {
      deleteMany: {},
      create: mapValues(payload.values),
    };
  }

  if (Object.keys(data).length === 0) {
    throw new AppError("No valid fields provided for update");
  }

  return specificationRepo.updateSpecification(id, data);
};

const deleteSpecification = async (id) => {
  await getSpecification(id);
  await specificationRepo.deleteSpecification(id);
};

module.exports = {
  listSpecifications,
  getSpecification,
  createSpecification,
  updateSpecification,
  deleteSpecification,
};
