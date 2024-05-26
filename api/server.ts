// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import cors from 'cors';
import express from 'express';

import { prisma } from './db';
import {
	WhereParam,
	WhereParamTypes,
	formatPaginatedResponse,
	parsePaginationForQuery,
	parseWhereStatement,
} from './utils/api-queries';

const app = express();
app.use(cors());

app.use(express.json());

app.get('/', async (_req, res) => {
	return res.send({ message: '🚀 API is functional 🚀' });
});

app.get('/bookingNFTs', async (req, res) => {
	const acceptedQueries: WhereParam[] = [
		{
			key: 'recipient',
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

app.listen(3000, () => console.log(`🚀 Server ready at: http://localhost:3000`));
