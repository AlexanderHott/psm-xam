import { memo, useCallback, useState } from "react";
import { Handle, Position } from "reactflow";
import { Slider } from "./ui/slider";
// import { useStore } from "~/store";

const handleStyle = { left: 10 };

// eslint-disable-next-line
type TODO = any;

export function TextUpdaterNode({ data }: { data: TODO }) {
  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (evt) => {
      console.log(evt.target.value);
      setText(evt.target.value);
    },
    [],
  );
  const [text, setText] = useState("");
  const [sld, setSld] = useState([0]);

  return (
    <div className="flex flex-col gap-4 bg-slate-300 p-4">
      <Handle
        type="target"
        style={{ width: 20, height: 20, top: -10 }}
        position={Position.Top}
      />
      <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
      </div>
      <Slider value={sld} onValueChange={(v) => setSld(v)} />
      <div>{text}</div>
      <div>{sld}</div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={handleStyle}
      />
    </div>
  );
}
