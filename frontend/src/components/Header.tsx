// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { CONSTANTS, QueryKey } from "@/constants";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { SizeIcon } from "@radix-ui/react-icons";
import { Box, Button, Container, Flex, Heading } from "@radix-ui/themes";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function Header() {
  const account = useCurrentAccount();
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();
  return (
    <Container>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        className="border-b flex flex-wrap"
      >
        <Box>
          <Heading className="flex items-center gap-3">
            <SizeIcon width={24} height={24} />
            Airdnb
          </Heading>
        </Box>

        <Box>
          <Button
            className="cursor-pointer"
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
        </Box>

        <Box className="connect-wallet-wrapper">
          <ConnectButton />
        </Box>
      </Flex>
    </Container>
  );
}
