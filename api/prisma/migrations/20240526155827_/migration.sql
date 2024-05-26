-- CreateTable
CREATE TABLE "BookingNFT" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "objectId" TEXT NOT NULL,
    "minter" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "nights" INTEGER NOT NULL,
    "recipient" TEXT NOT NULL,
    "checkOutDate" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "objectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "votesFor" INTEGER NOT NULL DEFAULT 0,
    "votesAgainst" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Cursor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventSeq" TEXT NOT NULL,
    "txDigest" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BookingNFT_objectId_key" ON "BookingNFT"("objectId");

-- CreateIndex
CREATE INDEX "BookingNFT_minter_idx" ON "BookingNFT"("minter");

-- CreateIndex
CREATE INDEX "BookingNFT_room_idx" ON "BookingNFT"("room");

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_objectId_key" ON "Proposal"("objectId");

-- CreateIndex
CREATE INDEX "Proposal_title_idx" ON "Proposal"("title");
