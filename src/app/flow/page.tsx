"use client";

import dynamic from "next/dynamic";

const DynamicFlow = dynamic(() => import("~/components/flow"), {
  loading: () => <div>Loading</div>,
  ssr: false,
});

export default function FlowPage() {
  return <DynamicFlow />;
}
