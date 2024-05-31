// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useInfiniteQuery } from "@tanstack/react-query";
import { CONSTANTS, QueryKey } from "@/constants";
import { Proposal } from "./Proposal";
import { InfiniteScrollArea } from "@/components/InfiniteScrollArea";
import { constructUrlSearchParams, getNextPageParam } from "@/utils/helpers";
import { ApiProposalObject, BookingNFTListingQuery } from "@/types/types";
import { useCallback, useEffect, useState } from "react";
import { Button, Card, Inset, TextArea, TextField } from "@radix-ui/themes";
import { useCreateProposal } from "@/mutations/proposal.ts";
import { useMyBookingNFTsContext } from "@/context/myBookingNFTsContext.tsx";

const dummyProposals = [
  {
    title: "Add More Comfortable Seating",
    description:
      "Adding five more comfortable seating options, like ergonomic chairs and cozy couches, would be fantastic. It'll make working here way more enjoyable for everyone.",
  },
  {
    title: "Upgrade Our Internet Speed",
    description:
      "Boosting our internet speed with a high-speed fiber-optic connection would be awesome. It'll make video calls and big file uploads way smoother for everyone.",
  },
  {
    title: "Create a Quiet Zone",
    description:
      "Creating a designated quiet zone with soundproof booths would be amazing. It'll give everyone a space for focused work and private calls, reducing distractions for all.",
  },
  {
    title: "Enhance Break Area",
    description:
      "Enhancing the break area with a better coffee machine and a variety of healthy snacks would be great. It'll make breaks more enjoyable and energizing for everyone.",
  },
];

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

  const [createProposalView, setCreateProposalView] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fillRandom = useCallback(() => {
    const proposalContent =
      dummyProposals[Math.floor(Math.random() * dummyProposals.length)];
    setTitle(proposalContent.title);
    setDescription(proposalContent.description);
  }, []);

  useEffect(() => {
    if (!pendingProposalCreation) {
      setCreateProposalView(false);
      setTitle("");
      setDescription("");
    }
  }, [pendingProposalCreation]);

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
        className="cursor-pointer mt-5 bg-primary py-5 shadow-md font-semibold"
        onClick={() => setCreateProposalView((val) => !val)}
      >
        {createProposalView ? "Show Proposals" : "Create Proposal"}
      </Button>
      {createProposalView ? (
        <div className="grid py-6 grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="!p-0 sui-object-card border-gray-200">
            <div className="p-1">
              <div className="flex">
                <p className="w-full text-xl mt-1 mb-5">New Proposal</p>
                <Button
                  className="cursor-pointer px-6 ml-2 bg-primary shadow-md py-5 font-semibold"
                  onClick={fillRandom}
                >
                  Fill Random
                </Button>
              </div>
              <TextField.Input
                placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextArea
                className="mt-3"
                placeholder="description"
                value={description}
                rows={4}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Inset className="p-2 border-t mt-3 bg-gray-100 rounded-none flex">
              <p className="text-sm flex-shrink-0 flex items-center gap-2"></p>
              <Button
                disabled={!myLastBookingNFT || pendingProposalCreation}
                className={`cursor-pointer ml-auto mr-2 px-6 shadow-md font-semibold py-5 ${
                  !myLastBookingNFT || pendingProposalCreation
                    ? ""
                    : "bg-primary"
                }`}
                onClick={() => {
                  if (myLastBookingNFT) {
                    createProposal({
                      bookingNFT: myLastBookingNFT,
                      title,
                      description,
                    });
                  }
                }}
              >
                Submit
              </Button>
            </Inset>
          </Card>
        </div>
      ) : (
        <InfiniteScrollArea
          loadMore={() => fetchNextPage()}
          hasNextPage={hasNextPage}
          loading={isFetchingNextPage || isLoading}
        >
          {data?.map((proposal: ApiProposalObject) => (
            <Proposal key={proposal.id} proposal={proposal} />
          ))}
        </InfiniteScrollArea>
      )}
    </div>
  );
}
