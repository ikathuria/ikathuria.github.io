
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { HeroScene, AbstractImpactScene } from './components/QuantumScene';
import { FeatureSelectionChart, DualStreamPipeline, FuzzyLogicCurves, AIHierarchyVenn, AudioWaveform, NetworkGraph, ConfidenceMeter, DepthGrid } from './components/Diagrams';
import { ArrowDown, Menu, X, ArrowLeft, ArrowRight, ExternalLink, GraduationCap, Briefcase, Code, Github, Linkedin, Mail, FileText, Cpu, Layers, Badge, Globe, User, Bot, Copy, Check } from 'lucide-react';
import { papers, projects, resume, PortfolioItem } from './data';
import Dashboard from './components/Dashboard';

const BRAND = '#3B5BDB';

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

const PaperCard = ({ item, onClick }: { item: PortfolioItem; onClick: () => void }) => (
    <motion.article
        onClick={onClick}
        className="group cursor-pointer bg-white rounded-2xl p-8 border border-stone-200 relative overflow-hidden h-full flex flex-col"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8, boxShadow: '0 24px 60px rgba(15,23,42,0.12)' }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.3 }}
    >
        <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: item.metadata.themeColor }} />
        <div className="pl-6 flex flex-col h-full">
            <div className="text-xs font-bold tracking-widest text-stone-400 uppercase mb-4 group-hover:text-stone-600 transition-colors">
                {item.metadata.venue} · {item.metadata.date}
            </div>
            <h3 className="font-serif text-2xl text-stone-900 mb-4 leading-tight group-hover:underline decoration-1 underline-offset-4 decoration-stone-300">
                {item.metadata.title}
            </h3>
            <p className="text-stone-600 leading-relaxed mb-6 flex-grow">{item.metadata.subtitle}</p>
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mt-auto" style={{ color: item.metadata.themeColor }}>
                Explore {item.type === 'research' ? 'Research' : 'Project'} <ArrowRight size={16} />
            </div>
        </div>
    </motion.article>
);

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
            className="text-center py-10 px-4"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.08 }}
        >
            <div className="text-3xl md:text-4xl font-bold mb-2 font-mono" style={{ color: BRAND }}>
                {displayText}
            </div>
            <div className="text-xs text-stone-500 leading-snug max-w-[120px] mx-auto">{stat.label}</div>
        </motion.div>
    );
};

const ImpactStrip = () => (
    <section className="border-y border-stone-200 bg-white">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-stone-100">
                {IMPACT_STATS.map((stat, i) => <StatCard key={i} stat={stat} index={i} />)}
            </div>
        </div>
    </section>
);

