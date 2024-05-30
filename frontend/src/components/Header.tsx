// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { ConnectButton } from "@mysten/dapp-kit";
import { SizeIcon } from "@radix-ui/react-icons";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";

export function Header() {
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

        <Box className="connect-wallet-wrapper">
          <ConnectButton />
        </Box>
      </Flex>
    </Container>
  );
}
