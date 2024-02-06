"use client";
import { useEffect } from "react";
import ReactFlow, {
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  SelectionMode,
  Panel,
  Handle,
  Position,
  clamp,
} from "reactflow";
import "reactflow/dist/style.css";
import { Osc } from "~/components/osc";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Slider } from "~/components/ui/slider";
import { useStore } from "~/store";

function Gain({ id, data }: { id: string; data: { gain: number } }) {
  // const handleStyle = { left: 10 };
  const { setGain } = useStore((store) => ({
    setGain: (gain: number) => store.updateNode(id, { type: "gain", gain }),
  }));

  return (
    <div className="flex min-w-32 flex-col gap-4 rounded-md bg-gray-300 p-4">
      <Handle type="target" position={Position.Top} />
      <p>Gain</p>
      <Label htmlFor="gain-slider">gain</Label>
      <Slider
        value={[data.gain]}
        onValueChange={(v) => setGain(v[0]!)}
        max={1}
        min={0}
        step={0.01}
      />
      <Input
        value={data.gain}
        onChange={(e) => {
          if (e.target.value !== "") {
            const parsed = parseFloat(e.target.value);
            const clamped = clamp(parsed, 0, 1);
            setGain(clamped);
          } else {
            setGain(0);
          }
        }}
      />
      <div>{data.gain} db</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function Out({ id }: { id: string }) {
  const { isRunning, toggleAudio } = useStore((store) => ({
    isRunning: store.ctx?.state === "running",
    toggleAudio: store.toggleAudio,
  }));

  return (
    <div className="flex min-w-32 flex-col justify-center gap-4 rounded-md bg-gray-300 p-4">
      <Handle type="target" position={Position.Top} />

      <p>Output Node</p>

      <Button id={`${id}:toggle`} onClick={() => void toggleAudio()}>
        {isRunning ? (
          <span role="img" aria-label="mute">
            🔇
          </span>
        ) : (
          <span role="img" aria-label="unmute">
            🔈
          </span>
        )}
      </Button>
    </div>
  );
}

const nodeTypes = {
  gain: Gain,
  osc: Osc,
  out: Out,
};
export default function FlowPage() {
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

  // const onConnect = useCallback(
  //   (params: Connection | Edge) => {
  //     console.log("connection", params);
  //     setEdges((eds) => addEdge(params, eds));
  //   },
  //   [setEdges],
  // );

  // https://reactflow.dev/api-reference/react-flow#pan-on-drag
  const panOnDrag = [1, 2];

  useEffect(() => {
    console.log("running setup effect");
    store.setup();
  }, []);

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
