import { memo } from "react";
import { useStore } from "../store";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Handle, Position, clamp } from "reactflow";

export const Osc = memo(function Osc({
  id,
  data,
}: {
  id: string;
  data: { frequency: number };
}) {
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
});
