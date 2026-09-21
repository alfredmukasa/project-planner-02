import { Download, Filter, Maximize2, Minus, Plus, Search } from 'lucide-react';

import { type LayoutEdge, type LayoutNode, layoutLayered } from '@/lib/graph-layout';

export interface GraphNodeInput extends LayoutNode {
  kind: string;
  status?: string;
}

export interface GraphEdgeInput extends LayoutEdge {
  label?: string;
}

const NODE_W = 150;
const NODE_H = 44;
const GAP_X = 70;
const GAP_Y = 18;
const PAD = 16;

const KIND_COLOR: Record<string, string> = {
  frontend: 'var(--accent)',
  interface: 'var(--accent)',
  api: 'var(--info)',
  service: 'var(--info)',
  backend: 'var(--info)',
  logic: 'var(--info)',
  database: 'var(--success)',
  storage: 'var(--success)',
  ai: 'var(--warning)',
  external: 'var(--text-faint)',
  infrastructure: 'var(--text-muted)',
  authentication: 'var(--danger)',
  user: 'var(--text)',
  result: 'var(--text)',
};

/**
 * Static SVG rendering of a graph derived from the demo project. Node
 * positions come from the same layered layout the desktop application uses.
 */
export function GraphSvg({ nodes, edges, selectedId, direction = 'LR', ariaLabel }: { nodes: GraphNodeInput[]; edges: GraphEdgeInput[]; selectedId?: string; direction?: 'LR' | 'TB'; ariaLabel: string }) {
  const laid = layoutLayered(nodes, edges, { nodeW: NODE_W, nodeH: NODE_H, gapX: GAP_X, gapY: GAP_Y, direction });
  const byId = new Map(laid.nodes.map((n) => [n.id, n]));
  const inputs = new Map(nodes.map((n) => [n.id, n]));
  const neighbours = new Set<string>();
  const activeEdges = new Set<string>();
  if (selectedId) {
    neighbours.add(selectedId);
    for (const e of edges) {
      if (e.source === selectedId || e.target === selectedId) {
        activeEdges.add(e.id);
        neighbours.add(e.source);
        neighbours.add(e.target);
      }
    }
  }
  const width = laid.width + PAD * 2;
  const height = laid.height + PAD * 2;

  return (
    <div className="rounded-md border border-border bg-bg">
      <div className="flex items-center gap-1 border-b border-border px-2 py-1 text-text-muted" aria-hidden>
        {[Maximize2, Plus, Minus].map((Icon, i) => (
          <span key={i} className="inline-flex h-5 w-5 items-center justify-center rounded-sm border border-border bg-surface">
            <Icon size={10} />
          </span>
        ))}
        <span className="ml-1 inline-flex items-center gap-1 rounded-sm border border-border bg-surface px-1.5 py-0.5 text-2xs">
          <Search size={9} /> Search nodes
        </span>
        <span className="inline-flex items-center gap-1 rounded-sm border border-border bg-surface px-1.5 py-0.5 text-2xs">
          <Filter size={9} /> Filter
        </span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-sm border border-border bg-surface px-1.5 py-0.5 text-2xs">
          <Download size={9} /> Export
        </span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel} className="block w-full h-auto" style={{ maxHeight: 460 }}>
        <defs>
          <marker id="pp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--border-strong)" />
          </marker>
          <marker id="pp-arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
          </marker>
        </defs>
        <g transform={`translate(${PAD} ${PAD})`}>
          {edges.map((e) => {
            const s = byId.get(e.source);
            const t = byId.get(e.target);
            if (!s || !t) return null;
            const active = activeEdges.has(e.id);
            const dim = selectedId && !active;
            let d: string;
            let lx: number;
            let ly: number;
            if (direction === 'LR') {
              const x1 = s.x + NODE_W;
              const y1 = s.y + NODE_H / 2;
              const x2 = t.x;
              const y2 = t.y + NODE_H / 2;
              const c = (x2 - x1) / 2;
              d = `M ${x1} ${y1} C ${x1 + c} ${y1}, ${x2 - c} ${y2}, ${x2} ${y2}`;
              lx = (x1 + x2) / 2;
              ly = (y1 + y2) / 2 - 4;
            } else {
              const x1 = s.x + NODE_W / 2;
              const y1 = s.y + NODE_H;
              const x2 = t.x + NODE_W / 2;
              const y2 = t.y;
              const c = (y2 - y1) / 2;
              d = `M ${x1} ${y1} C ${x1} ${y1 + c}, ${x2} ${y2 - c}, ${x2} ${y2}`;
              lx = (x1 + x2) / 2;
              ly = (y1 + y2) / 2 - 4;
            }
            return (
              <g key={e.id} opacity={dim ? 0.35 : 1}>
                <path d={d} fill="none" stroke={active ? 'var(--accent)' : 'var(--border-strong)'} strokeWidth={active ? 1.75 : 1.25} markerEnd={active ? 'url(#pp-arrow-active)' : 'url(#pp-arrow)'} />
                {e.label && (
                  <text x={lx} y={ly} textAnchor="middle" fontSize="9" fill={active ? 'var(--accent)' : 'var(--text-faint)'} style={{ fontFamily: 'var(--font-sans)' }}>
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}
          {laid.nodes.map((n) => {
            const input = inputs.get(n.id);
            const selected = n.id === selectedId;
            const dim = selectedId && !neighbours.has(n.id);
            const color = KIND_COLOR[input?.kind ?? ''] ?? 'var(--text-muted)';
            return (
              <g key={n.id} transform={`translate(${n.x} ${n.y})`} opacity={dim ? 0.4 : 1}>
                <rect width={NODE_W} height={NODE_H} rx="5" fill="var(--surface)" stroke={selected ? 'var(--accent)' : 'var(--border-strong)'} strokeWidth={selected ? 2 : 1} />
                <rect x="0" y="0" width="4" height={NODE_H} rx="2" fill={color} />
                <text x="12" y="18" fontSize="11" fontWeight="600" fill="var(--text)" style={{ fontFamily: 'var(--font-sans)' }}>
                  {n.label.length > 22 ? `${n.label.slice(0, 21)}…` : n.label}
                </text>
                <text x="12" y="33" fontSize="9" fill="var(--text-faint)" style={{ fontFamily: 'var(--font-sans)' }}>
                  {input?.kind}
                  {input?.status ? ` · ${input.status.replace('_', ' ')}` : ''}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
