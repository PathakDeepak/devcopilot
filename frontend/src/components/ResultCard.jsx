import React from 'react'
import { motion } from 'framer-motion'

export default function ResultCard({ item, onOpen }) {
  const payload = item.payload || item
  const title = payload.title || payload.type || 'Untitled'
  const body = payload.body || ''
  const ts = payload.timestamp ? new Date(payload.timestamp/1000).toLocaleString() : ''

  return (
    <motion.div
      whileHover={{scale:1.01}}
      className="p-4 bg-gradient-to-br from-slate-800/60 to-slate-700/40 rounded-xl mb-3 cursor-pointer"
      onClick={() => onOpen(item.id)}
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-md font-semibold">{title}</h4>
          <p className="text-sm text-slate-300 mt-1 truncate">{body}</p>
        </div>
        <div className="text-right text-xs text-slate-400">
          {ts}
          <div className="text-sm font-mono mt-1">{item.score?.toFixed(3)}</div>
        </div>
      </div>
    </motion.div>
  )
}
