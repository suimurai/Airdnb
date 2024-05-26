// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { SuiEvent } from '@mysten/sui.js/client';
import { Prisma } from '@prisma/client';

import { prisma } from '../db';

type BookingNFTMinted = {
	id: string;
	room: string;
	nights: string;
	check_out_time_ms: string;
	recipient: string;
	minter: string;
};

type ProposalCreated = {
	id: string;
	title: string;
	description: string;
	creator: string;
};

type ProposalUpdated = {
	id: string;
	votes_for: string,
	votes_against: string,
};

export const handleAirdnbEvents = async (events: SuiEvent[], type: string) => {
	const bookingUpdates: Record<string, Prisma.BookingNFTCreateInput> = {};
	const proposalUpdates: Record<string, Prisma.ProposalCreateInput> = {};

	for (const event of events) {
		if (!event.type.startsWith(type)) throw new Error('Invalid event module origin');

		if (event.type.endsWith('::BookingNFTMinted')) {
			const data = event.parsedJson as BookingNFTMinted;
			bookingUpdates[data.id] = {
				objectId: data.id,
				room: data.room,
				nights: Number(data.nights),
				checkOutDate: new Date(Number(data.check_out_time_ms)),
				recipient: data.recipient,
				minter: data.minter
			};
			continue;
		}

		if (event.type.endsWith('::ProposalCreated')) {
			const data = event.parsedJson as ProposalCreated;
			proposalUpdates[data.id] = {
				objectId: data.id,
				title: data.title,
				description: data.description,
				creator: data.creator
			};
			continue;
		}


		if (event.type.endsWith('::ProposalUpdated')) {
			const data = event.parsedJson as ProposalUpdated;
			proposalUpdates[data.id] = {
				...proposalUpdates[data.id],
				votesFor: Number(data.votes_for),
				votesAgainst: Number(data.votes_against)
			};
			continue;
		}

		throw new Error('unsupported event: ' + event.type);
	}

	await Promise.all(Object.values(bookingUpdates).map((update) =>
		prisma.bookingNFT.upsert({
			where: {
				objectId: update.objectId,
			},
			create: update,
			update,
		}),
	));
	await Promise.all(Object.values(proposalUpdates).map((update) =>
		prisma.proposal.upsert({
			where: {
				objectId: update.objectId,
			},
			create: update,
			update,
		}),
	));
};
