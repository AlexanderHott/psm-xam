"use client";
import { useCallback, useMemo } from "react";
import ReactFlow, {
  useEdgesState,
  useNodesState,
  addEdge,
  type Connection,
  type Edge,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  SelectionMode,
  Panel,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

const audioCtx = new AudioContext();

export default function FlowPage() {
  const initialNodes = [
    { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
    { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
    {
      id: "asdf",
      position: { x: 500, y: 500 },
      data: { label: "" },
      type: "gain",
    },
  ];
  const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      console.log("connection", params);
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges],
  );

  // https://reactflow.dev/api-reference/react-flow#pan-on-drag
  const panOnDrag = [1, 2];

  const nodeTypes = useMemo(() => ({ gain: Gain }), []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgesDelete={(es) => console.log("del edges", es)}
        onNodesDelete={(ns) => console.log("del nodes", ns)}
        panOnScroll
        selectionOnDrag
        panOnDrag={panOnDrag}
        selectionMode={SelectionMode.Partial}
        nodeTypes={nodeTypes}
      >
        <Panel position="top-left">
          <button
            onClick={() =>
              setNodes((n) => [
                {
                  id: new Date().toString(),
                  position: { x: 0, y: 0 },
                  data: { label: "hi" },
                  type: "gain",
                },
                ...n,
              ])
            }
          >
            +
          </button>
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

function Gain() {
  const handleStyle = { left: 10 };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="rounded-md bg-red-500 p-4">
        <label htmlFor="text">Text:</label>
        <input
          id="text"
          name="text"
          onChange={(e) => console.log(e.target.value)}
          className="nodrag"
        />
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={handleStyle}
      />
    </>
  );
}
