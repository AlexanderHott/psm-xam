"use client";
import ReactFlow, {
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  SelectionMode,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "~/components/ui/button";
import { useStore } from "~/store";
import { Gain, Osc, Out } from "./nodes";

const nodeTypes = {
  gain: Gain,
  osc: Osc,
  out: Out,
};

let ctx: AudioContext | undefined = undefined;
if (typeof window !== "undefined") {
  ctx = new AudioContext();
}

export default function Flow() {
  const store = useStore((store) => ({
    nodes: store.nodes,
    edges: store.edges,
    onNodesChange: store.onNodesChange,
    onEdgesChange: store.onEdgesChange,
    onNodesDelete: store.removeNodes,
    onEdgesDelete: store.removeEdges,
    addEdge: store.addEdge,
    createNode: store.createNode,
    setup: store.setup,
  }));
  if (!ctx) {
    return null;
  }
  store.setup(ctx);

  // const onConnect = useCallback(
  //   (params: Connection | Edge) => {
  //     console.log("connection", params);
  //     setEdges((eds) => addEdge(params, eds));
  //   },
  //   [setEdges],
  // );

  // https://reactflow.dev/api-reference/react-flow#pan-on-drag
  const panOnDrag = [1, 2];

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={store.nodes}
        edges={store.edges}
        onNodesChange={store.onNodesChange}
        onEdgesChange={store.onEdgesChange}
        onConnect={store.addEdge}
        onNodesDelete={store.onNodesDelete}
        onEdgesDelete={store.onEdgesDelete}
        // onEdgesDelete={(es) => console.log("del edges", es)}
        // onNodesDelete={(ns) => console.log("del nodes", ns)}
        panOnScroll
        selectionOnDrag
        panOnDrag={panOnDrag}
        selectionMode={SelectionMode.Partial}
        nodeTypes={nodeTypes}
      >
        <Panel position="top-right">
          <Button
            onClick={() => store.createNode("osc")}
            className="bg-gray-400"
          >
            osc
          </Button>
          <Button
            onClick={() => store.createNode("gain")}
            className="bg-gray-400"
          >
            gain
          </Button>
          <Button
            onClick={() => store.createNode("out")}
            className="bg-gray-400"
          >
            out
          </Button>
          <div className="bg-gray-400">state: {ctx?.state}</div>
        </Panel>
        <Controls />
        <MiniMap />
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
          color="#333"
          className="bg-slate-900"
        />
      </ReactFlow>
    </div>
  );
}
