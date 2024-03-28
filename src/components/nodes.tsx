"use client";
import { Handle, Position, clamp } from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Slider } from "~/components/ui/slider";
import { useStore } from "~/store";

export function Gain({ id, data }: { id: string; data: { gain: number } }) {
  // const handleStyle = { left: 10 };
  const { setGain } = useStore((store) => ({
    setGain: (gain: number) => store.updateNode(id, { gain }),
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

export function Out({ id }: { id: string }) {
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

export function Osc({ id, data }: { id: string; data: { frequency: number } }) {
  const { setFrequency } = useStore((store) => ({
    setFrequency: (frequency: number) =>
      store.updateNode(id, { type: "osc", frequency }),
  }));
  return (
    <div className="flex min-w-32 flex-col gap-4 rounded-md bg-gray-300 p-4">
      <p>Oscillator</p>
      <Label htmlFor="freq-slider">Frequency</Label>
      <Slider
        value={[data.frequency]}
        onValueChange={(v) => setFrequency(v[0]!)}
        max={22050}
        min={0}
        step={1}
      />
      <Input
        value={data.frequency}
        onChange={(e) => {
          if (e.target.value !== "") {
            const parsed = parseInt(e.target.value);
            const clamped = clamp(parsed, 0, 22050);
            setFrequency(clamped);
          } else {
            setFrequency(0);
          }
        }}
      />
      <div>{data.frequency} Hz</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
