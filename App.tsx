
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FeatureSelectionChart, DualStreamPipeline, FuzzyLogicCurves, AIHierarchyVenn, AudioWaveform, NetworkGraph, ConfidenceMeter, DepthGrid } from './components/Diagrams';
import { ArrowDown, Menu, X, ArrowLeft, ArrowUpRight, ExternalLink, GraduationCap, Briefcase, Code, Github, Linkedin, Mail, FileText, Cpu, Layers, Badge, Globe, User, Bot, Copy, Check, Trophy, Users, MapPin, PlayCircle } from 'lucide-react';
import { papers, projects, hackathons, resume, PortfolioItem } from './data';

// Lazy-loaded so these chunks are only fetched when actually rendered.
const Dashboard = lazy(() => import('./components/Dashboard'));
const AbstractImpactScene = lazy(() =>
    import('./components/QuantumScene').then(m => ({ default: m.AbstractImpactScene }))
);

const BRAND = '#3B5BDB';

// ─── HOOKS ────────────────────────────────────────────────────────────────────

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

// ─── STICKER SYSTEM ───────────────────────────────────────────────────────────

const STICKER_PALETTE = {
    yellow:  { bg: '#FFD43B', shadow: '#c49d00', text: '#292524' },
    coral:   { bg: '#FF6B6B', shadow: '#bb2929', text: '#fff'    },
    mint:    { bg: '#51CF66', shadow: '#1e8a3a', text: '#fff'    },
    indigo:  { bg: '#3B5BDB', shadow: '#1c3ab0', text: '#fff'    },
    purple:  { bg: '#9C36B5', shadow: '#6b1a82', text: '#fff'    },
    lime:    { bg: '#94D82D', shadow: '#527a10', text: '#292524' },
} as const;
type StickerColor = keyof typeof STICKER_PALETTE;

