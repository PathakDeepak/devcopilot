import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

export default function ScoreHistogram({ results, minScore }) {
  if (!results || results.length === 0) {
    return (
      <div className="text-slate-400 text-sm mt-3">
        Run a search to view score distribution.
      </div>
    );
  }

  // Convert scores into buckets (0.0–1.0 grouped)
  const bucketSize = 0.1;
  const buckets = Array.from({ length: 10 }, (_, i) => ({
    range: `${(i * bucketSize).toFixed(1)}-${((i + 1) * bucketSize).toFixed(
      1
    )}`,
    count: 0,
  }));

  results.forEach((r) => {
    const score = r.score ?? 0;
    const index = Math.min(
      Math.floor(score / bucketSize),
      buckets.length - 1
    );
    buckets[index].count += 1;
  });

  return (
    <div className="w-full mt-4">
      <h4 className="text-sm font-semibold text-slate-200">
        Similarity Score Histogram
      </h4>

      <div className="h-48 mt-2 bg-slate-900 p-2 rounded-xl shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={buckets}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="range"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
            />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
            <Tooltip
              wrapperStyle={{ outline: "none" }}
              contentStyle={{
                backgroundColor: "#1e293b",
                borderRadius: "8px",
                border: "none",
              }}
              labelStyle={{ color: "#e2e8f0" }}
              itemStyle={{ color: "#e2e8f0" }}
            />
            <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            <ReferenceLine x={minScore.toFixed(1)} stroke="#f43f5e" strokeDasharray="3 3" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

