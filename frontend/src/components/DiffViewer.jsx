import React from "react";

export default function DiffViewer({ diff }) {
  if (!diff || diff.trim() === "") {
    return (
      <div className="text-slate-400 text-sm mt-3 italic">
        No differences found.
      </div>
    );
  }

  const lines = diff.split("\n");

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-4 max-h-[70vh] overflow-auto shadow-inner">
      <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed">
        {lines.map((line, idx) => {
          let color = "text-slate-300";
          let bg = "";

          if (line.startsWith("@@")) {
            color = "text-yellow-400 font-bold";
            bg = "bg-slate-800";
          } else if (line.startsWith("+")) {
            color = "text-green-400";
          } else if (line.startsWith("-")) {
            color = "text-red-400";
          }

          return (
            <div
              key={idx}
              className={`flex gap-3 px-1 py-0.5 ${bg}`}
            >
              {/* Line Number */}
              <span className="text-slate-500 w-12 select-none text-right pr-2">
                {idx + 1}
              </span>

              {/* Diff Line */}
              <span className={`${color} break-all`}>
                {line === "" ? " " : line}
              </span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}
