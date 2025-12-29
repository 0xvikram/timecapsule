-- CreateTable
CREATE TABLE "CapsuleLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "capsuleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CapsuleLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CapsuleLike_userId_capsuleId_key" ON "CapsuleLike"("userId", "capsuleId");

-- AddForeignKey
ALTER TABLE "CapsuleLike" ADD CONSTRAINT "CapsuleLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapsuleLike" ADD CONSTRAINT "CapsuleLike_capsuleId_fkey" FOREIGN KEY ("capsuleId") REFERENCES "Capsule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
