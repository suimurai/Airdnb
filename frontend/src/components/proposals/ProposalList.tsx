// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useInfiniteQuery } from "@tanstack/react-query";
import { CONSTANTS, QueryKey } from "@/constants";
import { Proposal } from "./Proposal";
import { InfiniteScrollArea } from "@/components/InfiniteScrollArea";
import { constructUrlSearchParams, getNextPageParam } from "@/utils/helpers";
import { ApiProposalObject, BookingNFTListingQuery } from "@/types/types";
import { useState } from "react";
import { Button, TextField } from "@radix-ui/themes";
import { useCreateProposal } from "@/mutations/proposal.ts";
import { useMyBookingNFTsContext } from "@/context/myBookingNFTsContext.tsx";

/**
 * A component that fetches and displays a list of escrows.
 * It works by using the API to fetch them, and can be re-used with different
 * API params, as well as an optional search by escrow ID functionality.
 */
export function ProposalList({
  params,
  enableSearch,
}: {
  params: BookingNFTListingQuery;
  enableSearch?: boolean;
}) {
  const [objectId, setObjectId] = useState("");

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      initialPageParam: null,
      queryKey: [QueryKey.Proposal, params, objectId],
      queryFn: async ({ pageParam }) => {
        const data = await fetch(
          CONSTANTS.apiEndpoint +
            "proposals" +
            constructUrlSearchParams({
              ...params,
              ...(pageParam ? { cursor: pageParam as string } : {}),
              ...(objectId ? { objectId } : {}),
            }),
        );
        return data.json();
      },
      select: (data) => data.pages.flatMap((page) => page.data),
      getNextPageParam,
    });
  const { myLastBookingNFT } = useMyBookingNFTsContext();
  const { mutate: createProposal, isPending: pendingProposalCreation } =
    useCreateProposal();

  return (
    <div>
      {enableSearch && (
        <TextField.Root>
          <TextField.Input
            placeholder="Search by escrow id"
            value={objectId}
            onChange={(e) => setObjectId(e.target.value)}
          />
        </TextField.Root>
      )}
      <Button
        disabled={!myLastBookingNFT || pendingProposalCreation}
        className="cursor-pointer mt-5"
        onClick={() => {
          if (myLastBookingNFT) {
            createProposal({
              bookingNFT: myLastBookingNFT,
            });
          }
        }}
      >
        Create Demo Proposal
      </Button>
      <InfiniteScrollArea
        loadMore={() => fetchNextPage()}
        hasNextPage={hasNextPage}
        loading={isFetchingNextPage || isLoading}
      >
        {data?.map((proposal: ApiProposalObject) => (
          <Proposal key={proposal.id} proposal={proposal} />
        ))}
      </InfiniteScrollArea>
    </div>
  );
}
