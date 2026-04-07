-- CreateTable
CREATE TABLE "Specification" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Specification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecificationValue" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "specificationId" INTEGER NOT NULL,

    CONSTRAINT "SpecificationValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToSpecificationValue" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToSpecificationValue_AB_unique" ON "_ProductToSpecificationValue"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToSpecificationValue_B_index" ON "_ProductToSpecificationValue"("B");

-- AddForeignKey
ALTER TABLE "SpecificationValue" ADD CONSTRAINT "SpecificationValue_specificationId_fkey" FOREIGN KEY ("specificationId") REFERENCES "Specification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToSpecificationValue" ADD CONSTRAINT "_ProductToSpecificationValue_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToSpecificationValue" ADD CONSTRAINT "_ProductToSpecificationValue_B_fkey" FOREIGN KEY ("B") REFERENCES "SpecificationValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
