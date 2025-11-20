import axios from 'axios'


const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'


export async function semanticSearch(query, top_k=10, minScore=0.3) {
  const payload = { query, top_k };
  const res = await axios.post(`${API_BASE}/search?min_score=${minScore}`, payload);
  return res.data;
}



export async function fetchEvent(id){
    const res = await axios.get(`${API_BASE}/event/${id}`)
    return res.data
}

export async function fetchDiff(id1, id2) {
  const res = await fetch(`/compare?id1=${id1}&id2=${id2}`);
  return await res.json();
}