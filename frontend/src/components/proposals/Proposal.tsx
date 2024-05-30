// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useSuiClientQuery } from "@mysten/dapp-kit";
import { SuiObjectDisplay } from "@/components/SuiObjectDisplay";
import { ExplorerLink } from "../ExplorerLink";
import { ApiProposalObject } from "@/types/types";
import { Button } from "@radix-ui/themes";
import { useVoteOnProposal } from "@/mutations/proposal.ts";
import { useMemo } from "react";
import { useMyBookingNFTsContext } from "@/context/myBookingNFTsContext.tsx";
import { useMyVotesContext } from "@/context/myVotesContext.tsx";

/**
 * A component that displays an escrow and allows the user to accept or cancel it.
 * Accepts an `escrow` object as returned from the API.
 */
export function Proposal({ proposal }: { proposal: ApiProposalObject }) {
  const { mutate: vote, isPending: pendingVoteSubmission } =
    useVoteOnProposal();

  const { activeBookingNFTs } = useMyBookingNFTsContext();
  const suiObject = useSuiClientQuery("getObject", {
    id: proposal?.objectId,
    options: {
      showDisplay: true,
      showType: true,
    },
  });

  const disabled = useMemo(
    () => !activeBookingNFTs || pendingVoteSubmission,
    [activeBookingNFTs, pendingVoteSubmission],
  );

  const { myVotes } = useMyVotesContext();
  const myVote = useMemo(() => {
    return myVotes?.find((v) => v.proposalId === proposal?.objectId);
  }, [myVotes, proposal]);

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
        {myVote ? (
          <div className="ml-auto flex items-center text-sm">
            You Voted
            <img
              src={myVote.voteFor ? "/thumbs-up.svg" : "/thumbs-down.svg"}
              className="w-8 ml-1.5"
            />
          </div>
        ) : (
          <>
            <Button
              className={`bg-transparent text-black ml-auto px-1.5 ${
                disabled ? "" : "cursor-pointer"
              }`}
              disabled={disabled}
              onClick={() => {
                if (activeBookingNFTs) {
                  vote({
                    proposal,
                    bookingNFTs: activeBookingNFTs,
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
              className={`bg-transparent text-black px-1.5 ${
                disabled ? "" : "cursor-pointer"
              }`}
              disabled={disabled}
              onClick={() => {
                if (activeBookingNFTs) {
                  vote({
                    proposal,
                    bookingNFTs: activeBookingNFTs,
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
          </>
        )}
      </div>
    </SuiObjectDisplay>
  );
}
