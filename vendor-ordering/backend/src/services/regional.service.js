const regionalRepo = require("../repositories/regional.repository");
const { AppError, ensureString } = require("../utils/validation");

const listRegionals = () => regionalRepo.getRegionals();

const getRegional = async (id) => {
  const regional = await regionalRepo.getRegionalById(id);

  if (!regional) {
    throw new AppError("Regional not found", 404);
  }

  return regional;
};

const createRegional = async (payload) => {
  const name = ensureString(payload.name, "name");
  const location = ensureString(payload.location, "location");

  return regionalRepo.createRegional({ name, location });
};

const updateRegional = async (id, payload) => {
  await getRegional(id);

  const data = {};

  if (payload.name !== undefined) {
    data.name = ensureString(payload.name, "name");
  }

  if (payload.location !== undefined) {
    data.location = ensureString(payload.location, "location");
  }

  if (Object.keys(data).length === 0) {
    throw new AppError("No valid fields provided for update");
  }

  return regionalRepo.updateRegional(id, data);
};

const deleteRegional = async (id) => {
  await getRegional(id);
  await regionalRepo.deleteRegional(id);
};

const listRegionalVendors = async (id) => {
  await getRegional(id);
  return regionalRepo.getRegionalVendors(id);
};

module.exports = {
  listRegionals,
  getRegional,
  createRegional,
  updateRegional,
  deleteRegional,
  listRegionalVendors,
};
