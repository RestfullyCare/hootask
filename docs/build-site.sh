#!/usr/bin/env bash
# Builds the GitHub Pages site from release tags into $1 (default: site).
#
# - Latest stable release           → /hootask/
# - Latest patch of each older minor → /hootask/v<major>.<minor>/
# - versions.json at the root, read by the version select in every build
#
# Each version is built from its own tag: its own docs, code, lockfile and
# tool versions. Tags without docs/ are skipped.
set -euo pipefail

root=/hootask
mkdir -p "${1:-site}"
out=$(cd "${1:-site}" && pwd)

build() { # <tag> <base> <dest>
  local wt
  wt=$(mktemp -d)
  git worktree add --detach --quiet "$wt" "$1"
  (
    cd "$wt"
    mise trust --quiet
    mise install --quiet
    mise exec -- pnpm install --frozen-lockfile --silent
    DOCS_BASE=$2 mise exec -- pnpm --filter docs build
  )
  mkdir -p "$3"
  cp -R "$wt/docs/dist/." "$3"
  git worktree remove --force "$wt"
}

entries=()
seen=" "
for tag in $(git tag --list 'v*' --sort=-v:refname | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$'); do
  git cat-file -e "$tag:docs/astro.config.mjs" 2>/dev/null || continue
  minor=${tag%.*}
  [[ $seen == *" $minor "* ]] && continue
  seen+="$minor "

  if [[ ${#entries[@]} -eq 0 ]]; then
    build "$tag" "$root" "$out"
    entries+=("{\"label\":\"Latest ($tag)\",\"path\":\"$root/\"}")
  else
    build "$tag" "$root/$minor" "$out/$minor"
    entries+=("{\"label\":\"$minor\",\"path\":\"$root/$minor/\"}")
  fi
done

if [[ ${#entries[@]} -eq 0 ]]; then
  echo "No release tag has docs/ yet." >&2
  exit 1
fi

(
  IFS=,
  echo "[${entries[*]}]"
) >"$out/versions.json"
