const express = require("express");
const cors = require("cors");
require("dotenv").config();

const regionalRoutes = require("./src/routes/regional.routes");
const vendorRoutes = require("./src/routes/vendor.routes");
const productRoutes = require("./src/routes/product.routes");
const questionRoutes = require("./src/routes/question.routes");
const specificationRoutes = require("./src/routes/specification.routes");
const orderRoutes = require("./src/routes/order.routes");
const { errorHandler, notFoundHandler } = require("./src/middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Vendor Ordering Backend Running",
    version: "1.0.0",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/regionals", regionalRoutes);
app.use("/vendors", vendorRoutes);
app.use("/products", productRoutes);
app.use("/questions", questionRoutes);
app.use("/specifications", specificationRoutes);
app.use("/orders", orderRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
