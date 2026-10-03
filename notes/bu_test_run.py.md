# bu_test_run.py

> category: sandbox

#!/usr/bin/env python3
"""
Browser Use Cloud — V4 Agent test run.
Creates a run, polls until completion, prints the result.

Prerequisites:
  pip install --upgrade browser-use-sdk

Set your key (already in vault, just export it):
  export BROWSER_USE_API_KEY=bu_ot5in1i_FlzVU2fAkv-qZx4b-U8r5ipnNVX4jEB87A4
"""

import os
import time
import urllib.request
import urllib.error
import json

API_KEY = os.environ.get("BROWSER_USE_API_KEY")
if not API_KEY:
    raise SystemExit("Set BROWSER_USE_API_KEY env var first.")

BASE = "https://api.browser-use.com/api/v4"
HEADERS = {
    "X-Browser-Use-API-Key": API_KEY,
    "Content-Type": "application/json",
}

def api(method, path, body=None):
    url = f"{BASE}{path}"
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(url, data=data, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        err = e.read().decode()
        print(f"HTTP {e.code}: {err}")
        raise

# ── 1. Create a run ──────────────────────────────────────────────
task = "Go to news.ycombinator.com and tell me the title of the #1 story."
print(f"Creating run: {task}")

run = api("POST", "/runs", {"task": task})
run_id = run["id"]
session_id = run.get("session_id")
print(f"  run_id={run_id}  session_id={session_id}")

# ── 2. Poll status until terminal ────────────────────────────────
TERMINAL = {"completed", "failed", "cancelled"}
while True:
    status_resp = api("GET", f"/runs/{run_id}/status")
    status = status_resp["status"]
    print(f"  status: {status}")
    if status in TERMINAL:
        break
    time.sleep(3)

# ── 3. Fetch the full result ─────────────────────────────────────
full = api("GET", f"/runs/{run_id}")
print("\n─── RESULT ───")
print(json.dumps(full, indent=2))

# If there's a structured result field, highlight it
if full.get("result"):
    print(f"\nAnswer: {full['result']}")

print(f"\nView live session: https://cloud.browser-use.com/sessions/{session_id}")

