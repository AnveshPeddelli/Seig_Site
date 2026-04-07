const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {

  // 1. Regional
  const regional = await prisma.regional.create({
    data: {
      name: "South Region",
      location: "Bangalore"
    }
  });

  // 2. Vendor
  const vendor = await prisma.vendor.create({
    data: {
      name: "Vendor A",
      location: "Bangalore",
      phone: "9999999999",
      regionalId: regional.id
    }
  });

  // 3. Create Multiple Products
  const productData = [
    { name: "Battery 10V", price: 100 },
    { name: "Battery 20V", price: 150 },
    { name: "Pump 100W", price: 300 }
  ];

  const products = [];

  for (const p of productData) {
    const product = await prisma.product.create({ data: p });
    products.push(product);
  }

  const product1 = products[0];
  const product2 = products[1];
  const product3 = products[2];

  // 4. VendorProduct mapping (IMPORTANT)
  await prisma.vendorProduct.createMany({
    data: [
      { vendorId: vendor.id, productId: product1.id, stock: 10 },
      { vendorId: vendor.id, productId: product2.id, stock: 5 },
      { vendorId: vendor.id, productId: product3.id, stock: 7 }
    ]
  });

  // 5. Specifications
  const voltage = await prisma.specification.create({
    data: { name: "Voltage" }
  });

  const current = await prisma.specification.create({
    data: { name: "Current" }
  });

  // Spec values
  const v10 = await prisma.specificationValue.create({
    data: {
      value: "10V",
      specificationId: voltage.id
    }
  });

  const v20 = await prisma.specificationValue.create({
    data: {
      value: "20V",
      specificationId: voltage.id
    }
  });

  const a5 = await prisma.specificationValue.create({
    data: {
      value: "5A",
      specificationId: current.id
    }
  });

  // Attach specs
  await prisma.product.update({
    where: { id: product1.id },
    data: {
      specs: {
        connect: [{ id: v10.id }, { id: a5.id }]
      }
    }
  });

  await prisma.product.update({
    where: { id: product2.id },
    data: {
      specs: {
        connect: [{ id: v20.id }, { id: a5.id }]
      }
    }
  });

  await prisma.product.update({
    where: { id: product3.id },
    data: {
      specs: {
        connect: [{ id: v10.id }]
      }
    }
  });

  // 6. Questionnaire (FIXED)
  await prisma.question.create({
    data: {
      text: "What do you need?",
      options: {
        create: [
          {
            text: "Battery",
            products: {
              connect: [
                { id: product1.id },
                { id: product2.id }
              ]
            }
          },
          {
            text: "Pump",
            products: {
              connect: [
                { id: product3.id }
              ]
            }
          }
        ]
      }
    }
  });

  console.log("Seeded successfully 🚀");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());