const Sticker: React.FC<{
    children: React.ReactNode;
    color?: StickerColor;
    rotation?: number;
    className?: string;
}> = ({ children, color = 'indigo', rotation = 0, className = '' }) => {
    const c = STICKER_PALETTE[color];
    return (
        <motion.div
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap select-none cursor-default ${className}`}
            style={{ background: c.bg, color: c.text, boxShadow: `0 4px 0 0 ${c.shadow}, 0 6px 20px rgba(0,0,0,0.08)` }}
            initial={{ rotate: rotation }}
            whileHover={{ rotate: 0, y: -5, boxShadow: `0 8px 0 0 ${c.shadow}, 0 14px 28px rgba(0,0,0,0.14)`, transition: { duration: 0.15 } }}
        >
            {children}
        </motion.div>
    );
};

const SUBTITLES = [
    "Building AI systems that ship to production.",
    "Researching LLM safety & robustness.",
    "Designing multi-agent architectures.",
    "Making AI trustworthy & explainable.",
    "Bridging research and real-world products.",
];

const IMPACT_STATS: Array<{
    displayValue: string | null;
    numericEnd: number | null;
    prefix: string;
    suffix: string;
    label: string;
}> = [
    { displayValue: '2.5hr→30m', numericEnd: null, prefix: '', suffix: '', label: 'debugging time cut at AWS' },
    { displayValue: null, numericEnd: 50, prefix: '$', suffix: 'K/mo', label: 'infrastructure costs saved' },
    { displayValue: null, numericEnd: 172, prefix: '', suffix: 'K+', label: 'lines of code shipped' },
    { displayValue: null, numericEnd: 200, prefix: '', suffix: '+', label: 'students mentored into AI' },
    { displayValue: null, numericEnd: 4, prefix: '', suffix: '', label: 'peer-reviewed papers' },
    { displayValue: null, numericEnd: 6, prefix: '', suffix: '', label: 'hackathons built & led' },
    { displayValue: '4.0 GPA', numericEnd: null, prefix: '', suffix: '', label: 'at Purdue University' },
];

const MACHINE_CLIPBOARD_TEXT = `ISHANI KATHURIA
ishani@kathuria.net · linkedin.com/in/ishani-kathuria · github.com/ikathuria · ishani.kathuria.net

STATUS: Open to internships & full-time opportunities

# AI/ML Engineer & Researcher
MS Applied AI @ Purdue · ex-SDE @ AWS · 4× Published (IEEE + Springer)

Applied AI researcher building LLM systems, agentic pipelines, and safety tools that bridge research and real-world products.

---

## Impact

2.5hr→30m    debugging time cut at AWS
$50K/mo      infrastructure costs saved
172K+        lines of code shipped to production
200+         students mentored into AI careers
4            peer-reviewed papers (IEEE + Springer)
6            hackathons built & led
4.0 GPA      at Purdue University

---

## About

I'm an AI/ML engineer who spent two years shipping production LLM systems at AWS — log summarization tools, internal chatbots, automated deployment pipelines across 15+ distributed services — before returning to academia to research the harder questions.

Now at Purdue, I focus on what makes AI systems trustworthy: retrieval quality, hallucination reduction, safety evaluation. I've published four peer-reviewed papers (IEEE + Springer) and co-founded an initiative that helped 200+ students build their first ML projects.

I'm looking for opportunities — internships or full-time — where rigorous research and real-world impact aren't at odds.

---

## Selected Projects

### TrustworthyRAG
Project · 2025
Query-Adaptive Learned Fusion (QALF) for optimal multimodal retrieval.
Designed a query-adaptive learned fusion mechanism to dynamically route queries across vector, graph, and keyword retrieval systems. Built a multimodal knowledge graph ingesting unstructured text and images to enable multi-hop reasoning.

### AutoRedTeam
Project · 2026
Multi-agent adversarial simulation framework for LLM safety.
Engineered a multi-agent adversarial evaluation framework (Attacker, Target, Judge) to stress-test LLM safety and robustness. Provider-agnostic: GPT-4, Gemini, Llama 3.
GitHub: https://github.com/ikathuria/AutoRedTeam

### DeepFakeGuard
Project · 2026
Client-side Edge AI forensic tool for synthetic audio detection.
Built a client-side AI forensic tool using Transformers.js to detect synthetic audio directly in-browser, preserving user privacy. Sub-second latency, fully client-side.

---

## Hackathons

### How Cooked Am I? — Vibe-Coded Creator Hackathon
May 31, 2026 · Chicago (hosted by Play)
An AI tool that roasts then rebuilds content creators — returns a 'cookedScore', a diagnosis, and a three-phase growth plan. Team of 3, built end-to-end with Replit Agent in ~1 hour.
GitHub: https://github.com/ikathuria/HowCookedAmI
Demo: https://how-cooked-am-i.replit.app/

### GROUNDWORK — Hack-Nation Global AI Hackathon
Apr 25–26, 2026 · San Francisco
Literature-synthesis engine turning a research question into a traceable, experiment-ready brief across arXiv, Semantic Scholar & more.
GitHub: https://github.com/ikathuria/groundwork

### GlobalBuddy — HackwithChicago 3.0
Apr 2, 2026 · Microsoft, Chicago
Graph-powered support platform helping international students navigate a new US city. Neo4j + FastAPI + Vue.
GitHub: https://github.com/ikathuria/GlobalBuddy

### VibeCut — Google Hackathon
Mar 14, 2026 · Drive Capital, Chicago
AI-native video editor with semantic search, transcription-aware cuts, and generative media. Gemini + Next.js.
GitHub: https://github.com/slab10000/Google-Hackathon

### RealityShift — Mistral AI Hackathon
Feb 28 – Mar 1, 2026 · San Francisco
Voice-controlled RPG where an 'Architect' AI rewrites the game's source code in real time. Mistral devstral + ElevenLabs.
GitHub: https://github.com/ikathuria/RealityShift
Demo: https://www.youtube.com/watch?v=jj_8OoTdjRQ

### SIREN One-Day App Challenge — Founder & President, Purdue Northwest
Apr 3, 2026
Founded and ran a one-day build challenge — 70+ registrants, 7 final teams, $200 in prizes.
Event: https://ishani.kathuria.net/siren-student-research-pnw/odadc/2026

---

## Research Publications

### Conversational AI for Supporting Children with Autism
Book Chapter (Springer) · July 2025
A deep learning-based virtual agent for social and language skills development.

### Real-Time Temperature Based Food Recommendation
ICCNT (IEEE) · July 2023
Dynamic menu personalization using Gradient Boosting and Fuzzy Logic.

### Applications of Deep Learning in Healthcare
Springer · November 2023
A systematic analysis of deep learning methods in disease diagnosis and medical imaging.

### Predicting Daily PM2.5 using Azure ML Studio
IEEE · July 2022
Classical ML pipeline on Azure for air quality prediction using meteorological features.

---

## Experience

### Purdue University Northwest
AI Research Assistant · Sep 2025 – Present · Hammond, Indiana, USA
- Conducting applied research on RAG systems, focusing on retrieval quality, hallucination reduction, and latency optimization for LLM-based applications.
- Evaluating retrieval strategies using Recall@K and nDCG to optimize real-world QA performance.

### Amazon Web Services
Software Development Engineer · Jul 2023 – Jul 2025 · Bangalore, India
- Built and deployed LLM-based log summarization systems, reducing root-cause analysis time from 2.5 hours to 30 minutes.
- Designed internal AI chatbots for developer support workflows, improving resolution efficiency by 40%.
- Automated deployment pipelines for 15+ OpenSearch services, reducing manual intervention by 80%.
- Developed proactive anomaly detection systems, reducing customer-reported issues by 30%.

---

## Education

MS Applied Artificial Intelligence · Purdue University Northwest · 2025–2027 · GPA 4.0/4.0
BTech Artificial Intelligence · Amity University · 2019–2023 · GPA 9.09/10.0

---

## Skills

Generative AI: LLMs, RAG, Fine-Tuning, Multi-Agent Systems, Prompt Engineering, LangChain, HuggingFace, Gemini, Gemma, ChatGPT, Claude, Mistral, Nova
ML Frameworks: Ollama, PyTorch, TensorFlow, Scikit-Learn
Programming: Python, Golang, TypeScript, Java
Cloud & MLOps: AWS (Bedrock, Lambda, ECS, Step Functions, CloudFormation, CloudWatch), Azure
Web & Data Science: React, Flask, Django, Pandas, NumPy, Tableau, Matplotlib, Seaborn
Certifications: AWS Certified AI Practitioner, AWS Certified Cloud Practitioner

---

CONTACT
[ishani@kathuria.net](mailto:ishani@kathuria.net)
[LinkedIn](https://linkedin.com/in/ishani-kathuria)
[GitHub](https://github.com/ikathuria)

© ${new Date().getFullYear()} Ishani Kathuria`;

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

const AuthorCard = ({ name, role, delay, themeColor }: { name: string; role: string; delay: string; themeColor: string }) => (
    <div className="flex flex-col group animate-fade-in-up items-center md:p-8 p-6 bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-xs relative" style={{ animationDelay: delay }}>
        <div className="group-hover:border-opacity-100 border border-transparent transition-all duration-300 rounded-xl absolute inset-0 pointer-events-none" style={{ borderColor: themeColor, opacity: 0.3 }} />
        <h3 className="font-serif text-2xl text-stone-900 text-center mb-3 relative z-10">{name}</h3>
        <div className="w-12 h-0.5 mb-4 opacity-60" style={{ backgroundColor: themeColor }} />
        <p className="text-xs text-stone-500 font-bold uppercase tracking-widest text-center leading-relaxed relative z-10">{role}</p>
    </div>
);

const PaperCard = ({ item }: { item: PortfolioItem }) => (
    <motion.article
        className="group bg-white rounded-3xl p-7 border border-stone-200/80 relative overflow-hidden h-full flex flex-col"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6, rotate: -0.4, boxShadow: '0 20px 48px rgba(15,23,42,0.10), 0 4px 0 rgba(15,23,42,0.04)' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.3 }}
        style={{ boxShadow: '0 2px 8px rgba(15,23,42,0.05), 0 0 0 1px rgba(15,23,42,0.04)' }}
    >
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ background: `linear-gradient(135deg, ${item.metadata.themeColor}10 0%, transparent 60%)` }} />
        {/* Clickable main area — href enables right-click → open in new tab */}
        <a href={`#project=${item.id}`} className="flex flex-col flex-grow relative z-10 text-left cursor-pointer">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold mb-4 w-fit"
                style={{ background: item.metadata.themeColor + '18', color: item.metadata.themeColor }}>
                {item.metadata.venue} · {item.metadata.date}
            </div>
            <h3 className="font-serif text-xl text-stone-900 mb-3 leading-snug">{item.metadata.title}</h3>
            <p className="text-stone-500 text-sm leading-relaxed mb-5 flex-grow">{item.metadata.subtitle}</p>
        </a>
        {/* Footer: tech chips + external links */}
        <div className="relative z-10 flex items-center justify-between gap-3 pt-4 border-t border-stone-100 mt-auto">
            <div className="flex flex-wrap gap-1.5">
                {item.technical?.techStack.slice(0, 3).map(t => (
                    <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-500">{t}</span>
                ))}
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
                {item.metadata.githubUrl && (
                    <a href={item.metadata.githubUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                        className="w-7 h-7 rounded-full bg-stone-900 text-white inline-flex items-center justify-center hover:-translate-y-0.5 transition-transform" aria-label="GitHub">
                        <Github size={12} />
                    </a>
                )}
                {item.metadata.demoUrl && (
                    <a href={item.metadata.demoUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                        className="w-7 h-7 rounded-full text-white inline-flex items-center justify-center hover:-translate-y-0.5 transition-transform" aria-label="Demo"
                        style={{ backgroundColor: item.metadata.themeColor }}>
                        <ArrowUpRight size={12} />
                    </a>
                )}
            </div>
        </div>
    </motion.article>
);

const HackathonCard = ({ item }: { item: typeof hackathons[number] }) => {
    const isOrganizer = item.role === 'organizer';
    return (
        <motion.article
            className="group bg-white rounded-3xl p-7 border border-stone-200/80 relative overflow-hidden h-full flex flex-col"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, rotate: -0.4, boxShadow: '0 20px 48px rgba(15,23,42,0.10), 0 4px 0 rgba(15,23,42,0.04)' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
            style={{ boxShadow: '0 2px 8px rgba(15,23,42,0.05), 0 0 0 1px rgba(15,23,42,0.04)' }}
        >
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `linear-gradient(135deg, ${item.themeColor}10 0%, transparent 60%)` }} />
            <div className="flex flex-col flex-grow relative z-10">
                <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold w-fit"
                        style={{ background: item.themeColor + '18', color: item.themeColor }}>
                        {item.hackathon} · {item.date}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md flex-shrink-0"
                        style={isOrganizer ? { background: item.themeColor + '18', color: item.themeColor } : { background: '#f5f5f4', color: '#a8a29e' }}>
                        {isOrganizer ? <><Trophy size={11} /> Organizer</> : <><Code size={11} /> Builder</>}
                    </span>
                </div>
                <h3 className="font-serif text-xl text-stone-900 mb-2 leading-snug">{item.project}</h3>
                {(item.location || (item.team && item.team.length > 0)) && (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-stone-400 mb-3">
                        {item.location && <span className="inline-flex items-center gap-1"><MapPin size={11} /> {item.location}</span>}
                        {item.team && item.team.length > 0 && <span className="inline-flex items-center gap-1"><Users size={11} /> with {item.team.join(', ')}</span>}
                    </div>
                )}
                <p className="text-stone-500 text-sm leading-relaxed mb-5 flex-grow">{item.tagline}</p>
            </div>
            <div className="relative z-10 flex items-center justify-between gap-3 pt-4 border-t border-stone-100 mt-auto">
                <div className="flex flex-wrap gap-1.5">
                    {item.techStack?.slice(0, 3).map(t => (
                        <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-500">{t}</span>
                    ))}
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                    {item.links.github && (
                        <a href={item.links.github} target="_blank" rel="noopener noreferrer"
                            className="w-7 h-7 rounded-full bg-stone-900 text-white inline-flex items-center justify-center hover:-translate-y-0.5 transition-transform" aria-label="GitHub">
                            <Github size={12} />
                        </a>
                    )}
                    {item.links.video && (
                        <a href={item.links.video} target="_blank" rel="noopener noreferrer"
                            className="w-7 h-7 rounded-full bg-red-600 text-white inline-flex items-center justify-center hover:-translate-y-0.5 transition-transform" aria-label="Demo video">
                            <PlayCircle size={12} />
                        </a>
                    )}
                    {item.links.demo && (
                        <a href={item.links.demo} target="_blank" rel="noopener noreferrer"
                            className="w-7 h-7 rounded-full text-white inline-flex items-center justify-center hover:-translate-y-0.5 transition-transform" aria-label="Demo"
                            style={{ backgroundColor: item.themeColor }}>
                            <ArrowUpRight size={12} />
                        </a>
                    )}
                    {item.links.linkedin && (
                        <a href={item.links.linkedin} target="_blank" rel="noopener noreferrer"
                            className="w-7 h-7 rounded-full text-white inline-flex items-center justify-center hover:-translate-y-0.5 transition-transform" aria-label="LinkedIn write-up"
                            style={{ backgroundColor: '#0A66C2' }}>
                            <Linkedin size={12} />
                        </a>
                    )}
                </div>
            </div>
        </motion.article>
    );
};

const CodeTerminal = ({ code, color }: { code: string; color: string }) => (
    <div className="w-full max-w-2xl bg-stone-900 rounded-lg shadow-2xl overflow-hidden border border-stone-800 font-mono text-xs md:text-sm my-8">
        <div className="bg-stone-800 px-4 py-2 flex items-center gap-2 border-b border-stone-700">
            <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="ml-4 text-stone-400 opacity-60">model_architecture.py</div>
        </div>
        <div className="p-6 text-stone-300 overflow-x-auto">
            <pre><code>{code}</code></pre>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-50" style={{ color }} />
    </div>
);

const StatCard = ({ stat, index }: { stat: typeof IMPACT_STATS[0]; index: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView || stat.numericEnd === null) return;
        const target = stat.numericEnd;
        const duration = 1400;
        const startTime = Date.now();
        const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [isInView, stat.numericEnd]);

    const displayText = stat.displayValue ?? `${stat.prefix}${count}${stat.suffix}`;

    return (
        <motion.div
            ref={ref}
            className="text-center py-8 px-3 rounded-2xl hover:bg-stone-50 transition-colors"
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.08 }}
        >
            <div className="text-2xl md:text-3xl font-bold mb-1.5 font-mono tracking-tight" style={{ color: BRAND }}>
                {displayText}
            </div>
            <div className="text-xs text-stone-400 leading-snug max-w-[100px] mx-auto">{stat.label}</div>
        </motion.div>
    );
};

