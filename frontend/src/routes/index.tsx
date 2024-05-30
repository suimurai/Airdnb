// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { createBrowserRouter } from "react-router-dom";

import { Root } from "./root";
import { EscrowDashboard } from "@/routes/EscrowDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <EscrowDashboard />,
      },
    ],
  },
]);
