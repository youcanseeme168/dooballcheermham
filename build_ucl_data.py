# -*- coding: utf-8 -*-
"""
Script to parse Ucl.txt and generate structured data.js
"""
import re
import json

def parse_ucl_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        text = f.read()

    # Split header, matches, and overview
    header_end = text.find('คู่ที่ 1:')
    header_text = text[:header_end].strip()

    overview_start = text.find('วิเคราะห์ภาพรวมทุกคู่')
    overview_text = text[overview_start:].strip()

    matches = []
    for i in range(1, 10):
        start_tag = f'คู่ที่ {i}:'
        start_pos = text.find(start_tag)
        end_pos = text.find(f'คู่ที่ {i+1}:') if i < 9 else overview_start
        m_chunk = text[start_pos:end_pos].strip()
        matches.append((i, m_chunk))

    return header_text, matches, overview_text

if __name__ == '__main__':
    header, matches, overview = parse_ucl_file('Ucl.txt')
    print(f'Parsed {len(matches)} matches, overview length {len(overview)}')
