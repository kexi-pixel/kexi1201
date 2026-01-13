import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { KnowledgeNode } from '../types';

export default function MindMap({ data, onNodeClick }: { data: KnowledgeNode, onNodeClick: (n: KnowledgeNode) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const width = 800, height = 500;
    const root = d3.hierarchy(data);
    const treeLayout = d3.tree<KnowledgeNode>().size([height - 100, width - 200]);
    treeLayout(root);
    const g = svg.append("g").attr("transform", "translate(100, 50)");
    g.selectAll(".link").data(root.links()).enter().append("path").attr("d", d3.linkHorizontal().x((d: any) => d.y).y((d: any) => d.x) as any).attr("fill", "none").attr("stroke", "#e2e8f0");
    const node = g.selectAll(".node").data(root.descendants()).enter().append("g").attr("transform", (d: any) => `translate(${d.y},${d.x})`).on("click", (e, d) => onNodeClick(d.data));
    node.append("circle").attr("r", 6).attr("fill", "#6366f1");
    node.append("text").attr("dy", ".35em").attr("x", 10).text((d: any) => d.data.name).style("font-size", "12px").attr("font-weight", "bold");
  }, [data]);
  return <svg ref={svgRef} className="w-full h-[500px]" />;
}