const AboutSection = () => (
    <motion.section
        className="py-24"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
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
                        I'm an AI/ML engineer who spent two years shipping production LLM systems at AWS — log summarization tools, internal chatbots, automated deployment pipelines across 15+ distributed services — before returning to academia to research the harder questions.
                    </p>
                    <p>
                        Now at Purdue, I focus on what makes AI systems trustworthy: retrieval quality, hallucination reduction, safety evaluation. I've published four peer-reviewed papers (IEEE + Springer) and co-founded an initiative that helped 200+ students build their first ML projects.
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

const MachineMode = ({ onToggle }: { onToggle: () => void }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(MACHINE_CLIPBOARD_TEXT);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const MLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
        <>
            <span className="text-stone-600 select-none">[</span>
            <a
                href={href}
                target={href.startsWith('http') || href.startsWith('mailto') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-indigo-400 hover:underline underline-offset-2"
            >
                {children}
            </a>
            <span className="text-stone-600 select-none">]</span>
        </>
    );

    const H1 = ({ children }: { children: React.ReactNode }) => (
        <div className="mb-3 mt-1">
            <span className="text-stone-700 select-none mr-1">#</span>
            <span className="text-white font-semibold">{children}</span>
        </div>
    );

    const H2 = ({ children }: { children: React.ReactNode }) => (
        <div className="mb-3 mt-8">
            <span className="text-stone-700 select-none mr-1">##</span>
            <span className="text-indigo-400 font-semibold">{children}</span>
        </div>
    );

    const H3 = ({ children }: { children: React.ReactNode }) => (
        <div className="mb-1 mt-5">
            <span className="text-stone-700 select-none mr-1">###</span>
            <span className="text-stone-200 font-semibold">{children}</span>
        </div>
    );

    const Hr = () => <div className="border-t border-stone-800 my-8" />;

    return (
        <div className="min-h-screen bg-[#0D0D0F] font-mono text-sm">
            {/* Top bar */}
            <div className="sticky top-0 z-50 bg-[#0D0D0F]/95 backdrop-blur-sm border-b border-stone-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs text-stone-500 ml-2">ishani.kathuria.net</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 text-xs px-3 py-1.5 rounded border border-stone-700 hover:border-indigo-500 hover:text-indigo-400 transition-colors text-stone-400"
                    >
                        {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy as Text</>}
                    </button>
                    <div className="flex items-center gap-0.5 bg-stone-900 rounded-full p-1 border border-stone-800">
                        <button onClick={onToggle} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-stone-500 hover:text-stone-300 transition-colors text-xs">
                            <User size={11} /> Human
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600 text-white font-semibold text-xs">
                            <Bot size={11} /> Machine
                        </button>
                    </div>
                </div>
            </div>

            {/* Document body */}
            <div className="max-w-3xl mx-auto px-6 py-12 text-stone-300 leading-relaxed text-xs">

                {/* Header */}
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
                    <MLink href="mailto:ishani@kathuria.net?subject=Resume%20Request">Request Resume</MLink>
                </div>

                <Hr />

                <H2>Impact</H2>
                <div className="space-y-1.5 mb-2">
                    {IMPACT_STATS.map((stat, i) => {
                        const val = stat.displayValue ?? `${stat.prefix}${stat.numericEnd}${stat.suffix}`;
                        return (
                            <div key={i} className="flex gap-4">
                                <span className="text-indigo-400 font-bold w-20 flex-shrink-0">{val}</span>
                                <span className="text-stone-400">{stat.label}</span>
                            </div>
                        );
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
                        {project.technical && (
                            <p className="text-stone-600 mb-2">Tech Stack: {project.technical.techStack.join(', ')}</p>
                        )}
                        <div className="flex flex-wrap gap-4 mb-2">
                            {project.metadata.githubUrl && <MLink href={project.metadata.githubUrl}>View Code →</MLink>}
                            {project.metadata.demoUrl && <MLink href={project.metadata.demoUrl}>Live Demo →</MLink>}
                            {project.metadata.link && <MLink href={project.metadata.link}>Read More →</MLink>}
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
                        {paper.metadata.link && (
                            <div className="mb-2"><MLink href={paper.metadata.link}>Read Paper →</MLink></div>
                        )}
                    </div>
                ))}

                <Hr />

                <H2>Experience</H2>
                {resume.experience.map((exp, idx) => (
                    <div key={idx}>
                        <H3>{exp.company}</H3>
                        <div className="text-stone-600 mb-2">{exp.role} · {exp.period}</div>
                        <ul className="space-y-1 mb-2">
                            {exp.details.map((d, i) => (
                                <li key={i} className="flex gap-2 text-stone-400">
                                    <span className="text-stone-700 flex-shrink-0">-</span>
                                    <span>{d}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <Hr />

                <H2>Education</H2>
                {resume.education.map((edu, idx) => (
                    <div key={idx} className="mb-4">
                        <span className="text-stone-200 font-semibold">{edu.degree}</span>
                        <span className="text-stone-600"> · {edu.school} · {edu.period}</span>
                        {edu.details.map((d, i) => (
                            <div key={i} className="text-stone-500 mt-0.5">{d}</div>
                        ))}
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

const ModePill = ({ machineMode, onToggle }: { machineMode: boolean; onToggle: () => void }) => (
    <div className={`flex items-center gap-0.5 rounded-full p-1 text-xs border transition-colors ${machineMode ? 'bg-stone-900 border-stone-700' : 'bg-stone-100 border-stone-200'}`}>
        <button
            onClick={() => machineMode && onToggle()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${!machineMode ? 'bg-white shadow text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-300'}`}
        >
            <User size={11} /> Human
        </button>
        <button
            onClick={() => !machineMode && onToggle()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${machineMode ? 'bg-indigo-600 text-white font-semibold' : 'text-stone-500 hover:text-stone-900'}`}
        >
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
        viewport={{ once: true, amount: 0.25 }}
    >
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">EXPERIENCE & EDUCATION</div>
                <h2 className="font-serif text-4xl md:text-5xl mb-4 text-stone-900">Resume</h2>
                <div className="flex justify-center mt-6">
                    <a
                        href="mailto:ishani@kathuria.net?subject=Resume%20Request"
                        className="px-8 py-3 rounded-full text-white text-sm font-medium hover:opacity-90 transition-all inline-flex items-center gap-2 shadow-lg hover:-translate-y-0.5"
                        style={{ backgroundColor: BRAND }}
                    >
                        <FileText size={18} /> Request Full Resume
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4 space-y-12">
                    <div>
                        <h3 className="flex items-center gap-3 text-xl font-serif font-bold text-stone-900 mb-6">
                            <GraduationCap size={24} className="text-stone-400" /> Education
                        </h3>
                        <div className="space-y-8 border-l-2 border-stone-100 pl-6 ml-3">
                            {resume.education.map((edu, idx) => (
                                <div key={idx} className="relative">
                                    <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: BRAND }} />
                                    <h4 className="font-bold text-stone-800">{edu.degree}</h4>
                                    <div className="text-sm text-stone-500 mb-1">{edu.school}, {edu.location}</div>
                                    <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-2">{edu.period}</div>
                                    <ul className="text-sm text-stone-600 list-disc list-inside space-y-1">
                                        {edu.details.map((d, i) => <li key={i}>{d}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="flex items-center gap-3 text-xl font-serif font-bold text-stone-900 mb-6">
                            <Code size={24} className="text-stone-400" /> Skills
                        </h3>
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
                                        {items.map(s => (
                                            <span key={s} className="px-3 py-1 text-sm rounded-md border border-stone-200 text-stone-600 bg-stone-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors cursor-default">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="flex items-center gap-3 text-xl font-serif font-bold text-stone-900 mb-6">
                            <Badge size={24} className="text-stone-400" /> Certifications
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {resume.skills.certs.map(s => (
                                <span key={s} className="px-3 py-1 text-sm rounded-md border text-stone-600 bg-stone-50" style={{ borderColor: BRAND + '55' }}>
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <h3 className="flex items-center gap-3 text-xl font-serif font-bold text-stone-900 mb-8">
                        <Briefcase size={24} className="text-stone-400" /> Professional Experience
                    </h3>
                    <div className="space-y-12 border-l-2 border-stone-100 pl-8 ml-3">
                        {resume.experience.map((exp, idx) => (
                            <div key={idx} className="relative group">
                                <div
                                    className="absolute -left-[39px] top-1.5 w-4 h-4 rounded-full border-4 border-white group-hover:scale-110 transition-transform"
                                    style={{ backgroundColor: idx === 0 ? BRAND : '#D1D5DB' }}
                                />
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
        const timer = setInterval(() => {
            setSubtitleIndex(i => (i + 1) % SUBTITLES.length);
        }, 3200);
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
            if (hash === '#dashboard') {
                setShowDashboard(true);
                setActiveItemId(null);
            } else if (hash.startsWith('#project=')) {
                const id = hash.replace('#project=', '');
                if (allItems.find(p => p.id === id)) {
                    setShowDashboard(false);
                    setActiveItemId(id);
                }
            } else {
                setShowDashboard(false);
                setActiveItemId(null);
            }
        };
        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        setShowTechnical(false);
    }, [activeItemId, showDashboard]);

    const activeItem = allItems.find(p => p.id === activeItemId);

    if (showDashboard) return <Dashboard onBack={() => setShowDashboard(false)} />;

    if (!activeItem && machineMode) {
        return <MachineMode onToggle={() => setMachineMode(false)} />;
    }

    // ── Home View ──────────────────────────────────────────────────────────────
    if (!activeItem) {
        return (
            <div className="min-h-screen bg-[#FAFAF8] text-stone-800">
                <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-full focus:bg-stone-900 focus:text-white">
                    Skip to main content
                </a>

                <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#FAFAF8]/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
                    <div className="container mx-auto px-6 flex justify-between items-center">
                        <div className={`font-serif font-bold text-xl tracking-tight ${scrolled ? 'text-stone-900' : 'text-white'}`}>
                            Ishani<span className={scrolled ? 'text-stone-400' : 'text-stone-400/80'}>.ai</span>
                        </div>
                        <div className={`hidden md:flex items-center gap-8 text-sm font-medium ${scrolled ? 'text-stone-500' : 'text-stone-300'}`}>
                            <a href="#projects" className={`hover:text-stone-900 transition-colors ${!scrolled && 'hover:text-white'}`}>Projects</a>
                            <a href="#research" className={`hover:text-stone-900 transition-colors ${!scrolled && 'hover:text-white'}`}>Research</a>
                            <a href="#resume" className={`hover:text-stone-900 transition-colors ${!scrolled && 'hover:text-white'}`}>Resume</a>
                            <button onClick={() => setShowDashboard(true)} className={`hover:text-stone-900 transition-colors ${!scrolled && 'hover:text-white'}`}>Dashboard</button>
                            <ModePill machineMode={machineMode} onToggle={() => setMachineMode(m => !m)} />
                        </div>
                        <button
                            className={`${scrolled ? 'text-stone-900' : 'text-white'} md:hidden`}
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle navigation menu"
                            aria-expanded={menuOpen}
                        >
                            {menuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </nav>

                {menuOpen && (
                    <div className="fixed inset-0 z-40 bg-[#FAFAF8] flex flex-col items-center justify-center gap-8 text-xl font-serif animate-fade-in text-stone-900">
                        <a href="#projects" onClick={() => setMenuOpen(false)}>Projects</a>
                        <a href="#research" onClick={() => setMenuOpen(false)}>Research</a>
                        <a href="#resume" onClick={() => setMenuOpen(false)}>Resume</a>
                        <button onClick={() => { setMenuOpen(false); setShowDashboard(true); }}>Dashboard</button>
                        <ModePill machineMode={machineMode} onToggle={() => { setMachineMode(m => !m); setMenuOpen(false); }} />
                    </div>
                )}

                {/* Hero */}
                <header className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0D0D1A] text-white">
                    <div className="absolute inset-0">
                        <HeroScene themeColor={BRAND} />
                    </div>
                    <div className="absolute inset-0 bg-[#0D0D1A]/60 z-0" />

                    <div className="relative z-10 container mx-auto px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-xs font-medium text-stone-200 mb-8"
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Open to internships & full-time opportunities
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="font-serif text-6xl md:text-9xl mb-6 tracking-tight text-white drop-shadow-lg"
                        >
                            Ishani Kathuria
                        </motion.h1>

                        <div className="h-8 mb-10 overflow-hidden flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={subtitleIndex}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{ duration: 0.45 }}
                                    className="text-stone-300 text-base md:text-xl font-light"
                                >
                                    {SUBTITLES[subtitleIndex]}
                                </motion.p>
                            </AnimatePresence>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-wrap justify-center gap-2 md:gap-4 text-xs font-mono uppercase tracking-widest text-stone-400 mb-10"
                        >
                            <span>MS Applied AI @ Purdue</span>
                            <span className="text-stone-600">·</span>
                            <span>ex-SDE @ AWS</span>
                            <span className="text-stone-600">·</span>
                            <span>4× Published (IEEE + Springer)</span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col sm:flex-row justify-center gap-4 mb-10"
                        >
                            <a href="#projects" className="px-7 py-3 rounded-full bg-white text-stone-900 text-sm font-semibold tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                View projects
                            </a>
                            <a href="#research" className="px-7 py-3 rounded-full border border-white/30 text-sm font-semibold text-stone-50 bg-white/10 hover:bg-white/15 hover:-translate-y-0.5 transition-all">
                                View publications
                            </a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="flex justify-center gap-4 mb-12"
                        >
                            {[
                                { href: 'mailto:ishani@kathuria.net', icon: <Mail size={20} />, label: 'Email' },
                                { href: 'https://www.linkedin.com/in/ishani-kathuria', icon: <Linkedin size={20} />, label: 'LinkedIn' },
                                { href: 'https://github.com/ikathuria', icon: <Github size={20} />, label: 'GitHub' },
                                { href: '#resume', icon: <FileText size={20} />, label: 'Resume' },
                            ].map(({ href, icon, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target={href.startsWith('http') ? '_blank' : undefined}
                                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 transition-all border border-white/10"
                                    aria-label={label}
                                >
                                    {icon}
                                </a>
                            ))}
                        </motion.div>

                        <a href="#about" className="animate-float-soft inline-block text-stone-500 hover:text-white transition-colors">
                            <ArrowDown size={28} />
                        </a>
                    </div>
                </header>

                <ImpactStrip />

                <main id="main" className="container mx-auto px-6 pb-32 space-y-32 pt-24">
                    <div id="about">
                        <AboutSection />
                    </div>

                    <motion.section
                        id="projects"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true, amount: 0.25 }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <h2 className="font-serif text-3xl text-stone-900">Selected Projects</h2>
                            <div className="h-px bg-stone-200 flex-grow" />
                        </div>
                        <p className="text-stone-500 mb-8 max-w-2xl">
                            Systems that translate research into production-ready tools — AI safety, retrieval, and multimodal understanding.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {projects.map(project => (
                                <PaperCard key={project.id} item={project} onClick={() => setActiveItemId(project.id)} />
                            ))}
                        </div>
                    </motion.section>

                    <motion.section
                        id="research"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.05 }}
                        viewport={{ once: true, amount: 0.25 }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <h2 className="font-serif text-3xl text-stone-900">Research Publications</h2>
                            <div className="h-px bg-stone-200 flex-grow" />
                        </div>
                        <p className="text-stone-500 mb-8 max-w-2xl">
                            Peer-reviewed work spanning healthcare, recommendation systems, and trustworthy AI.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {papers.map(paper => (
                                <PaperCard key={paper.id} item={paper} onClick={() => setActiveItemId(paper.id)} />
                            ))}
                        </div>
                    </motion.section>

                    <ResumeSection />
                </main>

                <footer className="bg-stone-900 text-stone-400 py-12 text-center text-sm">
                    <p>© {new Date().getFullYear()} Ishani Kathuria. All rights reserved.</p>
                </footer>
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
            case 'bar-chart': return <FeatureSelectionChart color={metadata.themeColor} />;
            case 'flow-chart': return <DualStreamPipeline color={metadata.themeColor} />;
            case 'fuzzy-curves': return <FuzzyLogicCurves color={metadata.themeColor} />;
            case 'venn-diagram': return <AIHierarchyVenn color={metadata.themeColor} />;
            case 'waveform': return <AudioWaveform color={metadata.themeColor} />;
            case 'network-graph': return <NetworkGraph color={metadata.themeColor} />;
            case 'confidence-meter': return <ConfidenceMeter color={metadata.themeColor} />;
            case 'depth-grid': return <DepthGrid color={metadata.themeColor} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAF8] text-stone-800 selection:text-white" style={{ ['--theme-color' as any]: metadata.themeColor }}>
            <style>{`::selection { background-color: ${metadata.themeColor}; }`}</style>

            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#FAFAF8]/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <button
                        onClick={() => setActiveItemId(null)}
                        className={`flex items-center gap-2 transition-colors ${scrolled ? 'text-stone-500 hover:text-stone-900' : 'text-stone-300 hover:text-white'}`}
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium text-sm tracking-wide uppercase">Back</span>
                    </button>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
                        {(['problem', 'innovation', 'impact'] as const).map(sec => (
                            <a
                                key={sec}
                                href={`#${sec}`}
                                onClick={scrollToSection(sec)}
                                className={`uppercase transition-colors ${scrolled ? 'hover:opacity-70' : 'text-stone-300 hover:text-white'}`}
                                style={scrolled ? { color: metadata.themeColor } : {}}
                            >
                                {sec}
                            </a>
                        ))}
                        {metadata.demoUrl && (
                            <a href={metadata.demoUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2 text-white rounded-full hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2" style={{ backgroundColor: metadata.themeColor }}>
                                <Globe size={14} /> Live Demo
                            </a>
                        )}
                        {metadata.githubUrl && (
                            <a href={metadata.githubUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2 text-white rounded-full hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2 bg-stone-900">
                                <Github size={14} /> View Code
                            </a>
                        )}
                        {metadata.link && (
                            <a href={metadata.link} target="_blank" rel="noopener noreferrer" className="px-5 py-2 text-white rounded-full hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2" style={{ backgroundColor: metadata.themeColor }}>
                                Read Paper <ExternalLink size={14} />
                            </a>
                        )}
                    </div>
                    <button className={`md:hidden p-2 transition-colors ${scrolled ? 'text-stone-900' : 'text-white'}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
                        {menuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {menuOpen && (
                <div className="fixed inset-0 z-40 bg-[#0D0D1A] flex flex-col items-center justify-center gap-8 text-xl font-serif animate-fade-in text-white">
                    <button onClick={() => { setActiveItemId(null); setMenuOpen(false); }} className="text-stone-400 uppercase text-sm mb-4 flex items-center gap-2"><ArrowLeft size={16} /> Back to Portfolio</button>
                    <a href="#problem" onClick={scrollToSection('problem')} className="uppercase text-stone-200 hover:text-white transition-colors">Problem</a>
                    <a href="#innovation" onClick={scrollToSection('innovation')} className="uppercase text-stone-200 hover:text-white transition-colors">Innovation</a>
                    <a href="#impact" onClick={scrollToSection('impact')} className="uppercase text-stone-200 hover:text-white transition-colors">Impact</a>
                    {metadata.demoUrl && <a href={metadata.demoUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 text-white rounded-full shadow-lg flex items-center gap-2" style={{ backgroundColor: metadata.themeColor }}><Globe size={18} /> Live Demo</a>}
                    {metadata.githubUrl && <a href={metadata.githubUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 text-white rounded-full shadow-lg flex items-center gap-2 bg-stone-700"><Github size={18} /> View Code</a>}
                    {metadata.link && <a href={metadata.link} target="_blank" rel="noopener noreferrer" className="px-6 py-3 text-white rounded-full shadow-lg flex items-center gap-2" style={{ backgroundColor: metadata.themeColor }}>Read Paper <ExternalLink size={18} /></a>}
                </div>
            )}

            <header className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0D0D1A]">
                <div className="absolute inset-0">
                    <HeroScene themeColor={metadata.themeColor} />
                </div>
                <div className="absolute inset-0 bg-[#0D0D1A]/55 z-0" />
                <div className="relative z-10 container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border text-xs tracking-[0.18em] uppercase font-bold backdrop-blur-sm bg-white/10"
                        style={{ borderColor: metadata.themeColor + '80', color: metadata.themeColor }}
                    >
                        {metadata.venue} · {metadata.date}
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium leading-tight mb-8 text-white drop-shadow-lg max-w-5xl mx-auto"
                    >
                        {metadata.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="max-w-2xl mx-auto text-lg md:text-xl text-stone-300 font-light leading-relaxed mb-12 italic"
                    >
                        {metadata.subtitle}
                    </motion.p>
                    <motion.a
                        href="#problem"
                        onClick={scrollToSection('problem')}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="group inline-flex flex-col items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <span>Discover</span>
                        <span className="p-2 border border-stone-600 rounded-full group-hover:border-white transition-colors bg-white/5 animate-float-soft">
                            <ArrowDown size={16} />
                        </span>
                    </motion.a>
                </div>
            </header>

            <main id="main">
                <section id="problem" className="py-24 bg-white">
                    <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                        <div className="md:col-span-4">
                            <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">The Challenge</div>
                            <h2 className="font-serif text-4xl mb-6 leading-tight text-stone-900">Identifying the Gap</h2>
                            <div className="w-16 h-1 mb-6" style={{ backgroundColor: metadata.themeColor }} />
                        </div>
                        <div className="md:col-span-8 text-lg text-stone-600 leading-relaxed">
                            <p>{narrative.problem}</p>
                        </div>
                    </div>
                </section>

                <section id="innovation" className="py-24 bg-stone-50 border-t border-stone-100">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-xs font-bold tracking-widest uppercase rounded-full border border-stone-200 shadow-sm" style={{ color: metadata.themeColor }}>
                                        METHODOLOGY
                                    </div>
                                    {technical && (
                                        <button onClick={() => setShowTechnical(!showTechnical)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide hover:text-stone-900 transition-colors" style={{ color: showTechnical ? metadata.themeColor : '#78716c' }}>
                                            <Layers size={14} />
                                            {showTechnical ? 'Show Concept' : 'Show Code'}
                                        </button>
                                    )}
                                </div>
                                <h2 className="font-serif text-4xl md:text-5xl mb-6 text-stone-900">The Approach</h2>
                                <p className="text-lg text-stone-600 mb-6 leading-relaxed">{narrative.innovation}</p>
                                {technical && (
                                    <div className="mt-8">
                                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Cpu size={14} /> Tech Stack</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {technical.techStack.map(tech => (
                                                <span key={tech} className="px-3 py-1 bg-white border border-stone-200 text-stone-600 text-sm rounded-md shadow-sm">{tech}</span>
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

                <section id="impact" className="py-24 bg-white border-t border-stone-200">
                    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
                        <div className="md:col-span-5 relative min-h-[400px]">
                            <div className="absolute inset-0 bg-[#F5F4F0] rounded-xl overflow-hidden border border-stone-200 shadow-inner">
                                <AbstractImpactScene themeColor={metadata.themeColor} />
                            </div>
                        </div>
                        <div className="md:col-span-7 flex flex-col justify-center">
                            <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">REAL WORLD RESULTS</div>
                            <h2 className="font-serif text-4xl mb-6 text-stone-900">The Impact</h2>
                            <p className="text-lg text-stone-600 mb-8 leading-relaxed">{narrative.impact}</p>
                            <div className="p-6 bg-stone-50 border border-stone-200 rounded-lg border-l-4" style={{ borderLeftColor: metadata.themeColor }}>
                                <p className="font-serif italic text-xl text-stone-800 mb-4">"{metadata.title}"</p>
                                <span className="text-sm font-bold text-stone-500 tracking-wider uppercase">— Published in {metadata.venue}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="authors" className="py-24 bg-stone-100 border-t border-stone-200">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">CONTRIBUTORS</div>
                            <h2 className="font-serif text-3xl md:text-5xl mb-4 text-stone-900">Team & Roles</h2>
                        </div>
                        <div className="flex flex-wrap gap-8 justify-center">
                            {authors.map((author, idx) => (
                                <AuthorCard key={idx} name={author.name} role={author.role} delay={`${idx * 0.1}s`} themeColor={metadata.themeColor} />
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-stone-900 text-stone-400 py-16">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <div className="text-white font-serif font-bold text-2xl mb-2">{metadata.title}</div>
                        <p className="text-sm max-w-md">{metadata.subtitle}</p>
                    </div>
                    <button onClick={() => setActiveItemId(null)} className="text-stone-500 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest">
                        Back to Portfolio
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default App;
