# -*- coding: utf-8 -*-
"""
Generate complete data.js with all 9 matches, overview, summary table, and SVGs
"""
import sys
import os
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

from generate_assets import SVGS

TEAMS_INFO = {
    'Galatasaray': {
        'id': 'galatasaray', 'name': 'Galatasaray', 'thaiName': 'กาลาตาซาราย', 'short': 'GAL',
        'country': 'ตุรกี', 'primary': '#C8102E', 'secondary': '#FDB913', 'accent': '#FFD700',
        'league': 'จ่าฝูง Turkish Süper Lig'
    },
    'VfB Stuttgart': {
        'id': 'stuttgart', 'name': 'VfB Stuttgart', 'thaiName': 'เฟาเอ็ฟเบ ชตุทท์การ์ท', 'short': 'VFB',
        'country': 'เยอรมนี', 'primary': '#E32219', 'secondary': '#FFFFFF', 'accent': '#FFFFFF',
        'league': 'บุนเดสลีกา เยอรมนี'
    },
    'Shakhtar Donetsk': {
        'id': 'shakhtar', 'name': 'Shakhtar Donetsk', 'thaiName': 'ชัคตาร์ ดอเนตสก์', 'short': 'SHK',
        'country': 'ยูเครน', 'primary': '#F36F21', 'secondary': '#000000', 'accent': '#FFA040',
        'league': 'ยูเครเนียน พรีเมียร์ลีก'
    },
    'Sporting CP': {
        'id': 'sporting', 'name': 'Sporting CP', 'thaiName': 'สปอร์ติง ลิสบอน', 'short': 'SCP',
        'country': 'โปรตุเกส', 'primary': '#008057', 'secondary': '#FFFFFF', 'accent': '#FFD700',
        'league': 'ปรีไมราลีกา โปรตุเกส'
    },
    'Feyenoord': {
        'id': 'feyenoord', 'name': 'Feyenoord', 'thaiName': 'ไฟเยอโนร์ด', 'short': 'FEY',
        'country': 'เนเธอร์แลนด์', 'primary': '#DA291C', 'secondary': '#FFFFFF', 'accent': '#FFD700',
        'league': 'เอเรดิวิซี เนเธอร์แลนด์'
    },
    'Inter': {
        'id': 'inter', 'name': 'Inter Milan', 'thaiName': 'อินเตอร์ มิลาน', 'short': 'INT',
        'country': 'อิตาลี', 'primary': '#005CA9', 'secondary': '#000000', 'accent': '#38BDF8',
        'league': 'เซเรีย อา อิตาลี'
    },
    'Bodø/Glimt': {
        'id': 'bodo', 'name': 'Bodø/Glimt', 'thaiName': 'โบโด/กลิมท์', 'short': 'BOD',
        'country': 'นอร์เวย์', 'primary': '#FFD100', 'secondary': '#000000', 'accent': '#FFE55C',
        'league': 'เอลีเตเซเรียน นอร์เวย์'
    },
    'LOSC Lille': {
        'id': 'lille', 'name': 'LOSC Lille', 'thaiName': 'ลีลล์', 'short': 'LIL',
        'country': 'ฝรั่งเศส', 'primary': '#D71920', 'secondary': '#11224D', 'accent': '#FFFFFF',
        'league': 'ลีกเอิง ฝรั่งเศส'
    },
    'Atlético Madrid': {
        'id': 'atletico', 'name': 'Atlético Madrid', 'thaiName': 'อัตเลติโก มาดริด', 'short': 'ATM',
        'country': 'สเปน', 'primary': '#CB3524', 'secondary': '#272E61', 'accent': '#FFFFFF',
        'league': 'ลาลีกา สเปน'
    },
    'Bayern Munich': {
        'id': 'bayern', 'name': 'Bayern Munich', 'thaiName': 'บาเยิร์น มิวนิค', 'short': 'BAY',
        'country': 'เยอรมนี', 'primary': '#DC052D', 'secondary': '#0066B2', 'accent': '#FFFFFF',
        'league': 'บุนเดสลีกา เยอรมนี'
    },
    'Villarreal': {
        'id': 'villarreal', 'name': 'Villarreal CF', 'thaiName': 'บิยาร์เรอัล', 'short': 'VIL',
        'country': 'สเปน', 'primary': '#FFE600', 'secondary': '#00519E', 'accent': '#00519E',
        'league': 'ลาลีกา สเปน'
    },
    'PSG': {
        'id': 'psg', 'name': 'Paris Saint-Germain', 'thaiName': 'เปแอสเช', 'short': 'PSG',
        'country': 'ฝรั่งเศส', 'primary': '#004170', 'secondary': '#DA291C', 'accent': '#DA291C',
        'league': 'ลีกเอิง ฝรั่งเศส'
    },
    'Barcelona': {
        'id': 'barcelona', 'name': 'FC Barcelona', 'thaiName': 'บาร์เซโลนา', 'short': 'BAR',
        'country': 'สเปน', 'primary': '#004D98', 'secondary': '#A50044', 'accent': '#EDBB00',
        'league': 'ลาลีกา สเปน'
    },
    'Aston Villa': {
        'id': 'astonvilla', 'name': 'Aston Villa', 'thaiName': 'แอสตัน วิลลา', 'short': 'AVL',
        'country': 'อังกฤษ', 'primary': '#670E36', 'secondary': '#95BFE5', 'accent': '#FEE12B',
        'league': 'พรีเมียร์ลีก อังกฤษ'
    },
    'Man Utd': {
        'id': 'manutd', 'name': 'Manchester United', 'thaiName': 'แมนเชสเตอร์ ยูไนเต็ด', 'short': 'MUN',
        'country': 'อังกฤษ', 'primary': '#DA291C', 'secondary': '#000000', 'accent': '#FBE122',
        'league': 'พรีเมียร์ลีก อังกฤษ'
    },
    'Roma': {
        'id': 'roma', 'name': 'AS Roma', 'thaiName': 'เอเอส โรมา', 'short': 'ASR',
        'country': 'อิตาลี', 'primary': '#8E1F2F', 'secondary': '#F0BC42', 'accent': '#F0BC42',
        'league': 'เซเรีย อา อิตาลี'
    },
    'LASK': {
        'id': 'lask', 'name': 'LASK Linz', 'thaiName': 'แอลเอเอสเค ลินซ์', 'short': 'LSK',
        'country': 'ออสเตรีย', 'primary': '#000000', 'secondary': '#FFFFFF', 'accent': '#E5E7EB',
        'league': 'ออสเตรียน บุนเดสลีกา'
    },
    'Slovan Bratislava': {
        'id': 'slovan', 'name': 'Slovan Bratislava', 'thaiName': 'สโลวาน บราติสลาวา', 'short': 'SLO',
        'country': 'สโลวาเกีย', 'primary': '#2D82C8', 'secondary': '#FFFFFF', 'accent': '#FFD700',
        'league': 'สโลวัก ซูเปอร์ลีกา'
    }
}

