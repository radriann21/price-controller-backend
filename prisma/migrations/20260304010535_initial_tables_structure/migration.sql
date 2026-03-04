-- CreateTable
CREATE TABLE "ExchangeRates" (
    "id" SERIAL NOT NULL,
    "source" TEXT NOT NULL,
    "rate" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExchangeRates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "costUsd" DECIMAL(10,2) NOT NULL,
    "profitMargin" DECIMAL(5,2) NOT NULL,
    "priceVes" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historyPrices" (
    "id" TEXT NOT NULL,
    "oldPriceVes" DECIMAL(10,2) NOT NULL,
    "newPriceVes" DECIMAL(10,2) NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "historyPrices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "historyPrices" ADD CONSTRAINT "historyPrices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
