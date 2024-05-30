// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// @ts-ignore
const packageId: string | undefined = import.meta.env
  .VITE_AIRDNB_CONTRACT_PACKAGE_ID;
if (!packageId) {
  throw new Error("VITE_AIRDNB_CONTRACT_PACKAGE_ID not provided");
}

export enum QueryKey {
  Proposal = "proposal",
  BookingNFT = "bookingNFT",
  Vote = "vote",
  GetOwnedObjects = "getOwnedObjects",
}

export const CONSTANTS = {
  airdnbContract: {
    packageId,
    lockedType: `${packageId}::lock::Locked`,
    lockedKeyType: `${packageId}::lock::Key`,
    lockedObjectDFKey: `${packageId}::lock::LockedObjectKey`,
  },
  demoContract: {
    packageId,
    demoBearType: `${packageId}::demo_bear::DemoBear`,
  },
  apiEndpoint: "http://localhost:3000/",
};
