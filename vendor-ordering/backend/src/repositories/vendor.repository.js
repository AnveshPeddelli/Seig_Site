const prisma = require("../config/prisma");

const getVendorProducts = async (vendorId) => {
    return prisma.VendorProduct.findMany({
        where:{vendorId},
        include:{product:true}
    });
};

module.exports = {
    getVendorProducts
}