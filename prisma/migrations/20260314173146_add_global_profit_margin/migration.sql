-- CreateTable
CREATE TABLE "globalProfitMargin" (
    "id" SERIAL NOT NULL,
    "profitMargin" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "globalProfitMargin_pkey" PRIMARY KEY ("id")
);
