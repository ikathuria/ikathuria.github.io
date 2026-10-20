/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { papers, projects, hackathons } from '../data';
import { skills, categoryMeta, skillsForTags, type Skill } from '../skills';
import graphData from '../public/project-graph.json';

// --- TYPES ---

type ItemKind = 'paper' | 'project' | 'hackathon';

interface RepoMap {
    components: Array<{ name: string; role: string }>;
    flow?: string;
}

/** Public enrichment written by the project-deepdive publish step. */
interface Enrichment {
    title?: string;
    kind?: ItemKind;
    date?: string;
    oneLiner?: string;
    tags?: string[];
    map?: RepoMap;
    github?: string;
    demo?: string;
}

interface MapItem {
    id: string;
    title: string;
    kind: ItemKind;
    date: string;
    oneLiner: string;
    tags: string[];
    skillIds: string[];
    map?: RepoMap;
    links: Array<{ label: string; href: string }>;
}

interface Node {
    id: string;
    type: 'item' | 'skill';
    label: string;
    w: number;
    h: number;
    x: number;
    y: number;
}

// --- DATA ---

const kindLabel: Record<ItemKind, string> = {
    paper: 'paper',
    project: 'project',
    hackathon: 'hackathon',
};

function buildItems(): MapItem[] {
    const extra = (graphData as { items: Record<string, Enrichment> }).items;
    const link = (label: string, href?: string) => (href ? [{ label, href }] : []);

    const base: MapItem[] = [
        ...papers.map((p) => ({
            id: p.id,
            title: p.metadata.title,
            kind: 'paper' as const,
            date: p.metadata.date,
            oneLiner: p.metadata.subtitle,
            tags: p.technical?.techStack ?? [],
            skillIds: [],
            links: link('paper', p.metadata.link),
        })),
        ...projects.map((p) => ({
            id: p.id,
            title: p.metadata.title,
            kind: 'project' as const,
            date: p.metadata.date,
            oneLiner: p.metadata.subtitle,
            tags: p.technical?.techStack ?? [],
            skillIds: [],
            links: [...link('code', p.metadata.githubUrl), ...link('demo', p.metadata.demoUrl)],
        })),
        ...hackathons.map((h) => ({
            id: h.id,
            title: h.project,
            kind: 'hackathon' as const,
            date: h.date,
            oneLiner: `${h.hackathon}. ${h.tagline}`,
            tags: h.techStack ?? [],
            skillIds: [],
            links: [
                ...link('code', h.links.github),
                ...link('demo', h.links.demo),
                ...link('devpost', h.links.devpost),
            ],
        })),
    ];

    const known = new Set(base.map((i) => i.id));
    const merged = base.map((item) => {
        const e = extra[item.id];
        if (!e) return item;
        return {
            ...item,
            oneLiner: e.oneLiner ?? item.oneLiner,
            tags: Array.from(new Set([...item.tags, ...(e.tags ?? [])])),
            map: e.map,
            links: item.links.length
                ? item.links
                : [...link('code', e.github), ...link('demo', e.demo)],
        };
    });
    // Repos published by a deep dive that aren't on the home page yet.
    const added = Object.entries(extra)
        .filter(([id, e]) => !known.has(id) && e.title)
        .map(([id, e]) => ({
            id,
            title: e.title!,
            kind: e.kind ?? 'project',
            date: e.date ?? '',
            oneLiner: e.oneLiner ?? '',
            tags: e.tags ?? [],
            skillIds: [],
            map: e.map,
            links: [...link('code', e.github), ...link('demo', e.demo)],
        }));

    return [...merged, ...added].map((i) => ({ ...i, skillIds: skillsForTags(i.tags) }));
}

// --- LAYOUT ---

const W = 1040;
const H = 680;
const textWidth = (s: string, item = false) => s.length * (item ? 7.3 : 7.2) + (item ? 38 : 22);

const shortLabel = (s: string) => {
    const base = s.split(/[:–]/)[0].trim();
    if (base.length <= 30) return base;
    return base.slice(0, base.lastIndexOf(' ', 29)) + '…';
};

