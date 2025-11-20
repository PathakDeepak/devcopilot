import React from "react";
import ResultCard from "./ResultCard";

export default function Timeline({ results, onOpen, onCompare }) {
  if (!results || results.length === 0) {
    return (
      <div className="text-slate-400 mt-6 italic">
        No results yet — try searching for something.
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {results.map((item) => (
        <ResultCard
          key={item.id}
          item={item}
          onOpen={() => onOpen(item.id)}
          onCompare={() => onCompare(item.id)}
        />
      ))}
    </div>
  );
}
