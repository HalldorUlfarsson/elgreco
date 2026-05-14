#!/usr/bin/env python3
"""Run this once to place the correct flame.json in assets/.
Usage: python3 fix-flame.py  (from the DF Test folder)
"""
import urllib.request, json, pathlib, sys

# The original Lottie file encoded inline would be too large.
# Instead, paste the path to the uploaded file here if you have it,
# or download it from LottieFiles and place it as assets/flame.json.

# Quick diagnostic: check current flame.json layer shape counts
p = pathlib.Path('assets/flame.json')
if p.exists():
    data = json.loads(p.read_text())
    counts = [len(l.get('shapes', [])) for l in data.get('layers', [])]
    print('Current layer shape counts:', counts)
    print('Expected: [8, 7, 11, 12, 11, 10, 9, 5, 10, 10]')
    if counts == [8, 7, 11, 12, 11, 10, 9, 5, 10, 10]:
        print('flame.json looks correct!')
    else:
        print('flame.json is truncated — replace it with the original upload.')
else:
    print('assets/flame.json not found')
