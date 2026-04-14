const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

async function main()
{
    const vendor = await prisma.vendor.create({
        data:{
            name:"Vendor one",
            location: "Bangalore",
            phone:"9490290297",
        },
    });

    const product1 = await prisma.product.create({
        data:{
            name:"Cement Bag",
            description: "Ultra Strong Cement",
            price:450,
            imageUrl: "https://via.placeholder.com/150",
        },
    });

    const product2 = await prisma.product.create({
        data:{
            name: "Steel Rod",
            description: "High Quality Steel Rod",
            price: 700,
            imageUrl: "https://via.placeholder.com/150",
        },
    });

    await prisma.vendorProduct.createMany({
        data:[
            {vendorId: vendor.id, productId: product1.id, stock:100},
            {vendorId: vendor.id, productId: product2.id, stock: 50},
        ],
    });

    await prisma.region.createMany({
        data:[
            {name:"Bangalore"},
            {name:"Hyderabad"},
            {name:"Chennai"}
        ]
    });

    console.log("Database seeded");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());