# -*- coding: utf-8 -*-
"""
Full parser and data generator for UCL Match Analysis
"""
import re
import json

# Team Metadata mapping
TEAMS_INFO = {
    'Galatasaray': {
        'id': 'galatasaray', 'name': 'Galatasaray', 'thaiName': 'กาลาตาซาราย', 'short': 'GAL',
        'country': 'ตุรกี', 'primary': '#C8102E', 'secondary': '#FDB913', 'accent': '#FFD700',
        'league': 'Turkish Süper Lig'
    },
    'VfB Stuttgart': {
        'id': 'stuttgart', 'name': 'VfB Stuttgart', 'thaiName': 'เฟาเอ็ฟเบ ชตุทท์การ์ท', 'short': 'VFB',
        'country': 'เยอรมนี', 'primary': '#E32219', 'secondary': '#FFFFFF', 'accent': '#FFFFFF',
        'league': 'Bundesliga'
    },
    'Shakhtar Donetsk': {
        'id': 'shakhtar', 'name': 'Shakhtar Donetsk', 'thaiName': 'ชัคตาร์ ดอเนตสก์', 'short': 'SHK',
        'country': 'ยูเครน', 'primary': '#F36F21', 'secondary': '#000000', 'accent': '#FFA040',
        'league': 'Ukrainian Premier League'
    },
    'Sporting CP': {
        'id': 'sporting', 'name': 'Sporting CP', 'thaiName': 'สปอร์ติง ลิสบอน', 'short': 'SCP',
        'country': 'โปรตุเกส', 'primary': '#008057', 'secondary': '#FFFFFF', 'accent': '#FFD700',
        'league': 'Primeira Liga'
    },
    'Feyenoord': {
        'id': 'feyenoord', 'name': 'Feyenoord', 'thaiName': 'ไฟเยอโนร์ด', 'short': 'FEY',
        'country': 'เนเธอร์แลนด์', 'primary': '#DA291C', 'secondary': '#FFFFFF', 'accent': '#FFD700',
        'league': 'Eredivisie'
    },
    'Inter': {
        'id': 'inter', 'name': 'Inter Milan', 'thaiName': 'อินเตอร์ มิลาน', 'short': 'INT',
        'country': 'อิตาลี', 'primary': '#005CA9', 'secondary': '#000000', 'accent': '#38BDF8',
        'league': 'Serie A'
    },
    'Bodø/Glimt': {
        'id': 'bodo', 'name': 'Bodø/Glimt', 'thaiName': 'โบโด/กลิมท์', 'short': 'BOD',
        'country': 'นอร์เวย์', 'primary': '#FFD100', 'secondary': '#000000', 'accent': '#FFE55C',
        'league': 'Eliteserien'
    },
    'LOSC Lille': {
        'id': 'lille', 'name': 'LOSC Lille', 'thaiName': 'ลีลล์', 'short': 'LIL',
        'country': 'ฝรั่งเศส', 'primary': '#D71920', 'secondary': '#11224D', 'accent': '#FFFFFF',
        'league': 'Ligue 1'
    },
    'Atlético Madrid': {
        'id': 'atletico', 'name': 'Atlético Madrid', 'thaiName': 'อัตเลติโก มาดริด', 'short': 'ATM',
        'country': 'สเปน', 'primary': '#CB3524', 'secondary': '#272E61', 'accent': '#FFFFFF',
        'league': 'La Liga'
    },
    'Bayern Munich': {
        'id': 'bayern', 'name': 'Bayern Munich', 'thaiName': 'บาเยิร์น มิวนิค', 'short': 'BAY',
        'country': 'เยอรมนี', 'primary': '#DC052D', 'secondary': '#0066B2', 'accent': '#FFFFFF',
        'league': 'Bundesliga'
    },
    'Villarreal': {
        'id': 'villarreal', 'name': 'Villarreal CF', 'thaiName': 'บิยาร์เรอัล', 'short': 'VIL',
        'country': 'สเปน', 'primary': '#FFE600', 'secondary': '#00519E', 'accent': '#00519E',
        'league': 'La Liga'
    },
    'PSG': {
        'id': 'psg', 'name': 'Paris Saint-Germain', 'thaiName': 'เปแอสเช', 'short': 'PSG',
        'country': 'ฝรั่งเศส', 'primary': '#004170', 'secondary': '#DA291C', 'accent': '#DA291C',
        'league': 'Ligue 1'
    },
    'Barcelona': {
        'id': 'barcelona', 'name': 'FC Barcelona', 'thaiName': 'บาร์เซโลนา', 'short': 'BAR',
        'country': 'สเปน', 'primary': '#004D98', 'secondary': '#A50044', 'accent': '#EDBB00',
        'league': 'La Liga'
    },
    'Aston Villa': {
        'id': 'astonvilla', 'name': 'Aston Villa', 'thaiName': 'แอสตัน วิลลา', 'short': 'AVL',
        'country': 'อังกฤษ', 'primary': '#670E36', 'secondary': '#95BFE5', 'accent': '#FEE12B',
        'league': 'Premier League'
    },
    'Man Utd': {
        'id': 'manutd', 'name': 'Manchester United', 'thaiName': 'แมนเชสเตอร์ ยูไนเต็ด', 'short': 'MUN',
        'country': 'อังกฤษ', 'primary': '#DA291C', 'secondary': '#000000', 'accent': '#FBE122',
        'league': 'Premier League'
    },
    'Roma': {
        'id': 'roma', 'name': 'AS Roma', 'thaiName': 'เอเอส โรมา', 'short': 'ASR',
        'country': 'อิตาลี', 'primary': '#8E1F2F', 'secondary': '#F0BC42', 'accent': '#F0BC42',
        'league': 'Serie A'
    },
    'LASK': {
        'id': 'lask', 'name': 'LASK Linz', 'thaiName': 'แอลเอเอสเค ลินซ์', 'short': 'LSK',
        'country': 'ออสเตรีย', 'primary': '#000000', 'secondary': '#FFFFFF', 'accent': '#E5E7EB',
        'league': 'Austrian Bundesliga'
    },
    'Slovan Bratislava': {
        'id': 'slovan', 'name': 'Slovan Bratislava', 'thaiName': 'สโลวาน บราติสลาวา', 'short': 'SLO',
        'country': 'สโลวาเกีย', 'primary': '#2D82C8', 'secondary': '#FFFFFF', 'accent': '#FFD700',
        'league': 'Slovak Super Liga'
    }
}

