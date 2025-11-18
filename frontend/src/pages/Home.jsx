import React, { useState } from 'react'
import SearchBar from '../components/SearchBar'
import Timeline from '../components/Timeline'
import EventDrawer from '../components/EventDrawer'
import { semanticSearch, fetchEvent } from '../api'
import { motion } from 'framer-motion'

import ScoreHistogram from "../components/ScoreHistogram"
import ScoreThresholdSlider from "../components/ScoreThresholdSlider"

export default function Home(){
  const [results, setResults] = useState([])   // <-- IMPORTANT: in scope
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [minScore, setMinScore] = useState(0.30);

  async function onSearch(q){
    setLoading(true)
    try{
      const data = await semanticSearch(q, 20, minScore)
      setResults(data)
    }catch(e){
      console.error(e)
    }finally{
      setLoading(false)
    }
  }

  async function openEvent(id){
    try {
      const e = await fetchEvent(id)
      setSelected(e)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="grid grid-cols-12 gap-6">

      {/* LEFT SECTION: Search + Timeline */}
      <div className="col-span-8">

        {/* Search bar section */}
        <motion.div
          initial={{opacity:0, y:8}}
          animate={{opacity:1,y:0}}
          transition={{delay:0.05}}
        >
          <SearchBar onSearch={onSearch} loading={loading} />
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="mt-6"
          initial={{opacity:0}}
          animate={{opacity:1}}
        >
          <Timeline results={results} onOpen={openEvent} />
        </motion.div>
      </div>

      {/* RIGHT SECTION: Stats + Filters */}
      <div className="col-span-4">

        {/* Activity Summary */}
        <div className="p-4 bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold">Activity Summary</h3>
          <p className="mt-2 text-sm text-slate-300">
            Quick insights based on your search.
          </p>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Total events</span>
              <span className="font-medium">{results.length}</span>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Top score</span>
              <span className="font-medium">
                {results[0]?.score?.toFixed(3) ?? '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <div className="mt-6 p-4 bg-gradient-to-br from-slate-800/60 to-slate-700/40 rounded-2xl shadow-inner">
          <h4 className="text-sm text-slate-300 mb-2">Filters</h4>

          <div className="space-y-2">
            <select className="w-full rounded p-2 bg-slate-900 text-slate-100">
              <option value="">All types</option>
              <option value="git_commit">git_commit</option>
              <option value="cli_cmd">cli_cmd</option>
              <option value="api_call">api_call</option>
            </select>

            <input
              type="date"
              className="w-full rounded p-2 bg-slate-900 text-slate-100"
            />
          </div>
        </div>

        {/* ⭐ SCORE THRESHOLD SLIDER ⭐ */}
        <ScoreThresholdSlider value={minScore} onChange={setMinScore} />


        {/* ScoreHistogram Summary */}
        <ScoreHistogram results={results} minScore={minScore} />

      </div>

      {/* Event Drawer */}
      <EventDrawer
        selected={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