const ImpactStrip = () => (
    <section className="border-y border-stone-100 bg-white py-4">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-2">
                {IMPACT_STATS.map((stat, i) => <StatCard key={i} stat={stat} index={i} />)}
            </div>
        </div>
    </section>
);

const AboutSection = () => (
    <motion.section
        className="py-24 bg-[#FAFAF7] border-t border-stone-100"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.1 }}
    >
        <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                <div className="md:col-span-4">
                    <div className="text-xs font-bold tracking-widest text-stone-400 uppercase mb-4">About</div>
                    <h2 className="font-serif text-4xl text-stone-900 leading-tight">
                        Research meets<br />real-world scale.
                    </h2>
                    <div className="w-12 h-0.5 mt-6" style={{ backgroundColor: BRAND }} />
                </div>
                <div className="md:col-span-8 space-y-5 text-lg text-stone-600 leading-relaxed">
                    <p>
                        I'm an AI/ML engineer who spent two years shipping production LLM systems at{' '}
                        <span style={{ background: 'linear-gradient(180deg, transparent 62%, rgba(59,91,219,0.18) 62%)', padding: '0 2px' }}>AWS</span>
                        {' '}— log summarization tools, internal chatbots, automated deployment pipelines across 15+ distributed services — before returning to academia to research the harder questions.
                    </p>
                    <p>
                        Now at{' '}
                        <span style={{ background: 'linear-gradient(180deg, transparent 62%, rgba(59,91,219,0.18) 62%)', padding: '0 2px' }}>Purdue</span>
                        , I focus on what makes AI systems trustworthy: retrieval quality, hallucination reduction, safety evaluation. I've published four peer-reviewed papers (IEEE + Springer) and co-founded an initiative that helped 200+ students build their first ML projects.
                    </p>
                    <p>
                        I'm looking for opportunities — internships or full-time — where rigorous research and real-world impact aren't at odds.
                    </p>
                </div>
            </div>
        </div>
    </motion.section>
);

// ─── MACHINE MODE ─────────────────────────────────────────────────────────────

const MLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <>
        <span className="text-stone-600 select-none">[</span>
        <a href={href} target={href.startsWith('http') || href.startsWith('mailto') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="text-indigo-400 hover:underline underline-offset-2">{children}</a>
        <span className="text-stone-600 select-none">]</span>
    </>
);
const H1 = ({ children }: { children: React.ReactNode }) => <div className="mb-3 mt-1"><span className="text-stone-700 select-none mr-1">#</span><span className="text-white font-semibold">{children}</span></div>;
const H2 = ({ children }: { children: React.ReactNode }) => <div className="mb-3 mt-8"><span className="text-stone-700 select-none mr-1">##</span><span className="text-indigo-400 font-semibold">{children}</span></div>;
const H3 = ({ children }: { children: React.ReactNode }) => <div className="mb-1 mt-5"><span className="text-stone-700 select-none mr-1">###</span><span className="text-stone-200 font-semibold">{children}</span></div>;
const Hr = () => <div className="border-t border-stone-800 my-8" />;

