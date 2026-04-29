# Changelog

All notable changes to `@dotclaude/dotclaude` land here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versioning follows
[SemVer](https://semver.org/spec/v2.0.0.html).

## Unreleased

## [2.0.0](https://github.com/kaiohenricunha/dotclaude/compare/v1.0.0...v2.0.0) (2026-04-29)


### ⚠ BREAKING CHANGES

* **handoff:** self-bootstrap push — drop init ceremony and schema pin ([#80](https://github.com/kaiohenricunha/dotclaude/issues/80))
* **handoff:** every `dotclaude handoff push` now requires a one-time `dotclaude handoff init` against $DOTCLAUDE_HANDOFF_REPO. Existing v1 branches remain readable; writes always emit the new v2 shape. Migrate script lands as a follow-up (plan PR C). Migration is one command: `dotclaude handoff init`.
* **handoff:** `--via github`, `--via gist-token`, `--via git-fallback`, `DOTCLAUDE_GH_TOKEN`, and the `references/transport-github.md` file are removed. Migration is `s/ --via git-fallback//g` across any script that called `dotclaude handoff push|pull --via git-fallback`; gist users move to a private git repo (`gh repo create handoff-store --private` + `export DOTCLAUDE_HANDOFF_REPO=git@github.com:<user>/handoff-store.git`) and delete leftover gists with `gh gist list` + `gh gist delete <id>`.
* **handoff:** push <cli> <query> and pull <cli> <handle> now exit 64 with a migration message pointing at --from. Power-user subs (resolve/describe/digest/file) keep their explicit <cli> <id>.

### Added

* /pre-pr and /review-prs commands + CLAUDE.md rule refinements ([#51](https://github.com/kaiohenricunha/dotclaude/issues/51)) ([4e300ca](https://github.com/kaiohenricunha/dotclaude/commit/4e300ca399555d9b2fc8f018d30fe55fcbe977f4))
* add global CLAUDE.md rule floor ([aea0626](https://github.com/kaiohenricunha/dotclaude/commit/aea0626300b3040cba7b590ccc1ba1a18dfedae1))
* **agents:** add AWS, Azure, GCP provider agents and specialist skills ([#32](https://github.com/kaiohenricunha/dotclaude/issues/32)) ([95d25f5](https://github.com/kaiohenricunha/dotclaude/commit/95d25f5ef9bb66ca6037168cb659af7b29e8ab30))
* **agents:** add docker-engineer — Compose orchestration and runtime ops ([#47](https://github.com/kaiohenricunha/dotclaude/issues/47)) ([6f187e9](https://github.com/kaiohenricunha/dotclaude/commit/6f187e927278738dac6607a56e4add144e6868c5))
* **agents:** add first-class agent support with model routing and discovery ([#28](https://github.com/kaiohenricunha/dotclaude/issues/28)) ([9f72cfe](https://github.com/kaiohenricunha/dotclaude/commit/9f72cfe96836708f9ff70c26877fcbdc033ea272))
* **agents:** add generic veracity harness — data-scientist, compliance-auditor, veracity-audit skill ([#41](https://github.com/kaiohenricunha/dotclaude/issues/41)) ([ec2f3d1](https://github.com/kaiohenricunha/dotclaude/commit/ec2f3d1a63f7c873683152a35c166a80b91991ed))
* **agents:** add IaC tool agents and specialist skills ([#33](https://github.com/kaiohenricunha/dotclaude/issues/33)) ([4f7e24c](https://github.com/kaiohenricunha/dotclaude/commit/4f7e24cf2c2cecf4b26289f82367ec2f138b5d31))
* **agents:** add kubernetes ecosystem agents and specialist skill ([#31](https://github.com/kaiohenricunha/dotclaude/issues/31)) ([f6c20ac](https://github.com/kaiohenricunha/dotclaude/commit/f6c20ac3d45e357b96d7189cde0754498cb25633))
* **ci:** automate semantic versioning with release-please ([#52](https://github.com/kaiohenricunha/dotclaude/issues/52)) ([67e7949](https://github.com/kaiohenricunha/dotclaude/commit/67e79491a190c6dfa51188de55daf80169be7436))
* **claude-hardening:** settings.json validator + hardening decisions doc ([83244ec](https://github.com/kaiohenricunha/dotclaude/commit/83244ec8a1a20f51742abfcd21cbd32d8aa0d811))
* **cli:** bootstrap + sync subcommands for global ~/.claude/ lifecycle ([#29](https://github.com/kaiohenricunha/dotclaude/issues/29)) ([8eaee6b](https://github.com/kaiohenricunha/dotclaude/commit/8eaee6b336df6115847a6ba02786d0303d9178b2))
* **commands:** add /create-inspection slash command ([#23](https://github.com/kaiohenricunha/dotclaude/issues/23)) ([82189c0](https://github.com/kaiohenricunha/dotclaude/commit/82189c0d21d6cc820f249aa8e7042f50d867f3f1))
* **commands:** add generic /review-pr slash command ([#22](https://github.com/kaiohenricunha/dotclaude/issues/22)) ([1d4bc0f](https://github.com/kaiohenricunha/dotclaude/commit/1d4bc0fa4835b23e089393a101ecc15513a8ea0e))
* **handoff:** auto-preflight caching for push/pull ([#91](https://github.com/kaiohenricunha/dotclaude/issues/91) gap 2) ([#94](https://github.com/kaiohenricunha/dotclaude/issues/94)) ([a948837](https://github.com/kaiohenricunha/dotclaude/commit/a9488378839e601abe70cd2e12fb6a08c512ed46))
* **handoff:** collapse local surface under pull verb, rename remote pull→fetch ([#87](https://github.com/kaiohenricunha/dotclaude/issues/87)) ([#102](https://github.com/kaiohenricunha/dotclaude/issues/102)) ([33d2a34](https://github.com/kaiohenricunha/dotclaude/commit/33d2a3402af62b991c9a7ccb276ede6e8a4276e1))
* **handoff:** drop &lt;cli&gt; positional from push/pull ([#66](https://github.com/kaiohenricunha/dotclaude/issues/66)) ([a172e0e](https://github.com/kaiohenricunha/dotclaude/commit/a172e0e3b736094c43b80047ed2e217ed30a8301))
* **handoff:** make --from mandatory on push without &lt;query&gt;; flip drift test (Phase 2 PR 3) ([#120](https://github.com/kaiohenricunha/dotclaude/issues/120)) ([a73e68b](https://github.com/kaiohenricunha/dotclaude/commit/a73e68b9498bf7b4f1c98c40aadc88677b24b578))
* **handoff:** promote doctor, remote-list, search into the binary ([#71](https://github.com/kaiohenricunha/dotclaude/issues/71)) ([7ea0883](https://github.com/kaiohenricunha/dotclaude/commit/7ea08833104ebe89292e4b280468670fbb08bff0))
* **handoff:** prune references stale verbs + remove --cli flag (Phase 2 PR 7) ([0be8f85](https://github.com/kaiohenricunha/dotclaude/commit/0be8f85c15ebd6f1b11da8519be25944cafe75b1))
* **handoff:** prune references stale verbs + remove --cli flag (Phase 2 PR 7) ([5754087](https://github.com/kaiohenricunha/dotclaude/commit/5754087514bec521136920539939dec8cf129ce7))
* **handoff:** prune verb deletes aged remote branches with safety gates ([#91](https://github.com/kaiohenricunha/dotclaude/issues/91) Gap 5) ([#106](https://github.com/kaiohenricunha/dotclaude/issues/106)) ([7bd9bd8](https://github.com/kaiohenricunha/dotclaude/commit/7bd9bd81abfe01e7fe515e36a729be8b247f6c50))
* **handoff:** push --dry-run previews without touching the transport ([#91](https://github.com/kaiohenricunha/dotclaude/issues/91) Gap 4) ([#105](https://github.com/kaiohenricunha/dotclaude/issues/105)) ([6dcceef](https://github.com/kaiohenricunha/dotclaude/commit/6dcceefaeb078ad0e8b68e89989ca94a559ddec3))
* **handoff:** reconcile handoff-guide + third drift source (Phase 2 PR 8) ([b0dd427](https://github.com/kaiohenricunha/dotclaude/commit/b0dd427b58929aeb5ec5f9bcdf348519df0c4346))
* **handoff:** reconcile handoff-guide + third drift source (Phase 2 PR 8) ([7ad75ec](https://github.com/kaiohenricunha/dotclaude/commit/7ad75eca1b69dd6388b5cebf33f61c617cdd4a26))
* **handoff:** remove --to &lt;cli&gt; from pull (Phase 2 PR 4) ([23308e2](https://github.com/kaiohenricunha/dotclaude/commit/23308e2656be29c636b83886222f9905306ba1ec))
* **handoff:** remove --to &lt;cli&gt; from pull (Phase 2 PR 4) ([a999b13](https://github.com/kaiohenricunha/dotclaude/commit/a999b13151866376acc86fdcef88e4c6629350b4))
* **handoff:** remove deprecated alias verbs + bare-positional path (Phase 2 PR 5) ([f643474](https://github.com/kaiohenricunha/dotclaude/commit/f643474795fd3f7de19dc2c177951e04245becd6))
* **handoff:** remove deprecated alias verbs + bare-positional path (Phase 2 PR 5) ([013a241](https://github.com/kaiohenricunha/dotclaude/commit/013a241c321feadb2caae97ef9e2d61486b09e7e))
* **handoff:** remove gist transports, drop --via flag ([#68](https://github.com/kaiohenricunha/dotclaude/issues/68)) ([9aec0dc](https://github.com/kaiohenricunha/dotclaude/commit/9aec0dc0902a58831898ad34ccda97be06250b3f))
* **handoff:** search --fixed, two-pass clean filter, documented JSON shape ([#88](https://github.com/kaiohenricunha/dotclaude/issues/88)) ([#101](https://github.com/kaiohenricunha/dotclaude/issues/101)) ([60e3c04](https://github.com/kaiohenricunha/dotclaude/commit/60e3c04d5bf9a7e10b0aa126902b4a098ae53d3f))
* **handoff:** self-bootstrap push — drop init ceremony and schema pin ([#80](https://github.com/kaiohenricunha/dotclaude/issues/80)) ([ab02686](https://github.com/kaiohenricunha/dotclaude/commit/ab026867a2b3665d413961cb1f9faf6ae8cecc85))
* **handoff:** shell-scripts-first refactor + dotclaude-handoff binary ([#58](https://github.com/kaiohenricunha/dotclaude/issues/58)) ([176cb9d](https://github.com/kaiohenricunha/dotclaude/commit/176cb9dd9a0c1ba5362bd783604343aaa4815b19))
* **handoff:** shrink SKILL.md per spec §3 + install §5.5 phrase mapping (Phase 2 PR 6) ([def399c](https://github.com/kaiohenricunha/dotclaude/commit/def399c30cea381be65b3d803efca0a7546e1d71))
* **handoff:** shrink SKILL.md per spec §3 + install §5.5 phrase mapping (Phase 2 PR 6) ([ba4d3ca](https://github.com/kaiohenricunha/dotclaude/commit/ba4d3ca0a04699877f8ec0ee972b2da2053ca0e5))
* **handoff:** structured error normalization for remote failures ([#91](https://github.com/kaiohenricunha/dotclaude/issues/91) Gap 3) ([#104](https://github.com/kaiohenricunha/dotclaude/issues/104)) ([f339510](https://github.com/kaiohenricunha/dotclaude/commit/f3395108d47cf4ce7b82f252b6de65c25289d089))
* **handoff:** tags first-class — multi-tag push, exact-tag pull, list filter, histogram ([#91](https://github.com/kaiohenricunha/dotclaude/issues/91) Gap 7) ([#107](https://github.com/kaiohenricunha/dotclaude/issues/107)) ([c117418](https://github.com/kaiohenricunha/dotclaude/commit/c117418e1a974996f683a0640155fa6887e3d781))
* **handoff:** v2 store taxonomy + schema enforcement + init ([#73](https://github.com/kaiohenricunha/dotclaude/issues/73)) ([6da64bb](https://github.com/kaiohenricunha/dotclaude/commit/6da64bb80f7e25d489d1ee92bef2416d3a1674a2))
* **harness:** /init-harness command spec + scaffold templates ([2cadd27](https://github.com/kaiohenricunha/dotclaude/commit/2cadd27d083b2a54b9593ce3f2c656f387837d58))
* **harness:** /init-harness scaffolder with tested template engine ([d0ff4d4](https://github.com/kaiohenricunha/dotclaude/commit/d0ff4d40f0a4444e44a38e33308d98787444f000))
* **harness:** add harness-validate-skills CLI ([f573c86](https://github.com/kaiohenricunha/dotclaude/commit/f573c86312ea9fbace2566af3503a7fa8aaa25d1))
* **harness:** adopt ValidationError across validators + debug silent catches ([#6](https://github.com/kaiohenricunha/dotclaude/issues/6)) ([ae0ed16](https://github.com/kaiohenricunha/dotclaude/commit/ae0ed16b296b0bbd3a040dfffa8a85bf814430b8))
* **harness:** always-on AI PR review workflow template ([b49da1b](https://github.com/kaiohenricunha/dotclaude/commit/b49da1b62206715d268609475ac4589cbd552f77))
* **harness:** barrel index + umbrella CLI + package.json contract ([#3](https://github.com/kaiohenricunha/dotclaude/issues/3)) ([c70d2cf](https://github.com/kaiohenricunha/dotclaude/commit/c70d2cf7dccf8e803d2d814de1f68a367d3cd669))
* **harness:** bin migration to lib/* + JSDoc rollout (PR 3b) ([#8](https://github.com/kaiohenricunha/dotclaude/issues/8)) ([a460301](https://github.com/kaiohenricunha/dotclaude/commit/a46030133bc4fe6144ccef1af1d429155a1f9867))
* **harness:** dogfood + integration + coverage thresholds (PR 5) ([#10](https://github.com/kaiohenricunha/dotclaude/issues/10)) ([da1d360](https://github.com/kaiohenricunha/dotclaude/commit/da1d36082b16737b3c15c5a0684a3ba831aeab65))
* **harness:** foundation libs for structured errors + output + argv ([#2](https://github.com/kaiohenricunha/dotclaude/issues/2)) ([8224fdb](https://github.com/kaiohenricunha/dotclaude/commit/8224fdbdb499bc0d20b0bab0fa4fa51eb1e23da9))
* **harness:** include portable guard-destructive-git hook ([5ec882a](https://github.com/kaiohenricunha/dotclaude/commit/5ec882ada90c29163abbbb66727f4e07306d9fd7))
* **harness:** port check-spec-coverage with bot bypass + unknown-spec-id guard ([1ca66b9](https://github.com/kaiohenricunha/dotclaude/commit/1ca66b965f9d0c9d1b8fa5dedc797dbe620db52e))
* **harness:** port instruction-drift detector ([546795c](https://github.com/kaiohenricunha/dotclaude/commit/546795c97325a71cbe5d9665096339fcbffc6f61))
* **harness:** port skills-manifest validator with orphan + DAG checks ([7e1d912](https://github.com/kaiohenricunha/dotclaude/commit/7e1d912250ef5a46e9e5a9e57f293fc2865fc720))
* **harness:** port spec-harness-lib with parameterized repoRoot ([12b7b86](https://github.com/kaiohenricunha/dotclaude/commit/12b7b868e700fa8e9c395f2aae874510db4f9b5d))
* **harness:** port spec.json schema validator ([4f41b84](https://github.com/kaiohenricunha/dotclaude/commit/4f41b8462e87fd97d46db7a3aa063af0285ef38e))
* **harness:** scaffold plugin + npm package manifests ([8abe217](https://github.com/kaiohenricunha/dotclaude/commit/8abe217d25b1f45fd4cecec35b1c5abc73e77ac0))
* **harness:** self-healing drift — worktree refresh, branch drift, auto manifest ([0db6af0](https://github.com/kaiohenricunha/dotclaude/commit/0db6af09c812a7cfd31433d9824909c0def928a6))
* **harness:** shell hardening + bats suite (PR 4) ([#9](https://github.com/kaiohenricunha/dotclaude/issues/9)) ([2f5e967](https://github.com/kaiohenricunha/dotclaude/commit/2f5e9675ef997e41128fb9ace1831bf8ad25b9cb))
* **install:** add curl-pipe-bash installer script ([#44](https://github.com/kaiohenricunha/dotclaude/issues/44)) ([2f4e9b3](https://github.com/kaiohenricunha/dotclaude/commit/2f4e9b3a2c0653cbda46be3a0d78837314041eb4))
* **lint:** wire prettier + markdownlint-cli2 into npm run lint ([#18](https://github.com/kaiohenricunha/dotclaude/issues/18)) ([387a7c5](https://github.com/kaiohenricunha/dotclaude/commit/387a7c5b56a8a8d4edba7fb95c9f6600456be158))
* migrate global commands + skills from ~/.claude/ ([edab7e3](https://github.com/kaiohenricunha/dotclaude/commit/edab7e3ac8345e66c3216f1a9fec7c78c1b8ea77))
* **plugin:** expand agents array to all 21 agents + mark spec shipped ([#40](https://github.com/kaiohenricunha/dotclaude/issues/40)) ([61982e4](https://github.com/kaiohenricunha/dotclaude/commit/61982e41a66fab15bd2a66ef64f50953f453da3e))
* rename harness → dotclaude (package, bins, plugin dir, de-personalize) ([#16](https://github.com/kaiohenricunha/dotclaude/issues/16)) ([866431d](https://github.com/kaiohenricunha/dotclaude/commit/866431dc64c6e72cf039efe49adbebc42b9eba80))
* **skills:** handoff — cross-CLI session context transfer ([#46](https://github.com/kaiohenricunha/dotclaude/issues/46)) ([232f137](https://github.com/kaiohenricunha/dotclaude/commit/232f137ca315872c8fa01bc349c75fbd11cd1e0d))
* **skills:** handoff — cross-machine transport (GitHub gists, first) ([#49](https://github.com/kaiohenricunha/dotclaude/issues/49)) ([93fd367](https://github.com/kaiohenricunha/dotclaude/commit/93fd367bcd6cfeb12618aef8cfb6ea9970ab54b2))
* **taxonomy:** Phase 1 — schemas + index builder + CLI (non-breaking) ([#34](https://github.com/kaiohenricunha/dotclaude/issues/34)) ([f91ac17](https://github.com/kaiohenricunha/dotclaude/commit/f91ac170cd5148d113a0d9cec5a462ac12bcd501))
* **taxonomy:** Phase 2 — frontmatter backfill + schema tightening ([#36](https://github.com/kaiohenricunha/dotclaude/issues/36)) ([719cf80](https://github.com/kaiohenricunha/dotclaude/commit/719cf80a99f11a93ffff78d7c6da315f33266323))
* **taxonomy:** Phase 3 — search/list/show CLI + governance docs + CI gate ([#37](https://github.com/kaiohenricunha/dotclaude/issues/37)) ([47ebd88](https://github.com/kaiohenricunha/dotclaude/commit/47ebd8852ff59483f3876bead1a0eecaed676b51))
* **taxonomy:** Phase 4 — build-plugin script + generated plugin templates ([#38](https://github.com/kaiohenricunha/dotclaude/issues/38)) ([f10d9d9](https://github.com/kaiohenricunha/dotclaude/commit/f10d9d9817953b05f46cbcde01f6be10c2071d87))


### Fixed

* **agents:** backfill schema taxonomy fields for all 24 agent artifacts ([5a4fced](https://github.com/kaiohenricunha/dotclaude/commit/5a4fced9746b2c67e1f874cddae1230d1788c021))
* **bootstrap:** link hooks/ into ~/.claude/hooks/ ([#35](https://github.com/kaiohenricunha/dotclaude/issues/35)) ([de43806](https://github.com/kaiohenricunha/dotclaude/commit/de43806f05201c45a85e5ea59a36c62bc9d133a0))
* **ci:** allow release-please CHANGELOG formatting in lint checks ([#55](https://github.com/kaiohenricunha/dotclaude/issues/55)) ([7b0c048](https://github.com/kaiohenricunha/dotclaude/commit/7b0c0484425b508d0e15373725f3710963adadca))
* **ci:** fix markdownlint violations in handoff-skill spec files ([#117](https://github.com/kaiohenricunha/dotclaude/issues/117)) ([726eeac](https://github.com/kaiohenricunha/dotclaude/commit/726eeac89d7a5b7dd60cbaad6f542dce96d4b43c)), closes [#114](https://github.com/kaiohenricunha/dotclaude/issues/114)
* **ci:** fix release-please config — drop ### prefix, add include-component-in-tag: false ([#54](https://github.com/kaiohenricunha/dotclaude/issues/54)) ([e7ae3e3](https://github.com/kaiohenricunha/dotclaude/commit/e7ae3e3495f8fd76dedd47213d46458bc6211d28))
* **ci:** strip tarball directory wrapper in lychee install step ([#116](https://github.com/kaiohenricunha/dotclaude/issues/116)) ([ac30bcd](https://github.com/kaiohenricunha/dotclaude/commit/ac30bcd0d38b4644bee61bf31a733fa896dee7f5)), closes [#115](https://github.com/kaiohenricunha/dotclaude/issues/115)
* **ci:** use PR author for bot-actor detection in dogfood ([#20](https://github.com/kaiohenricunha/dotclaude/issues/20)) ([7d5f00d](https://github.com/kaiohenricunha/dotclaude/commit/7d5f00d8229b8ccf00512b53f061126f2a46d804))
* **ci:** use PR_ACTOR to avoid GITHUB_ACTOR builtin collision ([#21](https://github.com/kaiohenricunha/dotclaude/issues/21)) ([5442ba5](https://github.com/kaiohenricunha/dotclaude/commit/5442ba5852d5ea71d7fb243fd86d716d6e35ad6a))
* close 12 open CodeQL alerts (permissions + security) ([#19](https://github.com/kaiohenricunha/dotclaude/issues/19)) ([57839bc](https://github.com/kaiohenricunha/dotclaude/commit/57839bc037dbf494b2a89e40af246bc01ebea3d1))
* **commands:** strengthen review-pr with branch health gates and mandatory test plan ([#25](https://github.com/kaiohenricunha/dotclaude/issues/25)) ([8274afd](https://github.com/kaiohenricunha/dotclaude/commit/8274afd78d1564ef386360da9da8c49bc5fe73a0))
* **deps:** patch js-yaml prototype pollution (GHSA-mh29-5h37-fv8m) ([#27](https://github.com/kaiohenricunha/dotclaude/issues/27)) ([41b6bb6](https://github.com/kaiohenricunha/dotclaude/commit/41b6bb6463d170f5d758de3ad63834b397e08bf0))
* **handoff-drift-fixture:** re-pad excluded-flags table for prettier ([c1a45e7](https://github.com/kaiohenricunha/dotclaude/commit/c1a45e73e5decb6f979c9064f44221d9e42b8d9f))
* **handoff-drift:** remove stale remote-list reference from --cli flag row ([4328935](https://github.com/kaiohenricunha/dotclaude/commit/4328935af8af7a500296dd98f01014d93e6fd12b))
* **handoff:** address Copilot review — fetch optional query + --from covers prune ([149d6b2](https://github.com/kaiohenricunha/dotclaude/commit/149d6b2065a9cecfcc9dbcef90506a5014f56fbb))
* **handoff:** clarify --from requirement applies to CLI not skill form; fix extractor docstring ([916fa28](https://github.com/kaiohenricunha/dotclaude/commit/916fa28deedbc46a51fc94ded0e4f57acb751f25))
* **handoff:** digest prompts group by message, not by line ([#84](https://github.com/kaiohenricunha/dotclaude/issues/84)) ([#97](https://github.com/kaiohenricunha/dotclaude/issues/97)) ([c595ef7](https://github.com/kaiohenricunha/dotclaude/commit/c595ef719810333fe04dd57b56a5f4b9d4b0b542))
* **handoff:** drop --cli bats test, fix prerequisites transport list, inline filterCli ([7e64f6e](https://github.com/kaiohenricunha/dotclaude/commit/7e64f6e960493d0eacc2948793e66d3c5bf73231))
* **handoff:** drop bare /handoff zero-arg alias ([#86](https://github.com/kaiohenricunha/dotclaude/issues/86)) ([#98](https://github.com/kaiohenricunha/dotclaude/issues/98)) ([ced24ca](https://github.com/kaiohenricunha/dotclaude/commit/ced24caf767da5d48c07e0c17309b9f884ef4dea))
* **handoff:** drop metadata.tag write-side (Phase 3 W-1) ([be25258](https://github.com/kaiohenricunha/dotclaude/commit/be25258fe8aab1967cc996f67d5276bb04807184))
* **handoff:** host-scope `latest` in bare &lt;query&gt; path ([#85](https://github.com/kaiohenricunha/dotclaude/issues/85)) ([#99](https://github.com/kaiohenricunha/dotclaude/issues/99)) ([40cafad](https://github.com/kaiohenricunha/dotclaude/commit/40cafad2eea11ad2c4e508568c396271f66d584c))
* **handoff:** pick_newest() busybox portability via stat probe ([#129](https://github.com/kaiohenricunha/dotclaude/issues/129)) ([#139](https://github.com/kaiohenricunha/dotclaude/issues/139)) ([e6a629b](https://github.com/kaiohenricunha/dotclaude/commit/e6a629b99346e1303f44a3cb7df7d8b722621584))
* **handoff:** refine list — filters, transport warnings, uniform row schema ([#100](https://github.com/kaiohenricunha/dotclaude/issues/100)) ([68fb908](https://github.com/kaiohenricunha/dotclaude/commit/68fb9087568e947be4c100c69344b39cc2aa412b))
* **handoff:** refuse force-push on short-id collision ([#90](https://github.com/kaiohenricunha/dotclaude/issues/90) Gap 3) ([#96](https://github.com/kaiohenricunha/dotclaude/issues/96)) ([a11649b](https://github.com/kaiohenricunha/dotclaude/commit/a11649b1a08043f932c634d57e93f53603829e39))
* **handoff:** remove dead --out-dir flag from META.flags (Phase 3 W-3) ([ddf76c9](https://github.com/kaiohenricunha/dotclaude/commit/ddf76c9dcea07caa038717522c5cb2c002e362f2))
* **handoff:** scrub every push and fail closed if scrubber cannot run ([#92](https://github.com/kaiohenricunha/dotclaude/issues/92)) ([8d0e6a6](https://github.com/kaiohenricunha/dotclaude/commit/8d0e6a6ce2e4b76621604a438c1fdd810bc94583))
* **handoff:** sort pull candidates by committer date ([#90](https://github.com/kaiohenricunha/dotclaude/issues/90) Gap 2) ([#95](https://github.com/kaiohenricunha/dotclaude/issues/95)) ([30e05c5](https://github.com/kaiohenricunha/dotclaude/commit/30e05c57271167633d5a666f89c89fca4c90e558))
* **handoff:** three v1.0.x patches — stderr template, narrowed-error spec amend, lazy yaml ([#135](https://github.com/kaiohenricunha/dotclaude/issues/135) [#136](https://github.com/kaiohenricunha/dotclaude/issues/136) [#130](https://github.com/kaiohenricunha/dotclaude/issues/130)) ([#140](https://github.com/kaiohenricunha/dotclaude/issues/140)) ([90a8e5b](https://github.com/kaiohenricunha/dotclaude/commit/90a8e5bb174a77910d946da435abef4eaa433d88))
* **handoff:** tighten drift-test extractor regexes (Phase 3 W-4) ([7b626ac](https://github.com/kaiohenricunha/dotclaude/commit/7b626aca5655902ad5086db9ccbc01913beafb55))
* **release:** drop softprops action, use gh CLI for release creation ([#15](https://github.com/kaiohenricunha/dotclaude/issues/15)) ([3695230](https://github.com/kaiohenricunha/dotclaude/commit/36952300cca5ec7cf8dc66bea660fd539501720c))
* remove squadranks vocabulary from project-agnostic surface ([#57](https://github.com/kaiohenricunha/dotclaude/issues/57)) ([59b5c63](https://github.com/kaiohenricunha/dotclaude/commit/59b5c6314861ad45150f5fa1c9087c057fc39175))
* **spec:** address all audit findings — spec text + agent tier rationale ([#42](https://github.com/kaiohenricunha/dotclaude/issues/42)) ([c557de3](https://github.com/kaiohenricunha/dotclaude/commit/c557de38004a2a08e69988213801daf8f9ad9de0))
* **test:** avoid bats $output capture for 10k-session stress test ([#63](https://github.com/kaiohenricunha/dotclaude/issues/63)) ([e1145b0](https://github.com/kaiohenricunha/dotclaude/commit/e1145b016e7a7266f133178084d13d04126d86b0))


### Changed

* align agents with build pipeline + scale-foundation tooling ([#48](https://github.com/kaiohenricunha/dotclaude/issues/48)) ([cca1433](https://github.com/kaiohenricunha/dotclaude/commit/cca143372d1d7dae58dafc1c0d81c8b9b5a89df8))
* **handoff:** extract remote transport to shared library ([#93](https://github.com/kaiohenricunha/dotclaude/issues/93)) ([d689d1e](https://github.com/kaiohenricunha/dotclaude/commit/d689d1e521cb56af4d1ce1db9b0db5f7aa1b5f52))
* **handoff:** rename git-fallback internals to remote ([#70](https://github.com/kaiohenricunha/dotclaude/issues/70)) ([fc8fbf7](https://github.com/kaiohenricunha/dotclaude/commit/fc8fbf773d2e2380d4b9e7097d41a47c53f86b9f))
* **harness:** move package.json to repo root for git-dep installability ([63f8278](https://github.com/kaiohenricunha/dotclaude/commit/63f82780ca97bc55fc415857cfea38e661719c2f))


### Documentation

* add Copilot instructions, review config, and AGENTS.md ([#65](https://github.com/kaiohenricunha/dotclaude/issues/65)) ([eb1aca4](https://github.com/kaiohenricunha/dotclaude/commit/eb1aca425b46467b64162c3b5c8ab1d4dcb9280c))
* clarify two-path usage model in README and CLAUDE.md ([#24](https://github.com/kaiohenricunha/dotclaude/issues/24)) ([f48fdb3](https://github.com/kaiohenricunha/dotclaude/commit/f48fdb333f4ccff573b254ed6f76c29e4843acca))
* **CLAUDE.md:** add Karpathy behavioral guidelines ([#26](https://github.com/kaiohenricunha/dotclaude/issues/26)) ([358d34f](https://github.com/kaiohenricunha/dotclaude/commit/358d34f552aca08619eb1d5b78200175a8ddae60))
* close v0.4-v0.5 coverage gaps + automate version stamps ([#56](https://github.com/kaiohenricunha/dotclaude/issues/56)) ([6e121c7](https://github.com/kaiohenricunha/dotclaude/commit/6e121c7721b5a504fe84cf65ea0539c2cf0f3f4e))
* document bootstrap + sync CLI commands in README and CLAUDE.md ([#30](https://github.com/kaiohenricunha/dotclaude/issues/30)) ([673bbad](https://github.com/kaiohenricunha/dotclaude/commit/673bbad9b36fbd7a32a86566439c5f50e8247fbc))
* **handoff:** drop --include-transcript from all docs ([#91](https://github.com/kaiohenricunha/dotclaude/issues/91) Gap 6) ([#103](https://github.com/kaiohenricunha/dotclaude/issues/103)) ([2545abe](https://github.com/kaiohenricunha/dotclaude/commit/2545abe252d8a5f681a1fbfe13d487e260d6da4e))
* **handoff:** slim SKILL.md to a thin wrapper around the binary ([#72](https://github.com/kaiohenricunha/dotclaude/issues/72)) ([fee18d7](https://github.com/kaiohenricunha/dotclaude/commit/fee18d7d3ed86e3ced9c6257ff38791c4a74c135))
* **harness:** add README ([14c9dbb](https://github.com/kaiohenricunha/dotclaude/commit/14c9dbbb3375ae198a46021694c3b3874effb75d))
* **harness:** full docs workstream + ADRs + command frontmatter (PR 6) ([#11](https://github.com/kaiohenricunha/dotclaude/issues/11)) ([1dc4aa3](https://github.com/kaiohenricunha/dotclaude/commit/1dc4aa303a57e5824d36e774063eb9229987b334))
* **plans:** add 10/10 remediation plan for harness productization ([df68006](https://github.com/kaiohenricunha/dotclaude/commit/df6800665d7e0453e81abccfda019ce9c0cd36a7))
* **README:** restructure for public audience ([7dbd661](https://github.com/kaiohenricunha/dotclaude/commit/7dbd661b4d463d9cb9fe36fd1323c352de79d5a8))
* **readme:** surface skills catalog, quick taste, and persona framing — 6.1→9.6/10 ([#45](https://github.com/kaiohenricunha/dotclaude/issues/45)) ([1c0634b](https://github.com/kaiohenricunha/dotclaude/commit/1c0634b96523325c33fbebf734d5e52277bca147))
* reposition dotclaude as a Claude Code toolkit ([#82](https://github.com/kaiohenricunha/dotclaude/issues/82)) ([8ac18d8](https://github.com/kaiohenricunha/dotclaude/commit/8ac18d83da07de97a38dbdfc58ceb114ad2cf80d))
* **spec:** register dotclaude-agents spec + gitignore cleanup ([#39](https://github.com/kaiohenricunha/dotclaude/issues/39)) ([09c5c85](https://github.com/kaiohenricunha/dotclaude/commit/09c5c85b6e1c6f6bb02316d5fd38e01c93b9f91f))

## [1.0.0](https://github.com/kaiohenricunha/dotclaude/compare/v0.11.0...v1.0.0) (2026-04-29)

The v1.0 stable cut of `@dotclaude/dotclaude`. Locks the handoff v2
surface, fixes the busybox/Alpine substrate crash, formalizes spec
templates that the v0.11.0 binary already implemented, and adds a CI
gate that prevents the release-pipeline drift behind #133/#134.

See [docs/migrations/v1.0.md](./docs/migrations/v1.0.md) for the full
verb-rename mapping and migration examples.

### ⚠ BREAKING CHANGES

- **handoff:** verb-rename surface redesign (#87, lands in this release). The pre-v1 `pull` verb (which fetched from the remote) and `--to <cli>` flag are gone. `--from <cli>` is now mandatory whenever the verb cannot infer the producing CLI from the input. Per spec §6.5 migration table:

  | Before (≤0.10.x)                          | After (v1.0)                                                |
  | ----------------------------------------- | ----------------------------------------------------------- |
  | `dotclaude handoff pull <id>`             | `dotclaude handoff fetch <id>`                              |
  | `dotclaude handoff pull <id> --to claude` | `dotclaude handoff fetch <id>` (consumer CLI is implicit)   |
  | `dotclaude handoff push <id>`             | `dotclaude handoff push <id>` (unchanged when `<id>` given) |
  | `dotclaude handoff push --from <cli>`     | unchanged; `--from` required when `<id>` is omitted         |
  | (no equivalent)                           | `dotclaude handoff pull <id>` — render a **local** session  |

  `pull` is now strictly local — it renders a local session as a
  `<handoff>` block, summary markdown (`--summary`), or a file
  (`-o <path>`). `fetch` is the remote-transport verb. `--to` is
  removed; the consumer CLI is always implicit (it's the one running
  the binary).

### Added

- **handoff:** `pull <id>` local rendering with `--summary` and `-o <path|auto|->` modes (#87). Stream isolation per spec §5.5.1 OPS-2: `<handoff>`/summary/path on stdout, progress on stderr.
- **handoff:** `prune --older-than <30d|6m|1y|YYYY-MM-DD>` for transport cleanup, with `--dry-run` and `--yes`.
- **handoff:** `--tag <label>` (multi-valued on push, single-value filter on `list --remote --tag`) and `list --remote --tags` histogram.
- **handoff:** push/fetch auto-run preflight on first use within a 5-minute window; `--verify` forces re-run. `doctor` verb unchanged.
- **handoff:** `<handoff>` block surfaces source CLI's customTitle / thread_name when present; resolver accepts named aliases on codex.
- **release:** `.github/workflows/release-gate.yml` enforces version-tag alignment on every PR to main and runs the published-tarball-vs-source diff on release PRs (#134).
- **docs:** `docs/migrations/v1.0.md` migration guide; spec §5.3.2 amended to formalize the narrowed `no <cli> session matches` form when `--from` is set.

### Fixed

- **handoff #129:** `pick_newest()` no longer crashes on busybox/Alpine. The runtime `||` fallback chain (find -printf → stat -f → stat -c) is replaced by a single probe at script init that detects GNU/BSD/posix substrates and selects one deterministic path. Fixed in #139.
- **handoff #135:** pull no-match stderr no longer double-prefixes `dotclaude-handoff: handoff-resolve: ...`. Fixed in #140 — the resolver script's prefix is stripped before the binary's own prefix is added.
- **handoff #130:** `js-yaml` is now lazy-loaded inside `build-index.mjs`. `dotclaude handoff --help` and other handoff commands no longer require `js-yaml` to be installed. Fixed in #140.

### Documentation

- **handoff #131 — system requirements (out of scope: sh-only environments).** The handoff toolchain requires `bash` 4+, `jq` 1.6+, `perl` 5.x, `git` 2.x, and GNU coreutils on the path. POSIX `sh`-only environments (e.g. minimal Alpine without bash installed) are unsupported. Substrate detection at script init handles GNU vs BSD vs busybox coreutils transparently as long as bash is present. See [docs/handoff-guide.md](./docs/handoff-guide.md#system-requirements).

- **handoff #132 — known property: branch namespace is host-agnostic.** Handoff branches are named `handoff/<project>/<cli>/<YYYY-MM>/<short-uuid>` (no hostname segment). If you fetch a session on machine A, edit it locally, then push from machine B against the same short-uuid, the second push **overwrites** the first. The short-uuid collision check (`metadata.json:hostname`) detects cross-host overwrites and exits 2 unless `--force-collision` is set, but the branch namespace itself is host-agnostic by design. See [docs/handoff-guide.md](./docs/handoff-guide.md#cross-host-collision-semantics).

- **handoff CP-1 — Copilot slash-handler does not pass `--summary` / `-o` flags through.** `/handoff pull latest --summary` and `/handoff pull latest -o <path>` exit 64 inside the Copilot CLI before the binary is invoked (the Copilot slash parser strips flag-prefixed arguments). Mitigation: invoke the bare binary, e.g. `!dotclaude handoff pull latest --summary`. The Claude Code and Codex slash paths are unaffected.

- **handoff CX-1 — progress messages go to stderr per spec §5.5.1 OPS-2.** When capturing the first line of `pull <id>` output (e.g. inside the Codex `!`-shell which displays the interleaved combined stream), redirect stderr explicitly: `dotclaude handoff pull <id> 2>/dev/null | head -1`. The `<handoff>` block, summary markdown, and `-o`-target path are stdout; the `latest <cli> session: <id>` and `using --from <cli> override` lines are stderr.

## [0.11.0](https://github.com/kaiohenricunha/dotclaude/compare/v0.10.0...v0.11.0) (2026-04-20)


### ⚠ BREAKING CHANGES

* **handoff:** self-bootstrap push — drop init ceremony and schema pin ([#80](https://github.com/kaiohenricunha/dotclaude/issues/80))

### Added

* **handoff:** self-bootstrap push — drop init ceremony and schema pin ([#80](https://github.com/kaiohenricunha/dotclaude/issues/80)) ([ab02686](https://github.com/kaiohenricunha/dotclaude/commit/ab026867a2b3665d413961cb1f9faf6ae8cecc85))

## [0.10.0](https://github.com/kaiohenricunha/dotclaude/compare/v0.9.0...v0.10.0) (2026-04-20)


### ⚠ BREAKING CHANGES

* **handoff:** every `dotclaude handoff push` now requires a one-time `dotclaude handoff init` against $DOTCLAUDE_HANDOFF_REPO. Existing v1 branches remain readable; writes always emit the new v2 shape. Migrate script lands as a follow-up (plan PR C). Migration is one command: `dotclaude handoff init`.

### Added

* **handoff:** v2 store taxonomy + schema enforcement + init ([#73](https://github.com/kaiohenricunha/dotclaude/issues/73)) ([6da64bb](https://github.com/kaiohenricunha/dotclaude/commit/6da64bb80f7e25d489d1ee92bef2416d3a1674a2))

## [0.9.0](https://github.com/kaiohenricunha/dotclaude/compare/v0.8.0...v0.9.0) (2026-04-20)


### ⚠ BREAKING CHANGES

* **handoff:** `--via github`, `--via gist-token`, `--via git-fallback`, `DOTCLAUDE_GH_TOKEN`, and the `references/transport-github.md` file are removed. Migration is `s/ --via git-fallback//g` across any script that called `dotclaude handoff push|pull --via git-fallback`; gist users move to a private git repo (`gh repo create handoff-store --private` + `export DOTCLAUDE_HANDOFF_REPO=git@github.com:<user>/handoff-store.git`) and delete leftover gists with `gh gist list` + `gh gist delete <id>`.

### Added

* **handoff:** promote doctor, remote-list, search into the binary ([#71](https://github.com/kaiohenricunha/dotclaude/issues/71)) ([7ea0883](https://github.com/kaiohenricunha/dotclaude/commit/7ea08833104ebe89292e4b280468670fbb08bff0))
* **handoff:** remove gist transports, drop --via flag ([#68](https://github.com/kaiohenricunha/dotclaude/issues/68)) ([9aec0dc](https://github.com/kaiohenricunha/dotclaude/commit/9aec0dc0902a58831898ad34ccda97be06250b3f))


### Changed

* **handoff:** rename git-fallback internals to remote ([#70](https://github.com/kaiohenricunha/dotclaude/issues/70)) ([fc8fbf7](https://github.com/kaiohenricunha/dotclaude/commit/fc8fbf773d2e2380d4b9e7097d41a47c53f86b9f))


### Documentation

* **handoff:** slim SKILL.md to a thin wrapper around the binary ([#72](https://github.com/kaiohenricunha/dotclaude/issues/72)) ([fee18d7](https://github.com/kaiohenricunha/dotclaude/commit/fee18d7d3ed86e3ced9c6257ff38791c4a74c135))

## [0.8.0](https://github.com/kaiohenricunha/dotclaude/compare/v0.7.0...v0.8.0) (2026-04-19)


### ⚠ BREAKING CHANGES

* **handoff:** `push <cli> <query>` and `pull <cli> <handle>` now exit 64 with a migration message pointing at `--from`. Power-user subs (resolve/describe/digest/file) keep their explicit `<cli> <id>`.

### Added

* **handoff:** drop &lt;cli&gt; positional from push/pull ([#66](https://github.com/kaiohenricunha/dotclaude/issues/66)) ([a172e0e](https://github.com/kaiohenricunha/dotclaude/commit/a172e0e3b736094c43b80047ed2e217ed30a8301))


### Fixed

* **test:** avoid bats $output capture for 10k-session stress test ([#63](https://github.com/kaiohenricunha/dotclaude/issues/63)) ([e1145b0](https://github.com/kaiohenricunha/dotclaude/commit/e1145b016e7a7266f133178084d13d04126d86b0))


### Documentation

* add Copilot instructions, review config, and AGENTS.md ([#65](https://github.com/kaiohenricunha/dotclaude/issues/65)) ([eb1aca4](https://github.com/kaiohenricunha/dotclaude/commit/eb1aca425b46467b64162c3b5c8ab1d4dcb9280c))

## [0.7.0](https://github.com/kaiohenricunha/dotclaude/compare/v0.6.0...v0.7.0) (2026-04-19)

### Added

- **handoff:** shell-scripts-first refactor + dotclaude-handoff binary ([#58](https://github.com/kaiohenricunha/dotclaude/issues/58)) ([176cb9d](https://github.com/kaiohenricunha/dotclaude/commit/176cb9dd9a0c1ba5362bd783604343aaa4815b19))

## [0.6.0](https://github.com/kaiohenricunha/dotclaude/compare/v0.5.0...v0.6.0) (2026-04-18)

### Added

- /pre-pr and /review-prs commands + CLAUDE.md rule refinements ([#51](https://github.com/kaiohenricunha/dotclaude/issues/51)) ([4e300ca](https://github.com/kaiohenricunha/dotclaude/commit/4e300ca399555d9b2fc8f018d30fe55fcbe977f4))
- **ci:** automate semantic versioning with release-please ([#52](https://github.com/kaiohenricunha/dotclaude/issues/52)) ([67e7949](https://github.com/kaiohenricunha/dotclaude/commit/67e79491a190c6dfa51188de55daf80169be7436))

### Fixed

- **ci:** allow release-please CHANGELOG formatting in lint checks ([#55](https://github.com/kaiohenricunha/dotclaude/issues/55)) ([7b0c048](https://github.com/kaiohenricunha/dotclaude/commit/7b0c0484425b508d0e15373725f3710963adadca))
- **ci:** fix release-please config — drop ### prefix, add include-component-in-tag: false ([#54](https://github.com/kaiohenricunha/dotclaude/issues/54)) ([e7ae3e3](https://github.com/kaiohenricunha/dotclaude/commit/e7ae3e3495f8fd76dedd47213d46458bc6211d28))
- remove squadranks vocabulary from project-agnostic surface ([#57](https://github.com/kaiohenricunha/dotclaude/issues/57)) ([59b5c63](https://github.com/kaiohenricunha/dotclaude/commit/59b5c6314861ad45150f5fa1c9087c057fc39175))

### Documentation

- close v0.4-v0.5 coverage gaps + automate version stamps ([#56](https://github.com/kaiohenricunha/dotclaude/issues/56)) ([6e121c7](https://github.com/kaiohenricunha/dotclaude/commit/6e121c7721b5a504fe84cf65ea0539c2cf0f3f4e))

## [Unreleased]

### BREAKING

- **`handoff push`/`pull`**: the `<cli>` positional is removed. The
  resolver already auto-detects across all three roots (claude,
  copilot, codex); forcing the user to state the source CLI was
  busywork. Migration:
  - `dotclaude-handoff push claude <q>` → `dotclaude-handoff push <q>`
    (or `... push <q> --from claude` to force a root).
  - `dotclaude-handoff pull claude <h>` → `dotclaude-handoff pull <h>`
    (or `... pull <h> --from claude`).
  - Power-user subs (`resolve`, `describe`, `digest`, `file`) keep
    their explicit `<cli> <id>` — scripting entry points unchanged.

  The binary now exits 64 on the removed form with an actionable
  message pointing at `--from` and this CHANGELOG. Bare
  `dotclaude-handoff` (no positionals) now executes `push` (host's
  latest session), aligning the binary with SKILL.md's five-form
  surface. Help still lives behind `--help`.

### Added

- **`--from <cli>` flag** on `push` / `pull` / bare `<query>`.
  Narrows auto-detection to a single root. Useful for scripting and
  for resolving short-UUID collisions across roots.
- **`detectHost()` env-probe routing.** The binary best-effort
  identifies the agentic CLI it is running inside via `CLAUDECODE`,
  `CLAUDE_CODE_SSE_PORT`, and `CODEX_*` / `COPILOT_*` / `GITHUB_COPILOT_*`
  prefix scans. All signals are labelled UNCONFIRMED in the source —
  false positives are cheap (a narrower resolve) and false negatives
  fall back to the union resolver.
- **Honest stderr fallback notes.** Bare `push` (no query) now prints
  one stderr line naming which fallback fired:
  - `no current-session signal in <cli>, using latest <cli> session: <short>`
    — host was detected, narrowed to its root.
  - `using --from <cli> override, latest session: <short>` — `--from`
    was explicit, host was not detected or differed.
  - `host not detected, using latest across all clis: <short>` —
    union-resolver fallback.
- **`--to` default is the detected host.** Previously hardcoded to
  `claude`; now matches whichever CLI the binary is running inside
  (falling back to `claude` when undetected).

## [0.5.0] — 2026-04-18

No breaking changes. This release adds cross-machine session handoff via GitHub
Gists, a `docker-engineer` agent, a curl-pipe-bash installer, and a refactored
agent build pipeline.

### Added

- **Cross-machine handoff transport** — `/handoff push`, `pull`, `remote-list`,
  and `doctor` sub-commands let a session started on one machine (Windows/WSL)
  be resumed on another (PopOS / macOS / CI). Default transport uses
  `gh gist`; `--via gist-token` (curl + PAT) and `--via git-fallback` (raw
  git) are documented workarounds for hosts where `gh` is unavailable or
  blocked. Includes a push-side secret-scrubbing pass covering eight token
  patterns, a `handoff-doctor.sh` preflight with per-transport remediation
  blocks, and 80 bats unit tests plus an e2e gist round-trip harness (#46,
  #49).
- **`docker-engineer` agent** — Compose orchestration and runtime ops; covers
  multi-service health, volume binding, network bridge configuration, and
  registry operations (#47).
- **curl-pipe-bash installer** — `curl -sSL .../install.sh | bash` path for
  users who prefer not to use npm. Idempotent; respects `NO_COLOR` (#44).

### Changed

- **Agent build pipeline alignment** — all agents consistently use the
  build-plugin script for template generation; scale-foundation tooling
  refactored to be purely generic (no project-specific references) (#48).

### Documentation

- README surfaces the skills catalog, a quick-taste section, and a revised
  persona framing (quality score raised from 6.1 → 9.6/10 per the README
  assessment) (#45).

## [0.4.0] — 2026-04-17

No breaking changes. This release adds the global-lifecycle CLI
(`dotclaude bootstrap`, `dotclaude sync`), first-class agents, the
taxonomy pipeline (schemas → backfill → search/list/show → build-plugin),
and a broad set of provider and IaC agents.

### Added

- **Global lifecycle CLI** — `dotclaude bootstrap` (set up or refresh
  `~/.claude/`) and `dotclaude sync <pull|status|push>` (update an
  installation). Both are idempotent, support `--json` / `--quiet`
  / `--no-color`, and are registered as subcommands of the umbrella
  `dotclaude` dispatcher alongside the taxonomy commands (#29).
- **First-class agent support** — agents directory, model routing,
  and discovery wired into the plugin (#28). Ships with 21 agents
  across generalist, specialist, and veracity tiers (#40):
  - Kubernetes ecosystem agents + `kubernetes-specialist` skill (#31).
  - AWS, Azure, GCP provider agents + `*-specialist` skills (#32).
  - IaC tool agents (Terraform, Terragrunt, Pulumi, Crossplane) +
    `*-specialist` skills (#33).
  - Generic veracity harness: `data-scientist`, `compliance-auditor`,
    and the `veracity-audit` skill (#41).
- **Taxonomy pipeline** — a four-phase buildout that formalizes the
  skill/agent metadata layer:
  - Phase 1: schemas + index builder + non-breaking CLI (#34).
  - Phase 2: frontmatter backfill + schema tightening (#36).
  - Phase 3: `dotclaude search`, `dotclaude list`, `dotclaude show`
    - governance docs + CI gate (#37).
  - Phase 4: `build-plugin` script + generated plugin templates (#38).
- **Slash commands** — generic `/review-pr` (#22) and `/create-inspection`
  (#23), plus strengthened branch-health gates and mandatory test plans
  in `/review-pr` (#25).
- **Lint pipeline** — `npm run lint` now wires `prettier` and
  `markdownlint-cli2` (#18).

### Changed

- README and CLAUDE.md document the two-path usage model
  (bootstrap vs npm plugin) (#24) and the new `bootstrap` / `sync`
  subcommands (#30).
- CLAUDE.md absorbs the Karpathy behavioral guidelines (#26).
- `dotclaude-agents` spec registered; `.gitignore` cleaned up (#39).
- Agent spec text updated with tier rationale from audit findings (#42).
- CI bumps `actions/upload-artifact` 4.6.2 → 7.0.1 (#13).

### Fixed

- `bootstrap` now links `hooks/` into `~/.claude/hooks/` so
  guard-destructive-git and friends apply globally (#35).
- Patched `js-yaml` prototype pollution (GHSA-mh29-5h37-fv8m) (#27).
- Closed 12 open CodeQL alerts around workflow permissions and
  security (#19).
- Dogfood workflow now uses `PR_ACTOR` (derived from PR author)
  instead of the `GITHUB_ACTOR` builtin, restoring correct bot
  detection (#20, #21).

## [0.3.0] — 2026-04-14

### Breaking

- **Package renamed** from `@kaiohenricunha/harness` → `@dotclaude/dotclaude`.
  Update your `package.json` dependency and all imports.
- **All CLI bins renamed**: `harness-*` → `dotclaude-*` (e.g. `harness-doctor`
  → `dotclaude-doctor`). Update CI workflows, pre-commit hooks, and any scripts
  that invoke them directly.
- **Three env vars renamed**: `HARNESS_DEBUG` → `DOTCLAUDE_DEBUG`,
  `HARNESS_JSON` → `DOTCLAUDE_JSON`, `HARNESS_REPO_ROOT` → `DOTCLAUDE_REPO_ROOT`.
  Note: `HARNESS_CHANGED_FILES` (CI diff input) and `HARNESS_SYNC_SKIP_SECRET_SCAN`
  (sync.sh bypass) are **not** renamed — they remain `HARNESS_*`.
- **Plugin directory** moved from `plugins/harness/` → `plugins/dotclaude/`
  (affects deep imports — use the public barrel `@dotclaude/dotclaude` instead).
- **Spec ID** `harness-core` → `dotclaude-core` (update `Spec ID:` lines in PR
  bodies and any `depends_on_specs` references).

### Changed

- npm scope changed from `@kaiohenricunha` to `@dotclaude` — published under
  the public `dotclaude` npm org.
- Prose and docs de-personalized for a public audience.

## [0.2.0] — 2026-04-14

First public release targeting `npm publish --provenance --access public`.
Productizes the plugin: public Node API barrel, structured-error contract,
umbrella CLI, shell hardening, full bats + vitest coverage, dogfood wiring,
and the docs set consumers need to adopt.

### Added

- **Node API barrel** at `plugins/dotclaude/src/index.mjs` — 24+ named exports
  covering every validator + `ValidationError` + `EXIT_CODES` + `version`.
- **Structured error taxonomy** (`plugins/dotclaude/src/lib/errors.mjs`): every
  validator emits `ValidationError` instances with stable `.code`, `.file`,
  `.pointer`, `.expected`, `.got`, `.hint`, `.category`. Enumerated codes
  (`SPEC_STATUS_INVALID`, `MANIFEST_CHECKSUM_MISMATCH`,
  `COVERAGE_UNCOVERED`, `DRIFT_TEAM_COUNT`, …) are a stable contract —
  renames are breaking.
- **Named `EXIT_CODES`** (`{OK:0, VALIDATION:1, ENV:2, USAGE:64}`) consumed
  by every bin. `64` mirrors BSD `sysexits.h EX_USAGE`.
- **Umbrella `dotclaude` CLI** that dispatches to subcommands:
  `harness validate-specs|validate-skills|check-spec-coverage|check-instruction-drift|detect-drift|doctor|init`.
  Every bin also exists as a standalone — `dotclaude-doctor`, `dotclaude-init`,
  etc.
- **`dotclaude-doctor`** — runs through env, repo, facts, manifest, specs,
  drift, and hook checks and reports `✓/✗/⚠` with exit 0/1/2.
- **`dotclaude-detect-drift`** — wraps `plugins/dotclaude/scripts/detect-branch-drift.mjs`
  so `npx dotclaude-detect-drift` resolves. Fixes the broken
  `plugins/dotclaude/templates/workflows/detect-drift.yml:15` invocation.
- **Universal CLI flags** across every bin: `--help`, `--version`, `--json`,
  `--verbose`, `--no-color`, plus bin-specific flags (`--update`,
  `--project-name`, `--force`, `--target-dir`, …).
- **`--json` output** on every bin and on `validate-settings.sh`, suitable
  for `jq -r '.events[] | …'` CI pipelines.
- **`set -euo pipefail`** across every shipped shell script; ✓/✗/⚠ helpers
  factored into `plugins/dotclaude/scripts/lib/output.sh` and mirrored in
  `src/lib/output.mjs`.
- **Hardened `guard-destructive-git.sh`** — normalizes tab whitespace,
  boundary-anchors `git` tokens, adds blocks for `git branch -D` and
  `git worktree remove --force`, and exposes `BYPASS_DESTRUCTIVE_GIT=1`
  bypass. Exit 2 preserved per Claude Code PreToolUse protocol.
- **`bootstrap.sh --quiet` + `--help`** plus a trailing
  `run 'dotclaude-doctor' to verify install` hint when the bin is on PATH.
- **`sync.sh` secret scan** — literal `_KEY` / `_TOKEN` / `_SECRET` + AWS
  keys + bearer tokens are refused at push time.
  `HARNESS_SYNC_SKIP_SECRET_SCAN=1` is the documented escape hatch.
- **bats suite** at `plugins/dotclaude/tests/bats/` (34 tests) covering every
  hardened shell surface.
- **Coverage gate** — `vitest run --coverage` enforces lines 85 /
  functions 85 / branches 80 / statements 85 via `vitest.config.mjs`.
- **`examples/minimal-consumer/`** — committed post-`dotclaude-init` scaffold.
- **Dogfood**: root `.claude/{settings,skills-manifest}.json`,
  `docs/repo-facts.json`, `docs/specs/dotclaude-core/{spec.json,spec.md}`.
  Every validator exits 0 against the root (see `npm run dogfood`).
- **Docs set**: `LICENSE`, `CHANGELOG.md` (this file), `CONTRIBUTING.md`,
  `CODE_OF_CONDUCT.md`, `docs/{index,quickstart,cli-reference,api-reference,architecture,personas,troubleshooting,upgrade-guide}.md`,
  `docs/adr/`, `plugins/dotclaude/templates/README.md`. README.md and
  `plugins/dotclaude/README.md` rewritten for consumer clarity.
- **Commands** (`.claude/commands/*.md`) get YAML frontmatter matching the
  `skills/*/SKILL.md` schema.

### Changed

- **Public surface** — deep imports from `plugins/dotclaude/src/*.mjs` are no
  longer a supported contract. Use the barrel import.
- **`package.json`** — `"main"` now points at the real barrel; `"exports"`
  field added; three new `"bin"` entries; `"files"` covers
  `plugins/dotclaude/scripts/` so `refresh-worktrees.sh`,
  `detect-branch-drift.mjs`, and `auto-update-manifest.mjs` ship in the
  tarball; version bumped to `0.2.0`.

### Breaking changes (for early adopters of 0.1.x)

- Validator errors are `ValidationError` instances, not strings. Existing
  CI pipelines that `grep` stderr continue to work because
  `ValidationError.prototype.toString()` preserves the
  `"<file>: <message>"` format; pipelines that consume `--json` get the
  structured payload.
- Deep imports (`import { … } from "@dotclaude/dotclaude/src/validate-specs.mjs"`)
  are no longer a supported contract — use the barrel.

## [0.1.0] — 2026-04-13

Retroactive entry. Initial plugin skeleton: spec-harness library, five
validators, template tree, hook, and `test_validate_settings.sh`. Never
published to npm — the first published version is 0.2.0.

## Roadmap

- Marketplace submission for the Claude Code plugin listing.
- `dotclaude upgrade` subcommand to migrate consumer repos across versions.
- `.d.ts` shipping for stronger type inference (via hand-authored declarations
  — TypeScript migration is out of scope per ADR-0002).
