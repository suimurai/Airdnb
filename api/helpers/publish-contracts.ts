// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { publishPackage } from '../sui-utils';

/// A demo showing how we could publish the airdnb contract
/// and our DEMO objects contract.
///
/// We're publishing both as part of our demo.
(async () => {
	await publishPackage({
		packagePath: __dirname + '/../../contracts/airdnb',
		network: 'testnet',
		exportFileName: 'airdnb-contract',
	});

	await publishPackage({
		packagePath: __dirname + '/../../contracts/demo',
		network: 'testnet',
		exportFileName: 'demo-contract',
	});
})();
