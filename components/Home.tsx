/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    ArrowUpRight,
    Menu,
    X,
    User,
    Bot,
    Layers,
    Briefcase,
    GraduationCap,
    Mail,
    FileText,
    Cpu,
    Linkedin,
    Github,
} from 'lucide-react';
import { papers, projects, hackathons, resume } from '../data';
import { IMPACT_STATS } from '../content';
import { Sticker } from './Sticker';

// ─── SHARED ───────────────────────────────────────────────────────────────────

const NAV: [string, string][] = [
    ['work', 'Projects'],
    ['hackathons', 'Hackathons'],
    ['research', 'Research'],
    ['resume', 'Resume'],
];
/** External links and PDFs (the résumé) always open in a new tab. */
export const opensInNewTab = (href: string) => /^https?:/.test(href) || /\.pdf([?#]|$)/i.test(href);
const EMAIL = 'ishani@kathuria.net';
const LINKEDIN = 'https://www.linkedin.com/in/ishani-kathuria';
const GITHUB = 'https://github.com/ikathuria';

const useActiveSection = (ids: string[]) => {
    const [active, setActive] = useState(ids[0]);
    useEffect(() => {
        const fn = () => {
            const y = window.scrollY + 130;
            let cur = ids[0];
            for (const id of ids) {
                const el = document.getElementById(id);
                if (el && el.offsetTop <= y) cur = id;
            }
            setActive(cur);
        };
        fn();
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);
    return active;
};

const SectionHead = ({
    n,
    label,
    title,
    blurb,
    tool,
}: {
    n: string;
    label: string;
    title: string;
    blurb: string;
    tool: string;
}) => (
    <div className="grid md:grid-cols-12 gap-x-8 gap-y-4 mb-10 items-end">
        <div className="md:col-span-7">
            <div className="font-mono text-xs text-ink-2 mb-3">
                {n} / {label}
            </div>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight">
                {title}
            </h2>
        </div>
        <div className="md:col-span-5 md:text-right">
            <p className="text-ink-2 text-[15px] leading-relaxed md:ml-auto max-w-[44ch]">
                {blurb}
            </p>
            <span className="inline-block font-mono text-xs mt-3 bg-machine text-machine-ink px-2 py-1 rounded-[2px]">
                {tool}
            </span>
        </div>
    </div>
);

export const TextLink = ({
    href,
    children,
    dark = false,
}: {
    href: string;
    children: React.ReactNode;
    dark?: boolean;
}) => (
    <a
        href={href}
        target={opensInNewTab(href) ? '_blank' : undefined}
        rel={opensInNewTab(href) ? 'noopener noreferrer' : undefined}
        className={`inline-flex items-center min-h-11 font-mono text-[13px] underline underline-offset-4 decoration-1 transition-colors ${dark ? 'decoration-paper/40 hover:decoration-hi hover:text-hi' : 'decoration-ink/30 hover:decoration-ink'}`}
    >
        {children}
    </a>
);

const DevpostIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6.002 1.61L0 12.004 6.002 22.39h11.996L24 12.004 17.998 1.61H6.002zm1.593 4.084h3.947c3.605 0 6.276 1.695 6.276 6.31 0 4.436-3.21 6.302-6.456 6.302H7.595V5.694zm2.517 2.449v7.714h1.241c2.646 0 3.862-1.55 3.862-3.861.009-2.569-1.096-3.853-3.767-3.853H10.112z" />
    </svg>
);

// ─── MODE TOGGLE ──────────────────────────────────────────────────────────────

export const ModePill = ({
    machineMode,
    onToggle,
}: {
    machineMode: boolean;
    onToggle: () => void;
}) => (
    <div
        className="flex items-center border border-ink rounded-[3px] p-0.5 text-xs font-mono"
        role="group"
        aria-label="View mode"
    >
        <button
            onClick={() => machineMode && onToggle()}
            aria-pressed={!machineMode}
            className={`flex items-center gap-1.5 px-3 min-h-9 rounded-[2px] transition-colors ${!machineMode ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'}`}
        >
            <User size={12} /> Human
        </button>
        <button
            onClick={() => !machineMode && onToggle()}
            aria-pressed={machineMode}
            className={`flex items-center gap-1.5 px-3 min-h-9 rounded-[2px] transition-colors ${machineMode ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'}`}
        >
            <Bot size={12} /> Machine
        </button>
    </div>
);

// ─── HERO: human/machine twin with an agent that reads the page ───────────────

type Key = 'name' | 'focus' | 'past' | 'now' | 'proof' | 'status';
const ORDER: Key[] = ['name', 'focus', 'past', 'now', 'proof', 'status'];
const STEP_MS = 1150;

const Hero = () => {
    const wrap = useRef<HTMLDivElement>(null);
    const els = useRef<Partial<Record<Key, HTMLElement | null>>>({});
    const timers = useRef<number[]>([]);
    const reduce = useReducedMotion();
    const [active, setActive] = useState<Key | null>(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [cursorOn, setCursorOn] = useState(false);
    const [done, setDone] = useState(false);

    const later = (fn: () => void, ms: number) => {
        timers.current.push(window.setTimeout(fn, ms));
    };
    const stopPlayback = () => {
        timers.current.forEach(clearTimeout);
        timers.current = [];
        setCursorOn(false);
        setDone(true);
    };

    const play = () => {
        timers.current.forEach(clearTimeout);
        timers.current = [];
        setDone(false);
        ORDER.forEach((k, i) => {
            const t = 500 + i * STEP_MS;
            later(() => {
                const w = wrap.current,
                    el = els.current[k];
                if (!w || !el) return;
                const wb = w.getBoundingClientRect();
                const r = el.getClientRects()[0] ?? el.getBoundingClientRect();
                setActive(null);
                setPos({
                    x: r.left - wb.left + Math.min(r.width * 0.55, 160),
                    y: r.top - wb.top + r.height * 0.6,
                });
                setCursorOn(true);
            }, t);
            later(() => setActive(k), t + 600);
        });
        later(
            () => {
                setActive(null);
                setCursorOn(false);
                setDone(true);
            },
            500 + ORDER.length * STEP_MS
        );
    };

    useEffect(() => {
        if (reduce) {
            setDone(true);
            return;
        }
        later(play, 300);
        return () => timers.current.forEach(clearTimeout);
    }, [reduce]);

    const engage = (k: Key) => {
        stopPlayback();
        setActive(k);
    };
    const release = () => setActive(null);

    const phrase = (k: Key, children: React.ReactNode, extra = '') => (
        <span
            ref={(el) => {
                els.current[k] = el;
            }}
            tabIndex={0}
            onPointerEnter={() => engage(k)}
            onPointerLeave={release}
            onFocus={() => engage(k)}
            onBlur={release}
            className={`rounded-[2px] px-1 -mx-1 cursor-default transition-colors duration-150 ${active === k ? 'bg-hi' : ''} ${extra}`}
        >
            {children}
        </span>
    );

    const line = (k: Key, children: React.ReactNode) => (
        <div
            className={`px-2 -mx-2 rounded-[2px] transition-colors duration-150 ${active === k ? 'bg-hi text-machine [&_span]:text-machine' : ''}`}
        >
            {children}
        </div>
    );
    const S = ({ children }: { children: React.ReactNode }) => (
        <span className="text-[#F1EFE8]">{children}</span>
    );

    return (
        <header className="md:min-h-[calc(100svh-57px)] flex flex-col justify-center py-10 md:py-8">
            <div ref={wrap} className="relative w-full max-w-[1120px] mx-auto px-5 md:px-8">
                <div className="font-mono text-xs text-ink-2 mb-4">
                    AI/ML engineer &amp; researcher
                </div>
                <h1 className="font-serif tracking-[-0.03em] leading-[0.95] text-[clamp(52px,min(10.5vw,15vh),148px)] mb-6 md:mb-[clamp(20px,4vh,40px)]">
                    {phrase('name', 'Ishani Kathuria')}
                </h1>

                <div className="relative">
                    <div className="grid md:grid-cols-2 border border-ink rounded-[4px] overflow-hidden">
                        <div className="bg-paper p-5 md:p-[clamp(20px,3.2vh,32px)]">
                            <div className="font-mono text-xs text-ink-2 mb-5">HUMAN</div>
                            <p className="font-serif text-[19px] md:text-[clamp(18px,min(2.1vw,3.3vh),26px)] leading-[1.45] tracking-[-0.01em]">
                                {phrase(
                                    'focus',
                                    'I build multi-agent systems and the evals that keep them honest.'
                                )}{' '}
                                {phrase('past', 'Two years at AWS shipping LLM tooling,')}{' '}
                                {phrase('now', 'now an M.S. in Applied AI at Purdue.')}{' '}
                                {phrase('proof', 'Four papers, nine hackathons, one win.')}{' '}
                                {phrase(
                                    'status',
                                    'Open to internships now and full-time from May 2027.'
                                )}
                            </p>
                        </div>
                        <div
                            className="bg-machine text-machine-ink p-5 md:p-[clamp(20px,3.2vh,32px)] font-mono text-xs md:text-[13px] leading-[1.9]"
                            aria-hidden="true"
                        >
                            <div className="text-xs text-machine-dim mb-5">
                                MACHINE · get_profile()
                            </div>
                            <div>{'{'}</div>
                            <div className="pl-4">
                                {line(
                                    'name',
                                    <>
                                        "name": <S>"Ishani Kathuria"</S>,
                                    </>
                                )}
                                {line(
                                    'focus',
                                    <>
                                        "focus": [<S>"multi-agent"</S>, <S>"evals"</S>, <S>"RAG"</S>
                                        ],
                                    </>
                                )}
                                {line(
                                    'past',
                                    <>
                                        "past": {'{'} "org": <S>"AWS"</S>, "years": <S>2</S> {'}'},
                                    </>
                                )}
                                {line(
                                    'now',
                                    <>
                                        "now": {'{'} "school": <S>"Purdue"</S>, "gpa": <S>4.0</S>{' '}
                                        {'}'},
                                    </>
                                )}
                                {line(
                                    'proof',
                                    <>
                                        "proof": {'{'} "papers": <S>4</S>, "wins": <S>1</S> {'}'},
                                    </>
                                )}
                                {line(
                                    'status',
                                    <>
                                        "status": <S>"open_to_work"</S>
                                    </>
                                )}
                            </div>
                            <div>{'}'}</div>
                        </div>
                    </div>

                    {/* Stickers straddle the frame edge (desktop, draggable). */}
                    <div className="hidden md:block" aria-hidden="true">
                        <div className="absolute -top-4 left-[4%]">
                            <Sticker color="indigo" rotation={-3} dragConstraints={wrap}>
                                <Layers size={13} /> Multi-agent AI
                            </Sticker>
                        </div>
                        <div className="absolute -top-4 left-[30%]">
                            <Sticker color="yellow" rotation={2} dragConstraints={wrap}>
                                <Briefcase size={13} /> Ex-AWS SDE
                            </Sticker>
                        </div>
                        <div className="absolute -top-4 right-[20%]">
                            <Sticker color="mint" rotation={-2} dragConstraints={wrap}>
                                <GraduationCap size={13} /> Purdue · 4.0 GPA
                            </Sticker>
                        </div>
                        <div className="absolute -bottom-4 left-[6%]">
                            <Sticker color="lime" rotation={2} dragConstraints={wrap}>
                                <Mail size={13} /> Open to work
                            </Sticker>
                        </div>
                        <div className="absolute -bottom-4 left-[38%]">
                            <Sticker color="coral" rotation={-2} dragConstraints={wrap}>
                                <Cpu size={13} /> LLM safety
                            </Sticker>
                        </div>
                        <div className="absolute -bottom-4 right-[6%]">
                            <Sticker color="purple" rotation={3} dragConstraints={wrap}>
                                <FileText size={13} /> 4× published
                            </Sticker>
                        </div>
                    </div>
                </div>

                <div className="md:hidden flex flex-wrap gap-2 mt-5" aria-hidden="true">
                    <Sticker color="yellow" rotation={-2}>
                        <Briefcase size={13} /> Ex-AWS SDE
                    </Sticker>
                    <Sticker color="mint" rotation={2}>
                        <GraduationCap size={13} /> Purdue · 4.0
                    </Sticker>
                    <Sticker color="purple" rotation={-1}>
                        <FileText size={13} /> 4× published
                    </Sticker>
                    <Sticker color="lime" rotation={2}>
                        <Mail size={13} /> Open to work
                    </Sticker>
                </div>

                <div className="mt-8 md:mt-[clamp(24px,4.5vh,40px)] flex flex-wrap items-center gap-x-6 gap-y-1">
                    <a
                        href="#work"
                        className="inline-flex items-center gap-2 min-h-11 px-5 bg-ink text-paper border border-ink rounded-[3px] text-sm font-medium hover:bg-hi hover:text-ink transition-colors"
                    >
                        See the work
                    </a>
                    <TextLink href="/resume.pdf">Resume (PDF)</TextLink>
                    <TextLink href={`mailto:${EMAIL}`}>{EMAIL}</TextLink>
                    <TextLink href={LINKEDIN}>LinkedIn</TextLink>
                    <TextLink href={GITHUB}>GitHub</TextLink>
                    {!reduce && done && (
                        <button
                            onClick={play}
                            className="ml-auto inline-flex items-center min-h-11 font-mono text-xs text-ink-2 hover:text-ink"
                        >
                            replay the agent ↻
                        </button>
                    )}
                </div>

                {/* The agent cursor */}
                <motion.div
                    className="absolute left-0 top-0 z-30 pointer-events-none flex items-start"
                    initial={false}
                    animate={{ x: pos.x, y: pos.y, opacity: cursorOn ? 1 : 0 }}
                    transition={{
                        x: { type: 'spring', stiffness: 90, damping: 18 },
                        y: { type: 'spring', stiffness: 90, damping: 18 },
                        opacity: { duration: 0.2 },
                    }}
                    aria-hidden="true"
                >
                    <svg width="18" height="18" viewBox="0 0 16 16">
                        <path
                            d="M2 1l11 5-5 2-2 5z"
                            fill="#FF4F00"
                            stroke="#1C1A17"
                            strokeWidth="1.2"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span className="font-mono text-xs bg-agent text-ink px-1.5 py-0.5 rounded-[2px] -ml-0.5 mt-3">
                        agent
                    </span>
                </motion.div>
            </div>
        </header>
    );
};

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

const Ledger = () => (
    <section aria-label="Impact" className="border-y border-ink">
        <dl className="max-w-[1120px] mx-auto px-5 md:px-8 py-10 grid grid-cols-2 lg:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-9">
            {IMPACT_STATS.map((s, i) => (
                <div key={i}>
                    <dt className="font-serif text-[25px] sm:text-[36px] leading-none tracking-tight whitespace-nowrap">
                        {s.displayValue ?? `${s.prefix}${s.numericEnd}${s.suffix}`}
                    </dt>
                    <dd className="text-[14px] leading-snug text-ink-2 mt-3 max-w-[24ch]">
                        {s.label}
                    </dd>
                </div>
            ))}
        </dl>
    </section>
);

const About = () => (
    <section id="about" className="py-24">
        <div className="max-w-[1120px] mx-auto px-5 md:px-8 grid md:grid-cols-12 gap-x-8 gap-y-8">
            <div className="md:col-span-4">
                <div className="font-mono text-xs text-ink-2 mb-3">01 / About</div>
                <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight">
                    Research meets real-world scale.
                </h2>
            </div>
            <div className="md:col-span-7 md:col-start-6 space-y-5 text-[18px] leading-[1.7] text-ink-2">
                <p>
                    I'm an AI/ML engineer who spent two years shipping production LLM systems at{' '}
                    <span className="mark-hi text-ink">AWS</span> — log summarization tools,
                    internal chatbots, automated deployment pipelines across 15+ distributed
                    services — before returning to academia to research the harder questions.
                </p>
                <p>
                    Now at <span className="mark-hi text-ink">Purdue</span>, I focus on what makes
                    AI systems trustworthy: retrieval quality, hallucination reduction, safety
                    evaluation. I've published four peer-reviewed papers (IEEE + Springer) and
                    co-founded an initiative that helped 200+ students build their first ML
                    projects.
                </p>
                <p>
                    I'm looking for opportunities — internships or full-time — where rigorous
                    research and real-world impact aren't at odds.
                </p>
            </div>
        </div>
    </section>
);

const cx = (...a: Array<string | false | undefined>) => a.filter(Boolean).join(' ');
const shortUrl = (u: string) => u.replace(/^https?:\/\//, '').replace(/\/$/, '');

const AbstractImpactScene = lazy(() =>
    import('./QuantumScene').then((m) => ({ default: m.AbstractImpactScene }))
);

// ─── PROJECTS: framed screenshots ─────────────────────────────────────────────

const FRAME_TINTS = ['#C4A3F5', '#6EE7A0', '#FF9B8A', '#A5B4FC'];

const ShotFrame = ({
    href,
    label,
    url,
    tint,
    image,
    illustrationId,
}: {
    href: string;
    label: string;
    url: string;
    tint: string;
    image?: { src: string; alt: string };
    illustrationId: string;
}) => (
    <a href={href} aria-label={label} tabIndex={-1} className="group/frame block relative">
        <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-3 translate-y-3 rounded-[6px] border-[1.5px] border-ink"
            style={{ background: tint }}
        />
        <div className="relative rounded-[6px] border-[1.5px] border-ink bg-paper overflow-hidden transition-transform duration-150 group-hover/frame:-translate-x-0.5 group-hover/frame:-translate-y-0.5">
            <div className="h-8 px-3 flex items-center border-b-[1.5px] border-ink bg-paper-2 font-mono text-xs text-ink-2 truncate">
                {url}
            </div>
            {image ? (
                <img
                    src={image.src}
                    alt={image.alt}
                    width={1280}
                    height={800}
                    loading="lazy"
                    className="block w-full h-auto aspect-[16/10] object-cover object-top"
                />
            ) : (
                <div className="aspect-[16/10] bg-paper-2" aria-hidden="true">
                    <Suspense fallback={null}>
                        <AbstractImpactScene id={illustrationId} />
                    </Suspense>
                </div>
            )}
        </div>
    </a>
);

const Projects = () => (
    <section id="work" className="pb-24">
        <div className="max-w-[1120px] mx-auto px-5 md:px-8">
            <SectionHead
                n="02"
                label="Projects"
                title="Selected projects"
                blurb="Systems that translate research into production-ready tools — AI safety, retrieval, and multimodal understanding."
                tool={`projects.list() → ${projects.length}`}
            />
            <div className="border-t border-ink">
                {projects.map((p, i) => {
                    const year = p.metadata.date.split(' ').pop();
                    const stack = p.technical?.techStack.slice(0, 3) ?? [];
                    const flip = i % 2 === 1;
                    const site = p.metadata.demoUrl ?? p.metadata.githubUrl ?? '';
                    return (
                        <article
                            key={p.id}
                            className="group grid md:grid-cols-12 gap-x-14 gap-y-10 py-14 border-b border-rule items-center"
                        >
                            <div
                                className={cx('md:col-span-5', flip ? 'md:order-2' : 'md:order-1')}
                            >
                                <div className="font-mono text-xs text-ink-2 mb-3">
                                    {String(i + 1).padStart(2, '0')} · {year}
                                </div>
                                <a
                                    href={`#project=${p.id}`}
                                    className="inline-flex items-baseline gap-2"
                                >
                                    <h3 className="font-serif text-[30px] md:text-[38px] leading-[1.08] tracking-tight group-hover:mark-hi">
                                        {p.metadata.title}
                                    </h3>
                                    <ArrowUpRight
                                        size={18}
                                        className="shrink-0 translate-y-0.5"
                                        aria-hidden="true"
                                    />
                                </a>
                                <p className="text-ink mt-3 text-[15px] font-medium">
                                    {p.metadata.subtitle}
                                </p>
                                <p className="text-ink-2 mt-3 text-[15px] leading-relaxed max-w-[52ch]">
                                    {p.narrative.innovation}
                                </p>
                                <div
                                    className="inline-block mt-5 bg-machine text-machine-ink font-mono text-xs leading-[1.9] px-3.5 py-2 rounded-[3px]"
                                    aria-hidden="true"
                                >
                                    {'{ '}"year": <span className="text-[#F1EFE8]">{year}</span>,
                                    "stack": [
                                    {stack.map((t, j) => (
                                        <span key={t}>
                                            <span className="text-[#F1EFE8]">"{t}"</span>
                                            {j < stack.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                    ]{' }'}
                                </div>
                                <div className="flex flex-wrap gap-x-5 mt-2 -mb-2">
                                    <TextLink href={`#project=${p.id}`}>Case study ↗</TextLink>
                                    {p.metadata.demoUrl && (
                                        <TextLink href={p.metadata.demoUrl}>Live demo ↗</TextLink>
                                    )}
                                    {p.metadata.githubUrl && (
                                        <TextLink href={p.metadata.githubUrl}>Code ↗</TextLink>
                                    )}
                                </div>
                            </div>
                            <div
                                className={cx(
                                    'md:col-span-7 pr-3 pb-3',
                                    flip ? 'md:order-1' : 'md:order-2'
                                )}
                            >
                                <ShotFrame
                                    href={`#project=${p.id}`}
                                    label={`Open the ${p.metadata.title} case study`}
                                    url={shortUrl(site)}
                                    tint={FRAME_TINTS[i % FRAME_TINTS.length]}
                                    image={p.image}
                                    illustrationId={p.id}
                                />
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    </section>
);

// ─── HACKATHONS: color tiles ──────────────────────────────────────────────────

const TILE_COLORS = ['#6EE7A0', '#C4A3F5', '#FF9B8A', '#B8F04A', '#A5B4FC', '#FFD84D'];

const HackTile = ({
    h,
    i,
    big,
    wide,
}: {
    h: (typeof hackathons)[number];
    i: number;
    big: boolean;
    wide: boolean;
}) => {
    const links: [string, string | undefined][] = [
        ['Code', h.links.github],
        ['Demo', h.links.demo],
        ['Video', h.links.video],
        ['Post', h.links.linkedin],
        ['Devpost', h.links.devpost],
    ];
    const linkClass =
        'inline-flex items-center gap-1.5 min-h-11 font-mono text-[13px] underline underline-offset-4 decoration-ink/40 hover:decoration-ink';

    const head = (
        <div className="flex items-start justify-between gap-3">
            <div className="font-mono text-xs leading-relaxed">
                <div>{h.date}</div>
                {h.location && <div>{h.location}</div>}
            </div>
            {h.award && (
                <Sticker color="yellow" rotation={3}>
                    Winner
                </Sticker>
            )}
            {h.role === 'organizer' && (
                <Sticker color="indigo" rotation={2}>
                    Organizer
                </Sticker>
            )}
        </div>
    );
    const title = (
        <>
            <h3
                className={cx(
                    'font-serif tracking-tight leading-[1.05] mt-6 [overflow-wrap:anywhere]',
                    big ? 'text-[38px] sm:text-[46px]' : 'text-[30px]'
                )}
            >
                {h.project.replace(/\./g, '\u200b.')}
            </h3>
            <div className="font-mono text-xs leading-relaxed mt-2">
                {h.hackathon}
                {h.award ? ` · ${h.award}` : ''}
                {h.team && h.team.length > 0 ? ` · with ${h.team.join(', ')}` : ''}
            </div>
        </>
    );
    const body = (
        <>
            <p className="text-[15px] leading-relaxed">{h.tagline}</p>
            {h.techStack && <div className="font-mono text-xs mt-3">{h.techStack.join(' · ')}</div>}
            <div className="flex flex-wrap gap-x-5 mt-auto pt-3 -mb-2">
                {links
                    .filter(([, href]) => href)
                    .map(([label, href]) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={linkClass}
                        >
                            {label === 'Devpost' ? <DevpostIcon /> : null}
                            {label}
                            <ArrowUpRight size={12} aria-hidden="true" />
                        </a>
                    ))}
            </div>
        </>
    );

    return (
        <article
            className={cx(
                'flex min-w-0 rounded-[6px] border-[1.5px] border-ink p-6 text-ink shadow-[0_4px_0_#1C1A17]',
                big && 'md:col-span-2',
                wide && 'md:col-span-2 lg:col-span-3'
            )}
            style={{ background: TILE_COLORS[i % TILE_COLORS.length] }}
        >
            {big && h.image ? (
                <div className="flex flex-col md:flex-row md:gap-8 flex-1 min-w-0">
                    <img
                        src={h.image.src}
                        alt={h.image.alt}
                        width={1000}
                        height={833}
                        loading="lazy"
                        className="block w-full md:w-[46%] md:shrink-0 self-start aspect-[6/5] object-cover object-top rounded-[4px] border-[1.5px] border-ink mb-6 md:mb-0"
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                        {head}
                        {title}
                        <div className="flex flex-col flex-1 mt-4">{body}</div>
                    </div>
                </div>
            ) : wide ? (
                <div className="flex flex-col lg:flex-row lg:gap-14 flex-1 min-w-0">
                    <div className="lg:w-5/12">
                        {head}
                        {title}
                    </div>
                    <div className="flex flex-col flex-1 mt-4 lg:mt-1 lg:w-7/12">{body}</div>
                </div>
            ) : (
                <div className="flex flex-col flex-1 min-w-0">
                    {head}
                    {title}
                    <div className="flex flex-col flex-1 mt-4">{body}</div>
                </div>
            )}
        </article>
    );
};

const Hackathons = () => (
    <section id="hackathons" className="py-24 bg-paper-2 border-y border-rule">
        <div className="max-w-[1120px] mx-auto px-5 md:px-8">
            <SectionHead
                n="03"
                label="Hackathons"
                title="Built in a weekend"
                blurb="Rapid prototypes from AI hackathons across the country — plus one I founded and ran at Purdue Northwest."
                tool={`hackathons.list() → ${hackathons.length}`}
            />
            <div className="grid gap-6 grid-cols-[minmax(0,1fr)] md:grid-cols-2 lg:grid-cols-3">
                {hackathons.map((h, i) => (
                    <HackTile
                        key={h.id}
                        h={h}
                        i={i}
                        big={i === 0}
                        wide={i === hackathons.length - 1}
                    />
                ))}
            </div>
        </div>
    </section>
);

const Research = () => (
    <section id="research" className="py-20">
        <div className="max-w-[1120px] mx-auto px-5 md:px-8">
            <SectionHead
                n="04"
                label="Research"
                title="Research publications"
                blurb="Peer-reviewed work across healthcare, recommendation systems, and trustworthy AI."
                tool={`papers.list() → ${papers.length}`}
            />
            <div className="border-t border-ink">
                {papers.map((paper) => (
                    <a
                        key={paper.id}
                        href={`#project=${paper.id}`}
                        className="group grid grid-cols-[56px_1fr] md:grid-cols-[72px_1fr_auto] gap-x-6 gap-y-1 items-baseline py-5 border-b border-rule"
                    >
                        <span className="font-mono text-xs text-ink-2">
                            {paper.metadata.date.split(' ').pop()}
                        </span>
                        <span className="font-serif text-xl md:text-2xl leading-snug tracking-tight">
                            <span className="group-hover:mark-hi">{paper.metadata.title}</span>
                        </span>
                        <span className="col-start-2 md:col-start-3 font-mono text-xs text-ink-2 inline-flex items-center gap-2">
                            {paper.metadata.venue} <ArrowUpRight size={14} aria-hidden="true" />
                        </span>
                    </a>
                ))}
            </div>
        </div>
    </section>
);

const Resume = () => {
    const skills = [
        ['Generative AI', resume.skills.genai],
        ['ML frameworks', resume.skills.ml],
        ['Programming', resume.skills.programming],
        ['Cloud & MLOps', resume.skills.cloud],
        ['Web & data', resume.skills.data],
        ['Certifications', resume.skills.certs],
    ] as [string, string[]][];
    return (
        <section id="resume" className="py-24 bg-paper-2 border-y border-rule">
            <div className="max-w-[1120px] mx-auto px-5 md:px-8">
                <SectionHead
                    n="05"
                    label="Resume"
                    title="Experience and education"
                    blurb="Two years of production LLM work at AWS, research at Purdue, and a few things I started along the way."
                    tool="resume.get() → pdf"
                />
                <div className="mb-12 flex flex-wrap items-center gap-x-6">
                    <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 min-h-11 px-5 bg-ink text-paper border border-ink rounded-[3px] text-sm font-medium hover:bg-hi hover:text-ink transition-colors"
                    >
                        <FileText size={16} /> Download resume (PDF)
                    </a>
                    <TextLink href={`mailto:${EMAIL}?subject=Resume%20Request`}>
                        or email me for the latest version
                    </TextLink>
                </div>
                <div className="grid lg:grid-cols-12 gap-x-12 gap-y-14">
                    <div className="lg:col-span-7 lg:order-2">
                        <h3 className="font-mono text-xs text-ink-2 mb-4">EXPERIENCE</h3>
                        <div className="border-t border-ink">
                            {resume.experience.map((exp, i) => (
                                <div
                                    key={i}
                                    className="grid md:grid-cols-[150px_1fr] gap-x-6 gap-y-2 py-6 border-b border-rule"
                                >
                                    <div className="font-mono text-xs text-ink-2 pt-1.5">
                                        {exp.period}
                                    </div>
                                    <div>
                                        <h4 className="font-serif text-xl leading-tight tracking-tight">
                                            {exp.role}
                                        </h4>
                                        <div className="text-[15px] text-ink-2 mb-3">
                                            {exp.company}
                                        </div>
                                        <ul className="space-y-2">
                                            {exp.details.map((d, j) => (
                                                <li
                                                    key={j}
                                                    className="relative pl-4 text-[15px] leading-relaxed text-ink-2 before:content-['–'] before:absolute before:left-0 before:text-ink"
                                                >
                                                    {d}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-5 lg:order-1 space-y-12">
                        <div>
                            <h3 className="font-mono text-xs text-ink-2 mb-4">EDUCATION</h3>
                            <div className="border-t border-ink">
                                {resume.education.map((edu, i) => (
                                    <div key={i} className="py-5 border-b border-rule">
                                        <h4 className="font-serif text-lg leading-snug tracking-tight">
                                            {edu.degree}
                                        </h4>
                                        <div className="text-[15px] text-ink-2 mt-1">
                                            {edu.school}, {edu.location}
                                        </div>
                                        <div className="font-mono text-xs text-ink-2 mt-1">
                                            {edu.period}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-mono text-xs text-ink-2 mb-4">SKILLS</h3>
                            <div className="border-t border-ink">
                                {skills.map(([label, items]) => (
                                    <div key={label} className="py-3.5 border-b border-rule">
                                        <div className="text-[13px] font-medium mb-1">{label}</div>
                                        <div className="font-mono text-xs leading-[1.7] text-ink-2">
                                            {items.join(' · ')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Contact = () => (
    <section id="contact" data-dark className="bg-ink text-paper py-28">
        <div className="max-w-[1120px] mx-auto px-5 md:px-8">
            <div className="font-mono text-xs text-machine-ink mb-6">06 / Contact</div>
            <h2 className="font-serif text-[clamp(44px,8vw,112px)] leading-[1.08] tracking-[-0.03em] max-w-[14ch]">
                Got a hard problem?{' '}
                <span className="bg-hi text-ink px-2 [box-decoration-break:clone]">
                    Let's break it together.
                </span>
            </h2>
            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2">
                <a
                    href={`mailto:${EMAIL}?subject=Hello`}
                    className="inline-flex items-center gap-2 min-h-11 px-5 bg-hi text-ink rounded-[3px] text-sm font-semibold hover:bg-paper transition-colors"
                >
                    <Mail size={15} /> {EMAIL}
                </a>
                <TextLink href={LINKEDIN} dark>
                    <Linkedin size={14} className="mr-2" /> LinkedIn
                </TextLink>
                <TextLink href={GITHUB} dark>
                    <Github size={14} className="mr-2" /> GitHub
                </TextLink>
            </div>
            <div className="font-mono text-xs text-machine-dim mt-20">
                © {new Date().getFullYear()} — Built in Indiana, mostly at 1am
            </div>
        </div>
    </section>
);

// ─── PAGE ─────────────────────────────────────────────────────────────────────

const Home: React.FC<{
    machineMode: boolean;
    onToggleMode: () => void;
    onOpenDashboard: () => void;
}> = ({ machineMode, onToggleMode, onOpenDashboard }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const activeSection = useActiveSection(['work', 'hackathons', 'research', 'resume']);

    return (
        <div className="min-h-screen bg-paper text-ink">
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:bg-ink focus:text-paper"
            >
                Skip to main content
            </a>

            <nav aria-label="Primary" className="sticky top-0 z-50 bg-paper/95 border-b border-ink">
                <div className="max-w-[1120px] mx-auto px-5 md:px-8 h-14 flex items-center justify-between gap-4">
                    <a href="#top" className="font-serif text-lg tracking-tight">
                        Ishani Kathuria
                    </a>
                    <div className="hidden md:flex items-center gap-1 text-sm">
                        {NAV.map(([id, label]) => (
                            <a
                                key={id}
                                href={`#${id}`}
                                aria-current={activeSection === id ? 'true' : undefined}
                                className={`px-3 py-1.5 rounded-[2px] transition-colors ${activeSection === id ? 'bg-hi text-ink' : 'text-ink-2 hover:text-ink'}`}
                            >
                                {label}
                            </a>
                        ))}
                        <button
                            onClick={onOpenDashboard}
                            className="px-3 py-1.5 rounded-[2px] text-ink-2 hover:text-ink transition-colors"
                        >
                            Dashboard
                        </button>
                        <div className="ml-3">
                            <ModePill machineMode={machineMode} onToggle={onToggleMode} />
                        </div>
                    </div>
                    <button
                        className="md:hidden inline-flex items-center justify-center w-11 h-11 -mr-2"
                        onClick={() => setMenuOpen((o) => !o)}
                        aria-label="Toggle navigation menu"
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {menuOpen && (
                <div className="fixed inset-0 top-14 z-40 bg-paper flex flex-col gap-1 px-5 pt-8 font-serif text-3xl tracking-tight">
                    {NAV.map(([id, label]) => (
                        <a
                            key={id}
                            href={`#${id}`}
                            onClick={() => setMenuOpen(false)}
                            className="py-2 border-b border-rule"
                        >
                            {label}
                        </a>
                    ))}
                    <button
                        onClick={() => {
                            setMenuOpen(false);
                            onOpenDashboard();
                        }}
                        className="py-2 border-b border-rule text-left"
                    >
                        Dashboard
                    </button>
                    <div className="mt-8 font-sans text-base">
                        <ModePill
                            machineMode={machineMode}
                            onToggle={() => {
                                setMenuOpen(false);
                                onToggleMode();
                            }}
                        />
                    </div>
                </div>
            )}

            <div id="top" />
            <Hero />
            <Ledger />
            <main id="main">
                <About />
                <Projects />
                <Hackathons />
                <Research />
                <Resume />
                <Contact />
            </main>
        </div>
    );
};

export default Home;