MATCH_TEAMS_PAIR = [
    ('Galatasaray', 'VfB Stuttgart', '00:45', False),
    ('Shakhtar Donetsk', 'Sporting CP', '00:45', True),
    ('Feyenoord', 'Inter', '03:00', False),
    ('Bodø/Glimt', 'LOSC Lille', '03:00', False),
    ('Atlético Madrid', 'Bayern Munich', '03:00', False),
    ('Villarreal', 'PSG', '03:00', False),
    ('Barcelona', 'Aston Villa', '03:00', False),
    ('Man Utd', 'Roma', '03:00', False),
    ('LASK', 'Slovan Bratislava', '03:00', False),
]

def clean_text(s):
    if not s:
        return ''
    return re.sub(r'\s+', ' ', s).strip()

def build():
    with open('Ucl.txt', 'r', encoding='utf-8', errors='replace') as f:
        text = f.read()

    header_end = text.find('คู่ที่ 1:')
    header_raw = text[:header_end].strip()

    overview_start = text.find('วิเคราะห์ภาพรวมทุกคู่')
    overview_raw = text[overview_start:].strip()

    matches_data = []

    for i in range(1, 10):
        start_tag = f'คู่ที่ {i}:'
        start_pos = text.find(start_tag)
        end_pos = text.find(f'คู่ที่ {i+1}:') if i < 9 else overview_start
        m_chunk = text[start_pos:end_pos].strip()

        home_key, away_key, time_slot, is_neutral = MATCH_TEAMS_PAIR[i-1]
        home_team_info = TEAMS_INFO[home_key]
        away_team_info = TEAMS_INFO[away_key]

        sec_markers = [
            '1. ข้อมูลการแข่งขัน',
            '2. วิเคราะห์ฟอร์มทั้งสองทีม',
            '3. วิเคราะห์สถิติเกมรุกและเกมรับ',
            '4. วิเคราะห์ความพร้อมนักเตะ',
            '5. วิเคราะห์แท็กติก',
            '6. วิเคราะห์ราคาเดิมพัน',
            '7. ความน่าจะเป็น 1X2',
            '8. คาดการณ์สกอร์',
            '9. วิเคราะห์ Over / Under และ BTTS',
            '10. การคัดเลือกและจัดอันดับตลาดเดิมพันที่น่าสนใจ',
            '11. จุดแข็งและจุดอ่อนของการคาดการณ์ & คะแนนความน่าเชื่อถือ',
            '12. สรุปผลและระดับความเสี่ยง'
        ]

        sec_positions = []
        for sm in sec_markers:
            p = m_chunk.find(sm)
            sec_positions.append(p)

        sections = {}
        for s_idx in range(len(sec_markers)):
            st = sec_positions[s_idx]
            en = sec_positions[s_idx+1] if s_idx + 1 < len(sec_positions) else len(m_chunk)
            content = m_chunk[st:en].strip()
            content = content[len(sec_markers[s_idx]):].strip()
            sections[s_idx+1] = content

        # Section 1
        sec1 = sections[1]
        round_m = re.search(r'รายการและรอบ:\s*(.*?)(?=วันและเวลาแข่งขัน:|$)', sec1)
        time_m = re.search(r'วันและเวลาแข่งขัน:\s*(.*?)(?=สนามแข่งขัน:|$)', sec1)
        stadium_m = re.search(r'สนามแข่งขัน:\s*(.*?)(?=อันดับตารางคะแนน|$)', sec1)
        standings_m = re.search(r'อันดับตารางคะแนน\s*UCL\s*ล่าสุด[^:]*:\s*(.*?)(?=โปรแกรมการแข่งขัน|$)', sec1)
        rest_m = re.search(r'โปรแกรมการแข่งขันและเวลาพัก:\s*(.*?)(?=สภาพสนาม|$)', sec1)
        pitch_m = re.search(r'สภาพสนามและสภาพอากาศ:\s*(.*?)$', sec1)

        # Section 2 (Form & H2H)
        sec2 = sections[2]
        h2h_split = re.search(r'(?:สถิติ\s*)?Head-to-Head\s*(?:\(H2H\))?:\s*(.*?)$', sec2)
        h2h_text = clean_text(h2h_split.group(1)) if h2h_split else ''
        form_body = sec2[:h2h_split.start()].strip() if h2h_split else sec2

        # Section 3 (Stats)
        sec3 = sections[3]

        # Section 4 (Readiness)
        sec4 = sections[4]

        # Section 5 (Tactics)
        sec5 = sections[5]

        # Section 6 (Market odds)
        sec6 = sections[6]
        odds_1x2_m = re.search(r'ราคาบอล\s*1X2:\s*(.*?)(?=Over\s*/\s*Under|$)', sec6)
        odds_ou_m = re.search(r'Over\s*/\s*Under\s*2\.5:\s*(.*?)(?=Both\s*Teams|$)', sec6)
        odds_btts_m = re.search(r'Both\s*Teams\s*To\s*Score[^:]*:\s*(.*?)(?=การประเมินความคุ้มค่า:|$)', sec6)
        odds_val_m = re.search(r'การประเมินความคุ้มค่า:\s*(.*?)$', sec6)

        # Section 7 (Probabilities)
        sec7 = sections[7]
        prob_home = 0
        prob_draw = 0
        prob_away = 0
        all_percs = re.findall(r'(\d+)%', sec7)
        if len(all_percs) >= 3:
            prob_home = int(all_percs[0])
            prob_draw = int(all_percs[1])
            prob_away = int(all_percs[2])

        # Section 8 (Score prediction)
        sec8 = sections[8]
        score_match = re.search(r'([^\(]+)(?:\((.*)\))?', sec8)
        score_pred = score_match.group(1).strip() if score_match else sec8
        score_reason = score_match.group(2).strip() if (score_match and score_match.group(2)) else ''

        # Section 9 (O/U & BTTS)
        sec9 = sections[9]

        # Section 10 (Ranked picks)
        sec10 = sections[10]
        opts_raw = re.split(r'(ตัวเลือกที่ \d+[^:]*:)', sec10)
        ranked_picks = []
        for k in range(1, len(opts_raw), 2):
            opt_title = opts_raw[k].strip()
            opt_body = opts_raw[k+1].strip()

            market_name_m = re.search(r'ชื่อตลาดเดิมพัน:\s*(.*?)(?=ตัวเลือกเดิมพัน:|$)', opt_body)
            selection_m = re.search(r'ตัวเลือกเดิมพัน:\s*(.*?)(?=ราคาต่อรอง(?:จริง)?:\s*|$)', opt_body)
            odds_m = re.search(r'ราคาต่อรอง(?:จริง)?:\s*(.*?)(?=ความน่าจะเป็นที่ประเมิน|$)', opt_body)
            prob_m = re.search(r'ความน่าจะเป็นที่ประเมิน[^:]*:\s*(.*?)(?=ราคา Fair Odds:|$)', opt_body)
            fair_odds_m = re.search(r'ราคา Fair Odds:\s*(.*?)(?=เหตุผลที่เลือก:|$)', opt_body)
            reasons_m = re.search(r'เหตุผลที่เลือก:\s*(.*?)(?=ปัจจัยเสี่ยง:|$)', opt_body)
            risks_m = re.search(r'ปัจจัยเสี่ยง:\s*(.*?)(?=ระดับความน่าสนใจ:|$)', opt_body)
            attract_m = re.search(r'ระดับความน่าสนใจ:\s*(.*?)$', opt_body)

            desc_before = opt_body[:opt_body.find('ชื่อตลาดเดิมพัน:')].strip() if 'ชื่อตลาดเดิมพัน:' in opt_body else ''

            ranked_picks.append({
                'title': opt_title,
                'category': clean_text(desc_before),
                'marketName': clean_text(market_name_m.group(1)) if market_name_m else '',
                'selection': clean_text(selection_m.group(1)) if selection_m else '',
                'odds': clean_text(odds_m.group(1)) if odds_m else '',
                'prob': clean_text(prob_m.group(1)) if prob_m else '',
                'fairOdds': clean_text(fair_odds_m.group(1)) if fair_odds_m else '',
                'reasons': clean_text(reasons_m.group(1)) if reasons_m else '',
                'risks': clean_text(risks_m.group(1)) if risks_m else '',
                'attractiveness': clean_text(attract_m.group(1)) if attract_m else ''
            })

        # Section 11 (Strengths, Weaknesses, Confidence)
        sec11 = sections[11]
        strengths_m = re.search(r'จุดแข็ง:\s*(.*?)(?=จุดอ่อน:|$)', sec11)
        weaknesses_m = re.search(r'จุดอ่อน:\s*(.*?)(?=คะแนนความน่าเชื่อถือ:|$)', sec11)
        conf_m = re.search(r'คะแนนความน่าเชื่อถือ:\s*(\d+)\s*/\s*100', sec11)
        confidence_val = int(conf_m.group(1)) if conf_m else 80

        # Section 12 (Summary & Risk)
        sec12 = sections[12]
        risk_level_m = re.search(r'ระดับความเสี่ยง:\s*(.*?)$', sec12)
        risk_level_str = clean_text(risk_level_m.group(1)) if risk_level_m else 'ปานกลาง'
        summary_text = sec12[:sec12.find('ระดับความเสี่ยง:')].strip() if 'ระดับความเสี่ยง:' in sec12 else sec12

        match_obj = {
            'id': i,
            'matchNumber': f'คู่ที่ {i}',
            'matchTitle': f'{home_team_info["name"]} พบ {away_team_info["name"]}',
            'kickoffSlot': time_slot,
            'isNeutralGround': is_neutral,
            'homeTeam': home_team_info,
            'awayTeam': away_team_info,
            'tournamentRound': clean_text(round_m.group(1)) if round_m else 'UEFA Champions League 2026–27 รอบ League Phase (Matchday 4 of 8)',
            'matchDateTime': clean_text(time_m.group(1)) if time_m else '',
            'stadium': clean_text(stadium_m.group(1)) if stadium_m else '',
            'standings': clean_text(standings_m.group(1)) if standings_m else '',
            'scheduleAndRest': clean_text(rest_m.group(1)) if rest_m else '',
            'pitchAndWeather': clean_text(pitch_m.group(1)) if pitch_m else '',

            'formAnalysis': {
                'raw': clean_text(sec2),
                'overview': clean_text(form_body),
                'h2h': clean_text(h2h_text)
            },

            'statsAnalysis': {
                'raw': clean_text(sec3)
            },

            'squadReadiness': {
                'raw': clean_text(sec4)
            },

            'tacticsAnalysis': {
                'raw': clean_text(sec5)
            },

            'marketOdds': {
                'raw': clean_text(sec6),
                'odds1X2': clean_text(odds_1x2_m.group(1)) if odds_1x2_m else '',
                'oddsOverUnder': clean_text(odds_ou_m.group(1)) if odds_ou_m else '',
                'oddsBTTS': clean_text(odds_btts_m.group(1)) if odds_btts_m else '',
                'valueAssessment': clean_text(odds_val_m.group(1)) if odds_val_m else ''
            },

            'winProbability': {
                'raw': clean_text(sec7),
                'home': prob_home,
                'draw': prob_draw,
                'away': prob_away
            },

            'scorePrediction': {
                'raw': clean_text(sec8),
                'prediction': clean_text(score_pred),
                'reasoning': clean_text(score_reason)
            },

            'overUnderBttsAnalysis': clean_text(sec9),

            'rankedPicks': ranked_picks,

            'metaAnalysis': {
                'raw': clean_text(sec11),
                'strengths': clean_text(strengths_m.group(1)) if strengths_m else '',
                'weaknesses': clean_text(weaknesses_m.group(1)) if weaknesses_m else '',
                'confidenceScore': confidence_val,
                'confidenceDisplay': f'{confidence_val} / 100'
            },

            'summaryAndRisk': {
                'raw': clean_text(sec12),
                'summary': clean_text(summary_text),
                'riskLevel': risk_level_str
            }
        }
        matches_data.append(match_obj)

    # Overview sections
    sup_m = re.search(r'คู่ที่มีข้อมูลสนับสนุนมากที่สุด:\s*(.*?)(?=คู่ที่มีความได้เปรียบชัดเจนที่สุด:|$)', overview_raw)
    adv_m = re.search(r'คู่ที่มีความได้เปรียบชัดเจนที่สุด[^:]*:\s*(.*?)(?=คู่ที่น่าสนใจที่สุดสำหรับตลาด Over / Under:|$)', overview_raw)
    ou_m = re.search(r'คู่ที่น่าสนใจที่สุดสำหรับตลาด Over / Under:\s*(.*?)(?=คู่ที่น่าสนใจที่สุดสำหรับตลาด BTTS|$)', overview_raw)
    btts_m = re.search(r'คู่ที่น่าสนใจที่สุดสำหรับตลาด BTTS[^:]*:\s*(.*?)(?=คู่ที่มีความเสี่ยงสูงและควรระวัง|$)', overview_raw)
    risk_m = re.search(r'คู่ที่มีความเสี่ยงสูงและควรระวัง[^:]*:\s*(.*?)(?=คู่ที่ควรหลีกเลี่ยงเพราะข้อมูลไม่เพียงพอ:|$)', overview_raw)
    avoid_m = re.search(r'คู่ที่ควรหลีกเลี่ยงเพราะข้อมูลไม่เพียงพอ:\s*(.*?)(?=ตารางสรุปทุกคู่|$)', overview_raw)

    # Table rows
    table_pos = overview_raw.find('ตารางสรุปทุกคู่')
    table_chunk = overview_raw[table_pos:] if table_pos != -1 else ''

    summary_table_rows = [
        {
            'id': 1,
            'match': 'Galatasaray พบ VfB Stuttgart',
            'time': '00:45',
            'isNeutral': False,
            'predictedScore': '2–1 / 2–2',
            'bestPicks': ['1. Over 2.5 (@ 1.43)', '2. BTTS - Yes (@ 1.38)'],
            'prob1X2': '43% / 26% / 31%',
            'confidence': '82 / 100',
            'confidenceScore': 82,
            'risk': 'ปานกลาง'
        },
        {
            'id': 2,
            'match': 'Shakhtar Donetsk พบ Sporting CP',
            'time': '00:45 (สนามกลาง)',
            'isNeutral': True,
            'predictedScore': '1–2 / 0–1',
            'bestPicks': ['1. Sporting CP ชนะ (2) (@ 1.97)', '2. Double Chance X2 (@ 1.32)'],
            'prob1X2': '24% / 26% / 50%',
            'confidence': '80 / 100',
            'confidenceScore': 80,
            'risk': 'ปานกลาง'
        },
        {
            'id': 3,
            'match': 'Feyenoord พบ Inter',
            'time': '03:00',
            'isNeutral': False,
            'predictedScore': '1–2',
            'bestPicks': ['1. Over 2.5 (@ 1.41)', '2. BTTS - Yes (@ 1.43)'],
            'prob1X2': '22% / 25% / 53%',
            'confidence': '84 / 100',
            'confidenceScore': 84,
            'risk': 'ปานกลาง'
        },
        {
            'id': 4,
            'match': 'Bodø/Glimt พบ LOSC Lille',
            'time': '03:00',
            'isNeutral': False,
            'predictedScore': '2–1 / 3–1',
            'bestPicks': ['1. Bodø/Glimt ชนะ (1) (@ 1.92)', '2. Bodø/Glimt Over 1.5 Goals (เชิงวิเคราะห์)'],
            'prob1X2': '56% / 23% / 21%',
            'confidence': '85 / 100',
            'confidenceScore': 85,
            'risk': 'ค่อนข้างต่ำ–ปานกลาง'
        },
        {
            'id': 5,
            'match': 'Atlético Madrid พบ Bayern Munich',
            'time': '03:00',
            'isNeutral': False,
            'predictedScore': '2–1 / 1–1',
            'bestPicks': ['1. BTTS - Yes (@ 1.36)', '2. Atlético Madrid 1X (เชิงวิเคราะห์)'],
            'prob1X2': '36% / 26% / 38%',
            'confidence': '86 / 100',
            'confidenceScore': 86,
            'risk': 'ปานกลาง'
        },
        {
            'id': 6,
            'match': 'Villarreal พบ PSG',
            'time': '03:00',
            'isNeutral': False,
            'predictedScore': '1–3 / 1–2',
            'bestPicks': ['1. PSG ชนะ (2) (@ 1.65)', '2. BTTS - Yes (@ 1.43)'],
            'prob1X2': '18% / 20% / 62%',
            'confidence': '88 / 100',
            'confidenceScore': 88,
            'risk': 'ค่อนข้างต่ำ'
        },
        {
            'id': 7,
            'match': 'Barcelona พบ Aston Villa',
            'time': '03:00',
            'isNeutral': False,
            'predictedScore': '3–1 / 2–1',
            'bestPicks': ['1. BTTS - Yes (@ 1.50)', '2. Aston Villa +1.75/+2.0 (เชิงวิเคราะห์)'],
            'prob1X2': '64% / 19% / 17%',
            'confidence': '87 / 100',
            'confidenceScore': 87,
            'risk': 'ค่อนข้างต่ำ (สำหรับ BTTS)'
        },
        {
            'id': 8,
            'match': 'Man Utd พบ Roma',
            'time': '03:00',
            'isNeutral': False,
            'predictedScore': '1–2 / 2–2',
            'bestPicks': ['1. Double Chance X2 - Roma/Draw (@ 1.65)', '2. BTTS - Yes (@ 1.50)'],
            'prob1X2': '30% / 28% / 42%',
            'confidence': '86 / 100',
            'confidenceScore': 86,
            'risk': 'ปานกลาง'
        },
        {
            'id': 9,
            'match': 'LASK พบ Slovan Bratislava',
            'time': '03:00',
            'isNeutral': False,
            'predictedScore': '3–0 / 3–1',
            'bestPicks': ['1. LASK ชนะ (1) (@ 1.50)', '2. Over 2.5 (@ 1.44)'],
            'prob1X2': '68% / 19% / 13%',
            'confidence': '80 / 100',
            'confidenceScore': 80,
            'risk': 'ค่อนข้างต่ำ'
        }
    ]

    overview_data = {
        'raw': overview_raw,
        'topSupported': clean_text(sup_m.group(1)) if sup_m else '',
        'topAdvantage': clean_text(adv_m.group(1)) if adv_m else '',
        'topOverUnder': clean_text(ou_m.group(1)) if ou_m else '',
        'topBTTS': clean_text(btts_m.group(1)) if btts_m else '',
        'highRiskWarnings': clean_text(risk_m.group(1)) if risk_m else '',
        'avoidanceAdvice': clean_text(avoid_m.group(1)) if avoid_m else '',
        'summaryTable': summary_table_rows
    }

    full_payload = {
        'siteTitle': 'AI ไอปันยาอ่อน วิเคราะห์บอล',
        'subTitle': 'UEFA Champions League 2026–27 • League Phase Matchday 4 of 8',
        'matchday': 'League Phase (Matchday 4 of 8)',
        'season': '2026–27',
        'analysisDateThai': 'คืนวันอังคารที่ 3 พฤศจิกายน 2026 (เช้ามืดวันพุธที่ 4 พ.ย. 2026 เวลาไทย)',
        'dataSources': 'Google Sports Data, Sofascore, Flashscore, Transfermarkt, Oddslot (อ้างอิงข้อมูลจริงล่าสุด ณ วันที่ 1–2 พฤศจิกายน 2026)',
        'quote': 'ราคาที่น่าสนใจ ไม่ได้หมายถึงทีมที่แข็งแกร่งที่สุดเสมอไป แต่คือราคาที่สะท้อนโอกาสได้คุ้มค่าที่สุด — ก่อนจะเลือกข้าง ต้องเข้าใจเกมให้มากกว่าตัวเลขบนหน้าจอ',
        'quoteAuthor': 'AI ไอปันยาอ่อน วิเคราะห์บอล • หลักการ Value Betting & สถิติเชิงลึก',
        'headerNotes': header_raw,
        'overview': overview_data,
        'matches': matches_data
    }

    # Write data.js
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write('/* Generated automatically from Ucl.txt */\n')
        f.write('const UCL_DATA = ' + json.dumps(full_payload, ensure_ascii=False, indent=2) + ';\n\n')
        f.write('const UCL_SVGS = ' + json.dumps(SVGS, ensure_ascii=False, indent=2) + ';\n\n')
        f.write('if (typeof module !== "undefined" && module.exports) {\n')
        f.write('  module.exports = { UCL_DATA, UCL_SVGS };\n')
        f.write('}\n')

    print(f'data.js generated successfully! Size: {os.path.getsize("data.js")} bytes')

if __name__ == '__main__':
    build()
