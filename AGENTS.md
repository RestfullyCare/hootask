# AGENTS.md

Public, MIT-licensed Hootask SDK, published to npm.

## Layout

- `packages/js`: `@hootask/js`, headless and framework-agnostic. No DOM, Node,
  or framework APIs (`lib: ES2023`, `types: []`, tsdown `platform: neutral`).
- `packages/react`: `@hootask/react`, built on `@hootask/js`; `react` is a peer
  dependency.
- `docs`: SDK docs site (Starlight). The API reference is generated from TSDoc
  in `packages/*` at build time, so document exports with TSDoc. `pnpm --filter
docs dev` to preview. Deploys to GitHub Pages on each published release.

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

- `main` is protected: pull request required, CI must pass, linear history
  (squash or rebase).
- Conventional Commits (`feat(js): …`, `fix(react): …`, `chore: …`).
- Branch from the Linear issue (Linear's "copy git branch name") so it links back.
- Don't add runtime dependencies to `@hootask/js` without a strong reason; it
  ships into customers' bundles.

## Releasing

Both packages share one version (lockstep).

1. New minor or major only: archive the outgoing version's docs by adding
   `{ slug: "<outgoing version>" }` to `starlightVersions({ versions })` in
   `docs/astro.config.mjs`, run `pnpm --filter docs build`, and commit the
   generated `docs/src/content/docs/<version>/` and
   `docs/src/content/versions/<version>.json`.
2. Set the same `version` in `packages/js/package.json` and
   `packages/react/package.json`; merge to `main` through a pull request.
3. Publish a GitHub Release with tag `v<version>`:
   `gh release create v<version> --generate-notes` (or the GitHub UI).

`release.yml` runs on the published release: checks the tag matches both
versions, runs the full CI, and publishes with npm trusted publishing (OIDC)
and provenance. `docs.yml` redeploys the docs site.
