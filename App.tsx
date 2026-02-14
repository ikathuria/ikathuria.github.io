
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { HeroScene, AbstractImpactScene } from './components/QuantumScene';
import { FeatureSelectionChart, DualStreamPipeline, FuzzyLogicCurves, AIHierarchyVenn, AudioWaveform, NetworkGraph, ConfidenceMeter, DepthGrid } from './components/Diagrams';
import { ArrowDown, Menu, X, ArrowLeft, ArrowRight, ExternalLink, GraduationCap, Briefcase, Code, Terminal, Database, Cloud, Github, Linkedin, Mail, FileText, Cpu, Layers, Badge, Globe } from 'lucide-react';
import { papers, projects, resume, PortfolioItem } from './data';

// --- COMPONENTS ---

const AuthorCard = ({ name, role, delay, themeColor }: { name: string, role: string, delay: string, themeColor: string }) => {
    return (
        <div className="flex flex-col group animate-fade-in-up items-center p-8 bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-xs" style={{ animationDelay: delay, borderColor: 'transparent' }}>
            <div className="group-hover:border-opacity-100 border border-transparent transition-all duration-300 rounded-xl absolute inset-0 pointer-events-none" style={{ borderColor: themeColor, opacity: 0.3 }}></div>
            <h3 className="font-serif text-2xl text-stone-900 text-center mb-3 relative z-10">{name}</h3>
            <div className="w-12 h-0.5 mb-4 opacity-60" style={{ backgroundColor: themeColor }}></div>
            <p className="text-xs text-stone-500 font-bold uppercase tracking-widest text-center leading-relaxed relative z-10">{role}</p>
        </div>
    );
};

const PaperCard = ({ item, onClick }: { item: PortfolioItem; onClick: () => void }) => {
    return (
        <div
            onClick={onClick}
            className="group cursor-pointer bg-white rounded-2xl p-8 border border-stone-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden h-full flex flex-col"
        >
            <div className="absolute top-0 left-0 w-2 h-full transition-all duration-300" style={{ backgroundColor: item.metadata.themeColor }}></div>
            <div className="pl-6 flex flex-col h-full">
                <div className="text-xs font-bold tracking-widest text-stone-400 uppercase mb-4 group-hover:text-stone-600 transition-colors">
                    {item.metadata.venue} • {item.metadata.date}
                </div>
                <h3 className="font-serif text-2xl text-stone-900 mb-4 leading-tight group-hover:underline decoration-1 underline-offset-4 decoration-stone-300">
                    {item.metadata.title}
                </h3>
                <p className="text-stone-600 leading-relaxed mb-6 flex-grow">
                    {item.metadata.subtitle}
                </p>
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors mt-auto" style={{ color: item.metadata.themeColor }}>
                    Explore {item.type === 'research' ? 'Research' : 'Project'} <ArrowRight size={16} />
                </div>
            </div>
        </div>
    )
}

const CodeTerminal = ({ code, color }: { code: string, color: string }) => {
    return (
        <div className="w-full max-w-2xl bg-stone-900 rounded-lg shadow-2xl overflow-hidden border border-stone-800 font-mono text-xs md:text-sm my-8">
            <div className="bg-stone-800 px-4 py-2 flex items-center gap-2 border-b border-stone-700">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 text-stone-400 opacity-60">model_architecture.py</div>
            </div>
            <div className="p-6 text-stone-300 overflow-x-auto">
                <pre>
                    <code>{code}</code>
                </pre>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-50" style={{ color: color }}></div>
        </div>
    )
}

