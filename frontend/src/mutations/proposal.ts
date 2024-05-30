// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { CONSTANTS, QueryKey } from "@/constants";
import { useTransactionExecution } from "@/hooks/useTransactionExecution";
import { ApiBookingNFTObject, ApiProposalObject } from "@/types/types";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
        queryClient.invalidateQueries({
          queryKey: [QueryKey.Proposal],
        });
        queryClient.invalidateQueries({
          queryKey: [QueryKey.Vote],
        });
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: [QueryKey.Proposal],
          });
          queryClient.invalidateQueries({
            queryKey: [QueryKey.Vote],
          });
        }, 1_000);
      }, 1_000);
    },
  });
}

export function useCreateProposal() {
  const currentAccount = useCurrentAccount();
  const executeTransaction = useTransactionExecution();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingNFT,
      title,
      description,
    }: {
      bookingNFT: ApiBookingNFTObject;
      title: string;
      description: string;
    }) => {
      if (!currentAccount?.address)
        throw new Error("You need to connect your wallet!");
      const txb = new TransactionBlock();

      txb.moveCall({
        target: `${CONSTANTS.airdnbContract.packageId}::airdnb::create_proposal`,
        arguments: [
          txb.object(bookingNFT.objectId),
          txb.pure.string(title),
          txb.pure.string(description),
        ],
      });

      return executeTransaction(txb);
    },

    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: [QueryKey.Proposal],
        });
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: [QueryKey.Proposal],
          });
        }, 1_000);
      }, 1_000);
    },
  });
}
