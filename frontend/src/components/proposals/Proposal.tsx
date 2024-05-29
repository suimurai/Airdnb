// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { SuiObjectDisplay } from "@/components/SuiObjectDisplay";
import { ExplorerLink } from "../ExplorerLink";
import {
  ApiBookingNFTObject,
  ApiProposalObject,
  BookingNFTListingQuery,
} from "@/types/types";
import { Button } from "@radix-ui/themes";
import { useVoteOnProposal } from "@/mutations/proposal.ts";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CONSTANTS, QueryKey } from "@/constants.ts";
import { constructUrlSearchParams, getNextPageParam } from "@/utils/helpers.ts";
import { useMemo } from "react";

/**
 * A component that displays an escrow and allows the user to accept or cancel it.
 * Accepts an `escrow` object as returned from the API.
 */
export function Proposal({ proposal }: { proposal: ApiProposalObject }) {
  const { mutate: vote, isPending: pendingVoteSubmission } =
    useVoteOnProposal();

  const account = useCurrentAccount();
  const params: BookingNFTListingQuery = {
    recipient: account?.address,
  };
  const { data } = useInfiniteQuery({
    initialPageParam: null,
    queryKey: [QueryKey.BookingNFT, params, ""],
    queryFn: async ({ pageParam }) => {
      const data = await fetch(
        CONSTANTS.apiEndpoint +
          "bookingNFTs" +
          constructUrlSearchParams({
            ...params,
            ...(pageParam ? { cursor: pageParam as string } : {}),
          }),
      );
      return data.json();
    },
    select: (data) => data.pages.flatMap((page) => page.data),
    getNextPageParam,
  });
  const bookingNFT: ApiBookingNFTObject | undefined = useMemo(() => {
    return data && data.length ? data[data.length - 1] : undefined;
  }, []);
  const suiObject = useSuiClientQuery("getObject", {
    id: proposal?.objectId,
    options: {
      showDisplay: true,
      showType: true,
    },
  });

  const disabled = useMemo(
    () => !bookingNFT || pendingVoteSubmission,
    [bookingNFT, pendingVoteSubmission],
  );

  return (
    <SuiObjectDisplay
      object={suiObject.data?.data!}
      placeholder={{
        title: proposal?.title,
        description: proposal?.description,
      }}
    >
      <div className="flex flex-wrap">
        <p className="text-sm flex-shrink-0 flex items-center gap-2">
          <ExplorerLink id={proposal.objectId} isAddress={false} />
          <span className="text-[green]">+{proposal.votesFor}</span>{" "}
          <span className="text-[red]">-{proposal.votesAgainst}</span>
        </p>
        <Button
          className={` bg-transparent text-black ml-auto px-1.5 ${
            disabled ? "" : "cursor-pointer"
          }`}
          disabled={disabled}
          onClick={() => {
            if (bookingNFT) {
              vote({
                proposal,
                bookingNFT,
                voteFor: true,
              });
            }
          }}
        >
          <img
            src={disabled ? "/thumbs-up-gray.svg" : "/thumbs-up.svg"}
            className="w-8"
          />
        </Button>
        <Button
          className={` bg-transparent text-black px-1.5 ${
            disabled ? "" : "cursor-pointer"
          }`}
          disabled={disabled}
          onClick={() => {
            if (bookingNFT) {
              vote({
                proposal,
                bookingNFT,
                voteFor: false,
              });
            }
          }}
        >
          <img
            src={disabled ? "/thumbs-down-gray.svg" : "/thumbs-down.svg"}
            className="w-8"
          />
        </Button>
      </div>
    </SuiObjectDisplay>
  );
}
