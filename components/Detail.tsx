/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, Suspense, lazy } from 'react';
import { ArrowLeft, ArrowUpRight, Github } from 'lucide-react';
import { ItemDiagram } from './ProjectDiagrams';
import { Sticker, StickerColor } from './Sticker';
import { TextLink } from './Home';
import type { PortfolioItem } from '../data';

const AbstractImpactScene = lazy(() =>
    import('./QuantumScene').then((m) => ({ default: m.AbstractImpactScene }))
);

const STICKER_COLORS: StickerColor[] = ['indigo', 'coral', 'mint', 'yellow', 'purple', 'lime'];
const STICKER_ROTS = [-2, 1.5, -1.5, 2, -3, 1];

const SECTIONS: [string, string][] = [
    ['problem', 'Challenge'],
    ['innovation', 'Approach'],
    ['impact', 'Impact'],
    ['authors', 'Team'],
];

const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
    <div className="font-mono text-xs text-ink-2 mb-3">{children}</div>
);

const Detail: React.FC<{ item: PortfolioItem; siblings: PortfolioItem[]; onBack: () => void }> = ({
    item,
    siblings,
    onBack,
}) => {
    const { metadata: m, narrative, authors, technical, results } = item;
    const [showCode, setShowCode] = useState(false);
    const year = m.date.split(' ').pop();
    const at = Math.max(
        0,
        siblings.findIndex((x) => x.id === item.id)
    );
    const prev = siblings[(at - 1 + siblings.length) % siblings.length];
    const next = siblings[(at + 1) % siblings.length];
    const setName = item.type === 'project' ? 'projects' : 'papers';
    const stack = technical?.techStack ?? [];

    const back = (e: React.MouseEvent) => {
        e.preventDefault();
        onBack();
    };
    const actions: [string, string | undefined, React.ReactNode][] = [
        ['Code', m.githubUrl, <Github size={14} key="g" />],
        ['Live demo', m.demoUrl, null],
        ['Read the paper', m.link, null],
    ];
    const primary = actions.find(([, href]) => href);

    return (
        <div className="min-h-screen bg-paper text-ink">
            <nav aria-label="Project" className="sticky top-0 z-50 bg-paper/95 border-b border-ink">
                <div className="max-w-[1120px] mx-auto px-5 md:px-8 h-14 flex items-center justify-between gap-4">
                    <a
                        href="/"
                        onClick={back}
                        className="inline-flex items-center gap-2 min-h-11 text-sm hover:underline underline-offset-4"
                    >
                        <ArrowLeft size={16} aria-hidden="true" />{' '}
                        <span className="font-serif text-lg tracking-tight">Ishani Kathuria</span>
                    </a>
                    <div className="hidden md:flex items-center gap-1 text-sm">
                        {SECTIONS.map(([id, label]) => (
                            <a
                                key={id}
                                href={`#${id}`}
                                onClick={scrollToSection(id)}
                                className="px-3 py-1.5 rounded-[2px] text-ink-2 hover:text-ink hover:bg-hi transition-colors"
                            >
                                {label}
                            </a>
                        ))}
                    </div>
                    {primary && (
                        <a
                            href={primary[1]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:inline-flex items-center gap-2 min-h-9 px-4 bg-ink text-paper border border-ink rounded-[3px] text-sm font-medium hover:bg-hi hover:text-ink transition-colors"
                        >
                            {primary[0]} <ArrowUpRight size={14} aria-hidden="true" />
                        </a>
                    )}
                </div>
            </nav>

            <header className="md:min-h-[calc(100svh-57px)] flex flex-col justify-center py-10 md:py-8">
                <div className="w-full max-w-[1120px] mx-auto px-5 md:px-8 grid md:grid-cols-12 gap-x-10 gap-y-10 items-center">
                    <div className="md:col-span-7">
                        <Eyebrow>
                            {m.venue} · {m.date}
                        </Eyebrow>
                        <h1 className="font-serif tracking-[-0.03em] leading-[1.02] text-[clamp(38px,min(6.2vw,9.5vh),92px)]">
                            {m.title}
                        </h1>
                        <p className="mt-6 text-[18px] leading-relaxed text-ink-2 max-w-[46ch]">
                            {m.subtitle}
                        </p>
                        {stack.length > 0 && (
                            <div className="mt-6 flex flex-wrap gap-2.5" aria-label="Tech stack">
                                {stack.slice(0, 4).map((t, i) => (
                                    <Sticker
                                        key={t}
                                        color={STICKER_COLORS[i % STICKER_COLORS.length]}
                                        rotation={STICKER_ROTS[i % STICKER_ROTS.length]}
                                    >
                                        {t}
                                    </Sticker>
                                ))}
                            </div>
                        )}
                        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-1">
                            {primary && (
                                <a
                                    href={primary[1]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 min-h-11 px-5 bg-ink text-paper border border-ink rounded-[3px] text-sm font-medium hover:bg-hi hover:text-ink transition-colors"
                                >
                                    {primary[2]} {primary[0]}
                                </a>
                            )}
                            {actions
                                .filter(([, href]) => href)
                                .slice(1)
                                .map(([label, href]) => (
                                    <TextLink key={label} href={href!}>
                                        {label} ↗
                                    </TextLink>
                                ))}
                            <TextLink href="#problem">Read the case study ↓</TextLink>
                        </div>
                    </div>

                    <div
                        className="md:col-span-5 bg-machine text-machine-ink font-mono text-xs md:text-[13px] leading-[1.9] p-5 md:p-7 rounded-[4px]"
                        aria-hidden="true"
                    >
                        <div className="text-xs text-machine-dim mb-4">
                            MACHINE · get_project("{item.id}")
                        </div>
                        <div>{'{'}</div>
                        <div className="pl-4">
                            "type": <span className="text-[#F1EFE8]">"{item.type}"</span>,
                        </div>
                        <div className="pl-4">
                            "venue": <span className="text-[#F1EFE8]">"{m.venue}"</span>,
                        </div>
                        <div className="pl-4">
                            "year": <span className="text-[#F1EFE8]">{year}</span>,
                        </div>
                        {stack.length > 0 && (
                            <div className="pl-4">
                                "stack": [
                                {stack.map((t, i) => (
                                    <span key={t}>
                                        <span className="text-[#F1EFE8]">"{t}"</span>
                                        {i < stack.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                                ],
                            </div>
                        )}
                        <div className="pl-4">
                            "code":{' '}
                            <span className="text-[#F1EFE8]">
                                {m.githubUrl ? '"public"' : 'null'}
                            </span>
                            ,
                        </div>
                        <div className="pl-4">
                            "demo":{' '}
                            <span className="text-[#F1EFE8]">
                                {m.demoUrl || m.link ? 'true' : 'false'}
                            </span>
                        </div>
                        <div>{'}'}</div>
                    </div>
                </div>
            </header>

            {results && results.length > 0 && (
                <section aria-label="Results" className="border-y border-ink">
                    <dl className="max-w-[1120px] mx-auto px-5 md:px-8 py-8 flex flex-wrap gap-x-14 gap-y-6">
                        {results.map((r) => (
                            <div key={r.label} className="max-w-[26ch]">
                                <dt className="font-serif text-[40px] leading-none tracking-tight">
                                    {r.value}
                                </dt>
                                <dd className="text-[13px] leading-snug text-ink-2 mt-2">
                                    {r.label}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>
            )}

            <main id="main">
                <section id="problem" className="py-24 border-t border-ink">
                    <div className="max-w-[1120px] mx-auto px-5 md:px-8 grid md:grid-cols-12 gap-x-8 gap-y-8">
                        <div className="md:col-span-4">
                            <Eyebrow>01 / The challenge</Eyebrow>
                            <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight">
                                Identifying the gap.
                            </h2>
                        </div>
                        <p className="md:col-span-7 md:col-start-6 text-[18px] leading-[1.7] text-ink-2">
                            {narrative.problem}
                        </p>
                    </div>
                </section>

                <section id="innovation" className="py-24 bg-paper-2 border-y border-rule">
                    <div className="max-w-[1120px] mx-auto px-5 md:px-8">
                        <div className="grid md:grid-cols-12 gap-x-8 gap-y-8 mb-12">
                            <div className="md:col-span-4">
                                <Eyebrow>02 / The approach</Eyebrow>
                                <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight">
                                    How it works.
                                </h2>
                            </div>
                            <div className="md:col-span-7 md:col-start-6">
                                <p className="text-[18px] leading-[1.7] text-ink-2">
                                    {narrative.innovation}
                                </p>
                                {technical && (
                                    <div
                                        className="flex flex-wrap gap-2.5 mt-6"
                                        aria-label="Tech stack"
                                    >
                                        {stack.map((t, i) => (
                                            <Sticker
                                                key={t}
                                                color={STICKER_COLORS[i % STICKER_COLORS.length]}
                                                rotation={STICKER_ROTS[i % STICKER_ROTS.length]}
                                            >
                                                {t}
                                            </Sticker>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {technical?.codeSnippet && (
                            <div className="flex items-center gap-4 mb-4">
                                <span className="font-mono text-xs text-ink-2">VIEW</span>
                                <div
                                    role="group"
                                    aria-label="Diagram or code"
                                    className="flex border border-ink rounded-[3px] p-0.5 font-mono text-xs"
                                >
                                    {(
                                        [
                                            [false, 'Interactive diagram'],
                                            [true, 'Code'],
                                        ] as const
                                    ).map(([v, label]) => (
                                        <button
                                            key={label}
                                            onClick={() => setShowCode(v)}
                                            aria-pressed={showCode === v}
                                            className={`min-h-9 px-3 rounded-[2px] transition-colors ${showCode === v ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'}`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {showCode && technical?.codeSnippet ? (
                            <div
                                className="bg-machine text-machine-ink rounded-[4px] overflow-hidden font-mono text-xs md:text-[13px]"
                                data-dark
                            >
                                <div className="px-5 py-3 border-b border-[#2A2A2A] text-machine-dim">
                                    {technical.codeFile ?? 'snippet'}
                                </div>
                                <pre className="p-5 overflow-x-auto leading-[1.7]" tabIndex={0}>
                                    <code>{technical.codeSnippet}</code>
                                </pre>
                            </div>
                        ) : (
                            <ItemDiagram id={item.id} />
                        )}
                    </div>
                </section>

                <section id="impact" className="py-24">
                    <div className="max-w-[1120px] mx-auto px-5 md:px-8 grid md:grid-cols-12 gap-x-10 gap-y-10">
                        <div
                            className="md:col-span-5 relative min-h-[340px] border border-ink rounded-[4px] bg-paper-2 overflow-hidden"
                            aria-hidden="true"
                        >
                            <Suspense fallback={null}>
                                <AbstractImpactScene id={item.id} />
                            </Suspense>
                        </div>
                        <div className="md:col-span-7 flex flex-col justify-center">
                            <Eyebrow>03 / The impact</Eyebrow>
                            <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight mb-6">
                                What changed.
                            </h2>
                            <p className="text-[18px] leading-[1.7] text-ink-2">
                                {narrative.impact}
                            </p>
                            <div className="mt-8 pt-5 border-t border-ink">
                                <p className="font-serif italic text-2xl leading-snug">
                                    <span className="mark-hi">{m.title}</span>
                                </p>
                                <div className="font-mono text-xs text-ink-2 mt-3">
                                    {m.venue === 'Project'
                                        ? `Independent project · ${m.date}`
                                        : `Published in ${m.venue}`}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="authors" className="pb-24">
                    <div className="max-w-[1120px] mx-auto px-5 md:px-8">
                        <Eyebrow>04 / Team</Eyebrow>
                        <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight mb-10">
                            Who built it.
                        </h2>
                        <div className="border-t border-ink">
                            {authors.map((a, i) => (
                                <div
                                    key={i}
                                    className="grid grid-cols-[1fr] sm:grid-cols-[1fr_auto] gap-x-8 gap-y-1 items-baseline py-5 border-b border-rule"
                                >
                                    <div className="font-serif text-2xl tracking-tight">
                                        {a.name}
                                    </div>
                                    <div className="font-mono text-xs text-ink-2">{a.role}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {siblings.length > 1 && (
                <nav aria-label={`More ${setName}`} className="border-t border-ink">
                    <div className="max-w-[1120px] mx-auto px-5 md:px-8">
                        <div className="font-mono text-xs text-ink-2 pt-6">
                            {String(at + 1).padStart(2, '0')} /{' '}
                            {String(siblings.length).padStart(2, '0')} {setName}
                        </div>
                        <div className="grid sm:grid-cols-2">
                            {[
                                {
                                    to: prev,
                                    dir: '← Previous',
                                    align: 'text-left sm:pr-8 sm:border-r border-rule',
                                },
                                {
                                    to: next,
                                    dir: 'Next →',
                                    align: 'text-left sm:text-right sm:pl-8',
                                },
                            ].map(({ to, dir, align }) => (
                                <a
                                    key={dir}
                                    href={`#project=${to.id}`}
                                    className={`group block py-8 border-b border-rule sm:border-b-0 ${align}`}
                                >
                                    <div className="font-mono text-xs text-ink-2 mb-2">{dir}</div>
                                    <div className="font-serif text-2xl md:text-3xl leading-tight tracking-tight">
                                        <span className="group-hover:mark-hi">
                                            {to.metadata.title}
                                        </span>
                                    </div>
                                    <div className="text-[15px] text-ink-2 mt-2 max-w-[44ch] sm:inline-block">
                                        {to.metadata.subtitle}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </nav>
            )}

            <footer data-dark className="bg-ink text-paper py-16">
                <div className="max-w-[1120px] mx-auto px-5 md:px-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="font-serif text-3xl tracking-tight mb-2">{m.title}</div>
                        <p className="text-[15px] text-machine-ink max-w-[52ch]">{m.subtitle}</p>
                    </div>
                    <a
                        href="/"
                        onClick={back}
                        className="inline-flex items-center gap-2 min-h-11 px-5 bg-hi text-ink rounded-[3px] text-sm font-semibold hover:bg-paper transition-colors self-start md:self-auto"
                    >
                        <ArrowLeft size={15} aria-hidden="true" /> Back to portfolio
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default Detail;
