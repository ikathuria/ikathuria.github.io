/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Github,
    Star,
    GitFork,
    AlertCircle,
    Search,
    Check,
    Terminal,
    X,
    RefreshCw,
    ChevronDown,
} from 'lucide-react';
import repoDescriptions from '../public/repo-descriptions.json';

// --- TYPES ---

interface Task {
    text: string;
    done: boolean;
}

interface Milestone {
    title: string;
    done: number;
    total: number;
    tasks: Task[];
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
    topics?: string[];
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    pushed_at: string;
    archived: boolean;
    html_url: string;
    default_branch: string;
    planData?: PlanData | null;
    planLoading?: boolean;
}

interface PlanSidebarProps {
    repo: Repo;
    plan: PlanData;
    onClose: () => void;
}

// --- HELPERS ---

function parsePlan(content: string): PlanData {
    const extractTasks = (section: string): Task[] =>
        (section.match(/- \[[ xX]\] .+/g) ?? []).map((line) => ({
            done: /^- \[[xX]\]/.test(line),
            text: line.replace(/^- \[[ xX]\] /, '').trim(),
        }));

    const buildMilestones = (sections: string[]): Milestone[] =>
        sections
            .map((section) => {
                const titleMatch = section.match(/^[^\n]*/);
                const title = titleMatch ? titleMatch[0].replace(/^#+\s*/, '').trim() : 'Milestone';
                const tasks = extractTasks(section);
                return {
                    title,
                    done: tasks.filter((t) => t.done).length,
                    total: tasks.length,
                    tasks,
                };
            })
            .filter((m) => m.total > 0);

    // Try ### headings first (e.g. "## Milestones / ### Milestone 1: ...")
    const h3Sections = content.split(/^### /m).slice(1);
    const h3Milestones = buildMilestones(h3Sections);
    if (h3Milestones.length > 0) {
        const totalDone = h3Milestones.reduce((s, m) => s + m.done, 0);
        const totalTasks = h3Milestones.reduce((s, m) => s + m.total, 0);
        return { milestones: h3Milestones, totalDone, totalTasks };
    }

    // Fall back to ## Milestone sections (exact word, avoids "## Milestones")
    const h2Sections = content.split(/^## Milestone\b/m).slice(1);
    const milestones = buildMilestones(h2Sections);
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

// --- STATUS ---
// Marker shapes carry the status too, so it never relies on color alone.

const STATUS_CONFIG: Record<RepoStatus, { label: string; marker: string }> = {
    active: { label: 'Active', marker: 'bg-hi border-ink' },
    stale: { label: 'Stale', marker: 'bg-paper-2 border-ink' },
    inactive: { label: 'Inactive', marker: 'bg-paper border-ink-2' },
    archived: { label: 'Archived', marker: 'bg-paper border-ink-2 border-dashed' },
};

const StatusMark = ({ status }: { status: RepoStatus }) => (
    <span className="inline-flex items-center gap-2 font-mono text-xs text-ink">
        <span aria-hidden="true" className={`w-2.5 h-2.5 border ${STATUS_CONFIG[status].marker}`} />
        {STATUS_CONFIG[status].label}
    </span>
);

const ProgressBar = ({ value, label, className = '' }: { value: number; label: string; className?: string }) => (
    <div
        className={`h-2 bg-paper-2 border border-ink ${className}`}
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={100}
    >
        <div
            className={`h-full transition-all duration-500 ${value >= 100 ? 'bg-hi' : 'bg-ink'}`}
            style={{ width: `${value}%` }}
        />
    </div>
);

const LOCK_IN_CMD = `claude "Read PLAN.md, find the first incomplete task, and continue. Mark tasks done as you go. Commit when a milestone is complete."`;

// --- PLAN SIDEBAR ---

const PlanSidebar = ({ repo, plan, onClose }: PlanSidebarProps) => {
    const status = getStatus(repo);
    const progress = plan.totalTasks > 0 ? (plan.totalDone / plan.totalTasks) * 100 : 0;
    const closeRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        closeRef.current?.focus();
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    return (
        <>
            <motion.div
                className="fixed inset-0 bg-ink/40 z-[60]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
            />
            <motion.aside
                role="dialog"
                aria-modal="true"
                aria-label={`${repo.name} plan`}
                className="fixed top-0 right-0 h-full w-full max-w-md bg-paper border-l border-ink z-[70] flex flex-col"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
                <div className="flex-shrink-0 px-6 pt-6 pb-5 border-b border-ink">
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="min-w-0">
                            <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-serif text-2xl tracking-tight hover:underline underline-offset-4 decoration-1 truncate block"
                            >
                                {repo.name}
                            </a>
                            <div className="flex items-center gap-3 mt-2">
                                <StatusMark status={status} />
                                {repo.language && (
                                    <span className="font-mono text-xs text-ink-2">
                                        {repo.language}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            ref={closeRef}
                            onClick={onClose}
                            aria-label="Close"
                            className="flex-shrink-0 w-11 h-11 -mr-2 -mt-2 inline-flex items-center justify-center hover:bg-hi transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div className="flex items-baseline justify-between font-mono text-xs text-ink-2 mb-2">
                        <span>OVERALL</span>
                        <span className="text-ink">
                            {plan.totalDone} / {plan.totalTasks} tasks · {Math.round(progress)}%
                        </span>
                    </div>
                    <ProgressBar value={progress} label={`${repo.name} overall plan progress`} />
                </div>

                <div className="flex-1 overflow-y-auto">
                    {plan.milestones.map((m, mi) => {
                        const complete = m.total > 0 && m.done === m.total;
                        const title =
                            m.title.replace(/^Milestone\s+\d+[:\s]*/i, '').trim() || m.title;
                        return (
                            <div key={mi} className="border-b border-rule">
                                <div className="flex items-center justify-between gap-3 px-6 py-3 bg-paper-2">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span
                                            className={`flex-shrink-0 font-mono text-xs px-1.5 py-0.5 border border-ink ${complete ? 'bg-hi text-ink' : 'bg-paper text-ink'}`}
                                        >
                                            M{mi + 1}
                                        </span>
                                        <span className="text-sm font-medium truncate">
                                            {title}
                                        </span>
                                    </div>
                                    <span className="flex-shrink-0 font-mono text-xs text-ink-2">
                                        {m.done}/{m.total}
                                    </span>
                                </div>
                                <ul className="px-6 py-4 space-y-3">
                                    {m.tasks.map((t, ti) => (
                                        <li key={ti} className="flex items-start gap-3">
                                            <span
                                                aria-hidden="true"
                                                className={`mt-1 w-4 h-4 flex-shrink-0 inline-flex items-center justify-center border border-ink ${t.done ? 'bg-ink' : 'bg-paper'}`}
                                            >
                                                {t.done && (
                                                    <Check
                                                        size={10}
                                                        className="text-paper"
                                                        strokeWidth={3}
                                                    />
                                                )}
                                            </span>
                                            <span
                                                className={`text-sm leading-relaxed ${t.done ? 'text-ink-2 line-through' : 'text-ink'}`}
                                            >
                                                <span className="sr-only">
                                                    {t.done ? 'Done: ' : 'To do: '}
                                                </span>
                                                {t.text}
                                            </span>
                                        </li>
                                    ))}
                                    {m.tasks.length === 0 && (
                                        <li className="text-xs text-ink-2 italic">
                                            No tasks listed
                                        </li>
                                    )}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                <div className="flex-shrink-0 px-6 py-3 border-t border-ink flex items-center justify-between">
                    <a
                        href={`${repo.html_url}/blob/main/PLAN.md`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center min-h-11 font-mono text-[13px] underline underline-offset-4 decoration-ink/30 hover:decoration-ink"
                    >
                        View PLAN.md on GitHub ↗
                    </a>
                    <button
                        onClick={onClose}
                        className="inline-flex items-center min-h-11 px-2 font-mono text-[13px] text-ink-2 hover:text-ink"
                    >
                        Close
                    </button>
                </div>
            </motion.aside>
        </>
    );
};

// --- REPO ROW ---

const RepoRow = ({
    repo,
    description,
    onShowPlan,
}: {
    repo: Repo;
    description: string | null;
    onShowPlan: (repo: Repo, plan: PlanData) => void;
}) => {
    const [copied, setCopied] = useState(false);
    const status = getStatus(repo);
    const plan = repo.planData;
    const progress = plan && plan.totalTasks > 0 ? (plan.totalDone / plan.totalTasks) * 100 : 0;
    const needsReview = description?.endsWith('[needs review]') ?? false;
    const descText = needsReview ? description!.replace(' [needs review]', '') : description;

    const handleLockIn = async () => {
        try {
            await navigator.clipboard.writeText(LOCK_IN_CMD);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* clipboard unavailable */
        }
    };

    return (
        <article className="grid md:grid-cols-[120px_minmax(0,1fr)_200px] gap-x-8 gap-y-3 py-6 border-b border-rule">
            <div className="font-mono text-xs text-ink-2 leading-relaxed space-y-1">
                <StatusMark status={status} />
                <div>{relativeTime(repo.pushed_at)}</div>
                {repo.language && <div>{repo.language}</div>}
            </div>

            <div className="min-w-0">
                <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-serif text-2xl tracking-tight leading-tight hover:underline underline-offset-4 decoration-1 break-words"
                >
                    {repo.name}
                </a>
                {descText && (
                    <p className="text-ink-2 text-[15px] leading-relaxed mt-2 max-w-[68ch]">
                        {descText}
                    </p>
                )}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 font-mono text-xs text-ink-2">
                    {needsReview && (
                        <span className="border border-dashed border-ink-2 px-1.5 py-0.5">
                            needs review
                        </span>
                    )}
                    {repo.topics?.slice(0, 3).map((t) => (
                        <span key={t}>#{t}</span>
                    ))}
                    {repo.stargazers_count > 0 && (
                        <span className="inline-flex items-center gap-1">
                            <Star size={12} aria-hidden="true" />
                            {repo.stargazers_count}
                            <span className="sr-only"> stars</span>
                        </span>
                    )}
                    {repo.forks_count > 0 && (
                        <span className="inline-flex items-center gap-1">
                            <GitFork size={12} aria-hidden="true" />
                            {repo.forks_count}
                            <span className="sr-only"> forks</span>
                        </span>
                    )}
                    {repo.open_issues_count > 0 && (
                        <span className="inline-flex items-center gap-1">
                            <AlertCircle size={12} aria-hidden="true" />
                            {repo.open_issues_count}
                            <span className="sr-only"> open issues</span>
                        </span>
                    )}
                </div>
                <div className="flex flex-wrap items-center gap-x-5 mt-1 -mb-2">
                    <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 min-h-11 font-mono text-[13px] underline underline-offset-4 decoration-ink/30 hover:decoration-ink"
                    >
                        <Github size={13} aria-hidden="true" /> GitHub ↗
                    </a>
                    <button
                        onClick={handleLockIn}
                        title="Copy the Claude Code command to your clipboard"
                        className="inline-flex items-center gap-1.5 min-h-11 font-mono text-[13px] underline underline-offset-4 decoration-ink/30 hover:decoration-ink"
                    >
                        {copied ? (
                            <Check size={13} aria-hidden="true" />
                        ) : (
                            <Terminal size={13} aria-hidden="true" />
                        )}
                        {copied ? 'Copied' : 'Copy lock-in command'}
                    </button>
                </div>
            </div>

            <div className="font-mono text-xs">
                <div className="text-ink-2 mb-2">PLAN.md</div>
                {repo.planLoading && (
                    <div className="space-y-2" aria-label="Loading plan">
                        <div className="h-3 bg-paper-2 animate-pulse w-24" />
                        <div className="h-2 bg-paper-2 animate-pulse" />
                    </div>
                )}
                {!repo.planLoading && plan && plan.totalTasks > 0 && (
                    <div>
                        <div className="flex justify-between mb-2">
                            <span>
                                {plan.totalDone}/{plan.totalTasks} tasks
                            </span>
                            <span className="text-ink-2">{Math.round(progress)}%</span>
                        </div>
                        <ProgressBar value={progress} label={`${repo.name} plan progress`} />
                        <button
                            onClick={() => onShowPlan(repo, plan)}
                            className="inline-flex items-center min-h-11 mt-1 underline underline-offset-4 decoration-ink/30 hover:decoration-ink"
                        >
                            View all {plan.milestones.length} milestones
                        </button>
                    </div>
                )}
                {!repo.planLoading && plan === null && (
                    <div className="text-ink-2">no plan yet</div>
                )}
                {!repo.planLoading && plan && plan.totalTasks === 0 && (
                    <div className="text-ink-2">no tasks listed</div>
                )}
            </div>
        </article>
    );
};

const SkeletonRow = () => (
    <div
        className="grid md:grid-cols-[120px_minmax(0,1fr)_200px] gap-x-8 gap-y-3 py-6 border-b border-rule animate-pulse"
        aria-hidden="true"
    >
        <div className="space-y-2">
            <div className="h-3 bg-paper-2 w-16" />
            <div className="h-3 bg-paper-2 w-12" />
        </div>
        <div className="space-y-2">
            <div className="h-6 bg-paper-2 w-1/3" />
            <div className="h-3 bg-paper-2 w-4/5" />
            <div className="h-3 bg-paper-2 w-3/5" />
        </div>
        <div className="space-y-2">
            <div className="h-3 bg-paper-2 w-24" />
            <div className="h-2 bg-paper-2" />
        </div>
    </div>
);

// --- MAIN DASHBOARD ---

const controlClass =
    'h-11 px-3 bg-paper border border-ink rounded-[3px] font-mono text-[13px] text-ink placeholder:text-ink-2 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2';

const Dashboard = ({ onBack }: { onBack: () => void }) => {
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterTab>('all');
    const [langFilter, setLangFilter] = useState('');
    const [topicFilter, setTopicFilter] = useState('');
    const [search, setSearch] = useState('');
    const [activePlan, setActivePlan] = useState<{ repo: Repo; plan: PlanData } | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAll = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
                setActivePlan(null);
            } else {
                setLoading(true);
            }
            setError(null);

            const res = await fetch(
                'https://api.github.com/users/ikathuria/repos?type=public&per_page=100&sort=pushed',
                { headers: { Accept: 'application/vnd.github+json' } }
            );
            if (!res.ok) throw new Error(`GitHub API responded with ${res.status}`);
            const data: Repo[] = await res.json();

            setRepos(data.map((r) => ({ ...r, planData: undefined, planLoading: true })));
            setLoading(false);

            await Promise.allSettled(
                data.map(async (repo) => {
                    try {
                        const branch = repo.default_branch || 'main';
                        const pr = await fetch(
                            `https://raw.githubusercontent.com/ikathuria/${repo.name}/${branch}/PLAN.md`,
                            { cache: 'no-store' }
                        );
                        const planData = pr.ok ? parsePlan(await pr.text()) : null;
                        setRepos((prev) =>
                            prev.map((r) =>
                                r.id === repo.id ? { ...r, planData, planLoading: false } : r
                            )
                        );
                    } catch {
                        setRepos((prev) =>
                            prev.map((r) =>
                                r.id === repo.id ? { ...r, planData: null, planLoading: false } : r
                            )
                        );
                    }
                })
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load repositories');
            setLoading(false);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const uniqueLangs = Array.from(
        new Set(repos.map((r) => r.language).filter(Boolean) as string[])
    ).sort();
    const uniqueTopics = Array.from(new Set(repos.flatMap((r) => r.topics ?? []))).sort();

    const filtered = repos.filter((repo) => {
        const status = getStatus(repo);
        const matchesFilter =
            filter === 'all' || filter === status || (filter === 'archived' && repo.archived);
        const matchesLang = !langFilter || repo.language === langFilter;
        const matchesTopic = !topicFilter || (repo.topics ?? []).includes(topicFilter);
        const q = search.toLowerCase();
        const matchesSearch =
            !q ||
            repo.name.toLowerCase().includes(q) ||
            (repo.description?.toLowerCase().includes(q) ?? false);
        return matchesFilter && matchesLang && matchesTopic && matchesSearch;
    });

    const counts: Record<FilterTab, number> = {
        all: repos.length,
        active: repos.filter((r) => getStatus(r) === 'active').length,
        stale: repos.filter((r) => getStatus(r) === 'stale').length,
        archived: repos.filter((r) => getStatus(r) === 'archived').length,
    };
    const filterTabs: { key: FilterTab; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'active', label: 'Active' },
        { key: 'stale', label: 'Stale' },
        { key: 'archived', label: 'Archived' },
    ];

    const plans = repos.filter((r) => r.planData && r.planData.totalTasks > 0);
    const tasksDone = plans.reduce((s, r) => s + r.planData!.totalDone, 0);
    const tasksTotal = plans.reduce((s, r) => s + r.planData!.totalTasks, 0);
    const plansPending = repos.some((r) => r.planLoading);
    const ledger: Array<[string, string]> = [
        [String(counts.all), 'public repos'],
        [String(counts.active), 'pushed in the last 14 days'],
        [plansPending ? '…' : String(plans.length), 'repos with a PLAN.md'],
        [plansPending ? '…' : `${tasksDone}/${tasksTotal}`, 'plan tasks done'],
    ];

    return (
        <div className="min-h-screen bg-paper text-ink">
            <nav aria-label="Tracker" className="sticky top-0 z-50 bg-paper/95 border-b border-ink">
                <div className="max-w-[1120px] mx-auto px-5 md:px-8 h-14 flex items-center justify-between gap-4">
                    <a
                        href="/"
                        onClick={(e) => {
                            e.preventDefault();
                            onBack();
                        }}
                        className="inline-flex items-center gap-2 min-h-11 hover:underline underline-offset-4"
                    >
                        <ArrowLeft size={16} aria-hidden="true" />{' '}
                        <span className="font-serif text-lg tracking-tight">Ishani Kathuria</span>
                    </a>
                    <span className="hidden sm:inline font-mono text-xs text-ink-2">
                        build tracker
                    </span>
                    <div className="flex items-center">
                        <button
                            onClick={() => fetchAll(true)}
                            disabled={refreshing || loading}
                            aria-label="Refresh repos and plans"
                            title="Refresh repos and plans"
                            className="w-11 h-11 inline-flex items-center justify-center hover:bg-hi transition-colors disabled:opacity-40"
                        >
                            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                        </button>
                        <a
                            href="https://github.com/ikathuria"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub profile"
                            className="w-11 h-11 inline-flex items-center justify-center hover:bg-hi transition-colors"
                        >
                            <Github size={18} />
                        </a>
                    </div>
                </div>
            </nav>

            <header className="max-w-[1120px] mx-auto px-5 md:px-8 pt-16 pb-10">
                <div className="grid md:grid-cols-12 gap-x-8 gap-y-4 items-end">
                    <div className="md:col-span-7">
                        <div className="font-mono text-xs text-ink-2 mb-3">github / ikathuria</div>
                        <h1 className="font-serif text-[clamp(40px,7vw,80px)] leading-[1] tracking-[-0.03em]">
                            Build tracker
                        </h1>
                    </div>
                    <div className="md:col-span-5 md:text-right">
                        <p className="text-ink-2 text-[15px] leading-relaxed md:ml-auto max-w-[44ch]">
                            Live view of every public repo: how recently it moved, and how far along
                            its PLAN.md is.
                        </p>
                        <span className="inline-block font-mono text-xs mt-3 bg-machine text-machine-ink px-2 py-1 rounded-[2px]">
                            repos.list() → {loading ? '…' : counts.all}
                        </span>
                    </div>
                </div>
            </header>

            <section aria-label="Summary" className="border-y border-ink">
                <dl className="max-w-[1120px] mx-auto px-5 md:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6">
                    {ledger.map(([v, l]) => (
                        <div key={l}>
                            <dt className="font-serif text-[36px] leading-none tracking-tight">
                                {loading ? '…' : v}
                            </dt>
                            <dd className="text-[13px] leading-snug text-ink-2 mt-2 max-w-[20ch]">
                                {l}
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>

            <main className="max-w-[1120px] mx-auto px-5 md:px-8 pt-10 pb-24">
                <div className="flex flex-col gap-3 mb-8">
                    <div className="flex flex-wrap gap-3 items-center">
                        <label className="relative">
                            <span className="sr-only">Search repos</span>
                            <Search
                                size={14}
                                aria-hidden="true"
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-2 pointer-events-none"
                            />
                            <input
                                type="text"
                                placeholder="search repos"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={`${controlClass} pl-9 w-52`}
                            />
                        </label>
                        {uniqueLangs.length > 0 && (
                            <div className="relative">
                                <select
                                    aria-label="Language"
                                    value={langFilter}
                                    onChange={(e) => setLangFilter(e.target.value)}
                                    className={`${controlClass} appearance-none pr-9 cursor-pointer`}
                                >
                                    <option value="">All languages</option>
                                    {uniqueLangs.map((l) => (
                                        <option key={l} value={l}>
                                            {l}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={14}
                                    aria-hidden="true"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-2 pointer-events-none"
                                />
                            </div>
                        )}
                        {uniqueTopics.length > 0 && (
                            <div className="relative">
                                <select
                                    aria-label="Topic"
                                    value={topicFilter}
                                    onChange={(e) => setTopicFilter(e.target.value)}
                                    className={`${controlClass} appearance-none pr-9 cursor-pointer`}
                                >
                                    <option value="">All topics</option>
                                    {uniqueTopics.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={14}
                                    aria-hidden="true"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-2 pointer-events-none"
                                />
                            </div>
                        )}
                        {(langFilter || topicFilter) && (
                            <button
                                onClick={() => {
                                    setLangFilter('');
                                    setTopicFilter('');
                                }}
                                className="inline-flex items-center min-h-11 font-mono text-[13px] underline underline-offset-4 decoration-ink/30 hover:decoration-ink"
                            >
                                clear filters
                            </button>
                        )}
                    </div>
                    <div role="group" aria-label="Status" className="flex gap-2 flex-wrap">
                        {filterTabs.map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                aria-pressed={filter === f.key}
                                className={`min-h-11 px-3.5 font-mono text-[13px] border border-ink rounded-[3px] transition-colors ${filter === f.key ? 'bg-ink text-paper' : 'bg-paper text-ink hover:bg-hi'}`}
                            >
                                {f.label}{' '}
                                <span
                                    className={filter === f.key ? 'text-machine-ink' : 'text-ink-2'}
                                >
                                    {counts[f.key]}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="border-t border-ink">
                    {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

                    {error && (
                        <div className="py-16">
                            <p className="font-serif text-2xl mb-2">Couldn't reach GitHub.</p>
                            <p className="text-ink-2 text-[15px] mb-4">
                                {error}. The public API allows a limited number of requests per
                                hour, so try again in a bit.
                            </p>
                            <button
                                onClick={() => fetchAll()}
                                className="min-h-11 px-4 font-mono text-[13px] border border-ink rounded-[3px] bg-ink text-paper hover:bg-hi hover:text-ink transition-colors"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {!loading && !error && filtered.length === 0 && (
                        <div className="py-16">
                            <p className="font-serif text-2xl mb-2">
                                No repos match those filters.
                            </p>
                            <button
                                onClick={() => {
                                    setFilter('all');
                                    setLangFilter('');
                                    setTopicFilter('');
                                    setSearch('');
                                }}
                                className="inline-flex items-center min-h-11 font-mono text-[13px] underline underline-offset-4 decoration-ink/30 hover:decoration-ink"
                            >
                                Clear everything
                            </button>
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        filtered.map((repo) => (
                            <RepoRow
                                key={repo.id}
                                repo={repo}
                                description={
                                    (repoDescriptions as Record<string, string>)[repo.name] ??
                                    repo.description ??
                                    null
                                }
                                onShowPlan={(r, p) => setActivePlan({ repo: r, plan: p })}
                            />
                        ))}
                </div>
            </main>

            <AnimatePresence>
                {activePlan && (
                    <PlanSidebar
                        repo={activePlan.repo}
                        plan={activePlan.plan}
                        onClose={() => setActivePlan(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
