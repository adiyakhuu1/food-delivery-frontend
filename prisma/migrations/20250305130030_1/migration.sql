-- CreateTable
CREATE TABLE "food-category" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "food-category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foodorderitems" (
    "id" TEXT NOT NULL,
    "createdAt" DATE,
    "foodId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "updatedAt" DATE,
    "foodOrderId" TEXT,

    CONSTRAINT "foodorderitems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foodorders" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalPrice" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "foodorders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foods" (
    "id" TEXT NOT NULL,
    "foodName" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "image" TEXT,
    "ingredients" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "foods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "createdAt_1" ON "foodorders"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "foodorderitems" ADD CONSTRAINT "foodorderitems_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "foods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foodorderitems" ADD CONSTRAINT "foodorderitems_foodOrderId_fkey" FOREIGN KEY ("foodOrderId") REFERENCES "foodorders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foodorders" ADD CONSTRAINT "foodorders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foods" ADD CONSTRAINT "foods_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "food-category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
