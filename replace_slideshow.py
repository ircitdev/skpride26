#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re

# Read the original index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Read the new slider block
with open('new_slider_block.html', 'r', encoding='utf-8') as f:
    new_block = f.read()

# Pattern to match the entire slideshow div block
# From <div class="slideshow"> to the closing </div> before <!-- Backdrop
pattern = r'<div class="slideshow">.*?</figure>\s*</div>(?=\s*<!-- Backdrop)'

# Replace with new liquid slider block
new_content = re.sub(pattern, new_block.strip(), content, flags=re.DOTALL)

# Write to new file first (backup)
with open('index.html.backup', 'w', encoding='utf-8') as f:
    f.write(content)

# Write the modified content
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Slideshow replaced with liquid slider!")
print("Backup saved as index.html.backup")
