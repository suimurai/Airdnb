// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// You can choose a different env (e.g. using a .env file, or a predefined list)
import demoContract from "../../api/airdnb-contract.json";
import airdnbContract from "../../api/airdnb-contract.json";

export enum QueryKey {
  Locked = "locked",
  BookingNFT = "bookingNFT",
  GetOwnedObjects = "getOwnedObjects",
}

export const CONSTANTS = {
  airdnbContract: {
    ...airdnbContract,
    lockedType: `${airdnbContract.packageId}::lock::Locked`,
    lockedKeyType: `${airdnbContract.packageId}::lock::Key`,
    lockedObjectDFKey: `${airdnbContract.packageId}::lock::LockedObjectKey`,
  },
  demoContract: {
    ...demoContract,
    demoBearType: `${demoContract.packageId}::demo_bear::DemoBear`,
  },
  apiEndpoint: "http://localhost:3000/",
};
