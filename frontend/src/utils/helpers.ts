// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { ApiBookingNFTObject } from "@/types/types.ts";

/**
 * Takes an object of { key: value } and builds a URL param string.
 * e.g. { page: 1, limit: 10 } -> ?page=1&limit=10
 */
export const constructUrlSearchParams = (
  object: Record<string, string>,
): string => {
  const searchParams = new URLSearchParams();

  for (const key in object) {
    searchParams.set(key, object[key]);
  }

  return `?${searchParams.toString()}`;
};

/** Checks whether we have a next page */
export const getNextPageParam = (lastPage: any) => {
  if ("api" in lastPage) {
    return lastPage.api.cursor;
  }
  return lastPage.cursor;
};

export function getBookingNFTRemainingNights(bookingNFT: ApiBookingNFTObject) {
  const now = new Date().getTime();
  const checkoutTime = new Date(bookingNFT.checkOutDate).getTime();
  if (now > checkoutTime) return 0;
  return Math.min(
    Math.floor((checkoutTime - now) / 86400000),
    Number(bookingNFT.nights),
  );
}
