import React from "react";

export default function ScoreThresholdSlider({ value, onChange }) {
  return (
    <div className="mt-6 p-4 bg-slate-800/40 rounded-xl shadow-inner">
      <label className="text-sm font-semibold text-slate-300">
        Minimum Similarity Score: {value.toFixed(2)}
      </label>

      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full mt-3 accent-cyan-400 cursor-pointer"
      />
    </div>
  );
}
