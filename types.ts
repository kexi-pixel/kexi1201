export interface ConceptPart { name: string; description: string; }
export interface VisualNode { id: string; label: string; type: 'core' | 'component' | 'benefit' | 'risk'; }
export interface VisualLink { source: string; target: string; }
export interface AIExplanation {
  title: string;
  summary: string;
  keyPoints: ConceptPart[];
  marketingApplication: string;
  suggestedCategory: string;
  visualStructure: { nodes: VisualNode[]; links: VisualLink[]; };
}
export interface KnowledgeNode {
  id: string;
  name: string;
  category: string;
  description?: string;
  children?: KnowledgeNode[];
}
export interface LearningAdvice {
  overallProgress: string;
  knowledgeGaps: string[];
  suggestedNextSteps: { topic: string; reason: string; }[];
  marketingSynergy: string;
}
