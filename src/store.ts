import { nanoid } from "nanoid";
import {
  type NodeChange,
  applyNodeChanges,
  type EdgeChange,
  applyEdgeChanges,
  type Edge,
  type Node as FlowNode,
  type OnConnect,
} from "reactflow";
import { type StateCreator } from "zustand";
import {
  connect,
  createAudioNode,
  disconnectNodes,
  removeAudioNode,
  updateAudioNode,
} from "./audio";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

// https://docs.pmnd.rs/zustand/guides/typescript#slices-pattern
type FlowSlice = {
  nodes: FlowNode<NodeData>[];
  edges: Edge[];

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  addEdge: OnConnect;
  removeEdges: (edges: Edge[]) => void;

  updateNode: (id: string, data: NodeData) => void;
  removeNodes: (nodes: FlowNode[]) => void;
  createNode: (type: NodeData["type"]) => void;
};

export type NodeData =
  | {
      type: "osc";
      frequency: number;
    }
  | {
      type: "gain";
      gain: number;
    }
  | {
      type: "out";
    };

type AudioSlice = {
  ctx: AudioContext | null;
  toggleAudio: () => Promise<void>;
  setup: () => void;
};
const createAudioSlice: StateCreator<AudioSlice, [], [], AudioSlice> = (
  set,
  get,
) => ({
  ctx: null,
  toggleAudio: async () => {
    const audioCtx = get().ctx;
    console.log("toggle audio", audioCtx?.state);
    audioCtx?.state === "running"
      ? await audioCtx?.suspend()
      : await audioCtx?.resume();
  },
  setup: () => {
    const ctx = get().ctx;
    if (!ctx) {
      console.log("overriding context");
      const newCtx = new AudioContext();
      set({ ctx: newCtx });
    }
  },
});

const createFlowSlice: StateCreator<
  FlowSlice & AudioSlice,
  [],
  [],
  FlowSlice
> = (set, get) => ({
  nodes: [
    // {
    //   id: "osc",
    //   position: { x: 300, y: 300 },
    //   data: { type: "osc", frequency: 440 },
    //   type: "osc",
    // },
    // {
    //   id: "gain",
    //   position: { x: 600, y: 300 },
    //   data: { type: "gain", gain: 0 },
    //   type: "gain",
    // },
    // {
    //   id: "out",
    //   position: { x: 900, y: 300 },
    //   data: { type: "out" },
    //   type: "out",
    // },
  ],
  edges: [],
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  addEdge: (connection) => {
    if (!connection.source && !connection.target) {
      return;
    }
    const id = nanoid(6);
    const edge = { id, ...connection } as Edge;

    set({ edges: [edge, ...get().edges] });

    connect(connection.source!, connection.target!);
  },

  removeEdges: (edges) => {
    for (const { source, target } of edges) {
      disconnectNodes(source, target);
    }
  },

  updateNode: (id, data) => {
    updateAudioNode(id, data);
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n,
      ),
    });
  },
  removeNodes: (nodes) => {
    for (const { id } of nodes) {
      removeAudioNode(id);
    }
  },

  createNode: (type) => {
    const id = nanoid(6);
    const ctx = get().ctx;
    if (!ctx) return;

    switch (type) {
      case "osc": {
        const data = { type: "osc", frequency: 440 } as const;
        const position = { x: 0, y: 0 };

        createAudioNode(ctx, id, type, data);
        set({ nodes: [...get().nodes, { id, type, data, position }] });

        break;
      }

      case "gain": {
        const data = { type: "gain", gain: 0 } as const;
        const position = { x: 0, y: 0 };

        createAudioNode(ctx, id, type, data);
        set({ nodes: [...get().nodes, { id, type, data, position }] });

        break;
      }
      case "out": {
        const data = { type: "out" } as const;
        const position = { x: 0, y: 0 };

        createAudioNode(ctx, id, type, data);
        set({ nodes: [...get().nodes, { id, type, data, position }] });

        break;
      }
    }
  },
});

export const useStore = createWithEqualityFn<FlowSlice & AudioSlice>()(
  (...a) => ({
    ...createFlowSlice(...a),
    ...createAudioSlice(...a),
  }),
  shallow,
);