const MachineMode = ({ onToggle }: { onToggle: () => void }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(MACHINE_CLIPBOARD_TEXT);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#0D0D0F] font-mono text-sm">
            <div className="sticky top-0 z-50 bg-[#0D0D0F]/95 backdrop-blur-sm border-b border-stone-800 px-4 sm:px-6 py-4 flex items-center justify-between gap-2">
                <div className="hidden sm:flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs text-stone-500 ml-2 hidden md:inline">ishani.kathuria.net</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink min-w-0">
                    <button onClick={handleCopy} className="flex items-center gap-2 text-xs px-3 py-1.5 rounded border border-stone-700 hover:border-indigo-500 hover:text-indigo-400 transition-colors text-stone-400 whitespace-nowrap">
                        {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> <span className="hidden sm:inline">Copy as Text</span><span className="sm:hidden">Copy</span></>}
                    </button>
                    <div className="flex items-center gap-0.5 bg-stone-900 rounded-full p-1 border border-stone-800">
                        <button onClick={onToggle} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-stone-500 hover:text-stone-300 transition-colors text-xs"><User size={11} /> Human</button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600 text-white font-semibold text-xs"><Bot size={11} /> Machine</button>
                    </div>
                </div>
            </div>
            <div className="max-w-3xl mx-auto px-6 py-12 text-stone-300 leading-relaxed text-xs">
                <div className="text-white font-bold text-base mb-2">ISHANI KATHURIA</div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-stone-500 mb-1">
                    <MLink href="mailto:ishani@kathuria.net">ishani@kathuria.net</MLink>
                    <span className="text-stone-700">·</span>
                    <MLink href="https://www.linkedin.com/in/ishani-kathuria">LinkedIn</MLink>
                    <span className="text-stone-700">·</span>
                    <MLink href="https://github.com/ikathuria">GitHub</MLink>
                    <span className="text-stone-700">·</span>
                    <MLink href="https://ishani.kathuria.net">ishani.kathuria.net</MLink>
                </div>
                <div className="text-emerald-400 mb-6">● Open to internships & full-time opportunities</div>
                <H1>AI/ML Engineer & Researcher</H1>
                <div className="text-stone-500 mb-2">MS Applied AI @ Purdue · ex-SDE @ AWS · 4× Published (IEEE + Springer)</div>
                <p className="text-stone-300 mb-3">Applied AI researcher building LLM systems, agentic pipelines, and safety tools that bridge research and real-world products.</p>
                <div className="flex flex-wrap gap-4 mb-2">
                    <MLink href="#projects">View Projects</MLink>
                    <MLink href="#research">View Publications</MLink>
                    <MLink href="/resume.pdf">Download Resume</MLink>
                </div>
                <Hr />
                <H2>Impact</H2>
                <div className="space-y-1.5 mb-2">
                    {IMPACT_STATS.map((stat, i) => {
                        const val = stat.displayValue ?? `${stat.prefix}${stat.numericEnd}${stat.suffix}`;
                        return <div key={i} className="flex gap-4"><span className="text-indigo-400 font-bold w-20 flex-shrink-0">{val}</span><span className="text-stone-400">{stat.label}</span></div>;
                    })}
                </div>
                <Hr />
                <H2>About</H2>
                <div className="space-y-3 mb-2 text-stone-300">
                    <p>I'm an AI/ML engineer who spent two years shipping production LLM systems at AWS — log summarization tools, internal chatbots, automated deployment pipelines across 15+ distributed services — before returning to academia to research the harder questions.</p>
                    <p>Now at Purdue, I focus on what makes AI systems trustworthy: retrieval quality, hallucination reduction, safety evaluation. I've published four peer-reviewed papers (IEEE + Springer) and co-founded an initiative that helped 200+ students build their first ML projects.</p>
                    <p>I'm looking for opportunities — internships or full-time — where rigorous research and real-world impact aren't at odds.</p>
                </div>
                <Hr />
                <H2>Selected Projects</H2>
                {projects.map(project => (
                    <div key={project.id}>
                        <H3>{project.metadata.title}</H3>
                        <div className="text-stone-600 mb-1">{project.metadata.venue} · {project.metadata.date}</div>
                        <p className="text-stone-400 italic mb-2">{project.metadata.subtitle}</p>
                        <p className="text-stone-300 mb-2">{project.narrative.innovation}</p>
                        {project.technical && <p className="text-stone-600 mb-2">Tech Stack: {project.technical.techStack.join(', ')}</p>}
                        <div className="flex flex-wrap gap-4 mb-2">
                            {project.metadata.githubUrl && <MLink href={project.metadata.githubUrl}>View Code →</MLink>}
                            {project.metadata.demoUrl && <MLink href={project.metadata.demoUrl}>Live Demo →</MLink>}
                            {project.metadata.link && <MLink href={project.metadata.link}>Read More →</MLink>}
                        </div>
                    </div>
                ))}
                <Hr />
                <H2>Hackathons</H2>
                {hackathons.map(h => (
                    <div key={h.id}>
                        <H3>{h.project}</H3>
                        <div className="text-stone-600 mb-1">{h.hackathon} · {h.date}{h.location ? ` · ${h.location}` : ''}</div>
                        <p className="text-stone-400 italic mb-2">{h.tagline}</p>
                        {h.techStack && <p className="text-stone-600 mb-2">Tech Stack: {h.techStack.join(', ')}</p>}
                        <div className="flex flex-wrap gap-4 mb-2">
                            {h.links.github && <MLink href={h.links.github}>View Code →</MLink>}
                            {h.links.video && <MLink href={h.links.video}>Watch Demo →</MLink>}
                            {h.links.demo && <MLink href={h.links.demo}>Live Demo →</MLink>}
                            {h.links.linkedin && <MLink href={h.links.linkedin}>Write-up →</MLink>}
                        </div>
                    </div>
                ))}
                <Hr />
                <H2>Research Publications</H2>
                {papers.map(paper => (
                    <div key={paper.id}>
                        <H3>{paper.metadata.title}</H3>
                        <div className="text-stone-600 mb-1">{paper.metadata.venue} · {paper.metadata.date}</div>
                        <p className="text-stone-400 italic mb-2">{paper.metadata.subtitle}</p>
                        {paper.metadata.link && <div className="mb-2"><MLink href={paper.metadata.link}>Read Paper →</MLink></div>}
                    </div>
                ))}
                <Hr />
                <H2>Experience</H2>
                {resume.experience.map((exp, idx) => (
                    <div key={idx}>
                        <H3>{exp.company}</H3>
                        <div className="text-stone-600 mb-2">{exp.role} · {exp.period}</div>
                        <ul className="space-y-1 mb-2">
                            {exp.details.map((d, i) => <li key={i} className="flex gap-2 text-stone-400"><span className="text-stone-700 flex-shrink-0">-</span><span>{d}</span></li>)}
                        </ul>
                    </div>
                ))}
                <Hr />
                <H2>Education</H2>
                {resume.education.map((edu, idx) => (
                    <div key={idx} className="mb-4">
                        <span className="text-stone-200 font-semibold">{edu.degree}</span>
                        <span className="text-stone-600"> · {edu.school} · {edu.period}</span>
                        {edu.details.map((d, i) => <div key={i} className="text-stone-500 mt-0.5">{d}</div>)}
                    </div>
                ))}
                <Hr />
                <H2>Skills</H2>
                <div className="space-y-1.5 mb-2">
                    {[
                        { label: 'Generative AI', items: resume.skills.genai },
                        { label: 'ML Frameworks', items: resume.skills.ml },
                        { label: 'Programming', items: resume.skills.programming },
                        { label: 'Cloud & MLOps', items: resume.skills.cloud },
                        { label: 'Web & Data', items: resume.skills.data },
                        { label: 'Certifications', items: resume.skills.certs },
                    ].map(({ label, items }) => (
                        <div key={label} className="flex gap-2">
                            <span className="text-stone-500 flex-shrink-0 w-32">{label}:</span>
                            <span className="text-stone-300">{items.join(', ')}</span>
                        </div>
                    ))}
                </div>
                <Hr />
                <div className="space-y-1 text-stone-500">
                    <div className="text-stone-400 font-semibold mb-3">CONTACT</div>
                    <div><MLink href="mailto:ishani@kathuria.net">ishani@kathuria.net</MLink></div>
                    <div><MLink href="https://www.linkedin.com/in/ishani-kathuria">LinkedIn</MLink></div>
                    <div><MLink href="https://github.com/ikathuria">GitHub</MLink></div>
                    <div className="pt-6 text-stone-700">© {new Date().getFullYear()} Ishani Kathuria</div>
                </div>
            </div>
        </div>
    );
};

