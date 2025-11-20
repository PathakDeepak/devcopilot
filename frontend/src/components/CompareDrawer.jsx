import React from "react";
import DiffViewer from "./DiffViewer";
import { motion, AnimatePresence } from "framer-motion";

export default function CompareDrawer({ open, onClose, data }) {
  if (!open || !data) return null;

  const { id1, id2, event1, event2, diff, explanation } = data;

  const formatTime = (ts) => {
    if (!ts) return "";
    return new Date(ts).toLocaleString();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed right-0 top-0 h-full w-[48vw] bg-slate-800 border-l border-slate-700 shadow-xl z-50 flex flex-col"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
            <div>
              <h2 className="text-xl font-semibold">Compare Events</h2>
              <p className="text-xs text-slate-400">
                {id1} → {id2}
              </p>
            </div>

            <button
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          {/* CONTENT */}
          <div className="px-6 py-4 overflow-y-auto">
            {/* EVENT METADATA */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">

              {/* Left event metadata */}
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                <h3 className="text-slate-300 font-semibold">Event A</h3>
                <p className="text-slate-400 mt-1 text-xs">ID: {id1}</p>

                <div className="mt-3 space-y-1 text-xs text-slate-400">
                  <p>Type: <span className="text-slate-200">{event1?.type}</span></p>
                  <p>Title: <span className="text-slate-200">{event1?.title || "—"}</span></p>
                  <p>Time: <span className="text-slate-200">{formatTime(event1?.timestamp)}</span></p>
                </div>
              </div>

              {/* Right event metadata */}
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                <h3 className="text-slate-300 font-semibold">Event B</h3>
                <p className="text-slate-400 mt-1 text-xs">ID: {id2}</p>

                <div className="mt-3 space-y-1 text-xs text-slate-400">
                  <p>Type: <span className="text-slate-200">{event2?.type}</span></p>
                  <p>Title: <span className="text-slate-200">{event2?.title || "—"}</span></p>
                  <p>Time: <span className="text-slate-200">{formatTime(event2?.timestamp)}</span></p>
                </div>
              </div>

            </div>

            {/* DIFF SECTION */}
            <h3 className="text-sm text-slate-400 mb-2">Unified Diff</h3>
            <DiffViewer diff={diff} />

            {/* AI EXPLANATION */}
            {explanation && (
              <>
                <h3 className="text-sm text-slate-400 mt-6 mb-2">AI Explanation</h3>
                <div className="bg-slate-900 p-4 rounded-xl whitespace-pre-wrap border border-slate-700 text-slate-300 leading-relaxed">
                  {explanation}
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
