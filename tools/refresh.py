#!/usr/bin/env python3
"""Refresh the counters in README.md from the GitHub API.

No GitHub Action and no third-party stats widget: run this by hand when the numbers
are worth updating, then commit.

    python3 tools/refresh.py
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

USER = "cYoren"
README = Path(__file__).resolve().parent.parent / "README.md"
BLOCK = re.compile(r"(<!-- counters:start -->)(.*?)(<!-- counters:end -->)", re.S)


def api(path: str) -> dict:
    """One GET through the gh CLI, so it uses the token already configured."""
    out = subprocess.run(
        ["gh", "api", path], capture_output=True, text=True, check=True
    ).stdout
    return json.loads(out)


def count(query: str) -> int:
    return api(f"search/{query}")["total_count"]


def counters() -> dict[str, int]:
    repos = api(f"users/{USER}/repos?per_page=100&type=owner")
    return {
        "commits": count(f"commits?q=author:{USER}&per_page=1"),
        "pull requests": count(f"issues?q=author:{USER}+type:pr&per_page=1"),
        "reviews": count(f"issues?q=reviewed-by:{USER}&per_page=1"),
        "original repos": len([r for r in repos if not r["fork"]]),
    }


def main() -> int:
    try:
        values = counters()
    except subprocess.CalledProcessError as exc:
        print(f"gh api failed: {exc.stderr.strip()[:300]}", file=sys.stderr)
        return 1

    line = " &nbsp;·&nbsp; ".join(
        f"<b>{value:,}</b> {name}" for name, value in values.items()
    )
    text = README.read_text()
    if not BLOCK.search(text):
        print("counters block not found in README.md", file=sys.stderr)
        return 1
    README.write_text(BLOCK.sub(lambda m: f"{m.group(1)}\n  {line}\n  {m.group(3)}", text))
    print(line)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
