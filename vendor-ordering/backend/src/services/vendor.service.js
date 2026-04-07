const vendorRepo = require("../repositories/vendor.repository");

const fetchVendorProducts = async(vendorId) => {
    if(!vendorId) throw new Error("vendor ID requested");
    return vendorRepo.getVendorProducts(vendorId);
};

module.exports = {
    fetchVendorProducts
}