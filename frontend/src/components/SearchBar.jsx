import React, { useState } from 'react'
import { motion } from 'framer-motion'


export default function SearchBar({ onSearch, loading }){
    const [q, setQ] = useState('')

    function submit(e){
        e.preventDefault()
        if (!q.trim()) return
        onSearch(q.trim())
    }

    return (
        <form onSubmit={submit} className="p-4 bg-gradient-to-br from-primary/20 to-slate-900 rounded-3xl shadow-xl">
            <div className="flex gap-3">
                <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search your dev history — e.g. 'redis fix'" className="flex-1 p-3 rounded-2xl bg-slate-900 text-slate-100" />
                <button type="submit" className="px-4 py-2 rounded-2xl bg-accent text-slate-900 font-semibold">{loading? 'Searching...' : 'Search'}</button>
            </div>
        </form>
    )
}