/** Deterministic force layout (Fruchterman–Reingold) plus a box-overlap pass. */
function layout(
    items: MapItem[],
    shared: Skill[]
): { nodes: Node[]; edges: Array<[string, string]> } {
    const sharedIds = new Set(shared.map((s) => s.id));
    const placed = items.filter((i) => i.skillIds.some((s) => sharedIds.has(s)));
    const nodes: Node[] = [
        ...shared.map((s, k) => {
            const a = (2 * Math.PI * k) / shared.length;
            return {
                id: `s:${s.id}`,
                type: 'skill' as const,
                label: s.label,
                w: textWidth(s.label),
                h: 28,
                x: W / 2 + 150 * Math.cos(a),
                y: H / 2 + 120 * Math.sin(a),
            };
        }),
        ...placed.map((it, k) => {
            const a = (2 * Math.PI * k) / placed.length + 0.3;
            return {
                id: `i:${it.id}`,
                type: 'item' as const,
                label: shortLabel(it.title),
                w: textWidth(shortLabel(it.title), true),
                h: 30,
                x: W / 2 + 420 * Math.cos(a),
                y: H / 2 + 250 * Math.sin(a),
            };
        }),
    ];
    const edges: Array<[string, string]> = placed.flatMap((it) =>
        it.skillIds
            .filter((s) => sharedIds.has(s))
            .map((s) => [`i:${it.id}`, `s:${s}`] as [string, string])
    );
    const byId = new Map(nodes.map((n) => [n.id, n]));
    const k = Math.sqrt((W * H) / nodes.length) * 0.55;
    let temp = 60;

    for (let iter = 0; iter < 400; iter++) {
        const disp = new Map(nodes.map((n) => [n.id, { x: 0, y: 0 }]));
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i],
                    b = nodes[j];
                const dx = a.x - b.x || 0.01,
                    dy = a.y - b.y || 0.01;
                const d = Math.max(Math.hypot(dx, dy), 1);
                const f = (k * k) / d;
                disp.get(a.id)!.x += (dx / d) * f;
                disp.get(a.id)!.y += (dy / d) * f;
                disp.get(b.id)!.x -= (dx / d) * f;
                disp.get(b.id)!.y -= (dy / d) * f;
            }
        }
        for (const [s, t] of edges) {
            const a = byId.get(s)!,
                b = byId.get(t)!;
            const dx = a.x - b.x,
                dy = a.y - b.y;
            const d = Math.max(Math.hypot(dx, dy), 1);
            const f = (d * d) / k;
            disp.get(s)!.x -= (dx / d) * f;
            disp.get(s)!.y -= (dy / d) * f;
            disp.get(t)!.x += (dx / d) * f;
            disp.get(t)!.y += (dy / d) * f;
        }
        for (const n of nodes) {
            const v = disp.get(n.id)!;
            v.x += (W / 2 - n.x) * 0.02;
            v.y += (H / 2 - n.y) * 0.04; // wide, short canvas
            const m = Math.max(Math.hypot(v.x, v.y), 1);
            n.x += (v.x / m) * Math.min(m, temp);
            n.y += (v.y / m) * Math.min(m, temp);
        }
        temp = Math.max(temp * 0.985, 1);
    }

    // Fit centres into the canvas, then push overlapping labels apart and keep boxes inside it.
    const xs = nodes.map((n) => n.x),
        ys = nodes.map((n) => n.y);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    for (const n of nodes) {
        n.x = 110 + ((n.x - x0) / Math.max(x1 - x0, 1)) * (W - 220);
        n.y = 30 + ((n.y - y0) / Math.max(y1 - y0, 1)) * (H - 60);
    }
    const clamp = (n: Node) => {
        n.x = Math.min(Math.max(n.x, 8 + n.w / 2), W - 8 - n.w / 2);
        n.y = Math.min(Math.max(n.y, 8 + n.h / 2), H - 8 - n.h / 2);
    };
    for (let pass = 0; pass < 150; pass++) {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i],
                    b = nodes[j];
                const ox = (a.w + b.w) / 2 + 14 - Math.abs(a.x - b.x);
                const oy = (a.h + b.h) / 2 + 14 - Math.abs(a.y - b.y);
                if (ox > 0 && oy > 0) {
                    if (ox < oy) {
                        const s = a.x < b.x ? -1 : 1;
                        a.x += (s * ox) / 2;
                        b.x -= (s * ox) / 2;
                    } else {
                        const s = a.y < b.y ? -1 : 1;
                        a.y += (s * oy) / 2;
                        b.y -= (s * oy) / 2;
                    }
                }
            }
        }
        nodes.forEach(clamp);
    }
    return { nodes, edges };
}

