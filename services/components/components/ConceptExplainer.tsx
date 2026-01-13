import React, { useState } from 'react';
import { explainConcept } from '../services/geminiService';
import { AIExplanation } from '../types';

export default function ConceptExplainer({ onAddToTree }: { onAddToTree: (e: AIExplanation) => void }) {
  const [q, setQ] = useState('');
  const [res, setRes] = useState<AIExplanation | null>(null);
  const [ld, setLd] = useState(false);

  const handle = async () => {
    setLd(true);
    try { setRes(await explainConcept(q)); } catch (e) { alert("获取失败"); }
    setLd(false);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="输入你想学习的概念..." className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500" />
      <button onClick={handle} disabled={ld} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition">
        {ld ? "探索中..." : "解析概念"}
      </button>
      {res && (
        <div className="pt-4 space-y-4">
          <h2 className="text-xl font-bold">{res.title}</h2>
          <p className="text-sm text-slate-600">{res.summary}</p>
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100"><p className="text-xs font-bold text-emerald-700 mb-1">战略应用</p><p className="text-xs text-emerald-800">{res.marketingApplication}</p></div>
          <button onClick={() => onAddToTree(res)} className="w-full border-2 border-slate-900 py-3 rounded-2xl font-bold text-sm hover:bg-slate-900 hover:text-white transition">同步到我的知识树</button>
        </div>
      )}
    </div>
  );
}
