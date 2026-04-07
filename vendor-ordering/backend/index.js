const express = require("express");
const cors = require("cors");
require("dotenv").config();

const path = require("path");
const productRoutes = require(path.resolve(__dirname, "src/routes/product.routes.js"));
const vendorRoutes = require(path.resolve(__dirname, "src/routes/vendor.routes.js"));

//console.log("VendorRoutes:", vendorRoutes);
//console.log("Type:", typeof vendorRoutes);

const app = express();

//Registers
app.use(cors());
app.use(express.json());
app.use("/vendor", vendorRoutes);
app.use("/products", productRoutes);

app.get("/", (req, res) => {
    res.send("Vendor Ordering Backend Running");
});

app.get("/products", (req, res) => {
    res.send("Products root working");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//console.log(typeof vendorRoutes);