// ─── MODE PILL ────────────────────────────────────────────────────────────────

const ModePillLight = ({ machineMode, onToggle }: { machineMode: boolean; onToggle: () => void }) => (
    <div className={`flex items-center gap-0.5 rounded-full p-1 text-xs border transition-colors ${machineMode ? 'bg-stone-900 border-stone-700' : 'bg-stone-100 border-stone-200'}`}>
        <button onClick={() => machineMode && onToggle()} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${!machineMode ? 'bg-white shadow text-stone-900 font-semibold' : 'text-stone-400 hover:text-stone-200'}`}>
            <User size={11} /> Human
        </button>
        <button onClick={() => !machineMode && onToggle()} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${machineMode ? 'bg-indigo-600 text-white font-semibold' : 'text-stone-500 hover:text-stone-900'}`}>
            <Bot size={11} /> Machine
        </button>
    </div>
);

// ─── RESUME SECTION ───────────────────────────────────────────────────────────

const ResumeSection = () => (
    <motion.section
        id="resume"
        className="py-24 bg-white border-t border-stone-200"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
        viewport={{ once: true, amount: 0.1 }}
    >
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">EXPERIENCE & EDUCATION</div>
                <h2 className="font-serif text-4xl md:text-5xl mb-4 text-stone-900">Resume</h2>
                <div className="flex flex-col items-center gap-3 mt-6">
                    <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="px-8 py-3 rounded-full text-white text-sm font-medium hover:opacity-90 transition-all inline-flex items-center gap-2 shadow-lg hover:-translate-y-0.5" style={{ backgroundColor: BRAND }}>
                        <FileText size={18} /> Download Resume (PDF)
                    </a>
                    <a href="mailto:ishani@kathuria.net?subject=Resume%20Request" className="text-xs text-stone-400 hover:text-stone-600 underline underline-offset-2 transition-colors">
                        or email me for the latest version
                    </a>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4 space-y-12">
                    <div>
                        <h3 className="flex items-center gap-3 text-xl font-serif font-bold text-stone-900 mb-6"><GraduationCap size={24} className="text-stone-400" /> Education</h3>
                        <div className="space-y-8 border-l-2 border-stone-100 pl-6 ml-3">
                            {resume.education.map((edu, idx) => (
                                <div key={idx} className="relative">
                                    <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: BRAND }} />
                                    <h4 className="font-bold text-stone-800">{edu.degree}</h4>
                                    <div className="text-sm text-stone-500 mb-1">{edu.school}, {edu.location}</div>
                                    <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-2">{edu.period}</div>
                                    <ul className="text-sm text-stone-600 list-disc list-inside space-y-1">{edu.details.map((d, i) => <li key={i}>{d}</li>)}</ul>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="flex items-center gap-3 text-xl font-serif font-bold text-stone-900 mb-6"><Code size={24} className="text-stone-400" /> Skills</h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Generative AI', items: resume.skills.genai },
                                { label: 'ML Frameworks', items: resume.skills.ml },
                                { label: 'Programming', items: resume.skills.programming },
                                { label: 'Cloud & MLOps', items: resume.skills.cloud },
                                { label: 'Web & Data', items: resume.skills.data },
                            ].map(({ label, items }) => (
                                <div key={label}>
                                    <div className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">{label}</div>
                                    <div className="flex flex-wrap gap-2">
                                        {items.map(s => <span key={s} className="px-3 py-1 text-sm rounded-md border border-stone-200 text-stone-600 bg-stone-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors cursor-default">{s}</span>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="flex items-center gap-3 text-xl font-serif font-bold text-stone-900 mb-6"><Badge size={24} className="text-stone-400" /> Certifications</h3>
                        <div className="flex flex-wrap gap-2">
                            {resume.skills.certs.map(s => <span key={s} className="px-3 py-1 text-sm rounded-md border text-stone-600 bg-stone-50" style={{ borderColor: BRAND + '55' }}>{s}</span>)}
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-8">
                    <h3 className="flex items-center gap-3 text-xl font-serif font-bold text-stone-900 mb-8"><Briefcase size={24} className="text-stone-400" /> Professional Experience</h3>
                    <div className="space-y-12 border-l-2 border-stone-100 pl-8 ml-3">
                        {resume.experience.map((exp, idx) => (
                            <div key={idx} className="relative group">
                                <div className="absolute -left-[39px] top-1.5 w-4 h-4 rounded-full border-4 border-white group-hover:scale-110 transition-transform" style={{ backgroundColor: idx === 0 ? BRAND : '#D1D5DB' }} />
                                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                                    <h4 className="text-lg font-bold text-stone-900">{exp.role}</h4>
                                    <span className="text-xs font-mono text-stone-400 uppercase bg-stone-50 px-2 py-1 rounded">{exp.period}</span>
                                </div>
                                <div className="text-sm font-semibold text-stone-500 mb-4">{exp.company}</div>
                                <ul className="space-y-2">
                                    {exp.details.map((detail, i) => (
                                        <li key={i} className="text-stone-600 text-sm leading-relaxed flex items-start gap-2">
                                            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: BRAND }} />
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </motion.section>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

const App: React.FC = () => {
    const [activeItemId, setActiveItemId] = useState<string | null>(null);
    const [showDashboard, setShowDashboard] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showTechnical, setShowTechnical] = useState(false);
    const [machineMode, setMachineMode] = useState(false);
    const [subtitleIndex, setSubtitleIndex] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (activeItemId || showDashboard) return;
        const timer = setInterval(() => setSubtitleIndex(i => (i + 1) % SUBTITLES.length), 3200);
        return () => clearInterval(timer);
    }, [activeItemId, showDashboard]);

    const allItems = [...papers, ...projects];

    useEffect(() => {
        const currentHash = window.location.hash;
        let desiredHash = '';
        if (showDashboard) desiredHash = '#dashboard';
        else if (activeItemId) desiredHash = `#project=${activeItemId}`;
        if (currentHash !== desiredHash) {
            if (desiredHash) window.location.hash = desiredHash;
            else if (currentHash) history.pushState(null, '', window.location.pathname);
        }
    }, [activeItemId, showDashboard]);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash === '#dashboard') { setShowDashboard(true); setActiveItemId(null); }
            else if (hash.startsWith('#project=')) {
                const id = hash.replace('#project=', '');
                if (allItems.find(p => p.id === id)) { setShowDashboard(false); setActiveItemId(id); }
            } else { setShowDashboard(false); setActiveItemId(null); }
        };
        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    useEffect(() => { window.scrollTo(0, 0); setShowTechnical(false); }, [activeItemId, showDashboard]);

    const activeItem = allItems.find(p => p.id === activeItemId);
    const activeSection = useActiveSection(['work', 'hackathons', 'research', 'resume']);

    if (showDashboard) {
        return (
            <Suspense fallback={<div className="min-h-screen bg-[#FAFAF8]" />}>
                <Dashboard onBack={() => setShowDashboard(false)} />
            </Suspense>
        );
    }
    if (!activeItem && machineMode) return <MachineMode onToggle={() => setMachineMode(false)} />;

    if (!activeItem) {
        return (
            <div className="min-h-screen bg-[#FAFAF8] text-stone-800">
                <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-full focus:bg-stone-900 focus:text-white">
                    Skip to main content
                </a>

                {/* Floating pill nav — always light */}
                <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-1 px-3 py-2 rounded-full border text-sm transition-all duration-300"
                    style={scrolled
                        ? { background: 'rgba(255,255,255,0.95)', borderColor: 'rgb(231,229,228)', boxShadow: '0 4px 24px rgba(15,23,42,0.09)', backdropFilter: 'blur(12px)' }
                        : { background: 'rgba(255,255,255,0.80)', borderColor: 'rgba(231,229,228,0.8)', backdropFilter: 'blur(12px)' }
                    }
                >
                    <span className="font-serif font-bold px-2 mr-1 text-stone-900">
                        Ishani<span className="text-stone-400">.ai</span>
                    </span>
                    {([['work', 'Projects'], ['hackathons', 'Hackathons'], ['research', 'Research'], ['resume', 'Resume']] as [string, string][]).map(([id, label]) => (
                        <a key={id} href={`#${id}`}
                            className={`px-3 py-1.5 rounded-full transition-colors text-sm ${activeSection === id ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'}`}>
                            {label}
                        </a>
                    ))}
                    <button onClick={() => setShowDashboard(true)} className="px-3 py-1.5 rounded-full transition-colors text-stone-500 hover:text-stone-900 hover:bg-stone-100 text-sm">
                        Dashboard
                    </button>
                    <div className="ml-1">
                        <ModePillLight machineMode={machineMode} onToggle={() => setMachineMode(m => !m)} />
                    </div>
                </nav>

                {/* Mobile hamburger */}
                <button
                    className="fixed top-4 right-4 z-50 md:hidden p-2.5 rounded-full border backdrop-blur-md transition-all"
                    style={{ background: 'rgba(255,255,255,0.90)', borderColor: 'rgb(231,229,228)', color: '#1c1917' }}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>

                {menuOpen && (
                    <div className="fixed inset-0 z-40 bg-[#FAFAF8] flex flex-col items-center justify-center gap-8 text-xl font-serif animate-fade-in text-stone-900">
                        <a href="#work" onClick={() => setMenuOpen(false)}>Projects</a>
                        <a href="#hackathons" onClick={() => setMenuOpen(false)}>Hackathons</a>
                        <a href="#research" onClick={() => setMenuOpen(false)}>Research</a>
                        <a href="#resume" onClick={() => setMenuOpen(false)}>Resume</a>
                        <button onClick={() => { setMenuOpen(false); setShowDashboard(true); }}>Dashboard</button>
                        <ModePillLight machineMode={machineMode} onToggle={() => { setMachineMode(m => !m); setMenuOpen(false); }} />
                    </div>
                )}

                {/* Hero — light, sticker-decorated */}
                <header className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#FAFAF7]">
                    {/* Decorative sticker cluster — desktop only */}
                    {/* Stickers live ABOVE the name (top ≤ 28%) and BELOW the CTAs (bottom ≤ 24%) */}
                    <div className="hidden xl:block absolute inset-0 pointer-events-none select-none">
                        {/* Above-name row */}
                        <div className="absolute left-[5%] top-[20%]">
                            <Sticker color="indigo" rotation={-2}><Layers size={14} /> Multi-Agent AI</Sticker>
                        </div>
                        <div className="absolute left-[22%] top-[14%]">
                            <Sticker color="yellow" rotation={-3}><Briefcase size={14} /> Ex-AWS SDE</Sticker>
                        </div>
                        <div className="absolute right-[22%] top-[14%]">
                            <Sticker color="mint" rotation={1.5}><GraduationCap size={14} /> Purdue · 4.0 GPA</Sticker>
                        </div>
                        <div className="absolute right-[5%] top-[20%]">
                            <Sticker color="lime" rotation={2}><Mail size={14} /> Open to Work</Sticker>
                        </div>
                        {/* Below-CTAs row */}
                        <div className="absolute left-[14%] bottom-[18%]">
                            <Sticker color="coral" rotation={2}><Cpu size={14} /> LLM Safety</Sticker>
                        </div>
                        <div className="absolute right-[14%] bottom-[18%]">
                            <Sticker color="purple" rotation={-2}><FileText size={14} /> 4× Published</Sticker>
                        </div>
                    </div>

                    {/* Center content — pt-24 clears the fixed nav */}
                    <div className="relative z-10 container mx-auto px-6 text-center pt-24 pb-12">
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stone-200 bg-white text-xs font-medium text-stone-500 mb-10 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Open to internships & full-time opportunities
                        </motion.div>
                        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                            className="font-serif text-6xl md:text-9xl mb-6 tracking-tight text-stone-900">
                            Ishani Kathuria
                        </motion.h1>
                        <div className="h-8 mb-8 overflow-hidden flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.p key={subtitleIndex} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45 }}
                                    className="text-stone-500 text-base md:text-xl italic font-light">
                                    {SUBTITLES[subtitleIndex]}
                                </motion.p>
                            </AnimatePresence>
                        </div>
                        {/* Sticker chips — inline below name on non-lg screens */}
                        <div className="flex xl:hidden flex-wrap gap-2 justify-center mb-8 px-4">
                            <Sticker color="yellow" rotation={-2}><Briefcase size={13} /> Ex-AWS</Sticker>
                            <Sticker color="mint" rotation={1.5}><GraduationCap size={13} /> Purdue · 4.0</Sticker>
                            <Sticker color="purple" rotation={-1.5}><FileText size={13} /> 4× Published</Sticker>
                            <Sticker color="lime" rotation={2}><Mail size={13} /> Open to Work</Sticker>
                        </div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-wrap justify-center gap-2 md:gap-4 text-xs font-mono uppercase tracking-widest text-stone-400 mb-10">
                            <span>MS Applied AI @ Purdue</span>
                            <span className="text-stone-300">·</span>
                            <span>ex-SDE @ AWS</span>
                            <span className="text-stone-300">·</span>
                            <span>4× Published (IEEE + Springer)</span>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col sm:flex-row justify-center gap-3 mb-10">
                            <a href="#work" className="px-7 py-3 rounded-full text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all" style={{ backgroundColor: BRAND, boxShadow: `0 4px 0 0 #1c3ab0, 0 8px 20px rgba(59,91,219,0.25)` }}>
                                View projects
                            </a>
                            <a href="#research" className="px-7 py-3 rounded-full border border-stone-200 text-sm font-semibold text-stone-700 bg-white hover:bg-stone-50 hover:-translate-y-0.5 transition-all shadow-sm">
                                View publications
                            </a>
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}
                            className="flex justify-center gap-3 mb-16">
                            {[
                                { href: 'mailto:ishani@kathuria.net', icon: <Mail size={18} />, label: 'Email' },
                                { href: 'https://www.linkedin.com/in/ishani-kathuria', icon: <Linkedin size={18} />, label: 'LinkedIn' },
                                { href: 'https://github.com/ikathuria', icon: <Github size={18} />, label: 'GitHub' },
                                { href: '#resume', icon: <FileText size={18} />, label: 'Resume' },
                            ].map(({ href, icon, label }) => (
                                <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    className="p-3 rounded-full bg-white border border-stone-200 text-stone-500 hover:text-stone-900 hover:scale-110 hover:shadow-md transition-all shadow-sm" aria-label={label}>
                                    {icon}
                                </a>
                            ))}
                        </motion.div>
                        <a href="#about" aria-label="Scroll to about section" className="animate-float-soft inline-block text-stone-300 hover:text-stone-600 transition-colors"><ArrowDown size={26} /></a>
                    </div>
                </header>

                <ImpactStrip />

                <main id="main">
                    <div id="about"><AboutSection /></div>

                    <motion.section id="work" className="py-24 bg-white border-t border-stone-100"
                        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true, amount: 0.15 }}>
                        <div className="container mx-auto px-6">
                            <div className="mb-10">
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
                                    Projects
                                </div>
                                <h2 className="font-serif text-4xl text-stone-900 mb-3">Selected Projects</h2>
                                <p className="text-stone-400 max-w-xl text-sm leading-relaxed">Systems that translate research into production-ready tools — AI safety, retrieval, and multimodal understanding.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {projects.map(project => <PaperCard key={project.id} item={project} />)}
                            </div>
                        </div>
                    </motion.section>

                    {/* Hackathons — card grid, link-out */}
                    <motion.section id="hackathons" className="py-24 bg-[#FAFAF7] border-t border-stone-100"
                        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true, amount: 0.15 }}>
                        <div className="container mx-auto px-6">
                            <div className="mb-10">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
                                    <Trophy size={12} /> Hackathons
                                </div>
                                <h2 className="font-serif text-4xl text-stone-900 mb-3">Built in a Weekend</h2>
                                <p className="text-stone-400 max-w-xl text-sm leading-relaxed">Rapid prototypes from AI hackathons across the country — plus one I founded and ran at Purdue Northwest.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {hackathons.map(h => <HackathonCard key={h.id} item={h} />)}
                            </div>
                        </div>
                    </motion.section>

                    {/* Research — list layout */}
                    <motion.section id="research" className="py-24 bg-[#FAFAF7] border-t border-stone-100"
                        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} viewport={{ once: true, amount: 0.15 }}>
                        <div className="container mx-auto px-6">
                            <div className="mb-10">
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
                                    Research
                                </div>
                                <h2 className="font-serif text-4xl text-stone-900 mb-3">Research Publications</h2>
                                <p className="text-stone-400 max-w-xl text-sm leading-relaxed">Peer-reviewed work across healthcare, recommendation systems, and trustworthy AI.</p>
                            </div>
                            <div className="flex flex-col">
                                {papers.map((paper, i) => (
                                    <motion.a
                                        key={paper.id}
                                        href={`#project=${paper.id}`}
                                        className="group grid gap-4 md:gap-6 items-baseline py-5 px-2 border-t border-stone-200 hover:bg-white/70 transition-colors text-left w-full last:border-b"
                                        style={{ gridTemplateColumns: '64px 1fr auto' }}
                                        initial={{ opacity: 0, y: 12 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: i * 0.06 }}
                                        viewport={{ once: true }}
                                    >
                                        <span className="font-mono text-xs text-stone-400">{paper.metadata.date.split(' ').pop()}</span>
                                        <span>
                                            <span className="font-serif text-lg md:text-xl text-stone-900 leading-snug">{paper.metadata.title}</span>
                                            <span className="font-mono text-[10px] tracking-widest uppercase text-stone-400 ml-3 align-middle">{paper.metadata.venue}</span>
                                        </span>
                                        <span className="w-8 h-8 rounded-full border border-stone-200 inline-flex items-center justify-center text-stone-400 group-hover:bg-stone-900 group-hover:text-white group-hover:border-stone-900 group-hover:rotate-[-45deg] transition-all flex-shrink-0">
                                            <ArrowUpRight size={13} />
                                        </span>
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.section>

                    <ResumeSection />

                    {/* CTA / Contact */}
                    <section id="contact" className="py-24 border-t border-stone-100 bg-white">
                        <div className="container mx-auto px-6">
                            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-12 items-end">
                                <motion.h2
                                    className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.0] tracking-tight text-stone-900"
                                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
                                >
                                    Got a hard problem?<br />
                                    <em className="italic" style={{ color: BRAND }}>Let's break it together.</em>
                                </motion.h2>
                                <motion.div
                                    className="flex flex-col gap-4 items-start md:items-end"
                                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}
                                >
                                    <div className="flex gap-2 flex-wrap md:justify-end">
                                        <a href="mailto:ishani@kathuria.net?subject=Hello" className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-white text-sm font-semibold transition-all hover:-translate-y-0.5" style={{ backgroundColor: BRAND, boxShadow: `0 4px 0 0 #1c3ab0, 0 8px 20px rgba(59,91,219,0.22)` }}>
                                            <Mail size={15} /> Email me
                                        </a>
                                        <a href="https://www.linkedin.com/in/ishani-kathuria" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-stone-700 text-sm font-semibold bg-white border border-stone-200 hover:bg-stone-50 hover:-translate-y-0.5 transition-all shadow-sm">
                                            <Linkedin size={15} /> LinkedIn
                                        </a>
                                        <a href="https://github.com/ikathuria" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-stone-700 text-sm font-semibold bg-white border border-stone-200 hover:bg-stone-50 hover:-translate-y-0.5 transition-all shadow-sm">
                                            <Github size={15} /> GitHub
                                        </a>
                                    </div>
                                    <div className="font-mono text-[10.5px] tracking-widest uppercase text-stone-400">
                                        © {new Date().getFullYear()} — Built in Indiana, mostly at 1am
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>
                </main>

            </div>
        );
    }

    // ── Detail View ────────────────────────────────────────────────────────────
    const { metadata, narrative, authors, visuals, technical } = activeItem;

    const scrollToSection = (id: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        setMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 100;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };

    const renderDiagram = () => {
        switch (visuals.diagramType) {
            case 'bar-chart':        return <FeatureSelectionChart color={metadata.themeColor} />;
            case 'flow-chart':       return <DualStreamPipeline color={metadata.themeColor} />;
            case 'fuzzy-curves':     return <FuzzyLogicCurves color={metadata.themeColor} />;
            case 'venn-diagram':     return <AIHierarchyVenn color={metadata.themeColor} />;
            case 'waveform':         return <AudioWaveform color={metadata.themeColor} />;
            case 'network-graph':    return <NetworkGraph color={metadata.themeColor} />;
            case 'confidence-meter': return <ConfidenceMeter color={metadata.themeColor} />;
            case 'depth-grid':       return <DepthGrid color={metadata.themeColor} />;
            default: return null;
        }
    };

    const detailStickerColors = (['indigo', 'coral', 'mint', 'yellow', 'purple', 'lime'] as StickerColor[]);
    const detailStickerRots = [-2, 1.5, -1.5, 2, -3, 1];

    return (
        <div className="min-h-screen bg-[#FAFAF7] text-stone-800 selection:text-white" style={{ ['--theme-color' as any]: metadata.themeColor }}>
            <style>{`::selection { background-color: ${metadata.themeColor}; }`}</style>

            {/* Nav — pill style matching home */}
            <nav className="fixed top-0 left-0 right-0 z-50 py-4 bg-[#FAFAF7]/90 backdrop-blur-md border-b border-stone-100/80">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <a href="/" onClick={(e) => { e.preventDefault(); setActiveItemId(null); }} className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors">
                        <ArrowLeft size={16} />
                        <span className="font-medium text-sm">Back</span>
                    </a>
                    <div className="hidden md:flex items-center gap-1 bg-white border border-stone-200 rounded-full px-2 py-1.5 shadow-sm">
                        {(['problem', 'innovation', 'impact'] as const).map(sec => (
                            <a key={sec} href={`#${sec}`} onClick={scrollToSection(sec)}
                                className="px-3 py-1 rounded-full text-sm capitalize text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors">
                                {sec}
                            </a>
                        ))}
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        {metadata.githubUrl && <a href={metadata.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-700 transition-colors"><Github size={13} /> Code</a>}
                        {metadata.demoUrl && <a href={metadata.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-sm font-medium hover:opacity-90 transition-opacity" style={{ backgroundColor: metadata.themeColor }}><Globe size={13} /> Demo</a>}
                        {metadata.link && <a href={metadata.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-sm font-medium hover:opacity-90 transition-opacity" style={{ backgroundColor: metadata.themeColor }}>Paper <ExternalLink size={13} /></a>}
                    </div>
                    <button className="md:hidden p-2 text-stone-600" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
                        {menuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {menuOpen && (
                <div className="fixed inset-0 z-40 bg-[#FAFAF7]/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6 animate-fade-in">
                    <a href="/" onClick={(e) => { e.preventDefault(); setActiveItemId(null); setMenuOpen(false); }} className="text-stone-400 text-sm mb-4 flex items-center gap-2"><ArrowLeft size={16} /> Back to Portfolio</a>
                    {(['problem', 'innovation', 'impact'] as const).map(sec => (
                        <a key={sec} href={`#${sec}`} onClick={scrollToSection(sec)} className="font-serif text-3xl text-stone-700 hover:text-stone-900 capitalize transition-colors">{sec}</a>
                    ))}
                    <div className="flex gap-3 mt-4 flex-wrap justify-center">
                        {metadata.githubUrl && <a href={metadata.githubUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full bg-stone-900 text-white text-sm flex items-center gap-2"><Github size={15} /> Code</a>}
                        {metadata.demoUrl && <a href={metadata.demoUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full text-white text-sm flex items-center gap-2" style={{ backgroundColor: metadata.themeColor }}><Globe size={15} /> Demo</a>}
                        {metadata.link && <a href={metadata.link} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full text-white text-sm flex items-center gap-2" style={{ backgroundColor: metadata.themeColor }}>Paper <ExternalLink size={15} /></a>}
                    </div>
                </div>
            )}

            {/* Hero — light, no Three.js */}
            <header className="relative min-h-screen flex items-center justify-center bg-[#FAFAF7] overflow-hidden">
                <div className="relative z-10 container mx-auto px-6 text-center pt-24 pb-16">
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-stone-200 bg-white text-xs font-mono tracking-widest uppercase text-stone-500 shadow-sm">
                        {metadata.venue} · {metadata.date}
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                        className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium leading-tight mb-6 text-stone-900 max-w-5xl mx-auto">
                        {metadata.title}
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-2xl mx-auto text-lg md:text-xl text-stone-400 font-light leading-relaxed mb-10 italic">
                        {metadata.subtitle}
                    </motion.p>
                    {/* Tech stickers */}
                    {technical && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-wrap gap-2 justify-center mb-10">
                            {technical.techStack.slice(0, 4).map((tech, i) => (
                                <Sticker key={tech} color={detailStickerColors[i % detailStickerColors.length]} rotation={detailStickerRots[i % detailStickerRots.length]}>
                                    {tech}
                                </Sticker>
                            ))}
                        </motion.div>
                    )}
                    {/* Action buttons */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-3 mb-12">
                        {metadata.githubUrl && <a href={metadata.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 text-white text-sm font-semibold hover:bg-stone-700 hover:-translate-y-0.5 transition-all shadow-sm"><Github size={15} /> View Code</a>}
                        {metadata.demoUrl && <a href={metadata.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-sm" style={{ backgroundColor: metadata.themeColor, boxShadow: `0 4px 0 0 ${metadata.themeColor}88, 0 8px 20px ${metadata.themeColor}33` }}><Globe size={15} /> Live Demo</a>}
                        {metadata.link && <a href={metadata.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-sm" style={{ backgroundColor: metadata.themeColor, boxShadow: `0 4px 0 0 ${metadata.themeColor}88, 0 8px 20px ${metadata.themeColor}33` }}>Read Paper <ExternalLink size={15} /></a>}
                    </motion.div>
                    <motion.a href="#problem" onClick={scrollToSection('problem')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}
                        aria-label="Scroll to project details"
                        className="inline-block text-stone-300 hover:text-stone-600 transition-colors animate-float-soft">
                        <ArrowDown size={24} />
                    </motion.a>
                </div>
            </header>

            <main id="main">
                <section id="problem" className="py-24 bg-white border-t border-stone-100">
                    <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                        <div className="md:col-span-4">
                            <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-400 uppercase">The Challenge</div>
                            <h2 className="font-serif text-4xl mb-6 leading-tight text-stone-900">Identifying the Gap</h2>
                            <div className="w-12 h-1 rounded-full mb-6" style={{ backgroundColor: metadata.themeColor }} />
                        </div>
                        <div className="md:col-span-8 text-lg text-stone-600 leading-relaxed"><p>{narrative.problem}</p></div>
                    </div>
                </section>

                <section id="innovation" className="py-24 bg-[#FAFAF7] border-t border-stone-100">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-3 py-1 rounded-full border border-stone-200 bg-white text-xs font-bold tracking-widest uppercase shadow-sm" style={{ color: metadata.themeColor }}>Methodology</span>
                                    {technical && (
                                        <button onClick={() => setShowTechnical(!showTechnical)} className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide hover:text-stone-900 transition-colors" style={{ color: showTechnical ? metadata.themeColor : '#a8a29e' }}>
                                            <Layers size={13} />{showTechnical ? 'Show Concept' : 'Show Code'}
                                        </button>
                                    )}
                                </div>
                                <h2 className="font-serif text-4xl md:text-5xl mb-6 text-stone-900">The Approach</h2>
                                <p className="text-lg text-stone-600 mb-6 leading-relaxed">{narrative.innovation}</p>
                                {technical && (
                                    <div className="mt-6">
                                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Cpu size={13} /> Tech Stack</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {technical.techStack.map((tech, i) => (
                                                <Sticker key={tech} color={detailStickerColors[i % detailStickerColors.length]} rotation={detailStickerRots[i % detailStickerRots.length]}>
                                                    {tech}
                                                </Sticker>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-center w-full">
                                {showTechnical && technical?.codeSnippet ? <CodeTerminal code={technical.codeSnippet} color={metadata.themeColor} /> : renderDiagram()}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="impact" className="py-24 bg-white border-t border-stone-100">
                    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
                        <div className="md:col-span-5 relative min-h-[400px]">
                            <div className="absolute inset-0 bg-[#F5F4F0] rounded-2xl overflow-hidden border border-stone-200">
                                <Suspense fallback={null}>
                                    <AbstractImpactScene themeColor={metadata.themeColor} id={activeItem.id} />
                                </Suspense>
                            </div>
                        </div>
                        <div className="md:col-span-7 flex flex-col justify-center">
                            <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-400 uppercase">Real World Results</div>
                            <h2 className="font-serif text-4xl mb-6 text-stone-900">The Impact</h2>
                            <p className="text-lg text-stone-600 mb-8 leading-relaxed">{narrative.impact}</p>
                            <div className="p-6 bg-[#FAFAF7] border border-stone-200 rounded-2xl border-l-4" style={{ borderLeftColor: metadata.themeColor }}>
                                <p className="font-serif italic text-xl text-stone-800 mb-3">"{metadata.title}"</p>
                                <span className="text-xs font-bold text-stone-400 tracking-widest uppercase">
                                    {metadata.venue === 'Project' ? `— Independent Project · ${metadata.date}` : `— Published in ${metadata.venue}`}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="authors" className="py-24 bg-[#FAFAF7] border-t border-stone-100">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-400 uppercase">Contributors</div>
                            <h2 className="font-serif text-3xl md:text-5xl mb-4 text-stone-900">Team & Roles</h2>
                        </div>
                        <div className="flex flex-wrap gap-6 justify-center">
                            {authors.map((author, idx) => <AuthorCard key={idx} name={author.name} role={author.role} delay={`${idx * 0.1}s`} themeColor={metadata.themeColor} />)}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-white border-t border-stone-100 py-12">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <div className="font-serif text-xl text-stone-900 mb-1">{metadata.title}</div>
                        <p className="text-sm text-stone-400 max-w-md">{metadata.subtitle}</p>
                    </div>
                    <a href="/" onClick={(e) => { e.preventDefault(); setActiveItemId(null); }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50 hover:-translate-y-0.5 transition-all">
                        <ArrowLeft size={14} /> Back to Portfolio
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default App;
