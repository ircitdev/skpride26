#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Read liquid-slider.js
with open('liquid-slider.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove ES module import lines
lines = content.split('\n')
new_lines = []
skip_until = False

for i, line in enumerate(lines):
    # Skip import statement and related console.log
    if 'import * as THREE' in line:
        skip_until = i + 2  # Skip next 2 lines too
        new_lines.append('// THREE.js loaded from three.min.js (global)')
        new_lines.append('console.log("✅ Three.js ready:", typeof THREE !== "undefined");')
        continue

    if skip_until and i <= skip_until:
        continue

    new_lines.append(line)

# Write bundled version
with open('liquid-slider-bundled.js', 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))

print("Created liquid-slider-bundled.js")
print("This version works WITHOUT ES modules!")
