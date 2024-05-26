// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { TransactionBlock } from '@mysten/sui.js/transactions';

import { CONFIG } from '../config';
import { ACTIVE_NETWORK, getActiveAddress, signAndExecute } from '../sui-utils';

function getCheckoutTime(): number {
	const fourDaysLater = new Date();
	fourDaysLater.setUTCDate(fourDaysLater.getUTCDate() + 4);
	fourDaysLater.setUTCHours(11, 0, 0, 0);
	return fourDaysLater.getTime();
}

const mintBookingNFT = async () => {
	const txb = new TransactionBlock();

	const bookingNFT = txb.moveCall({
		target: `${CONFIG.AIRDNB_CONTRACT.packageId}::airdnb::mint`,
		arguments: [txb.object(CONFIG.AIRDNB_CONTRACT.adminCap), txb.pure.string(`Room 301`), txb.pure.u64(7), txb.pure.u64(getCheckoutTime())],
	});

	txb.transferObjects([bookingNFT], txb.pure.address(getActiveAddress()));

	const res = await signAndExecute(txb, ACTIVE_NETWORK);

	if (!res.objectChanges || res.objectChanges.length === 0)
		throw new Error('Something went wrong while minting bookingNFT');

	console.log('Successfully created bookingNFT');
};

mintBookingNFT();
