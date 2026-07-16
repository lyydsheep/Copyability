# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Layout

This repository uses the single-context layout:

- `CONTEXT.md` at the repository root contains the domain glossary.
- `docs/adr/` contains architecture decision records.

These files are created lazily as domain terms and architectural decisions are established.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root.
- **`docs/adr/`** — read ADRs that touch the area you're about to work in.

If either location doesn't exist, proceed silently. Don't flag its absence or create placeholder files upfront. The `/domain-modeling` skill creates the relevant files when terms or decisions are actually resolved.

## File structure

```text
/
├── copyability.user.js
├── CONTEXT.md
├── docs/
│   ├── adr/
│   └── agents/
└── tests/
```

## Use the glossary's vocabulary

When output names a domain concept—in an issue title, refactor proposal, hypothesis, or test name—use the term defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If a needed concept isn't in the glossary, reconsider whether the language belongs to the project or note the gap for `/domain-modeling`.

## Flag ADR conflicts

If output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders) — but worth reopening because…_
