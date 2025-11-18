import React from 'react'
import { motion } from 'framer-motion'

export default function EventDrawer({ selected, onClose }){
    if (!selected) return null
    const p = selected.payload || selected
    return (
        <motion.div initial={{x:200, opacity:0}} animate={{x:0, opacity:1}} exit={{x:200}} className="fixed right-6 top-16 w-96 bg-slate-900 p-5 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold">{p.title || p.type}</h3>
                <button onClick={onClose} className="text-slate-400">Close</button>
            </div>
            <div className="mt-3 text-slate-300 text-sm">
                <pre className="whitespace-pre-wrap">{JSON.stringify(p, null, 2)}</pre>
            </div>
        </motion.div>
    )
}