"use client";
import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import { TextUpdaterNode } from "~/components/custom-node";
import { Osc } from "~/components/nodes";
import { type NodeData } from "~/store";

const initialNodes = [
  {
    id: "1",
    data: { label: "Hello" },
    position: { x: 0, y: 0 },
    type: "input",
  },
  {
    id: "2",
    data: { label: "World" },
    position: { x: 100, y: 100 },
  },
  {
    id: "osccc",
    data: { type: "osc", frequency: 440 },
    position: { x: 300, y: 300 },
    type: "osc",
  },
  {
    id: "text",
    data: { label: "Text" },
    position: { x: 500, y: 500 },
    type: "text",
  },
];

const nodeTypes = {
  osc: Osc,
  text: TextUpdaterNode,
};

const initialEdges: Edge[] = [];

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange<NodeData, NodeData["type"]>[]) =>
      // @ts-expect-error asdf
      // eslint-disable-next-line
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  useEffect(() => {
    console.log("ran effect");
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Flow;
