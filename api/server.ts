// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import cors from "cors";
import express from "express";

import { prisma } from "./db";
import {
  formatPaginatedResponse,
  parsePaginationForQuery,
  parseWhereStatement,
  WhereParam,
  WhereParamTypes,
} from "./utils/api-queries";
import { mintBookingNFT } from "./helpers/mint-booking-nft";
import { getActiveAddress } from "./sui-utils";

const app = express();
app.use(cors());

app.use(express.json());

app.get("/", async (_req, res) => {
  return res.send({ message: "🚀 API is functional 🚀" });
});

app.get("/mintBookingNFT", async (req, res) => {
  try {
    await mintBookingNFT(
      typeof req.query.recipient === "string"
        ? req.query.recipient
        : getActiveAddress(),
    );
    return res.send({ message: "Minted" });
  } catch (e) {
    res.status(500).send({ message: String(e) });
  }
});

app.get("/bookingNFTs", async (req, res) => {
  const acceptedQueries: WhereParam[] = [
    {
      key: "recipient",
      type: WhereParamTypes.STRING,
    },
  ];
  try {
    const escrows = await prisma.bookingNFT.findMany({
      where: parseWhereStatement(req.query, acceptedQueries)!,
      ...parsePaginationForQuery(req.query),
    });
    return res.send(formatPaginatedResponse(escrows));
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }
});

app.get("/proposals", async (req, res) => {
  const acceptedQueries: WhereParam[] = [];
  try {
    const proposals = await prisma.proposal.findMany({
      where: parseWhereStatement(req.query, acceptedQueries)!,
      ...parsePaginationForQuery(req.query),
    });
    return res.send(formatPaginatedResponse(proposals));
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }
});

app.get("/votes", async (req, res) => {
  const acceptedQueries: WhereParam[] = [
    {
      key: "voter",
      type: WhereParamTypes.STRING,
    },
  ];
  try {
    const proposals = await prisma.vote.findMany({
      where: parseWhereStatement(req.query, acceptedQueries)!,
      ...parsePaginationForQuery(req.query),
    });
    return res.send(formatPaginatedResponse(proposals));
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }
});

app.listen(3000, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`),
);
