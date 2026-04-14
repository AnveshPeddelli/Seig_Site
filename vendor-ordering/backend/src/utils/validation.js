class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

const ensureObject = (value, fieldName) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new AppError(`${fieldName} must be an object`);
  }

  return value;
};

const ensureString = (value, fieldName) => {
  if (typeof value !== "string" || value.trim() === "") {
    throw new AppError(`${fieldName} is required`);
  }

  return value.trim();
};

const optionalString = (value, fieldName) => {
  if (value === undefined) {
    return undefined;
  }

  return ensureString(value, fieldName);
};

const ensureInt = (value, fieldName) => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    throw new AppError(`${fieldName} must be an integer`);
  }

  return parsed;
};

const optionalInt = (value, fieldName) => {
  if (value === undefined) {
    return undefined;
  }

  return ensureInt(value, fieldName);
};

const ensurePositiveNumber = (value, fieldName) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new AppError(`${fieldName} must be a positive number`);
  }

  return parsed;
};

const optionalPositiveNumber = (value, fieldName) => {
  if (value === undefined) {
    return undefined;
  }

  return ensurePositiveNumber(value, fieldName);
};

const ensureNonNegativeInt = (value, fieldName) => {
  const parsed = ensureInt(value, fieldName);

  if (parsed < 0) {
    throw new AppError(`${fieldName} must be 0 or greater`);
  }

  return parsed;
};

const ensureIntArray = (value, fieldName) => {
  if (!Array.isArray(value) || value.length === 0) {
    throw new AppError(`${fieldName} must be a non-empty array`);
  }

  return [...new Set(value.map((item) => ensureInt(item, fieldName)))];
};

const optionalIntArray = (value, fieldName) => {
  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw new AppError(`${fieldName} must be an array`);
  }

  return [...new Set(value.map((item) => ensureInt(item, fieldName)))];
};

const ensureOrderItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError("items must be a non-empty array");
  }

  return items.map((item, index) => {
    ensureObject(item, `items[${index}]`);

    const quantity = ensureInt(item.quantity, `items[${index}].quantity`);

    if (quantity <= 0) {
      throw new AppError(`items[${index}].quantity must be greater than 0`);
    }

    return {
      productId: ensureInt(item.productId, `items[${index}].productId`),
      quantity,
    };
  });
};

const normalizeStatus = (value, fieldName = "status") => {
  const normalized = ensureString(value, fieldName).toUpperCase();
  return normalized;
};

module.exports = {
  AppError,
  ensureInt,
  optionalInt,
  ensureObject,
  ensureString,
  optionalString,
  ensurePositiveNumber,
  optionalPositiveNumber,
  ensureNonNegativeInt,
  ensureIntArray,
  optionalIntArray,
  ensureOrderItems,
  normalizeStatus,
};
