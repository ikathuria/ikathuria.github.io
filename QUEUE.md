# Queue

Tasks Claude can do unattended. Add items with the `queue` skill (or by hand, using the item format).

## Run protocol (read this first if you are an unattended run)

1. Read this repo's `CLAUDE.md` and `HANDOFF.md` if present. Their rules apply.
2. Take the **first** item below with `Status: ready` and `Where: cloud` (or `local` if you are
   running on the GPU machine). If none, stop without changes.
3. Set its status to `running (<date>)`, then create a branch `claude/auto-<yyyy-mm-dd>-<item-slug>`
   from the default branch.
4. Do only that item. Stay inside its Files and Out of scope. Don't ask questions: take the
   conservative choice and note it under Assumptions.
5. Run its **Done when** check. If it fails, fix and retry at most twice.
6. Stop at the first of: check passes; check still fails after two fixes; the item needs a decision
   from the user; it needs a secret, credential or paid service.
7. Commit in small steps, push the branch, and open a **draft** PR titled `auto: <item title>` whose
   body is the report. If you can't open a PR (no `gh` auth), put the report in the last commit
   message instead and leave the PR to the user:
   ```
   Item: <title>    Result: done | partial | blocked
   Check: <command> → <pass/fail, key output line>
   Changed: <files>
   Assumptions: <choices made without the user>
   Needs you: <decision or "nothing">
   ```
8. On the branch, set the item's status to `review (#<PR>)` or `blocked: <reason>`, and commit.
9. Never push to or merge into the default branch, force-push, delete branches, or touch CI,
   secrets, `.env`, or advisor-facing documents.

## Item format

```
### <title>
Status: ready | queued | needs-me | running (<date>) | review (#PR) | blocked: <why> | done (#PR)
Where: cloud | local     Size: S | M
Goal: <one sentence outcome>
Files: <paths to start from>
Done when: <command or check that passes only when the goal is met>
Out of scope: <what not to touch>
Notes: <context a fresh agent needs>
```

## Items

### Fix npm audit findings in build tooling
Status: ready
Where: cloud     Size: S
Goal: Clear the npm audit findings (12 on 2026-10-20: 10 high, 1 moderate, 1 low, all dev/build dependencies) without changing the site.
Files: `package.json`, `package-lock.json`
Done when: `npm ci && npx tsc --noEmit && npm run build && npm run verify:ir` all pass, and `npm audit --audit-level=high` reports no high findings, or the only remaining ones are in the `gh-pages` chain, listed under Assumptions with why.
Out of scope: any file outside `package.json`/`package-lock.json`; major-version upgrades of vite, react, tailwindcss or typescript; `npm audit fix --force`. Do not accept npm's suggested `gh-pages@6.1.1` change (it is a major-version move); instead try a newer `gh-pages` or an `overrides` entry for the vulnerable transitive packages, and keep `npm run deploy` working (check with `npx gh-pages --help`). Don't run the deploy.
Notes: Start with `npm audit fix` (non-breaking). Report before/after `npm audit` counts in the PR body.
