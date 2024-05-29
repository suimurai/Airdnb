-- CreateTable
CREATE TABLE "Vote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "proposalId" TEXT NOT NULL,
    "voterBookingNFTId" TEXT NOT NULL,
    "voter" TEXT NOT NULL,
    "voteFor" BOOLEAN NOT NULL,
    "voteWeight" INTEGER NOT NULL
);
