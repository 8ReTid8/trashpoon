-- CreateEnum
CREATE TYPE "CapacityStatus" AS ENUM ('FULL', 'EMPTY');

-- CreateTable
CREATE TABLE "Node" (
    "id" SERIAL NOT NULL,
    "areaId" INTEGER NOT NULL,
    "client" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "node_id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "status" "CapacityStatus" NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
