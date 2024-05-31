// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Escrow } from "./Escrow";
import { InfiniteScrollArea } from "@/components/InfiniteScrollArea";
import { useState } from "react";
import { Button, TextField } from "@radix-ui/themes";
import { useMyBookingNFTsContext } from "@/context/myBookingNFTsContext.tsx";
import { CONSTANTS, QueryKey } from "@/constants.ts";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useQueryClient } from "@tanstack/react-query";

/**
 * A component that fetches and displays a list of escrows.
 * It works by using the API to fetch them, and can be re-used with different
 * API params, as well as an optional search by escrow ID functionality.
 */
export function EscrowList({ enableSearch }: { enableSearch?: boolean }) {
  const [objectId, setObjectId] = useState("");

  const { myBookingNFTs, isLoading, isFetchingNextPage, votingPower } =
    useMyBookingNFTsContext();
  const account = useCurrentAccount();
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();

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
      <div className="rounded-lg px-4 py-3 mt-3 -mb-3 text-md font-semibold bg-gradient-to-r from-primary via-blue-500 to-primary text-white shadow-lg text-center opacity-90">
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

      <Button
        className={`cursor-pointer shadow-md font-semibold py-5 ${
          isPending ? "" : "bg-primary"
        }`}
        disabled={isPending}
        onClick={() => {
          setIsPending(true);
          fetch(
            CONSTANTS.apiEndpoint +
              "mintBookingNFT?recipient=" +
              account?.address,
          )
            .catch((e) => {
              console.log(e);
              alert(String(e));
            })
            .finally(() => {
              setIsPending(false);
              setTimeout(() => {
                queryClient.invalidateQueries({
                  queryKey: [QueryKey.BookingNFT],
                });
                setTimeout(() => {
                  queryClient.invalidateQueries({
                    queryKey: [QueryKey.BookingNFT],
                  });
                }, 1_000);
              }, 1_000);
            });
        }}
      >
        Claim Demo Booking
      </Button>
    </div>
  );
}
