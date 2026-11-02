# -*- coding: utf-8 -*-
import os

files_to_check = ['index.html', 'style.css', 'script.js', 'data.js']
for f in files_to_check:
    if os.path.exists(f):
        print(f'{f}: {os.path.getsize(f)} bytes - OK')
    else:
        print(f'{f}: MISSING!')

# Check assets/logos
logo_files = os.listdir('assets/logos')
print(f'assets/logos: {len(logo_files)} SVGs - OK')
