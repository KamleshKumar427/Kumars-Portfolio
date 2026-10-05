#!/usr/bin/env bash
# Links the facts about Kamlesh from the CV project into .claude/profile/, so
# this site and the CV pipeline read one source of truth instead of copies that
# drift apart.
#
#   bash scripts/link-profile.sh                  # CV project at ../Curriculum-Vitae
#   bash scripts/link-profile.sh /path/to/CV      # anywhere else
#
# The links are relative, so they keep working if both projects move together.
# .claude/profile/ is gitignored: the facts stay on this machine.
set -euo pipefail

repo="$(cd "$(dirname "$0")/.." && pwd)"
cv="${1:-$repo/../Curriculum-Vitae}"
if [ ! -f "$cv/profile/facts.md" ]; then
  echo "No profile/facts.md under $cv." >&2
  echo "Pass the CV project's folder: bash scripts/link-profile.sh /path/to/Curriculum-Vitae" >&2
  exit 1
fi
cv="$(cd "$cv" && pwd)"

dest="$repo/.claude/profile"
mkdir -p "$dest"
base="$(node -e 'console.log(require("node:path").relative(process.argv[1], process.argv[2]))' "$dest" "$cv")"

link() { ln -sfn "$base/$1" "$dest/$2"; }
link profile/facts.md facts.md
link profile/stories.md stories.md
link myData.md myData.md
link Kamlesh_Kumar_Resume_BASELINE.tex cv-baseline.tex
link Kamlesh_Kumar_Resume_BASELINE.pdf cv-baseline.pdf

status=0
for f in facts.md stories.md myData.md cv-baseline.tex cv-baseline.pdf; do
  if [ -e "$dest/$f" ]; then
    echo "linked  .claude/profile/$f"
  else
    echo "missing .claude/profile/$f (not found in the CV project)" >&2
    status=1
  fi
done
exit "$status"
