# handoff-skill — Engineering Spec

> Redesign the cross-CLI / cross-machine session handoff skill to fix accumulated UX debt — strip cosmetic flags that don't carry information, abstract source/target detection from the user, and commit to one coherent mental model end-to-end.
>
> Created: 2026-04-26
> Branch: `spec/handoff-skill`
> Worktree: `.claude/worktrees/spec-handoff-skill/`
> Base: `origin/main` @ `c117418`

## Status

| #   | Section                     | Status    |
| --- | --------------------------- | --------- |
| 1   | Problem / Motivation        | [x] done  |
| 2   | Scope                       | [x] done  |
| 3   | High-Level Architecture     | [x] done  |
| 4   | Data Flow / Components      | [x] done  |
| 5   | Interfaces and APIs         | [x] done  |
| 6   | Implementation Plan         | [x] done  |
| 7   | Non-Functional Requirements | [x] done  |
| 8   | Risks and Alternatives      | [x] done  |

## Quick Start

1. **Drift test is the spec's tooth** — see [ARCH-10](spec/3-high-level-architecture.md).
2. **Read in order**: [§1](spec/1-problem-motivation.md) → [§2](spec/2-scope.md) → [§5](spec/5-interfaces-apis.md) (the contract). Skip to [§8](spec/8-risks-alternatives.md) if you want to know why something *isn't* in the design.
3. **Constraint IDs (ARCH / KD / REL / SEC / PERF / OPS / R / A) and file citations (function/heading anchors, never line ranges) are stable references** — don't renumber, don't reanchor.

## Research Sources

See [research/sources.md](research/sources.md) for indexed source documents.
