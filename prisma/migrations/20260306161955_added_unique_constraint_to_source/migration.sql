/*
  Warnings:

  - A unique constraint covering the columns `[source]` on the table `ExchangeRates` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ExchangeRates_source_key" ON "ExchangeRates"("source");
