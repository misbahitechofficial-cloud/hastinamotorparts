#!/usr/bin/env python3
"""Merge all <bike>_parts.json files into master_parts.json (adds a "bike" field).
Usage:  python merge_parts.py [folder]      (default: current folder)
Bike name = file name without the "_parts.json" suffix, e.g. BAJAJ_BOXER_BM150_parts.json -> BAJAJ_BOXER_BM150
"""
import glob, json, os, sys
folder = sys.argv[1] if len(sys.argv) > 1 else "."
files = sorted(f for f in glob.glob(os.path.join(folder, "*_parts.json")) if os.path.basename(f) != "master_parts.json")
if not files:
    sys.exit("No *_parts.json files found in " + os.path.abspath(folder))
master, seen = [], set()
for f in files:
    bike = os.path.basename(f)[:-len("_parts.json")]
    if bike in seen:
        sys.exit("Duplicate bike name: " + bike)
    seen.add(bike)
    rows = json.load(open(f, encoding="utf-8"))
    for r in rows:
        r = dict(r); r["bike"] = bike
        master.append(r)
    print(f"{bike}: {len(rows)} rows")
out = os.path.join(folder, "master_parts.json")
with open(out, "w", encoding="utf-8") as fh:
    json.dump(master, fh, ensure_ascii=False, separators=(",", ":"))
print(f"master_parts.json: {len(master)} rows, {len(seen)} bikes, {os.path.getsize(out)//1024} KB")
