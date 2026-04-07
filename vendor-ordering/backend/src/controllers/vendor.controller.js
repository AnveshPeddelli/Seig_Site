const vendorService = require("../services/vendor.service");

const getVendorProducts = async (req, res) => {
    try{
        const vendorId = parseInt(req.params.id);
        const products = await vendorService.fetchVendorProducts(vendorId);
        res.json(products);
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({error: error.message});    
    }
};

module.exports = {
    getVendorProducts
};

//console.log("Controller export:", module.exports);
