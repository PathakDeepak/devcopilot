import React from "react";
import { motion } from "framer-motion";

export default function ResultCard({ item, onOpen, onCompare }) {
  const payload = item.payload || item;
  const title = payload.title || payload.type || "Untitled";
  const body = payload.body || payload.raw_text || "";
  const ts = payload.timestamp
    ? new Date(payload.timestamp / 1000).toLocaleString()
    : "";

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="p-4 bg-gradient-to-br from-slate-800/60 to-slate-700/40 rounded-xl mb-3 cursor-pointer border border-slate-700 hover:border-slate-500 transition"
      onClick={() => onOpen(item.id)}
    >
      <div className="flex items-start justify-between">
        {/* LEFT SECTION */}
        <div className="pr-3">
          <h4 className="text-md font-semibold text-slate-200">{title}</h4>
          <p className="text-sm text-slate-300 mt-1 truncate">{body}</p>

          {/* Compare Button */}
          <button
            className="mt-3 px-2 py-1 text-xs rounded-md bg-purple-600 hover:bg-purple-500 transition"
            onClick={(e) => {
              e.stopPropagation();        // prevent triggering onOpen
              onCompare(item.id);
            }}
          >
            Compare
          </button>
        </div>

        {/* RIGHT SECTION */}
        <div className="text-right text-xs text-slate-400">
          {ts}
          <div className="text-sm font-mono mt-1 text-slate-300">
            {item.score?.toFixed(3)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
