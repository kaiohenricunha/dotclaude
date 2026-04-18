# Handoff remote — cross-machine sign-off

Fill in once per OS pair (e.g. Windows ↔ PopOS). Re-sign only if the
description schema or payload shape changes in a backwards-
incompatible way.

## Context

- **Purpose.** Prove that a handoff created on machine A can be
  pulled and resumed on machine B with the same GitHub account, and
  that the target CLI continues the task without re-asking context.
- **Tooling.** Both machines must have `gh` authenticated to the
  same account with the `gist` scope, OR a PAT in
  `DOTCLAUDE_GH_TOKEN` on at least machine B.

## Run

### Step 1 — push on machine A

- [ ] Machine: `<hostname-A>` (e.g. `win-desktop`)
- [ ] OS: `<windows/macos/linux distro + version>`
- [ ] `gh auth status -h github.com` account: `<login>`
- [ ] Command: `/handoff push claude latest --tag <label>`
- [ ] Gist URL: `<https://gist.github.com/<login>/<id>>`
- [ ] Reported `Scrubbed <N> secrets` count: `<N>`

### Step 2 — pull on machine B

- [ ] Machine: `<hostname-B>` (e.g. `thinkpad-pop`)
- [ ] OS: `<windows/macos/linux distro + version>`
- [ ] `gh auth status -h github.com` account: `<login>` (must match
      step 1)
- [ ] Command: `/handoff pull latest --to claude`
- [ ] Output: paste the rendered `<handoff>...</handoff>` block
      below, verbatim.

```text
<paste here>
```

### Step 3 — continuity evidence

One to three sentences describing how the resumed session picked up
the work without re-asking context. Include one concrete example
(e.g. "Claude immediately proposed an edit to `foo.py:123` referencing
the plan from machine A").

- Evidence: `<sentence>`

### Step 4 — sign-off

- Date (ISO): `<YYYY-MM-DD>`
- Reviewer: `<@github-handle>`
- Cross-machine check passed: `<yes/no>`
- Notes / anomalies: `<free text>`

## Failure log

If any step fails, append a dated entry describing the failure and
link the triage commit or issue. Do not delete failed runs — they
are a record of real surface bugs.

- `<YYYY-MM-DD>` — `<one-line summary>` — `<link>`
