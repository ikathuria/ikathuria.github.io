/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * WebMCP integration — makes this portfolio callable by in-browser AI agents.
 *
 * Registers a small set of read-only "tools" on `document.modelContext`
 * (the Chrome WebMCP API, https://developer.chrome.com/docs/ai/webmcp) plus a
 * single navigation tool. This is a progressive enhancement: nothing here
 * changes the visual site, and browsers without WebMCP support are handled by
 * the `@mcp-b/webmcp-polyfill`, so an agent connecting via the MCP-B bridge
 * extension can query the page the same way a human reads it.
 *
 * The human-facing "Machine Mode" (a copy-paste plaintext dump) remains the
 * fallback for agents that cannot speak WebMCP.
 */

import { useEffect } from 'react';
// Importing the types package pulls in its `declare global` augmentation,
// which adds the optional `document.modelContext` typing.
import type { ModelContextTool } from '@mcp-b/webmcp-types';
import { papers, projects, hackathons, resume, profile } from '../data';

type Tool = ModelContextTool<Record<string, unknown>, unknown, string>;

let polyfillPromise: Promise<void> | null = null;

/**
 * Install the polyfill once so `document.modelContext` exists everywhere.
 * Returns the same in-flight promise to all concurrent callers, so a second
 * caller can't proceed before the dynamic import has actually installed the API
 * (this matters under React StrictMode's double-invoked effects).
 */
function ensurePolyfill(): Promise<void> {
  if (!polyfillPromise) {
    // The polyfill never replaces a native implementation, so this is safe even
    // in a Chrome build that ships WebMCP behind a flag.
    polyfillPromise = import('@mcp-b/webmcp-polyfill').then(({ initializeWebMCPPolyfill }) =>
      initializeWebMCPPolyfill()
    );
  }
  return polyfillPromise;
}

const json = (data: unknown): string => JSON.stringify(data, null, 2);

const allItems = [...projects, ...papers];

function buildTools(onOpenProject: (id: string) => void): Tool[] {
  return [
    {
      name: 'get_profile',
      description:
        "Get Ishani Kathuria's professional profile: name, headline, current status and job-search targets, a short summary, location, contact links, and headline impact stats. Call this first to understand who this portfolio belongs to.",
      annotations: { readOnlyHint: true },
      execute: async () =>
        json({
          name: profile.name,
          headline: profile.headline,
          tagline: profile.tagline,
          status: profile.status,
          location: profile.location,
          summary: profile.summary,
          email: profile.email,
          links: profile.links,
          highlights: profile.stats.map((s) => `${s.value} — ${s.label}`),
        }),
    },
    {
      name: 'get_resume',
      description:
        "Get Ishani Kathuria's full resume as structured data: work experience, education, technical skills, and certifications, plus a link to the downloadable PDF. Use this for questions about work history, roles, GPA, or specific skills.",
      annotations: { readOnlyHint: true },
      execute: async () =>
        json({
          summary: profile.summary,
          experience: resume.experience,
          education: resume.education,
          skills: resume.skills,
          resumePdf: profile.links.resume,
        }),
    },
    {
      name: 'list_projects',
      description:
        "List Ishani Kathuria's AI/ML engineering projects (e.g. TrustworthyRAG, AutoRedTeam, DeepFakeGuard) with the problem, the technical approach, impact, tech stack, and GitHub/demo links.",
      annotations: { readOnlyHint: true },
      execute: async () =>
        json(
          projects.map((p) => ({
            id: p.id,
            title: p.metadata.title,
            subtitle: p.metadata.subtitle,
            date: p.metadata.date,
            problem: p.narrative.problem,
            approach: p.narrative.innovation,
            impact: p.narrative.impact,
            techStack: p.technical?.techStack ?? [],
            github: p.metadata.githubUrl,
            demo: p.metadata.demoUrl,
          }))
        ),
    },
    {
      name: 'list_publications',
      description:
        "List Ishani Kathuria's peer-reviewed research publications (IEEE and Springer), including title, venue, date, a one-line summary, and the DOI/publisher link.",
      annotations: { readOnlyHint: true },
      execute: async () =>
        json(
          papers.map((p) => ({
            id: p.id,
            title: p.metadata.title,
            summary: p.metadata.subtitle,
            venue: p.metadata.venue,
            date: p.metadata.date,
            link: p.metadata.link,
            authors: p.authors.map((a) => a.name),
          }))
        ),
    },
    {
      name: 'list_hackathons',
      description:
        "List the hackathons Ishani Kathuria has built at or organized, including project name, event, date, location, role (builder/organizer), any award won, a tagline, tech stack, and links.",
      annotations: { readOnlyHint: true },
      execute: async () =>
        json(
          hackathons.map((h) => ({
            id: h.id,
            project: h.project,
            hackathon: h.hackathon,
            date: h.date,
            location: h.location,
            role: h.role,
            award: h.award,
            tagline: h.tagline,
            techStack: h.techStack ?? [],
            links: h.links,
          }))
        ),
    },
    {
      name: 'get_contact',
      description:
        "Get how to contact Ishani Kathuria and her current availability. Returns email, LinkedIn, GitHub, portfolio URL, resume link, and job-search status/targets. Use this when a user asks how to reach out, hire, or connect.",
      annotations: { readOnlyHint: true },
      execute: async () =>
        json({
          email: profile.email,
          status: profile.status,
          links: profile.links,
          preferredContact: `Email ${profile.email} or connect on LinkedIn.`,
        }),
    },
    {
      name: 'open_project',
      description:
        "Open a project or publication detail view on the portfolio by its id (get ids from list_projects or list_publications). This navigates the visible page so a human watching can follow along.",
      annotations: { readOnlyHint: false },
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The id of the project or publication to open.',
          },
        },
        required: ['id'],
      },
      execute: async (input) => {
        const id = String((input as { id?: unknown }).id ?? '');
        const match = allItems.find((item) => item.id === id);
        if (!match) {
          return json({
            ok: false,
            error: `No item with id "${id}".`,
            validIds: allItems.map((item) => item.id),
          });
        }
        onOpenProject(id);
        return json({ ok: true, opened: id, title: match.metadata.title });
      },
    },
  ];
}

/**
 * Registers the WebMCP tool layer for the lifetime of the component.
 * @param onOpenProject callback used by the `open_project` tool to drive the UI.
 */
export function useWebMCP(onOpenProject: (id: string) => void): void {
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    (async () => {
      try {
        await ensurePolyfill();
        if (cancelled) return;
        const mc = document.modelContext;
        if (!mc) return;
        const tools = buildTools(onOpenProject);
        await Promise.all(
          tools.map((tool) => mc.registerTool(tool, { signal: controller.signal }))
        );
      } catch (err) {
        // WebMCP is experimental; never let a registration failure break the site.
        if (import.meta.env?.DEV) console.warn('[WebMCP] tool registration skipped:', err);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
    // onOpenProject is stable (defined once in App); intentionally run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
