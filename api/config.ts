// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Network } from "./sui-utils";

require("dotenv").config();

/**
 * A default configuration
 * You need to call `publish-contracts.ts` before running any functionality
 * depends on it, or update our imports to not use these json files.
 * */

if (!process.env.AIRDNB_CONTRACT_PACKAGE_ID) {
  throw new Error("AIRDNB_CONTRACT_PACKAGE_ID not provided");
}
if (!process.env.AIRDNB_CONTRACT_ADMIN_CAP) {
  throw new Error("AIRDNB_CONTRACT_ADMIN_CAP not provided");
}
if (!process.env.AIRDNB_CONTRACT_PUBLISHER) {
  throw new Error("AIRDNB_CONTRACT_PUBLISHER not provided");
}

export const CONFIG = {
  /// Look for events every 1s
  POLLING_INTERVAL_MS: 1000,
  DEFAULT_LIMIT: 50,
  NETWORK: (process.env.NETWORK as Network) || "testnet",
  AIRDNB_CONTRACT: {
    packageId: process.env.AIRDNB_CONTRACT_PACKAGE_ID,
    adminCap: process.env.AIRDNB_CONTRACT_ADMIN_CAP,
    publisher: process.env.AIRDNB_CONTRACT_PUBLISHER,
  },
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
};
