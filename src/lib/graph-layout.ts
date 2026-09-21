/** Deterministic longest-path layered layout for the SVG graph previews. */

export interface LayoutNode {
  id: string;
  group: string;
  label: string;
}

export interface LayoutEdge {
  id: string;
  source: string;
  target: string;
}

export interface Positioned extends LayoutNode {
  x: number;
  y: number;
  layer: number;
}

export interface LayoutResult {
  nodes: Positioned[];
  width: number;
  height: number;
}

export function layoutLayered(nodes: LayoutNode[], edges: LayoutEdge[], opts: { nodeW: number; nodeH: number; gapX: number; gapY: number; direction?: 'LR' | 'TB' }): LayoutResult {
  const direction = opts.direction ?? 'LR';
  const ids = new Set(nodes.map((n) => n.id));
  const parents = new Map<string, string[]>();
  ids.forEach((id) => parents.set(id, []));
  for (const e of edges) if (ids.has(e.source) && ids.has(e.target) && e.source !== e.target) parents.get(e.target)!.push(e.source);

  const layer = new Map<string, number>();
  const visiting = new Set<string>();
  const depth = (id: string): number => {
    const cached = layer.get(id);
    if (cached !== undefined) return cached;
    if (visiting.has(id)) return 0;
    visiting.add(id);
    const ps = parents.get(id) ?? [];
    const v = ps.length ? Math.max(...ps.map((p) => depth(p) + 1)) : 0;
    visiting.delete(id);
    layer.set(id, v);
    return v;
  };
  ids.forEach(depth);

  const buckets = new Map<number, LayoutNode[]>();
  for (const n of nodes) {
    const l = layer.get(n.id) ?? 0;
    buckets.set(l, [...(buckets.get(l) ?? []), n]);
  }
  const layers = [...buckets.entries()].sort((a, b) => a[0] - b[0]);
  const maxPerLayer = Math.max(...layers.map(([, b]) => b.length));
  const acrossTotal = maxPerLayer * opts.nodeH + (maxPerLayer - 1) * opts.gapY;

  const out: Positioned[] = [];
  for (const [l, bucket] of layers) {
    bucket.sort((a, b) => a.group.localeCompare(b.group) || a.label.localeCompare(b.label));
    const bucketAcross = bucket.length * opts.nodeH + (bucket.length - 1) * opts.gapY;
    const offset = (acrossTotal - bucketAcross) / 2;
    bucket.forEach((n, i) => {
      const along = l * (opts.nodeW + opts.gapX);
      const across = offset + i * (opts.nodeH + opts.gapY);
      out.push(direction === 'LR' ? { ...n, x: along, y: across, layer: l } : { ...n, x: across, y: along, layer: l });
    });
  }
  const layerCount = layers.length;
  const alongTotal = layerCount * opts.nodeW + (layerCount - 1) * opts.gapX;
  return direction === 'LR' ? { nodes: out, width: alongTotal, height: acrossTotal } : { nodes: out, width: acrossTotal, height: alongTotal };
}
