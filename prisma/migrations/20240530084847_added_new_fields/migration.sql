/*
  Warnings:

  - You are about to drop the column `date` on the `Messages` table. All the data in the column will be lost.
  - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - A unique constraint covering the columns `[userId]` on the table `Messages` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Messages` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `verifyCode` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verifyCodeExpiry` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_userId_fkey";

-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "date",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAcceptingMessages" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verifyCode" TEXT NOT NULL,
ADD COLUMN     "verifyCodeExpiry" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "username" SET DATA TYPE VARCHAR(30);

-- CreateIndex
CREATE UNIQUE INDEX "Messages_userId_key" ON "Messages"("userId");

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
