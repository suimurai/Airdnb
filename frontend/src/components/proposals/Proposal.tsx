// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useSuiClientQuery } from "@mysten/dapp-kit";
import { SuiObjectDisplay } from "@/components/SuiObjectDisplay";
import { ExplorerLink } from "../ExplorerLink";
import { useMemo } from "react";
import { ApiBookingNFTObject, ApiProposalObject } from "@/types/types";

/**
 * A component that displays an escrow and allows the user to accept or cancel it.
 * Accepts an `escrow` object as returned from the API.
 */
export function Proposal({ proposal }: { proposal: ApiProposalObject }) {
  const suiObject = useSuiClientQuery("getObject", {
    id: proposal?.objectId,
    options: {
      showDisplay: true,
      showType: true,
    },
  });

  return (
    <SuiObjectDisplay
      object={suiObject.data?.data!}
      placeholder={{
        title: proposal?.title,
        description: proposal?.description
      }}
    >
      <div className="flex gap-3 flex-wrap">
        <p className="text-sm flex-shrink-0 flex items-center gap-2">
          <ExplorerLink id={proposal.objectId} isAddress={false} />
          <span className="text-[green]">+{proposal.votesFor}</span> <span className="text-[red]">-{proposal.votesAgainst}</span>
        </p>
      </div>
    </SuiObjectDisplay>
  );
}
