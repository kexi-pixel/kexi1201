import React, { useState, useEffect } from 'react';
import MindMap from './components/MindMap';
import ConceptExplainer from './components/ConceptExplainer';
import { KnowledgeNode, AIExplanation, LearningAdvice } from './types';
import { analyzeTree } from './services/geminiService';

const INITIAL_TREE: KnowledgeNode = {
  id: 'root',
  name: 'KEXI-1201 万象枢纽',
  category: 'General',
  children: [
    { id: 'cat-1', name: '市场与策略', category: 'Marketing', children: [] },
    { id: 'cat-2', name: '技术与AI', category: 'Technology', children: [] }
  ]
};

const App: React.FC = () => {
  const [treeData, setTreeData] = useState<KnowledgeNode>(() => {
    const saved = localStorage.getItem('kexi-data');
    return saved ? JSON.parse(saved) : INITIAL_TREE;
  });
  const [advice, setAdvice] = useState<LearningAdvice | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { localStorage.setItem('kexi-data', JSON.stringify(treeData)); }, [treeData]);

  const handleAddToTree = (exp: AIExplanation) => {
    const newNode: KnowledgeNode = {
      id: Math.random().toString(36).substr(2, 9),
      name: exp.title,
      category: exp.suggestedCategory,
      description: exp.summary,
      children: exp.keyPoints.map(p => ({ id: Math.random().toString(36).substr(2, 9), name: p.name, category: exp.suggestedCategory, description: p.description }))
    };
    const newTree = { ...treeData };
    newTree.children?.push(newNode);
    setTreeData(newTree);
  };

  const runAnalysis = async () => {
    setLoading(true);
    try { setAdvice(await analyzeTree(treeData)); } catch (e) { alert("分析失败"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900">KEXI-1201 NEXUS</h1>
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Personal Knowledge Hub</p>
        </div>
        <button onClick={runAnalysis} className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-black transition">
          {loading ? "AI 思考中..." : "AI 战略分析"}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4"><ConceptExplainer onAddToTree={handleAddToTree} /></div>
        <div className="lg:col-span-8 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold mb-4 px-4">我的知识树</h2>
          <MindMap data={treeData} onNodeClick={(n) => alert(n.description || "节点已选中")} />
        </div>
      </div>

      {advice && (
        <div className="bg-indigo-900 text-white p-8 rounded-3xl space-y-4">
          <h3 className="text-xl font-bold">AI 战略建议</h3>
          <p className="opacity-80">{advice.overallProgress}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {advice.suggestedNextSteps.map((s, i) => (
              <div key={i} className="bg-white/10 p-4 rounded-xl">
                <p className="font-bold">{s.topic}</p>
                <p className="text-xs opacity-60">{s.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
