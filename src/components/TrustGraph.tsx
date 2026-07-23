'use client';

import { useEffect, useRef } from 'react';
import type { TrustNode, TrustEdge } from '@/app/api/trust-graph/route';

interface TrustGraphProps {
  nodes: TrustNode[];
  edges: TrustEdge[];
  onNodeSelect: (node: TrustNode | null) => void;
  selectedNodeId?: string | null;
}

const NODE_COLOR: Record<string, string> = {
  trusted: '#22c55e',
  degraded: '#f97316',
  blocked: '#ef4444',
};

const NODE_RING: Record<string, string> = {
  orchestrator: '#38bdf8',
  worker: '#818cf8',
  external: '#94a3b8',
  compromised: '#ef4444',
};

export default function TrustGraph({ nodes, edges, onNodeSelect, selectedNodeId }: TrustGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    // Dynamically import D3 to avoid SSR issues
    import('d3').then((d3) => {
      const svg = d3.select(svgRef.current!);
      svg.selectAll('*').remove();

      const width = svgRef.current!.clientWidth || 800;
      const height = svgRef.current!.clientHeight || 600;

      // Build simulation nodes/links with position state
      type SimNode = TrustNode & d3.SimulationNodeDatum;
      type SimLink = d3.SimulationLinkDatum<SimNode> & Omit<TrustEdge, 'source' | 'target'>;

      const simNodes: SimNode[] = nodes.map(n => ({ ...n }));
      const nodeById = new Map(simNodes.map(n => [n.id, n]));

      const simLinks: SimLink[] = edges
        .map(e => ({
          ...e,
          source: nodeById.get(e.source) ?? e.source,
          target: nodeById.get(e.target) ?? e.target,
        }))
        .filter(e => e.source && e.target);

      const simulation = d3.forceSimulation<SimNode>(simNodes)
        .force('link', d3.forceLink<SimNode, SimLink>(simLinks).id(d => d.id).distance(130).strength(0.6))
        .force('charge', d3.forceManyBody().strength(-400))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide(48));

      // Defs for arrow markers
      const defs = svg.append('defs');
      ['trusted', 'blocked'].forEach(type => {
        defs.append('marker')
          .attr('id', `arrow-${type}`)
          .attr('viewBox', '0 -5 10 10')
          .attr('refX', 28)
          .attr('refY', 0)
          .attr('markerWidth', 6)
          .attr('markerHeight', 6)
          .attr('orient', 'auto')
          .append('path')
          .attr('d', 'M0,-5L10,0L0,5')
          .attr('fill', type === 'blocked' ? '#ef4444' : '#22c55e')
          .attr('opacity', 0.8);
      });

      // Background grid
      svg.append('rect').attr('width', width).attr('height', height).attr('fill', 'transparent');

      // Edges
      const link = svg.append('g')
        .selectAll<SVGLineElement, SimLink>('line')
        .data(simLinks)
        .enter()
        .append('line')
        .attr('stroke', d => d.blocked ? '#ef4444' : '#22c55e')
        .attr('stroke-width', d => d.blocked ? 2 : 1.5)
        .attr('stroke-opacity', 0.7)
        .attr('stroke-dasharray', d => d.blocked ? '6,4' : 'none')
        .attr('marker-end', d => `url(#arrow-${d.blocked ? 'blocked' : 'trusted'})`);

      // Edge labels (blocked only)
      const linkLabel = svg.append('g')
        .selectAll<SVGTextElement, SimLink>('text')
        .data(simLinks.filter(e => e.blocked))
        .enter()
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', '9px')
        .attr('fill', '#ef4444')
        .attr('font-weight', '600')
        .text(d => d.ruleTriggered?.split('_')[0] ?? 'BLOCKED');

      // Node groups
      const node = svg.append('g')
        .selectAll<SVGGElement, SimNode>('g')
        .data(simNodes)
        .enter()
        .append('g')
        .attr('cursor', 'pointer')
        .on('click', (_event, d) => onNodeSelect(d))
        .call(
          d3.drag<SVGGElement, SimNode>()
            .on('start', (event, d) => {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
            })
            .on('drag', (event, d) => {
              d.fx = event.x;
              d.fy = event.y;
            })
            .on('end', (event, d) => {
              if (!event.active) simulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
            })
        );

      // Outer ring (type indicator)
      node.append('circle')
        .attr('r', 26)
        .attr('fill', 'none')
        .attr('stroke', d => NODE_RING[d.type])
        .attr('stroke-width', d => d.id === selectedNodeId ? 3 : 1.5)
        .attr('stroke-dasharray', d => d.type === 'external' ? '4,3' : 'none')
        .attr('opacity', 0.6);

      // Main node circle
      node.append('circle')
        .attr('r', 20)
        .attr('fill', d => NODE_COLOR[d.trustLevel])
        .attr('fill-opacity', 0.15)
        .attr('stroke', d => NODE_COLOR[d.trustLevel])
        .attr('stroke-width', d => d.id === selectedNodeId ? 3 : 2);

      // Node icon text
      node.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-size', '14px')
        .text(d => {
          if (d.type === 'orchestrator') return '🔀';
          if (d.type === 'compromised') return '⚠️';
          if (d.type === 'external') return '🌐';
          return '🤖';
        });

      // Node label below
      node.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 36)
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .attr('fill', d => NODE_COLOR[d.trustLevel])
        .text(d => d.label);

      // mTLS badge
      node.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 50)
        .attr('font-size', '9px')
        .attr('fill', d => d.mtlsValid ? '#22c55e' : '#94a3b8')
        .text(d => d.mtlsValid ? '🔒 mTLS' : '⚠ No mTLS');

      // Simulation tick
      simulation.on('tick', () => {
        link
          .attr('x1', d => (d.source as SimNode).x ?? 0)
          .attr('y1', d => (d.source as SimNode).y ?? 0)
          .attr('x2', d => (d.target as SimNode).x ?? 0)
          .attr('y2', d => (d.target as SimNode).y ?? 0);

        linkLabel
          .attr('x', d => (((d.source as SimNode).x ?? 0) + ((d.target as SimNode).x ?? 0)) / 2)
          .attr('y', d => (((d.source as SimNode).y ?? 0) + ((d.target as SimNode).y ?? 0)) / 2 - 6);

        node.attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`);
      });

      return () => { simulation.stop(); };
    });
  }, [nodes, edges, selectedNodeId, onNodeSelect]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
}
