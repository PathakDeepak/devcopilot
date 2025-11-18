import React from 'react'
import ResultCard from './ResultCard'

export default function Timeline({ results, onOpen }) {
  if (!results || results.length === 0)
    return <div className="text-slate-400 mt-6">No results yet — try a search.</div>

  return (
    <div className="mt-4">
      {results.map(r => (
        <ResultCard key={r.id} item={r} onOpen={onOpen} />
      ))}
    </div>
  )
}
