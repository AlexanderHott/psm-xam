"use client";

import { useEffect, useState } from "react";

export function Audio() {
  const [audioCtx, setAudioCtx] = useState<AudioContext | undefined>(undefined);
  useEffect(() => {
    if (!audioCtx) {
      const ctx = new AudioContext();
      setAudioCtx(ctx);
    }
    return () => {
      if (audioCtx) {
        void audioCtx.close();
        setAudioCtx(undefined);
      }
    };
  }, [setAudioCtx]); // Empty dependency array ensures useEffect runs only once

  return (
    <div className="flex flex-col">
      <button
        onClick={() => {
          if (!audioCtx) return;
          // Create an oscillator node
          const oscillator = audioCtx.createOscillator();

          // Set the type of the oscillator to sine wave
          oscillator.type = "sine";

          // Set the frequency of the oscillator (e.g., 440 Hz for A4)
          oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);

          // Connect the oscillator to the audio context's destination (speakers)
          oscillator.connect(audioCtx.destination);

          // Start the oscillator
          // oscillator.start();

          // Stop the oscillator after a certain duration (e.g., 2 seconds)
          // const stopTime = audioCtx.currentTime + 2;
          // oscillator.stop(stopTime);

          // Clean up the audio context when the component unmounts
          //
        }}
      >
        setup
      </button>
      <button onClick={() => audioCtx?.resume()}>play</button>
      <button onClick={() => audioCtx?.suspend()}>pause</button>
    </div>
  );
}