// Built once: data.ts and the enrichment JSON are static.
const ITEMS = buildItems();

// --- COMPONENT ---

const chipClass = (on: boolean) =>
    `min-h-11 px-3 font-mono text-[13px] border border-ink rounded-[3px] transition-colors inline-flex items-center gap-2 ${on ? 'bg-ink text-paper' : 'bg-paper text-ink hover:bg-hi'}`;

const ProjectMap = () => {
    const items = ITEMS;
    const counts = useMemo(() => {
        const c = new Map<string, number>();
        items.forEach((i) => i.skillIds.forEach((s) => c.set(s, (c.get(s) ?? 0) + 1)));
        return c;
    }, [items]);
    // A skill becomes a node only when two or more items share it.
    const shared = useMemo(
        () =>
            skills
                .filter((s) => (counts.get(s.id) ?? 0) >= 2)
                .sort(
                    (a, b) =>
                        counts.get(b.id)! - counts.get(a.id)! || a.label.localeCompare(b.label)
                ),
        [counts]
    );
    const { nodes, edges } = useMemo(() => layout(items, shared), [items, shared]);
    const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
    const itemById = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
    const skillById = useMemo(() => new Map(skills.map((s) => [s.id, s])), []);
    const offMap = items.filter((i) => !byId.has(`i:${i.id}`));

    const [skill, setSkill] = useState<string | null>(null);
    const [item, setItem] = useState<string | null>(null);

    const active = new Set<string>();
    if (skill) {
        active.add(`s:${skill}`);
        edges.forEach(([i, s]) => s === `s:${skill}` && active.add(i));
    }
    if (item) {
        active.add(`i:${item}`);
        edges.forEach(([i, s]) => i === `i:${item}` && active.add(s));
    }
    const anyActive = active.size > 0;
    const edgeOn = (i: string, s: string) =>
        (skill ? s === `s:${skill}` : false) || (item ? i === `i:${item}` : false);

    const pickSkill = (id: string) => {
        setItem(null);
        setSkill((cur) => (cur === id ? null : id));
    };
    const pickItem = (id: string) => {
        setSkill(null);
        setItem((cur) => (cur === id ? null : id));
    };

    const selectedItem = item ? itemById.get(item) : undefined;
    const skillItems = skill ? items.filter((i) => i.skillIds.includes(skill)) : [];

    const log = selectedItem
        ? `project("${selectedItem.title}") → ${selectedItem.skillIds.length} skills: ${selectedItem.skillIds.map((s) => skillById.get(s)?.label).join(', ')}`
        : skill
          ? `skill("${skillById.get(skill)?.label}") → ${skillItems.length} items: ${skillItems.map((i) => i.title).join(', ')}`
          : `map.summary() → ${nodes.length - shared.length} items, ${shared.length} shared skills, ${edges.length} links`;

    return (
        <div>
            <div role="group" aria-label="Skills" className="flex flex-wrap gap-2 mb-6">
                {shared.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => pickSkill(s.id)}
                        aria-pressed={skill === s.id}
                        className={chipClass(skill === s.id)}
                    >
                        <span
                            aria-hidden="true"
                            className="w-2.5 h-2.5 border border-ink rounded-[2px]"
                            style={{ background: categoryMeta[s.category].color }}
                        />
                        {s.label}
                        <span className={skill === s.id ? 'text-machine-ink' : 'text-ink-2'}>
                            {counts.get(s.id)}
                        </span>
                    </button>
                ))}
            </div>

            <div
                tabIndex={0}
                role="region"
                aria-label="Skill map, scrolls sideways on small screens"
                className="border-[1.5px] border-ink rounded-[4px] bg-paper overflow-x-auto"
            >
                <svg
                    viewBox={`0 0 ${W} ${H}`}
                    className="block min-w-[880px] w-full h-auto"
                    role="img"
                    aria-label={`Skill map: ${nodes.length - shared.length} projects, papers and hackathons connected by ${shared.length} shared skills. Use the skill buttons above to explore it.`}
                >
                    {edges.map(([i, s]) => {
                        const a = byId.get(i)!,
                            b = byId.get(s)!;
                        const on = edgeOn(i, s);
                        return (
                            <line
                                key={`${i}-${s}`}
                                x1={a.x}
                                y1={a.y}
                                x2={b.x}
                                y2={b.y}
                                stroke={on ? '#1C1A17' : '#B9B2A6'}
                                strokeWidth={on ? 2.4 : 1.2}
                                opacity={anyActive && !on ? 0.35 : 1}
                            />
                        );
                    })}
                    {nodes.map((n) => {
                        const on = active.has(n.id);
                        const dim = anyActive && !on;
                        const id = n.id.slice(2);
                        if (n.type === 'skill') {
                            const s = skillById.get(id)!;
                            return (
                                <g
                                    key={n.id}
                                    onClick={() => pickSkill(id)}
                                    className="cursor-pointer"
                                    opacity={dim ? 0.4 : 1}
                                >
                                    <rect
                                        x={n.x - n.w / 2}
                                        y={n.y - n.h / 2}
                                        width={n.w}
                                        height={n.h}
                                        rx={6}
                                        fill={categoryMeta[s.category].color}
                                        stroke="#1C1A17"
                                        strokeWidth={on ? 2.4 : 1.5}
                                    />
                                    <text
                                        x={n.x}
                                        y={n.y + 4}
                                        textAnchor="middle"
                                        fontFamily="IBM Plex Mono, monospace"
                                        fontSize={12}
                                        fill="#1C1A17"
                                    >
                                        {n.label}
                                    </text>
                                </g>
                            );
                        }
                        const it = itemById.get(id)!;
                        const mx = n.x - n.w / 2 + 11,
                            my = n.y;
                        return (
                            <g
                                key={n.id}
                                onClick={() => pickItem(id)}
                                className="cursor-pointer"
                                opacity={dim ? 0.4 : 1}
                            >
                                <rect
                                    x={n.x - n.w / 2}
                                    y={n.y - n.h / 2}
                                    width={n.w}
                                    height={n.h}
                                    rx={3}
                                    fill={on ? '#FFE45C' : '#FBF8F3'}
                                    stroke="#1C1A17"
                                    strokeWidth={on ? 2.4 : 1.2}
                                />
                                {it.kind === 'paper' && (
                                    <circle cx={mx} cy={my} r={3.5} fill="#1C1A17" />
                                )}
                                {it.kind === 'project' && (
                                    <rect
                                        x={mx - 3.5}
                                        y={my - 3.5}
                                        width={7}
                                        height={7}
                                        fill="#1C1A17"
                                    />
                                )}
                                {it.kind === 'hackathon' && (
                                    <path
                                        d={`M${mx} ${my - 4.5} L${mx + 4.5} ${my} L${mx} ${my + 4.5} L${mx - 4.5} ${my} Z`}
                                        fill="#1C1A17"
                                    />
                                )}
                                <text
                                    x={n.x - n.w / 2 + 24}
                                    y={n.y + 4}
                                    textAnchor="start"
                                    fontFamily="Inter, system-ui, sans-serif"
                                    fontSize={12.5}
                                    fontWeight={500}
                                    fill="#1C1A17"
                                >
                                    {n.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div
                className="flex flex-wrap gap-x-6 gap-y-2 mt-3 font-mono text-xs text-ink-2"
                aria-hidden="true"
            >
                <span>● paper</span>
                <span>■ project</span>
                <span>◆ hackathon</span>
                {Object.entries(categoryMeta).map(([k, m]) => (
                    <span key={k} className="inline-flex items-center gap-1.5">
                        <span
                            className="w-2.5 h-2.5 border border-ink rounded-[2px]"
                            style={{ background: m.color }}
                        />
                        {m.label}
                    </span>
                ))}
            </div>

            <p
                aria-live="polite"
                className="mt-6 font-mono text-[13px] bg-machine text-machine-ink rounded-[4px] border-[1.5px] border-ink px-4 py-3 break-words"
            >
                {log}
            </p>

            {skill && (
                <div className="mt-8 border-t border-ink">
                    {skillItems.map((i) => (
                        <button
                            key={i.id}
                            onClick={() => pickItem(i.id)}
                            className="w-full text-left py-4 border-b border-rule hover:bg-hi transition-colors grid md:grid-cols-[120px_minmax(0,1fr)] gap-x-8 gap-y-1"
                        >
                            <span className="font-mono text-xs text-ink-2">
                                {kindLabel[i.kind]} · {i.date}
                            </span>
                            <span>
                                <span className="font-serif text-xl">{i.title}</span>
                                <span className="block text-ink-2 text-[14px] mt-1">
                                    {i.oneLiner}
                                </span>
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {selectedItem && (
                <article className="mt-8 border-t border-ink pt-6 grid md:grid-cols-12 gap-x-8 gap-y-6">
                    <div className="md:col-span-7">
                        <div className="font-mono text-xs text-ink-2 mb-2">
                            {kindLabel[selectedItem.kind]} · {selectedItem.date}
                        </div>
                        <h2 className="font-serif text-3xl tracking-tight">{selectedItem.title}</h2>
                        <p className="text-ink-2 text-[15px] leading-relaxed mt-3">
                            {selectedItem.oneLiner}
                        </p>
                        {selectedItem.map && (
                            <div className="mt-6">
                                <h3 className="font-mono text-xs text-ink-2 mb-2">repo map</h3>
                                <ol className="border-t border-ink">
                                    {selectedItem.map.components.map((c) => (
                                        <li
                                            key={c.name}
                                            className="py-2.5 border-b border-rule grid grid-cols-[160px_minmax(0,1fr)] gap-4 text-[14px]"
                                        >
                                            <span className="font-mono">{c.name}</span>
                                            <span className="text-ink-2">{c.role}</span>
                                        </li>
                                    ))}
                                </ol>
                                {selectedItem.map.flow && (
                                    <p className="font-mono text-[13px] mt-3">
                                        {selectedItem.map.flow}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="md:col-span-5">
                        <h3 className="font-mono text-xs text-ink-2 mb-2">skills</h3>
                        <div
                            role="group"
                            aria-label={`Skills in ${selectedItem.title}`}
                            className="flex flex-wrap gap-2"
                        >
                            {selectedItem.skillIds
                                .filter((s) => shared.some((x) => x.id === s))
                                .map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => pickSkill(s)}
                                        className={chipClass(false)}
                                    >
                                        {skillById.get(s)?.label}
                                    </button>
                                ))}
                        </div>
                        <p className="font-mono text-xs text-ink-2 mt-4">
                            stack: {selectedItem.tags.join(', ') || 'not listed'}
                        </p>
                        {selectedItem.links.length > 0 && (
                            <div className="flex gap-5 mt-4">
                                {selectedItem.links.map((l) => (
                                    <a
                                        key={l.href}
                                        href={l.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center min-h-11 font-mono text-[13px] underline underline-offset-4 decoration-ink/30 hover:decoration-ink"
                                    >
                                        {l.label} ↗
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </article>
            )}

            {offMap.length > 0 && (
                <p className="mt-10 text-[13px] text-ink-2">
                    Not on the map (no skill shared with another item yet):{' '}
                    {offMap.map((i) => i.title).join(', ')}.
                </p>
            )}
        </div>
    );
};

export default ProjectMap;
