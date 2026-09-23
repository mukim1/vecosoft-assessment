"""Export every user prompt from Claude Code transcripts, verbatim and in order.

Usage:
    python scripts/export_prompts.py                 # prompts since 2026-09-23T05:50Z
    python scripts/export_prompts.py --since 2026-09-23T05:00:00Z > PROMPT_HISTORY.md
"""
import argparse
import glob
import json
import os
import sys

PROJECTS_DIR = os.path.expanduser("~/.claude/projects")


def extract_text(content):
    if isinstance(content, str):
        return content
    parts = []
    for block in content:
        if block.get("type") == "text":
            parts.append(block["text"])
        elif block.get("type") == "image":
            parts.append("[image attached]")
    return "\n".join(parts)


def is_real_prompt(entry):
    if entry.get("type") != "user" or entry.get("isSidechain") or entry.get("isMeta"):
        return False
    content = entry.get("message", {}).get("content")
    # Tool results are also stored as "user" messages. Skip them.
    if isinstance(content, list) and any(b.get("type") == "tool_result" for b in content):
        return False
    return True


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--since", default="2026-09-23T05:50:00Z", help="ISO UTC timestamp")
    args = parser.parse_args()

    prompts = []
    for path in glob.glob(os.path.join(PROJECTS_DIR, "*", "*.jsonl")):
        with open(path, encoding="utf-8") as f:
            for line in f:
                try:
                    entry = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if is_real_prompt(entry) and entry.get("timestamp", "") >= args.since:
                    text = extract_text(entry["message"]["content"]).strip()
                    if text:
                        prompts.append((entry["timestamp"], entry.get("cwd", ""), text))

    prompts.sort(key=lambda p: p[0])
    sys.stdout.reconfigure(encoding="utf-8")
    print("# AI Prompt History — Claude Code (Claude Opus 5.5)\n")
    for i, (ts, cwd, text) in enumerate(prompts, 1):
        print(f"## Prompt {i} — {ts}\n\n_cwd: {cwd}_\n\n```text\n{text}\n```\n")


if __name__ == "__main__":
    main()
