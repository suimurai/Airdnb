// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { publishPackage } from "../sui-utils";

/// A demo showing how we could publish the airdnb contract
/// and our DEMO objects contract.
///
/// We're publishing both as part of our demo.
(async () => {
  await publishPackage({
    packagePath: __dirname + "/../../contracts",
    network: "testnet",
    envName: "AIRDNB_CONTRACT",
  });
})();
