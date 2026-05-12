import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Github, Star, GitFork, AlertCircle,
    Search, Clock, Check, Terminal
} from 'lucide-react';
import repoDescriptions from '../public/repo-descriptions.json';

// --- TYPES ---

interface Milestone {
    title: string;
    done: number;
    total: number;
}

interface PlanData {
    milestones: Milestone[];
    totalDone: number;
    totalTasks: number;
}

type RepoStatus = 'active' | 'stale' | 'inactive' | 'archived';
type FilterTab = 'all' | 'active' | 'stale' | 'archived';

interface Repo {
    id: number;
    name: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    pushed_at: string;
    archived: boolean;
    html_url: string;
    planData?: PlanData | null;
    planLoading?: boolean;
}

// --- HELPERS ---

function parsePlan(content: string): PlanData {
    const sections = content.split(/^## Milestone/m).slice(1);
    const milestones: Milestone[] = sections.map(section => {
        const titleMatch = section.match(/^[^\n]*/);
        const title = titleMatch ? titleMatch[0].replace(/^#+\s*/, '').trim() : 'Milestone';
        const done = (section.match(/- \[x\]/gi) ?? []).length;
        const todo = (section.match(/- \[ \]/g) ?? []).length;
        return { title, done, total: done + todo };
    });
    const totalDone = milestones.reduce((s, m) => s + m.done, 0);
    const totalTasks = milestones.reduce((s, m) => s + m.total, 0);
    return { milestones, totalDone, totalTasks };
}

function getStatus(repo: Repo): RepoStatus {
    if (repo.archived) return 'archived';
    const daysSince = (Date.now() - new Date(repo.pushed_at).getTime()) / 86_400_000;
    if (daysSince <= 14) return 'active';
    if (daysSince <= 90) return 'stale';
    return 'inactive';
}

function relativeTime(dateStr: string): string {
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
    if (days === 0) return 'today';
    if (days === 1) return '1d ago';
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months === 1) return '1mo ago';
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}yr ago`;
}

const STATUS_CONFIG: Record<RepoStatus, { label: string; color: string; bg: string; text: string }> = {
    active:   { label: 'Active',   color: '#22c55e', bg: '#f0fdf4', text: '#15803d' },
    stale:    { label: 'Stale',    color: '#f97316', bg: '#fff7ed', text: '#c2410c' },
    inactive: { label: 'Inactive', color: '#78716c', bg: '#f5f5f4', text: '#57534e' },
    archived: { label: 'Archived', color: '#a8a29e', bg: '#f5f5f4', text: '#78716c' },
};

const LOCK_IN_CMD = `claude "Read PLAN.md, find the first incomplete task, and continue. Mark tasks done as you go. Commit when a milestone is complete."`;

// --- REPO CARD ---

const RepoCard = ({ repo, description }: { repo: Repo; description: string | null }) => {
    const [copied, setCopied] = useState(false);
    const status = getStatus(repo);
    const cfg = STATUS_CONFIG[status];
    const plan = repo.planData;
    const progress = plan && plan.totalTasks > 0 ? (plan.totalDone / plan.totalTasks) * 100 : 0;

    // Strip trailing "[needs review]" for display; keep flag for badge
    const needsReview = description?.endsWith('[needs review]') ?? false;
    const descText = needsReview ? description!.replace(' [needs review]', '') : description;

    const handleLockIn = async () => {
        try {
            await navigator.clipboard.writeText(LOCK_IN_CMD);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // clipboard unavailable — silently ignore
        }
    };

    return (
        <motion.article
            className="group bg-white rounded-2xl p-8 border border-stone-200 relative overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(15,23,42,0.10)' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.15 }}
        >
            {/* Left accent bar */}
            <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: cfg.color }} />

            <div className="pl-5 flex flex-col h-full">
                {/* Title + status pill */}
                <div className="flex items-start justify-between gap-3 mb-2">
                    <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-serif text-xl text-stone-900 hover:underline decoration-1 underline-offset-4 decoration-stone-300 line-clamp-1 leading-snug"
                    >
                        {repo.name}
                    </a>
                    <span
                        className="flex-shrink-0 px-2.5 py-0.5 text-xs font-bold rounded-full uppercase tracking-wider"
                        style={{ backgroundColor: cfg.bg, color: cfg.text }}
                    >
                        {cfg.label}
                    </span>
                </div>

                {/* Language + time */}
                <div className="flex items-center gap-3 text-xs text-stone-400 mb-3">
                    {repo.language && <span className="font-mono">{repo.language}</span>}
                    <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {relativeTime(repo.pushed_at)}
                    </span>
                </div>

                {/* Description — custom text shown inline; needs-review badge when flagged */}
                {descText && (
                    <div className="mb-4 flex-grow">
                        <p className="text-stone-600 text-sm leading-relaxed">{descText}</p>
                        {needsReview && (
                            <span className="mt-2 inline-block text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                needs review
                            </span>
                        )}
                    </div>
                )}

                    {/* Stats */}
                    {(repo.stargazers_count > 0 || repo.forks_count > 0 || repo.open_issues_count > 0) && (
                        <div className="flex items-center gap-4 text-xs text-stone-400 mb-4">
                            {repo.stargazers_count > 0 && (
                                <span className="flex items-center gap-1"><Star size={12} />{repo.stargazers_count}</span>
                            )}
                            {repo.forks_count > 0 && (
                                <span className="flex items-center gap-1"><GitFork size={12} />{repo.forks_count}</span>
                            )}
                            {repo.open_issues_count > 0 && (
                                <span className="flex items-center gap-1"><AlertCircle size={12} />{repo.open_issues_count}</span>
                            )}
                        </div>
                    )}

                    {/* PLAN.md loading skeleton */}
                    {repo.planLoading && (
                        <div className="mb-4 space-y-2">
                            <div className="h-2 bg-stone-100 rounded-full animate-pulse w-24" />
                            <div className="h-1.5 bg-stone-100 rounded-full animate-pulse" />
                        </div>
                    )}

                    {/* PLAN.md progress */}
                    {!repo.planLoading && plan && plan.totalTasks > 0 && (
                        <div className="mb-4 space-y-2">
                            <div className="flex items-center justify-between text-xs text-stone-500">
                                <span className="font-bold uppercase tracking-wider">Plan</span>
                                <span>{plan.totalDone}/{plan.totalTasks} tasks</span>
                            </div>
                            <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{ width: `${progress}%`, backgroundColor: cfg.color }}
                                />
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {plan.milestones.map((m, i) => (
                                    <span
                                        key={i}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-50 border border-stone-200 text-stone-500 text-xs rounded-md"
                                    >
                                        <span
                                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: m.total > 0 && m.done === m.total ? '#22c55e' : cfg.color }}
                                        />
                                        <span className="truncate max-w-[100px]">{m.title}</span>
                                        <span className="text-stone-300">·</span>
                                        {m.done}/{m.total}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {!repo.planLoading && plan === null && (
                        <p className="mb-4 text-xs text-stone-300 italic">no plan yet</p>
                    )}

                    {/* Footer */}
                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-stone-100">
                        <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 transition-colors"
                        >
                            <Github size={13} /> GitHub
                        </a>
                        <button
                            onClick={handleLockIn}
                            title="Copy Claude Code command to clipboard"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-full hover:bg-stone-700 transition-colors"
                        >
                            {copied ? <Check size={12} /> : <Terminal size={12} />}
                            {copied ? 'Copied!' : 'Lock in'}
                        </button>
                    </div>
                </div>
            </motion.article>
    );
};

// --- SKELETON CARD ---

const SkeletonCard = () => (
    <div className="bg-white rounded-2xl p-8 border border-stone-200 animate-pulse space-y-3 h-56">
        <div className="h-4 bg-stone-100 rounded w-2/3" />
        <div className="h-3 bg-stone-100 rounded w-1/4" />
        <div className="h-3 bg-stone-100 rounded" />
        <div className="h-3 bg-stone-100 rounded w-4/5" />
    </div>
);

// --- MAIN DASHBOARD ---

const Dashboard = ({ onBack }: { onBack: () => void }) => {
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterTab>('all');
    const [search, setSearch] = useState('');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await fetch(
                    'https://api.github.com/users/ikathuria/repos?type=public&per_page=100&sort=pushed'
                );
                if (!res.ok) throw new Error(`GitHub API responded with ${res.status}`);
                const data: Repo[] = await res.json();

                setRepos(data.map(r => ({ ...r, planData: undefined, planLoading: true })));
                setLoading(false);

                // Fan out PLAN.md fetches in parallel
                await Promise.allSettled(
                    data.map(async repo => {
                        try {
                            const pr = await fetch(
                                `https://raw.githubusercontent.com/ikathuria/${repo.name}/main/PLAN.md`
                            );
                            const planData = pr.ok ? parsePlan(await pr.text()) : null;
                            setRepos(prev =>
                                prev.map(r => r.id === repo.id ? { ...r, planData, planLoading: false } : r)
                            );
                        } catch {
                            setRepos(prev =>
                                prev.map(r => r.id === repo.id ? { ...r, planData: null, planLoading: false } : r)
                            );
                        }
                    })
                );
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load repositories');
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    const filtered = repos.filter(repo => {
        const status = getStatus(repo);
        const matchesFilter =
            filter === 'all' ||
            filter === status ||
            (filter === 'archived' && repo.archived);
        const q = search.toLowerCase();
        const matchesSearch =
            !q ||
            repo.name.toLowerCase().includes(q) ||
            (repo.description?.toLowerCase().includes(q) ?? false);
        return matchesFilter && matchesSearch;
    });

    const counts: Record<FilterTab, number> = {
        all:      repos.length,
        active:   repos.filter(r => getStatus(r) === 'active').length,
        stale:    repos.filter(r => getStatus(r) === 'stale').length,
        archived: repos.filter(r => getStatus(r) === 'archived').length,
    };

    const filterTabs: { key: FilterTab; label: string }[] = [
        { key: 'all',      label: 'All' },
        { key: 'active',   label: 'Active' },
        { key: 'stale',    label: 'Stale' },
        { key: 'archived', label: 'Archived' },
    ];

    return (
        <div className="min-h-screen bg-[#F9F8F4] text-stone-800">
            {/* Nav */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#F9F8F4]/90 backdrop-blur-md shadow-sm py-4' : 'bg-[#F9F8F4] py-6 border-b border-stone-100'}`}>
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium text-sm tracking-wide uppercase">Portfolio</span>
                    </button>

                    <span className="font-serif font-bold text-xl text-stone-900 tracking-tight">
                        Project Dashboard
                    </span>

                    <a
                        href="https://github.com/ikathuria"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub profile"
                        className="p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-all"
                    >
                        <Github size={20} />
                    </a>
                </div>
            </nav>

            <main className="container mx-auto px-6 pt-28 pb-24">
                {/* Page header */}
                <motion.div
                    className="mb-10"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">
                        GitHub · ikathuria
                    </div>
                    <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-3">Project Tracker</h1>
                    <p className="text-stone-500 max-w-xl leading-relaxed">
                        Live view of all public repos with push-date status and PLAN.md milestone progress.
                    </p>
                </motion.div>

                {/* Search + filters */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-3 mb-8"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="relative max-w-xs w-full">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search repos…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-full text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all"
                        />
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        {filterTabs.map(f => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                    filter === f.key
                                        ? 'bg-stone-900 text-white shadow-sm'
                                        : 'bg-white border border-stone-200 text-stone-500 hover:border-stone-400 hover:text-stone-700'
                                }`}
                            >
                                {f.label}
                                <span className={`ml-1.5 text-xs ${filter === f.key ? 'text-stone-300' : 'text-stone-400'}`}>
                                    {counts[f.key]}
                                </span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Grid */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                )}

                {error && (
                    <div className="text-center py-20">
                        <p className="text-stone-500 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-sm text-stone-400 underline underline-offset-2 hover:text-stone-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <div className="text-center py-20 text-stone-400 font-serif text-xl">
                        No repositories match your search.
                    </div>
                )}

                {!loading && !error && filtered.length > 0 && (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {filtered.map(repo => (
                            <RepoCard
                                key={repo.id}
                                repo={repo}
                                description={
                                    (repoDescriptions as Record<string, string>)[repo.name]
                                    ?? repo.description
                                    ?? null
                                }
                            />
                        ))}
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
