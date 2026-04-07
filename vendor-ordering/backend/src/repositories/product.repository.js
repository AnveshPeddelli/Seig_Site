const prisma = require("../config/prisma");

const getOptionsWithProducts = async (optionIds) => {
  return prisma.option.findMany({
    where: {
      id: { in: optionIds }
    },
    include: {
      products: true
    }
  });
};

module.exports = {
  getOptionsWithProducts
};