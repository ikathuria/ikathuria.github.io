/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useLayoutEffect, useRef, lazy, Suspense } from 'react';
import { User, Bot, Copy, Check } from 'lucide-react';
import { papers, projects, hackathons, resume } from './data';
import { IMPACT_STATS } from './content';
import { useWebMCP } from './hooks/useWebMCP';
import Home from './components/Home';
import Detail from './components/Detail';

// Lazy-loaded so these chunks are only fetched when actually rendered.
const Dashboard = lazy(() => import('./components/Dashboard'));


const MACHINE_CLIPBOARD_TEXT = `ISHANI KATHURIA
ishani@kathuria.net · linkedin.com/in/ishani-kathuria · github.com/ikathuria · ishani.kathuria.net

STATUS: Graduating May 2027 · open to AI/ML engineer internships (now) and full-time (from May 2027) · USA-first, also open to India, Ireland, UK, Netherlands, Germany, Japan, Norway, Switzerland

# AI/ML Engineer & Researcher
MS Applied AI @ Purdue · ex-SDE @ AWS · 4× Published (IEEE + Springer)

AI/ML engineer with 2 years shipping production LLM systems at AWS, now completing an MS in Applied AI at Purdue (May 2027) with research in retrieval-augmented generation, multi-agent systems, and LLM evaluation. 4 peer-reviewed publications. Open to AI/ML engineering internships now and full-time from May 2027.

---

## Impact

2.5hr→30m    debugging time cut at AWS
$50K/mo      infrastructure costs saved
172K+        lines of code shipped to production
200+         students mentored into AI careers
4            peer-reviewed papers (IEEE + Springer)
9            hackathons built & led
4.0 GPA      at Purdue University

---

## About

I'm an AI/ML engineer who spent two years shipping production LLM systems at AWS — log summarization tools, internal chatbots, automated deployment pipelines across 15+ distributed services — before returning to academia to research the harder questions.

Now at Purdue, I focus on what makes AI systems trustworthy: retrieval quality, hallucination reduction, safety evaluation. I've published four peer-reviewed papers (IEEE + Springer) and co-founded an initiative that helped 200+ students build their first ML projects.

I'm looking for opportunities — internships or full-time — where rigorous research and real-world impact aren't at odds.

---

## Awards & Leadership

Winner, DeveloperWeek NY Hackathon 2026 (name.com Domain Roulette) · Founder & President, SIREN student AI research org (70+ participants) · 9 AI hackathons built & organized.

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

### yourbusiness.cards — DeveloperWeek NY Hackathon
Jun 2026 · New York · 🏆 Winner (name.com Domain Roulette)
A freemium SaaS that spins up a polished single-screen digital business card — templates, links, QR codes, and AI art — in under 60 seconds.
GitHub: https://github.com/ikathuria/yourbusiness.cards
Demo: https://yourbusiness-cards.vercel.app
Devpost: https://devpost.com/software/yourbusiness-cards

### RealSight — Google Cloud Rapid Agent Hackathon
Jun 2026
A Chrome extension that passively flags AI-generated videos on YouTube & Reels right on the player, with the model's visual reasoning in ~5 seconds.
GitHub: https://github.com/ikathuria/RealSight
Devpost: https://devpost.com/software/realsight

### afterparty.digital — DeveloperWeek NY Hackathon
Jun 2026 · New York
An AI platform that turns a finished event into lasting connections — attendee match pages, editable relationship graphs, and a connection-ROI dashboard.
GitHub: https://github.com/ikathuria/afterparty.digital
Devpost: https://devpost.com/software/afterparty-digital

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

// ─── MACHINE MODE ─────────────────────────────────────────────────────────────

const MLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <>
        <span className="text-stone-600 select-none">[</span>
        <a href={href} target={href.startsWith('http') || href.startsWith('mailto') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="text-[#FFE45C] hover:underline underline-offset-2">{children}</a>
        <span className="text-stone-600 select-none">]</span>
    </>
);
const H1 = ({ children }: { children: React.ReactNode }) => <div className="mb-3 mt-1"><span className="text-stone-700 select-none mr-1">#</span><span className="text-white font-semibold">{children}</span></div>;
const H2 = ({ children }: { children: React.ReactNode }) => <div className="mb-3 mt-8"><span className="text-stone-700 select-none mr-1">##</span><span className="text-[#FFE45C] font-semibold">{children}</span></div>;
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
                    <button onClick={handleCopy} className="flex items-center gap-2 text-xs px-3 py-1.5 rounded border border-stone-700 hover:border-[#FFE45C] hover:text-[#FFE45C] transition-colors text-stone-400 whitespace-nowrap">
                        {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> <span className="hidden sm:inline">Copy as Text</span><span className="sm:hidden">Copy</span></>}
                    </button>
                    <div className="flex items-center gap-0.5 bg-stone-900 rounded-full p-1 border border-stone-800">
                        <button onClick={onToggle} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-stone-500 hover:text-stone-300 transition-colors text-xs"><User size={11} /> Human</button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFE45C] text-[#111] font-semibold text-xs"><Bot size={11} /> Machine</button>
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
                        return <div key={i} className="flex gap-4"><span className="text-[#FFE45C] font-bold w-20 flex-shrink-0">{val}</span><span className="text-stone-400">{stat.label}</span></div>;
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
                            {h.links.devpost && <MLink href={h.links.devpost}>Devpost →</MLink>}
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

const App: React.FC = () => {
    // Initialise from the URL so deep links and refreshes keep their page
    // (the hash-sync effect below would otherwise strip the hash on first render).
    const [activeItemId, setActiveItemId] = useState<string | null>(() => {
        const id = window.location.hash.match(/^#project=(.+)$/)?.[1];
        return id && [...papers, ...projects].some(p => p.id === id) ? id : null;
    });
    const [showDashboard, setShowDashboard] = useState(() => window.location.hash === '#dashboard');
    const [machineMode, setMachineMode] = useState(false);

    const allItems = [...papers, ...projects];

    // Remember where the visitor was on the home page so Back returns there.
    // Captured at the moment of leaving: once the detail view renders, the page
    // is shorter and the browser clamps scrollY.
    const homeScroll = useRef(0);
    const viewRef = useRef({ activeItemId, showDashboard });
    viewRef.current = { activeItemId, showDashboard };
    const saveScroll = () => {
        if (!viewRef.current.activeItemId && !viewRef.current.showDashboard) homeScroll.current = window.scrollY;
    };

    // Expose the portfolio to in-browser AI agents via WebMCP (progressive
    // enhancement — no-op in browsers/agents without support). The setters are
    // stable, so the tool layer registers once for the app's lifetime.
    useWebMCP((id: string) => { saveScroll(); setShowDashboard(false); setActiveItemId(id); });

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
            saveScroll();
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

    // New page: start at the top. Back on the home page: return to where we were.
    useLayoutEffect(() => {
        const onHome = !activeItemId && !showDashboard;
        window.scrollTo({ top: onHome ? homeScroll.current : 0, behavior: 'instant' });
    }, [activeItemId, showDashboard]);

    const activeItem = allItems.find(p => p.id === activeItemId);

    if (showDashboard) {
        return (
            <Suspense fallback={<div className="min-h-screen bg-[#FAFAF8]" />}>
                <Dashboard onBack={() => setShowDashboard(false)} />
            </Suspense>
        );
    }
    if (!activeItem && machineMode) return <MachineMode onToggle={() => setMachineMode(false)} />;

    if (!activeItem) {
        return <Home machineMode={machineMode} onToggleMode={() => setMachineMode(m => !m)} onOpenDashboard={() => { saveScroll(); setShowDashboard(true); }} />;
    }

    return <Detail key={activeItem.id} item={activeItem} siblings={activeItem.type === 'project' ? projects : papers} onBack={() => setActiveItemId(null)} />;
};

export default App;
