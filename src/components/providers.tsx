"use client";

import { ReactFlowProvider } from "reactflow";

export function Providers(props: React.PropsWithChildren) {
  return <ReactFlowProvider>{props.children}</ReactFlowProvider>;
}