const ResumeSection = () => {
    return (
        <section id="resume" className="py-24 bg-white border-t border-stone-200">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">EXPERIENCE & EDUCATION</div>
                    <h2 className="font-serif text-4xl md:text-5xl mb-4 text-stone-900">Resume</h2>
                    <div className="flex justify-center mt-6">
                        <a
                            href="/resume.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-3 bg-stone-900 text-white rounded-full text-sm font-medium hover:bg-stone-800 transition-colors inline-flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            <FileText size={18} /> View Resume PDF
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* LEFT COLUMN: Education & Skills */}
                    <div className="lg:col-span-4 space-y-12">
                        {/* Education */}
                        <div>
                            <h3 className="flex items-center gap-3 text-xl font-serif font-bold text-stone-900 mb-6">
                                <GraduationCap size={24} className="text-stone-400" />
                                Education
                            </h3>
                            <div className="space-y-8 border-l-2 border-stone-100 pl-6 ml-3">
                                {resume.education.map((edu, idx) => (
                                    <div key={idx} className="relative">
                                        <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-stone-300 border-2 border-white"></div>
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

                        {/* Skills */}
                        <div>
                            <h3 className="flex items-center gap-3 text-xl font-serif font-bold text-stone-900 mb-6">
                                <Code size={24} className="text-stone-400" />
                                Skills
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Generative     AI</div>
                                    <div className="flex flex-wrap gap-2">
                                        {resume.skills.genai.map(s => <span key={s} className="px-3 py-1 bg-stone-100 text-stone-600 text-sm rounded-md">{s}</span>)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">ML Frameworks</div>
                                    <div className="flex flex-wrap gap-2">
                                        {resume.skills.ml.map(s => <span key={s} className="px-3 py-1 bg-stone-100 text-stone-600 text-sm rounded-md">{s}</span>)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Programming</div>
                                    <div className="flex flex-wrap gap-2">
                                        {resume.skills.programming.map(s => <span key={s} className="px-3 py-1 bg-stone-100 text-stone-600 text-sm rounded-md">{s}</span>)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Cloud (AWS)</div>
                                    <div className="flex flex-wrap gap-2">
                                        {resume.skills.cloud.map(s => <span key={s} className="px-3 py-1 bg-stone-100 text-stone-600 text-sm rounded-md">{s}</span>)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Web & Data Science</div>
                                    <div className="flex flex-wrap gap-2">
                                        {resume.skills.data.map(s => <span key={s} className="px-3 py-1 bg-stone-100 text-stone-600 text-sm rounded-md">{s}</span>)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Certifications */}
                        <div>
                            <h3 className="flex items-center gap-3 text-xl font-serif font-bold text-stone-900 mb-6">
                                <Badge size={24} className="text-stone-400" />
                                Certifications
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">AI & ML</div>
                                    <div className="flex flex-wrap gap-2">
                                        {resume.skills.certs.map(s => <span key={s} className="px-3 py-1 bg-stone-100 text-stone-600 text-sm rounded-md">{s}</span>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Experience */}
                    <div className="lg:col-span-8">
                        <h3 className="flex items-center gap-3 text-xl font-serif font-bold text-stone-900 mb-8">
                            <Briefcase size={24} className="text-stone-400" />
                            Professional Experience
                        </h3>
                        <div className="space-y-12 border-l-2 border-stone-100 pl-8 ml-3">
                            {resume.experience.map((exp, idx) => (
                                <div key={idx} className="relative group">
                                    <div className="absolute -left-[39px] top-1.5 w-4 h-4 rounded-full bg-stone-200 border-4 border-white group-hover:bg-stone-800 transition-colors"></div>
                                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                                        <h4 className="text-lg font-bold text-stone-900">{exp.role}</h4>
                                        <span className="text-xs font-mono text-stone-400 uppercase bg-stone-50 px-2 py-1 rounded">{exp.period}</span>
                                    </div>
                                    <div className="text-sm font-semibold text-stone-500 mb-4">{exp.company}</div>
                                    <ul className="space-y-2">
                                        {exp.details.map((detail, i) => (
                                            <li key={i} className="text-stone-600 text-sm leading-relaxed flex items-start gap-2">
                                                <span className="mt-1.5 w-1 h-1 rounded-full bg-stone-400 flex-shrink-0"></span>
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
        </section>
    )
}

// --- MAIN APP ---

const App: React.FC = () => {
    const [activeItemId, setActiveItemId] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showTechnical, setShowTechnical] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const allItems = [...papers, ...projects];

    // --- NAVIGATION SYNC (Back Button Fix) ---

    // 1. Sync State -> Hash (When State Changes, Update URL)
    useEffect(() => {
        const currentHash = window.location.hash;
        let desiredHash = '';

        if (activeItemId) {
            desiredHash = `#project=${activeItemId}`;
        }

        if (currentHash !== desiredHash) {
            if (desiredHash) {
                window.location.hash = desiredHash;
            } else {
                // Remove hash without reloading (Home view)
                // We use pushState to add a history entry for "Home" if coming from a project
                // effectively allowing "Forward" to work too.
                // However, strictly clearing hash might simply be:
                if (currentHash) {
                    history.pushState(null, '', window.location.pathname);
                }
            }
        }
    }, [activeItemId]);

    // 2. Sync Hash -> State (When URL/Hash Changes, Update State)
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;

            if (hash.startsWith('#project=')) {
                const id = hash.replace('#project=', '');
                // Validate ID
                if (allItems.find(p => p.id === id)) {
                    setActiveItemId(id);
                }
            } else {
                // Default / Home
                setActiveItemId(null);
            }
        };

        // Handle initial load (e.g., reloading on #resume)
        handleHashChange();

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []); // Empty dependency array relying on stable setters

    // Reset scroll and technical view when changing items
    useEffect(() => {
        window.scrollTo(0, 0);
        setShowTechnical(false);
    }, [activeItemId]);


    const activeItem = allItems.find(p => p.id === activeItemId);



    // --- HOME VIEW (PORTFOLIO) ---
    if (!activeItem) {
        return (
            <div className="min-h-screen bg-[#F9F8F4] text-stone-800">
                <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#F9F8F4]/90 backdrop-blur-md shadow-sm py-4 text-stone-900' : 'bg-transparent py-8 text-white'}`}>
                    <div className="container mx-auto px-6 flex justify-between items-center">
                        <div className="font-serif font-bold text-2xl tracking-tight">
                            Ishani Kathuria<span className={`${scrolled ? 'text-stone-400' : 'text-stone-400/80'}`}>.research</span>
                        </div>
                        <div className={`hidden md:flex gap-8 text-sm font-medium ${scrolled ? 'text-stone-500' : 'text-stone-300'}`}>
                            <a href="#projects" className={`hover:text-stone-900 transition-colors ${!scrolled && 'hover:text-white'}`}>Projects</a>
                            <a href="#research" className={`hover:text-stone-900 transition-colors ${!scrolled && 'hover:text-white'}`}>Research</a>
                            <a href="#resume" className={`hover:text-stone-900 transition-colors ${!scrolled && 'hover:text-white'}`}>Resume</a>
                        </div>
                        <button className={`${scrolled ? 'text-stone-900' : 'text-white'} md:hidden`} onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu Overlay */}
                {menuOpen && (
                    <div className="fixed inset-0 z-40 bg-[#F9F8F4] flex flex-col items-center justify-center gap-8 text-xl font-serif animate-fade-in text-stone-900">
                        <a href="#projects" onClick={() => setMenuOpen(false)}>Projects</a>
                        <a href="#research" onClick={() => setMenuOpen(false)}>Research</a>
                        <a href="#resume" onClick={() => setMenuOpen(false)}>Resume</a>
                    </div>
                )}

                <header className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-stone-900 text-white">
                    {/* Hero Background */}
                    <div className="absolute inset-0">
                        <HeroScene themeColor="#fbbf24" />
                    </div>
                    <div className="absolute inset-0 bg-stone-900/60 z-0"></div>

                    <div className="relative z-10 container mx-auto px-6 text-center mt-12">
                        <h1 className="font-serif text-5xl md:text-8xl mb-6 tracking-tight text-white drop-shadow-lg">
                            Ishani Kathuria
                        </h1>
                        <div className="flex flex-wrap justify-center gap-3 md:gap-6 text-xs md:text-sm font-mono uppercase tracking-widest text-stone-300 mb-8">
                            <span>MS in AI @ Purdue</span>
                            <span className="text-stone-500">•</span>
                            <span>ex-SDE @ AWS</span>
                            <span className="text-stone-500">•</span>
                            <span>4x Published</span>
                        </div>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-stone-200 font-light leading-relaxed mb-12">
                            Passionate about bridging research and real-world applications by building Agentic AI systems, RAG pipelines, and optimizing large-scale cloud infrastructure.
                        </p>

                        <div className="flex justify-center gap-6 mb-16">
                            <a href="mailto:ishani@kathuria.net" className="p-3 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 transition-all text-white border border-white/10" aria-label="Email">
                                <Mail size={24} />
                            </a>
                            <a href="https://www.linkedin.com/in/ishani-kathuria" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 transition-all text-white border border-white/10" aria-label="LinkedIn">
                                <Linkedin size={24} />
                            </a>
                            <a href="https://github.com/ikathuria" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 transition-all text-white border border-white/10" aria-label="GitHub">
                                <Github size={24} />
                            </a>
                            <a href="#resume" className="p-3 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 transition-all text-white border border-white/10" aria-label="Resume">
                                <FileText size={24} />
                            </a>
                        </div>

                        <a href="#projects" className="animate-bounce inline-block text-stone-400 hover:text-white transition-colors cursor-pointer">
                            <ArrowDown size={32} />
                        </a>
                    </div>
                </header>

                <main className="container mx-auto px-6 pb-32 space-y-32 pt-24">

                    {/* Projects */}
                    <section id="projects">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="font-serif text-3xl text-stone-900">Selected Projects</h2>
                            <div className="h-px bg-stone-200 flex-grow"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {projects.map(project => (
                                <PaperCard key={project.id} item={project} onClick={() => setActiveItemId(project.id)} />
                            ))}
                        </div>
                    </section>

                    {/* Research Papers */}
                    <section id="research">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="font-serif text-3xl text-stone-900">Research Publications</h2>
                            <div className="h-px bg-stone-200 flex-grow"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {papers.map(paper => (
                                <PaperCard key={paper.id} item={paper} onClick={() => setActiveItemId(paper.id)} />
                            ))}
                        </div>
                    </section>

                    {/* Resume */}
                    <ResumeSection />

                </main>

                <footer className="bg-stone-900 text-stone-400 py-12 text-center text-sm">
                    <p>© 2024 Ishani Kathuria Research Portfolio. All rights reserved.</p>
                </footer>
            </div>
        )
    }

    // --- DETAIL VIEW (ITEM) ---
    const { metadata, narrative, authors, visuals, technical } = activeItem;

    const scrollToSection = (id: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        setMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
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
    }

    return (
        <div className="min-h-screen bg-[#F9F8F4] text-stone-800 selection:text-white" style={{ ['--theme-color' as any]: metadata.themeColor }}>
            <style>{`::selection { background-color: ${metadata.themeColor}; }`}</style>

            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#F9F8F4]/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <button
                        onClick={() => setActiveItemId(null)}
                        className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium text-sm tracking-wide uppercase">Back to Portfolio</span>
                    </button>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-stone-600">
                        <a href="#problem" onClick={scrollToSection('problem')} className="hover:opacity-70 transition-opacity cursor-pointer uppercase" style={{ color: metadata.themeColor }}>The Problem</a>
                        <a href="#innovation" onClick={scrollToSection('innovation')} className="hover:opacity-70 transition-opacity cursor-pointer uppercase" style={{ color: metadata.themeColor }}>Innovation</a>
                        <a href="#impact" onClick={scrollToSection('impact')} className="hover:opacity-70 transition-opacity cursor-pointer uppercase" style={{ color: metadata.themeColor }}>Impact</a>
                        {metadata.demoUrl && (
                            <a
                                href={metadata.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2 text-white rounded-full hover:opacity-90 transition-opacity shadow-sm cursor-pointer flex items-center gap-2"
                                style={{ backgroundColor: metadata.themeColor }}
                            >
                                <Globe size={14} /> Live Demo
                            </a>
                        )}
                        {metadata.githubUrl && (
                            <a
                                href={metadata.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2 text-white rounded-full hover:opacity-90 transition-opacity shadow-sm cursor-pointer flex items-center gap-2 bg-stone-900"
                            >
                                <Github size={14} /> View Code
                            </a>
                        )}
                        {metadata.link && (
                            <a
                                href={metadata.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2 text-white rounded-full hover:opacity-90 transition-opacity shadow-sm cursor-pointer flex items-center gap-2"
                                style={{ backgroundColor: metadata.themeColor }}
                            >
                                Read Paper <ExternalLink size={14} />
                            </a>
                        )}
                    </div>

                    <button className="md:hidden text-stone-900 p-2" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="fixed inset-0 z-40 bg-[#F9F8F4] flex flex-col items-center justify-center gap-8 text-xl font-serif animate-fade-in">
                    <button onClick={() => { setActiveItemId(null); setMenuOpen(false); }} className="text-stone-500 uppercase text-sm mb-8">Back to Portfolio</button>
                    <a href="#problem" onClick={scrollToSection('problem')} className="uppercase">The Problem</a>
                    <a href="#innovation" onClick={scrollToSection('innovation')} className="uppercase">Innovation</a>
                    {metadata.demoUrl && (
                        <a
                            href={metadata.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 text-white rounded-full shadow-lg cursor-pointer flex items-center gap-2"
                            style={{ backgroundColor: metadata.themeColor }}
                        >
                            <Globe size={18} /> Live Demo
                        </a>
                    )}
                    {metadata.githubUrl && (
                        <a
                            href={metadata.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 text-white rounded-full shadow-lg cursor-pointer bg-stone-900 flex items-center gap-2"
                        >
                            <Github size={18} /> View Code
                        </a>
                    )}
                    {metadata.link && (
                        <a
                            href={metadata.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 text-white rounded-full shadow-lg cursor-pointer"
                            style={{ backgroundColor: metadata.themeColor }}
                        >
                            Read Paper
                        </a>
                    )}
                </div>
            )}

            {/* Hero Section */}
            <header className="relative h-screen flex items-center justify-center overflow-hidden">
                <HeroScene themeColor={metadata.themeColor} />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(249,248,244,0.92)_0%,rgba(249,248,244,0.6)_50%,rgba(249,248,244,0.3)_100%)]" />

                <div className="relative z-10 container mx-auto px-6 text-center">
                    <div className="inline-block mb-4 px-3 py-1 border text-xs tracking-[0.2em] uppercase font-bold rounded-full backdrop-blur-sm bg-white/30" style={{ borderColor: metadata.themeColor, color: metadata.themeColor }}>
                        {metadata.venue} • {metadata.date}
                    </div>
                    <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium leading-tight mb-8 text-stone-900 drop-shadow-sm max-w-5xl mx-auto">
                        {metadata.title}
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-stone-700 font-light leading-relaxed mb-12 italic">
                        {metadata.subtitle}
                    </p>

                    <div className="flex justify-center">
                        <a href="#problem" onClick={scrollToSection('problem')} className="group flex flex-col items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors cursor-pointer">
                            <span>DISCOVER</span>
                            <span className="p-2 border border-stone-300 rounded-full group-hover:border-stone-900 transition-colors bg-white/50">
                                <ArrowDown size={16} />
                            </span>
                        </a>
                    </div>
                </div>
            </header>

            <main>
                {/* The Problem */}
                <section id="problem" className="py-24 bg-white">
                    <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                        <div className="md:col-span-4">
                            <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">The Challenge</div>
                            <h2 className="font-serif text-4xl mb-6 leading-tight text-stone-900">Identifying the Gap</h2>
                            <div className="w-16 h-1 mb-6" style={{ backgroundColor: metadata.themeColor }}></div>
                        </div>
                        <div className="md:col-span-8 text-lg text-stone-600 leading-relaxed space-y-6">
                            <p className="first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:mt-[-8px] first-letter:font-serif first-letter:font-bold" style={{ ['--first-letter-color' as any]: metadata.themeColor }}>
                                {narrative.problem}
                            </p>
                        </div>
                    </div>
                </section>

                {/* The Innovation & Visual */}
                <section id="innovation" className="py-24 bg-stone-50 border-t border-stone-100">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-xs font-bold tracking-widest uppercase rounded-full border border-stone-200 shadow-sm" style={{ color: metadata.themeColor }}>
                                        METHODOLOGY
                                    </div>

                                    {/* TECH SWITCHER for AI Engineering roles */}
                                    {technical && (
                                        <button
                                            onClick={() => setShowTechnical(!showTechnical)}
                                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide hover:text-stone-900 transition-colors"
                                            style={{ color: showTechnical ? metadata.themeColor : '#78716c' }}
                                        >
                                            <Layers size={14} />
                                            {showTechnical ? 'Show Concept' : 'Show Code'}
                                        </button>
                                    )}
                                </div>

                                <h2 className="font-serif text-4xl md:text-5xl mb-6 text-stone-900">The Approach</h2>
                                <p className="text-lg text-stone-600 mb-6 leading-relaxed">
                                    {narrative.innovation}
                                </p>

                                {/* Tech Stack List */}
                                {technical && (
                                    <div className="mt-8">
                                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Cpu size={14} />
                                            Tech Stack
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {technical.techStack.map(tech => (
                                                <span key={tech} className="px-3 py-1 bg-white border border-stone-200 text-stone-600 text-sm rounded-md shadow-sm">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-center w-full">
                                {showTechnical && technical?.codeSnippet ? (
                                    <CodeTerminal code={technical.codeSnippet} color={metadata.themeColor} />
                                ) : (
                                    renderDiagram()
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Impact */}
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
                            <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                                {narrative.impact}
                            </p>

                            <div className="p-6 bg-stone-50 border border-stone-200 rounded-lg border-l-4" style={{ borderLeftColor: metadata.themeColor }}>
                                <p className="font-serif italic text-xl text-stone-800 mb-4">
                                    "{metadata.title}"
                                </p>
                                <span className="text-sm font-bold text-stone-500 tracking-wider uppercase">— Published in {metadata.venue}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Authors / Team */}
                <section id="authors" className="py-24 bg-stone-100 border-t border-stone-200">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">CONTRIBUTORS</div>
                            <h2 className="font-serif text-3xl md:text-5xl mb-4 text-stone-900">Team & Roles</h2>
                        </div>

                        <div className="flex flex-wrap gap-8 justify-center items-center">
                            {authors.map((author, idx) => (
                                <AuthorCard
                                    key={idx}
                                    name={author.name}
                                    role={author.role}
                                    delay={`${idx * 0.1}s`}
                                    themeColor={metadata.themeColor}
                                />
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
                    <button
                        onClick={() => setActiveItemId(null)}
                        className="text-stone-500 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest"
                    >
                        Back to Portfolio
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default App;
