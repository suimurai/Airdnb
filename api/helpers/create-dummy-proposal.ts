// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import dummyProposals from "../../dummy-proposals.json";
import { TransactionBlock } from '@mysten/sui.js/transactions';

import { CONFIG } from '../config';
import { ACTIVE_NETWORK, getActiveAddress, signAndExecute } from '../sui-utils';
import { mintBookingNFT } from "./mint-booking-nft";

export const createDummyProposal = async () => {
	const txb = new TransactionBlock();
	const address = getActiveAddress()

	const mintBookingNftRes = await mintBookingNFT(address)
	
	// @ts-ignore-next-line
	const bookingNftObjectId:string = mintBookingNftRes.objectChanges?.find((o) => o.type === 'created' && o.objectType === `${CONFIG.AIRDNB_CONTRACT.packageId}::airdnb::BookingNFT`)?.objectId

	if (!bookingNftObjectId)
		throw new Error('Something went wrong while minting the bookingNFT before creating a dummy proposal');
	const proposalContent = dummyProposals[Math.floor(Math.random()*dummyProposals.length)]
	
	txb.moveCall({
		target: `${CONFIG.AIRDNB_CONTRACT.packageId}::airdnb::create_proposal`,
		arguments: [txb.object(bookingNftObjectId), txb.pure.string(proposalContent.title), txb.pure.string(proposalContent.description)],
	});

	const res = await signAndExecute(txb, ACTIVE_NETWORK);
	
	if (!res.objectChanges || res.objectChanges.length === 0) {
		console.log(res)
		throw new Error('Something went wrong while creating a dummy proposal');
	}
};
