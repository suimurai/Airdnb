// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useSuiClientQuery } from "@mysten/dapp-kit";
import { SuiObjectDisplay } from "@/components/SuiObjectDisplay";
import { ExplorerLink } from "../ExplorerLink";
import { useMemo } from "react";
import { ApiBookingNFTObject } from "@/types/types";

/**
 * A component that displays an escrow and allows the user to accept or cancel it.
 * Accepts an `escrow` object as returned from the API.
 */
export function Escrow({ bookingNFT }: { bookingNFT: ApiBookingNFTObject }) {
  const suiObject = useSuiClientQuery("getObject", {
    id: bookingNFT?.objectId,
    options: {
      showDisplay: true,
      showType: true,
    },
  });

  const description = useMemo(() => {
    if(!bookingNFT) return '-'
    const remainingNights = Math.min(Math.floor((new Date(bookingNFT.checkOutDate).getTime() - new Date().getTime()) / 86400000), Number(bookingNFT.nights))
    return `${remainingNights} booked night${remainingNights > 1 ? 's' : ''} until checkout`
  }, [bookingNFT]);

  return (
    <SuiObjectDisplay
      object={suiObject.data?.data!}
      placeholder={{
	      // @ts-ignore-next-line
        image_url: import.meta.env.VITE_BOOKING_PLACEHOLDER_IMAGE_URL,
        description
      }}
    >
      <div className="flex gap-3 flex-wrap">
        <p className="text-sm flex-shrink-0 flex items-center gap-2">
          <ExplorerLink id={bookingNFT.objectId} isAddress={false} />
        </p>
      </div>
    </SuiObjectDisplay>
  );
}
