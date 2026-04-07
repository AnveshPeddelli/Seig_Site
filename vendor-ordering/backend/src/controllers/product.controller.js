const productService = require("../services/product.service");

const recommendProducts = async (req, res) => {
  try {
    const { optionIds } = req.body;

    if (!optionIds || optionIds.length === 0) {
      return res.status(400).json({ error: "optionIds required" });
    }

    const products = await productService.recommendProducts(optionIds);

    res.json(products);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  recommendProducts
};