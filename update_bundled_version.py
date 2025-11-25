#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re
import time

timestamp = str(int(time.time()))

# Read index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add version to three.min.js
content = re.sub(
    r'src="three\.min\.js"',
    f'src="three.min.js?v={timestamp}"',
    content
)

# Add version to liquid-slider-bundled.js
content = re.sub(
    r'src="liquid-slider-bundled\.js"',
    f'src="liquid-slider-bundled.js?v={timestamp}"',
    content
)

# Add version to liquid-slider.css
content = re.sub(
    r'href="liquid-slider\.css(\?v=\d+)?"',
    f'href="liquid-slider.css?v={timestamp}"',
    content
)

# Add version to main.js
content = re.sub(
    r'src="main\.js(\?v=\d+)?"',
    f'src="main.js?v={timestamp}"',
    content
)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Cache busting added! Version: {timestamp}")
print("Files: three.min.js, liquid-slider-bundled.js, liquid-slider.css, main.js")
print("")
print("RELOAD PAGE WITH: Ctrl+Shift+R")
