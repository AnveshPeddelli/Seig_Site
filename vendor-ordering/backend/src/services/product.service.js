const productRepo = require("../repositories/product.repository");

const recommendProducts = async (optionIds, specValueIds) => {
  const options = await productRepo.getOptionsWithProducts(optionIds);

  let productLists = options.map(o => o.products);

  let result = productLists[0] || [];

  for (let i = 1; i < productLists.length; i++) {
    const set = new Set(productLists[i].map(p => p.id));
    result = result.filter(p => set.has(p.id));
  }

  // filter by specs
  if (specValueIds && specValueIds.length > 0) {
    result = result.filter(p =>
      p.specs.some(s => specValueIds.includes(s.id))
    );
  }

  return result;
};


module.exports = {
  recommendProducts
};