const express = require("express");
const cors = require("cors");
require("dotenv").config();

const {PrismaClient} = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Vendor Ordering Backend Running");
});

app.get("/vendor/:id/products", async (req, res) => {
    const vendorId = parseInt(req.params.id);
    console.log("Starting server...");
    try{
        const products = await prisma.vendorProduct.findMany({
            where:{vendorId},
            include:{
                product:true,
            },
        });

        res.json(products);
    }
    catch(error){
        console.error(error);
        res.status(500).json({error: "Something went wrong"});
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
