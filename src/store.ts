import { nanoid } from "nanoid";
import {
  type NodeChange,
  applyNodeChanges,
  type EdgeChange,
  applyEdgeChanges,
  type Edge,
} from "reactflow";
import { create } from "zustand";

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],

  onNodesChange(changes: NodeChange[]) {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange(changes: EdgeChange[]) {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  addEdge(data: Omit<Edge, "id">) {
    const id = nanoid(6);
    const edge = { id, ...data };

    set({ edges: [edge, ...get().edges] });
  },
}));