MATCH_TEAMS_PAIR = [
    ('Galatasaray', 'VfB Stuttgart', '00:45'),
    ('Shakhtar Donetsk', 'Sporting CP', '00:45'),
    ('Feyenoord', 'Inter', '03:00'),
    ('Bodø/Glimt', 'LOSC Lille', '03:00'),
    ('Atlético Madrid', 'Bayern Munich', '03:00'),
    ('Villarreal', 'PSG', '03:00'),
    ('Barcelona', 'Aston Villa', '03:00'),
    ('Man Utd', 'Roma', '03:00'),
    ('LASK', 'Slovan Bratislava', '03:00'),
]

def clean_text(s):
    if not s:
        return ''
    return re.sub(r'\s+', ' ', s).strip()

def parse_full():
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

        home_key, away_key, time_slot = MATCH_TEAMS_PAIR[i-1]
        home_team_info = TEAMS_INFO[home_key]
        away_team_info = TEAMS_INFO[away_key]

        # 12 sections boundaries
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
            # remove the marker prefix
            content = content[len(sec_markers[s_idx]):].strip()
            sections[s_idx+1] = content

        # Section 1 details
        sec1 = sections[1]
        round_m = re.search(r'รายการและรอบ:\s*(.*?)(?=วันและเวลาแข่งขัน:|$)', sec1)
        time_m = re.search(r'วันและเวลาแข่งขัน:\s*(.*?)(?=สนามแข่งขัน:|$)', sec1)
        stadium_m = re.search(r'สนามแข่งขัน:\s*(.*?)(?=อันดับตารางคะแนน|$)', sec1)
        standings_m = re.search(r'อันดับตารางคะแนน\s*UCL\s*ล่าสุด[^:]*:\s*(.*?)(?=โปรแกรมการแข่งขัน|$)', sec1)
        rest_m = re.search(r'โปรแกรมการแข่งขันและเวลาพัก:\s*(.*?)(?=สภาพสนาม|$)', sec1)
        pitch_m = re.search(r'สภาพสนามและสภาพอากาศ:\s*(.*?)$', sec1)

        # Section 6 details (Odds)
        sec6 = sections[6]
        odds_1x2_m = re.search(r'ราคาบอล\s*1X2:\s*(.*?)(?=Over\s*/\s*Under|$)', sec6)
        odds_ou_m = re.search(r'Over\s*/\s*Under\s*2\.5:\s*(.*?)(?=Both\s*Teams|$)', sec6)
        odds_btts_m = re.search(r'Both\s*Teams\s*To\s*Score[^:]*:\s*(.*?)(?=การประเมินความคุ้มค่า:|$)', sec6)
        odds_val_m = re.search(r'การประเมินความคุ้มค่า:\s*(.*?)$', sec6)

        # Section 7 details (Probabilities)
        sec7 = sections[7]
        # Galatasaray ชนะ (1): 43% | เสมอ (X): 26% | VfB Stuttgart ชนะ (2): 31%
        prob_home = 0
        prob_draw = 0
        prob_away = 0
        ph_match = re.search(r'(\d+)%', sec7)
        all_percs = re.findall(r'(\d+)%', sec7)
        if len(all_percs) >= 3:
            prob_home = int(all_percs[0])
            prob_draw = int(all_percs[1])
            prob_away = int(all_percs[2])

        # Section 8 details (Score prediction)
        sec8 = sections[8]
        score_match = re.search(r'([^\(]+)(?:\((.*)\))?', sec8)
        score_pred = score_match.group(1).strip() if score_match else sec8
        score_reason = score_match.group(2).strip() if (score_match and score_match.group(2)) else ''

        # Section 10 options
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

            # also description before "ชื่อตลาดเดิมพัน"
            desc_before = opt_body[:opt_body.find('ชื่อตลาดเดิมพัน:')].strip() if 'ชื่อตลาดเดิมพัน:' in opt_body else ''

            ranked_picks.append({
                'title': opt_title,
                'category': desc_before,
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
            'thaiKickoffTime': time_slot,
            'homeTeam': home_team_info,
            'awayTeam': away_team_info,
            'tournamentRound': clean_text(round_m.group(1)) if round_m else 'UEFA Champions League 2026–27 รอบ League Phase (Matchday 4 of 8)',
            'matchDateTime': clean_text(time_m.group(1)) if time_m else '',
            'stadium': clean_text(stadium_m.group(1)) if stadium_m else '',
            'standings': clean_text(standings_m.group(1)) if standings_m else '',
            'scheduleAndRest': clean_text(rest_m.group(1)) if rest_m else '',
            'pitchAndWeather': clean_text(pitch_m.group(1)) if pitch_m else '',

            # Section 2
            'formAnalysis': clean_text(sections[2]),

            # Section 3
            'statsAnalysis': clean_text(sections[3]),

            # Section 4
            'squadReadiness': clean_text(sections[4]),

            # Section 5
            'tacticsAnalysis': clean_text(sections[5]),

            # Section 6
            'marketOdds': {
                'raw': clean_text(sec6),
                'odds1X2': clean_text(odds_1x2_m.group(1)) if odds_1x2_m else '',
                'oddsOverUnder': clean_text(odds_ou_m.group(1)) if odds_ou_m else '',
                'oddsBTTS': clean_text(odds_btts_m.group(1)) if odds_btts_m else '',
                'valueAssessment': clean_text(odds_val_m.group(1)) if odds_val_m else ''
            },

            # Section 7
            'winProbability': {
                'raw': clean_text(sec7),
                'home': prob_home,
                'draw': prob_draw,
                'away': prob_away
            },

            # Section 8
            'scorePrediction': {
                'raw': clean_text(sec8),
                'prediction': clean_text(score_pred),
                'reasoning': clean_text(score_reason)
            },

            # Section 9
            'overUnderBttsAnalysis': clean_text(sections[9]),

            # Section 10
            'rankedPicks': ranked_picks,

            # Section 11
            'metaAnalysis': {
                'raw': clean_text(sec11),
                'strengths': clean_text(strengths_m.group(1)) if strengths_m else '',
                'weaknesses': clean_text(weaknesses_m.group(1)) if weaknesses_m else '',
                'confidenceScore': confidence_val,
                'confidenceDisplay': f'{confidence_val} / 100'
            },

            # Section 12
            'summaryAndRisk': {
                'raw': clean_text(sec12),
                'summary': clean_text(summary_text),
                'riskLevel': risk_level_str
            }
        }
        matches_data.append(match_obj)

    # Parse overview text
    # 1. Supported
    sup_m = re.search(r'คู่ที่มีข้อมูลสนับสนุนมากที่สุด:\s*(.*?)(?=คู่ที่มีความได้เปรียบชัดเจนที่สุด:|$)', overview_raw)
    # 2. Advantage
    adv_m = re.search(r'คู่ที่มีความได้เปรียบชัดเจนที่สุด[^:]*:\s*(.*?)(?=คู่ที่น่าสนใจที่สุดสำหรับตลาด Over / Under:|$)', overview_raw)
    # 3. Over Under
    ou_m = re.search(r'คู่ที่น่าสนใจที่สุดสำหรับตลาด Over / Under:\s*(.*?)(?=คู่ที่น่าสนใจที่สุดสำหรับตลาด BTTS|$)', overview_raw)
    # 4. BTTS
    btts_m = re.search(r'คู่ที่น่าสนใจที่สุดสำหรับตลาด BTTS[^:]*:\s*(.*?)(?=คู่ที่มีความเสี่ยงสูงและควรระวัง|$)', overview_raw)
    # 5. Risk
    risk_m = re.search(r'คู่ที่มีความเสี่ยงสูงและควรระวัง[^:]*:\s*(.*?)(?=คู่ที่ควรหลีกเลี่ยงเพราะข้อมูลไม่เพียงพอ:|$)', overview_raw)
    # 6. Avoid
    avoid_m = re.search(r'คู่ที่ควรหลีกเลี่ยงเพราะข้อมูลไม่เพียงพอ:\s*(.*?)(?=ตารางสรุปทุกคู่|$)', overview_raw)
    # 7. Table
    table_m = re.search(r'ตารางสรุปทุกคู่.*?\n?(.*)$', overview_raw, re.DOTALL)

    overview_data = {
        'raw': overview_raw,
        'topSupported': clean_text(sup_m.group(1)) if sup_m else '',
        'topAdvantage': clean_text(adv_m.group(1)) if adv_m else '',
        'topOverUnder': clean_text(ou_m.group(1)) if ou_m else '',
        'topBTTS': clean_text(btts_m.group(1)) if btts_m else '',
        'highRiskWarnings': clean_text(risk_m.group(1)) if risk_m else '',
        'avoidanceAdvice': clean_text(avoid_m.group(1)) if avoid_m else '',
    }

    full_dataset = {
        'siteTitle': 'AI ไอปันยาอ่อน วิเคราะห์บอล',
        'subTitle': 'UEFA Champions League 2026–27 • League Phase Matchday 4 of 8',
        'analysisDateThai': 'คืนวันอังคารที่ 3 พฤศจิกายน 2026 (เช้ามืดวันพุธที่ 4 พ.ย. 2026 เวลาไทย)',
        'dataSources': 'Google Sports Data, Sofascore, Flashscore, Transfermarkt, Oddslot (อ้างอิงข้อมูลจริงล่าสุด ณ วันที่ 1–2 พฤศจิกายน 2026)',
        'quote': 'ราคาที่น่าสนใจ ไม่ได้หมายถึงทีมที่แข็งแกร่งที่สุดเสมอไป แต่คือราคาที่สะท้อนโอกาสได้คุ้มค่าที่สุด — ก่อนจะเลือกข้าง ต้องเข้าใจเกมให้มากกว่าตัวเลขบนหน้าจอ',
        'quoteAuthor': 'AI ไอปันยาอ่อน วิเคราะห์บอล • หลักการ Value Betting & สถิติเชิงลึก',
        'headerNotes': header_raw,
        'overview': overview_data,
        'matches': matches_data
    }

    return full_dataset

if __name__ == '__main__':
    data = parse_full()
    print(f"Parsed successfully! {len(data['matches'])} matches.")
    # test print match 1
    m1 = data['matches'][0]
    print("Match 1:", m1['homeTeam']['name'], "vs", m1['awayTeam']['name'])
    print("Match 1 Score Pred:", m1['scorePrediction']['prediction'])
    print("Match 1 Picks Count:", len(m1['rankedPicks']))
    print("Match 1 Confidence:", m1['metaAnalysis']['confidenceDisplay'])
    print("Match 1 Risk:", m1['summaryAndRisk']['riskLevel'])
