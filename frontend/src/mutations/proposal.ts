// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { CONSTANTS, QueryKey } from "@/constants";
import { useTransactionExecution } from "@/hooks/useTransactionExecution";
import { ApiBookingNFTObject, ApiProposalObject } from "@/types/types";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dummyProposals from "../../../dummy-proposals.json";

export function useVoteOnProposal() {
  const currentAccount = useCurrentAccount();
  const executeTransaction = useTransactionExecution();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      proposal,
      bookingNFT,
      voteFor,
    }: {
      proposal: ApiProposalObject;
      bookingNFT: ApiBookingNFTObject;
      voteFor: boolean;
    }) => {
      console.log({
        proposal,
        bookingNFT,
        voteFor,
      });
      if (!currentAccount?.address)
        throw new Error("You need to connect your wallet!");
      const txb = new TransactionBlock();

      txb.moveCall({
        target: `${CONSTANTS.airdnbContract.packageId}::airdnb::vote_on_proposal`,
        arguments: [
          txb.object(proposal.objectId),
          txb.object(bookingNFT.objectId),
          txb.pure.bool(voteFor),
        ],
      });

      return executeTransaction(txb);
    },

    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [QueryKey.Proposal] });
      }, 1_000);
    },
  });
}

export function useCreateProposal() {
  const currentAccount = useCurrentAccount();
  const executeTransaction = useTransactionExecution();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingNFT }: { bookingNFT: ApiBookingNFTObject }) => {
      if (!currentAccount?.address)
        throw new Error("You need to connect your wallet!");
      const txb = new TransactionBlock();
      const proposalContent =
        dummyProposals[Math.floor(Math.random() * dummyProposals.length)];

      txb.moveCall({
        target: `${CONSTANTS.airdnbContract.packageId}::airdnb::create_proposal`,
        arguments: [
          txb.object(bookingNFT.objectId),
          txb.pure.string(proposalContent.title),
          txb.pure.string(proposalContent.description),
        ],
      });

      return executeTransaction(txb);
    },

    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [QueryKey.Proposal] });
      }, 1_000);
    },
  });
}
