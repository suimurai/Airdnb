// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Escrow } from "./Escrow";
import { InfiniteScrollArea } from "@/components/InfiniteScrollArea";
import { BookingNFTListingQuery } from "@/types/types";
import { useState } from "react";
import { TextField } from "@radix-ui/themes";
import { useMyBookingNFTsContext } from "@/context/myBookingNFTsContext.tsx";

/**
 * A component that fetches and displays a list of escrows.
 * It works by using the API to fetch them, and can be re-used with different
 * API params, as well as an optional search by escrow ID functionality.
 */
export function EscrowList({
  params,
  enableSearch,
}: {
  params: BookingNFTListingQuery;
  enableSearch?: boolean;
}) {
  const [objectId, setObjectId] = useState("");

  const { myBookingNFTs, isLoading, isFetchingNextPage, votingPower } =
    useMyBookingNFTsContext();

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
      <div className="rounded-lg px-4 py-3 mt-3 -mb-3 text-md font-semibold bg-gradient-to-r from-green-300 via-blue-500 to-blue-500 text-white shadow-lg text-center opacity-90">
        Your Voting Power {votingPower ?? "..."}
      </div>
      <InfiniteScrollArea
        loadMore={() => {}}
        hasNextPage={false}
        loading={isFetchingNextPage || isLoading}
      >
        {myBookingNFTs?.map((bookingNFT) => (
          <Escrow key={bookingNFT.id} bookingNFT={bookingNFT} />
        ))}
      </InfiniteScrollArea>
    </div>
  );
}
