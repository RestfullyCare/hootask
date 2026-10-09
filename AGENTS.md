# AGENTS.md

Public, MIT-licensed Hootask SDK, published to npm.

## Layout

- `packages/js`: `@hootask/js`, headless and framework-agnostic. No DOM, Node,
  or framework APIs (`lib: ES2023`, `types: []`, tsdown `platform: neutral`).
- `packages/react`: `@hootask/react`, built on `@hootask/js`; `react` is a peer
  dependency.

In the workspace, `exports` point at `src/*.ts`; `publishConfig.exports` swaps
in `dist/` on pack.

## Setup

[mise](https://mise.jdx.dev) installs node (`.node-version`) and pnpm.

```bash
mise install
pnpm install
```

## Commands

| Command          | What                                               |
| ---------------- | -------------------------------------------------- |
| `pnpm build`     | tsdown, then publint + attw on each packed tarball |
| `pnpm typecheck` | `tsc` in every package                             |
| `pnpm lint`      | ESLint                                             |
| `pnpm format`    | Prettier (`format:check` in CI)                    |
| `pnpm test`      | Vitest across packages                             |

A Husky pre-commit hook runs ESLint and Prettier on staged files.

## Conventions

- Conventional Commits (`feat(js): …`, `fix(react): …`, `chore: …`).
- Branch from the Linear issue (Linear's "copy git branch name") so it links back.
- Don't add runtime dependencies to `@hootask/js` without a strong reason; it
  ships into customers' bundles.

## Releasing

Both packages share one version (lockstep).

1. Set the same `version` in `packages/js/package.json` and
   `packages/react/package.json`.
2. Commit, tag `v<version>`, push the tag.

`release.yml` checks the tag matches both versions, runs the full CI, and
publishes with npm trusted publishing (OIDC) and provenance.
