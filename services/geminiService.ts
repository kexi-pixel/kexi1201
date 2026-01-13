import { GoogleGenAI, Type } from "@google/genai";
import { AIExplanation, KnowledgeNode, LearningAdvice } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const explainConcept = async (concept: string): Promise<AIExplanation> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `请解释概念 "${concept}"。要求：1. 使用中英双语。2. 提供逻辑节点结构。3. 侧重市场营销和战略应用场景。`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          keyPoints: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING } }, required: ["name", "description"] } },
          marketingApplication: { type: Type.STRING },
          suggestedCategory: { type: Type.STRING },
          visualStructure: { type: Type.OBJECT, properties: { nodes: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, label: { type: Type.STRING }, type: { type: Type.STRING } }, required: ["id", "label", "type"] } }, links: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { source: { type: Type.STRING }, target: { type: Type.STRING } }, required: ["source", "target"] } } }, required: ["nodes", "links"] }
        },
        required: ["title", "summary", "keyPoints", "marketingApplication", "suggestedCategory", "visualStructure"],
      },
    },
  });
  return JSON.parse(response.text);
};

export const analyzeTree = async (tree: KnowledgeNode): Promise<LearningAdvice> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `分析以下知识树并给出学习建议：${JSON.stringify(tree)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallProgress: { type: Type.STRING },
          knowledgeGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedNextSteps: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { topic: { type: Type.STRING }, reason: { type: Type.STRING } }, required: ["topic", "reason"] } },
          marketingSynergy: { type: Type.STRING }
        },
        required: ["overallProgress", "knowledgeGaps", "suggestedNextSteps", "marketingSynergy"]
      }
    }
  });
  return JSON.parse(response.text);
};
