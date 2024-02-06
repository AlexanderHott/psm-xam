import { type NodeData } from "./store";

// const context = new AudioContext();
const nodes = new Map<string, AudioNode>();

// const osc = context.createOscillator();
// osc.frequency.value = 440;
// osc.type = "sine";
// osc.start();
//
// const amp = context.createGain();
// amp.gain.value = 0.0;
//
// const out = context.destination;
//
// nodes.set("osc", osc);
// nodes.set("gain", amp);
// nodes.set("out", out);

export function updateAudioNode(id: string, data: Record<string, any>) {
  const node = nodes.get(id);

  for (const [key, val] of Object.entries(data)) {
    if (key === "type") continue;
    console.log("updateAudioNode", key, val);
    if (node && node[key as keyof AudioNode] instanceof AudioParam) {
      // eslint-disable-next-line
      node[key].value = val;
    } else if (node) {
      // eslint-disable-next-line
      node[key] = val;
    }
  }
}

export function removeAudioNode(id: string) {
  const node = nodes.get(id);

  node?.disconnect();
  // node?.stop?.();

  nodes.delete(id);
}

export function connect(sourceId: string, targetId: string) {
  const source = nodes.get(sourceId);
  const target = nodes.get(targetId);

  console.log("connected", sourceId, targetId);
  if (source && target) {
    console.log("connected", sourceId, targetId);
    source.connect(target);
  }
}

export function disconnectNodes(sourceId: string, targetId: string) {
  const source = nodes.get(sourceId);
  const target = nodes.get(targetId);

  if (source && target) {
    try {
      source.disconnect(target);
    } catch (e) {
      if (e instanceof DOMException) {
        // node isn't connected
        return;
      }
      console.log("err", e);
    }
  }
}

export function isRunning(context: AudioContext) {
  return context.state === "running";
}

export function toggleAudio(context: AudioContext) {
  return isRunning(context) ? context.suspend() : context.resume();
}

export function createAudioNode(
  context: AudioContext,
  id: string,
  type: NodeData["type"],
  data: NodeData,
) {
  switch (data.type) {
    case "osc": {
      const node = context.createOscillator();
      node.frequency.value = data.frequency;
      // node.type = data.type;
      node.start();

      nodes.set(id, node);
      break;
    }

    case "gain": {
      const node = context.createGain();
      node.gain.value = data.gain;

      nodes.set(id, node);
      break;
    }
    case "out": {
      const node = context.destination;

      nodes.set(id, node);
      break;
    }
  }
}
