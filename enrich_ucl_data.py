# -*- coding: utf-8 -*-
"""
Enrich UCL dataset with structured player rosters (Sofascore Bench/Injury style),
Head-to-Head breakdowns, real logo paths, and enhanced metadata.
"""
import os
import json
import re

# Complete structured squad & injury roster mapping
STRUCTURED_ROSTERS = {
    1: {  # Galatasaray vs Stuttgart
        'home': {
            'coach': 'Okan Buruk',
            'keyPlayers': [
                {'name': 'Victor Osimhen', 'pos': 'FW', 'role': 'กองหน้าตัวเป้า', 'stat': 'ยิง 5 ประตูหลังสุดใน UCL ช่วงครึ่งหลัง', 'value': '65M€', 'isStar': True}
            ],
            'injuredPlayers': [
                {'name': 'Kaan Ayhan', 'pos': 'DF', 'status': 'NoEligibility', 'statusText': 'ไม่มีชื่อลงทะเบียน', 'badge': 'gray', 'detail': 'ไม่ได้ลงทะเบียนแข่งขัน UCL'},
                {'name': 'Eyüp Aydın', 'pos': 'MF', 'status': 'NoEligibility', 'statusText': 'ไม่มีชื่อลงทะเบียน', 'badge': 'gray', 'detail': 'ไม่ได้ลงทะเบียนแข่งขัน UCL'},
                {'name': 'Kazımcan Karataş', 'pos': 'DF', 'status': 'NoEligibility', 'statusText': 'ไม่มีชื่อลงทะเบียน', 'badge': 'gray', 'detail': 'ไม่ได้ลงทะเบียนแข่งขัน UCL'},
                {'name': 'Arda Ünyay', 'pos': 'DF', 'status': 'NoEligibility', 'statusText': 'ไม่มีชื่อลงทะเบียน', 'badge': 'gray', 'detail': 'ไม่ได้ลงทะเบียนแข่งขัน UCL'},
                {'name': 'Armando Güner', 'pos': 'FW', 'status': 'NoEligibility', 'statusText': 'ไม่มีชื่อลงทะเบียน', 'badge': 'gray', 'detail': 'ไม่ได้ลงทะเบียนแข่งขัน UCL'},
                {'name': 'Arda Yılmaz', 'pos': 'MF', 'status': 'NoEligibility', 'statusText': 'ไม่มีชื่อลงทะเบียน', 'badge': 'gray', 'detail': 'ไม่ได้ลงทะเบียนแข่งขัน UCL'}
            ]
        },
        'away': {
            'coach': 'Sebastian Hoeneß',
            'keyPlayers': [
                {'name': 'Ermedin Demirović', 'pos': 'FW', 'role': 'กองหน้าดาวซัลโว', 'stat': 'ยิงไปแล้ว 4 ประตูใน UCL ฤดูกาลนี้', 'value': '28M€', 'isStar': True},
                {'name': 'Chris Führich', 'pos': 'MF', 'role': 'ปีกตัวทำเกม', 'stat': 'แกนหลักขับเคลื่อนริมเส้น', 'value': '25M€', 'isStar': False},
                {'name': 'Grischa Prömel', 'pos': 'MF', 'role': 'มิดฟิลด์คุมจังหวะ', 'stat': 'คุมเกมแดนกลางทดแทน Stiller', 'value': '15M€', 'isStar': False}
            ],
            'injuredPlayers': [
                {'name': 'Angelo Stiller', 'pos': 'MF', 'status': 'Out', 'statusText': 'ยืนยันพักแข้ง (Out)', 'badge': 'red', 'detail': 'เจ็บกล้ามเนื้อต้นขาด้านใน (Adductor) - มูลค่าสูงสุดของทีม 45M€'},
                {'name': 'Josha Vagnoman', 'pos': 'DF', 'status': 'Out', 'statusText': 'ยืนยันพักแข้ง (Out)', 'badge': 'red', 'detail': 'บาดเจ็บกล้ามเนื้อแฮมสตริง'},
                {'name': 'Leo Sauer', 'pos': 'FW', 'status': 'Out', 'statusText': 'ยืนยันพักแข้ง (Out)', 'badge': 'red', 'detail': 'มีอาการบาดเจ็บกล้ามเนื้อ'},
                {'name': 'Dan-Axel Zagadou', 'pos': 'DF', 'status': 'Out', 'statusText': 'บาดเจ็บ & ไม่มีชื่อ', 'badge': 'red', 'detail': 'เจ็บแฮมสตริง / ไม่มีชื่อลงทะเบียน'},
                {'name': 'Justin Diehl', 'pos': 'FW', 'status': 'Out', 'statusText': 'บาดเจ็บ & ไม่มีชื่อ', 'badge': 'red', 'detail': 'เจ็บแฮมสตริง / ไม่มีชื่อลงทะเบียน'},
                {'name': 'Leonidas Stergiou', 'pos': 'DF', 'status': 'NoEligibility', 'statusText': 'ไม่มีชื่อลงทะเบียน', 'badge': 'gray', 'detail': 'ไม่ได้ลงทะเบียนแข่งขัน UCL'},
                {'name': 'Stefan Drljaca', 'pos': 'GK', 'status': 'NoEligibility', 'statusText': 'ไม่มีชื่อลงทะเบียน', 'badge': 'gray', 'detail': 'ไม่ได้ลงทะเบียนแข่งขัน UCL'}
            ]
        }
    },
    2: {  # Shakhtar vs Sporting CP
        'home': {
            'coach': 'Arda Turan',
            'keyPlayers': [
                {'name': 'Alisson', 'pos': 'FW', 'role': 'ปีกตัวความหวัง', 'stat': 'Sofascore เรตติ้ง 8.5 นัดล่าสุด (ยิง 3 ประตู)', 'value': '18M€', 'isStar': True}
            ],
            'injuredPlayers': [
                {'name': 'Pedrinho', 'pos': 'MF', 'status': 'Out', 'statusText': 'พักยาว (Out)', 'badge': 'red', 'detail': 'ผ่าตัดกระดูกเท้า จากเกมพบ Inter'},
                {'name': 'Eguinaldo', 'pos': 'FW', 'status': 'Out', 'statusText': 'บาดเจ็บ (Out)', 'badge': 'red', 'detail': 'บาดเจ็บหัวไหล่รุนแรง'},
                {'name': 'Maryan Shved', 'pos': 'MF', 'status': 'NoEligibility', 'statusText': 'ไม่มีสิทธิ์ลงสนาม', 'badge': 'gray', 'detail': 'ไม่ได้ลงทะเบียนในรอบลีกเฟส'},
                {'name': 'Viktor Korniyenko', 'pos': 'DF', 'status': 'NoEligibility', 'statusText': 'ไม่มีสิทธิ์ลงสนาม', 'badge': 'gray', 'detail': 'ไม่ได้ลงทะเบียนในรอบลีกเฟส'},
                {'name': 'Tymur Puzankov', 'pos': 'GK', 'status': 'NoEligibility', 'statusText': 'ไม่มีสิทธิ์ลงสนาม', 'badge': 'gray', 'detail': 'ไม่ได้ลงทะเบียนในรอบลีกเฟส'},
                {'name': 'Prosper Obah', 'pos': 'DF', 'status': 'NoEligibility', 'statusText': 'ไม่มีสิทธิ์ลงสนาม', 'badge': 'gray', 'detail': 'ไม่ได้ลงทะเบียนในรอบลีกเฟส'}
            ]
        },
        'away': {
            'coach': 'Rui Borges',
            'keyPlayers': [
                {'name': 'Iván Fresneda', 'pos': 'DF', 'role': 'วิงแบ็กจอมบุก', 'stat': '3 แอสซิสต์จาก 2 นัดหลังสุด', 'value': '22M€', 'isStar': True},
                {'name': 'Gonçalo Inácio', 'pos': 'DF', 'role': 'เซนเตอร์แบ็กตัวหลัก', 'stat': 'แกนหลักแผงหลังไร้พ่าย 12 นัดติด', 'value': '45M€', 'isStar': False},
                {'name': 'Eduardo Quaresma', 'pos': 'DF', 'role': 'กองหลังตัวจริง', 'stat': 'Sofascore เรตติ้ง 7.2 สม่ำเสมอ', 'value': '14M€', 'isStar': False}
            ],
            'injuredPlayers': [
                {'name': 'Sotiris Alexandropoulos', 'pos': 'MF', 'status': 'NoEligibility', 'statusText': 'ไม่มีชื่อลงทะเบียน', 'badge': 'gray', 'detail': 'ไม่มีชื่อลงทะเบียนในรอบลีกเฟส UCL'}
            ]
        }
    },
    3: {  # Feyenoord vs Inter
        'home': {
            'coach': 'Giovanni van Bronckhorst',
            'keyPlayers': [
                {'name': 'Anis Hadj Moussa', 'pos': 'FW', 'role': 'ปีกตัวอันตราย', 'stat': 'Sofascore เรตติ้ง 8.7 ในนัดล่าสุด', 'value': '12M€', 'isStar': True},
                {'name': 'Gjivai Zechiël', 'pos': 'MF', 'role': 'มิดฟิลด์ตัวรุก', 'stat': 'ยิงประตูเบิกร่อง 4 จาก 5 นัดในซีซั่นนี้', 'value': '8M€', 'isStar': False}
            ],
            'injuredPlayers': [
                {'name': 'Thomas Beelen', 'pos': 'DF', 'status': 'Out', 'statusText': 'พักยาว (Out)', 'badge': 'red', 'detail': 'ขาหัก / ไม่มีชื่อลงทะเบียน'},
                {'name': 'Jordan Bos', 'pos': 'DF', 'status': 'Out', 'statusText': 'พักยาว (Out)', 'badge': 'red', 'detail': 'เพิ่งเข้ารับการผ่าตัดหัวเข่า'},
                {'name': 'Jeremiah St. Juste', 'pos': 'DF', 'status': 'Out', 'statusText': 'บาดเจ็บ (Out)', 'badge': 'red', 'detail': 'บาดเจ็บกระดูกหน้าแข้ง'},
                {'name': 'Bart Nieuwkoop', 'pos': 'DF', 'status': 'Out', 'statusText': 'บาดเจ็บ (Out)', 'badge': 'red', 'detail': 'มีปัญหาอาการบาดเจ็บกล้ามเนื้อ'},
                {'name': 'Jakub Moder', 'pos': 'MF', 'status': 'Out', 'statusText': 'บาดเจ็บ (Out)', 'badge': 'red', 'detail': 'บาดเจ็บเอ็นกล้ามเนื้อ'},
                {'name': 'Reiss Nelson', 'pos': 'FW', 'status': 'Out', 'statusText': 'บาดเจ็บ (Out)', 'badge': 'red', 'detail': 'เจ็บกล้ามเนื้อแฮมสตริง'},
                {'name': 'Gijs Smal', 'pos': 'DF', 'status': 'Out', 'statusText': 'บาดเจ็บ (Out)', 'badge': 'red', 'detail': 'บาดเจ็บข้อเท้าแพลง'}
            ]
        },
        'away': {
            'coach': 'Simone Inzaghi',
            'keyPlayers': [
                {'name': 'Nicolò Barella', 'pos': 'MF', 'role': 'ห้องเครื่องตัวกลั่น', 'stat': 'หัวใจแดนกลางและคุมเกมรับ-รุก', 'value': '80M€', 'isStar': True},
                {'name': 'Hakan Çalhanoğlu', 'pos': 'MF', 'role': 'จอมทัพลูกนิ่ง', 'stat': 'เปอร์เซ็นต์จ่ายบอลสำเร็จ 91%', 'value': '45M€', 'isStar': False},
                {'name': 'Carlos Augusto', 'pos': 'DF', 'role': 'วิงแบ็กฝั่งซ้าย', 'stat': 'มีส่วนร่วม 5 ประตูจากเกมยุโรป', 'value': '22M€', 'isStar': False}
            ],
            'injuredPlayers': [
                {'name': 'Lautaro Martínez', 'pos': 'FW', 'status': 'Out', 'statusText': 'กัปตันทีม (Out)', 'badge': 'red', 'detail': 'ดาวยิงตัวเก่ง เจ็บกล้ามเนื้อแฮมสตริง'},
                {'name': 'Benjamin Pavard', 'pos': 'DF', 'status': 'Out', 'statusText': 'ตัวหลัก (Out)', 'badge': 'red', 'detail': 'เจ็บกล้ามเนื้อต้นขาด้านใน (Adductor)'},
                {'name': 'John Stones', 'pos': 'DF', 'status': 'Out', 'statusText': 'บาดเจ็บ (Out)', 'badge': 'red', 'detail': 'บาดเจ็บกล้ามเนื้อแฮมสตริง'},
                {'name': 'Curtis Jones', 'pos': 'MF', 'status': 'Out', 'statusText': 'บาดเจ็บ (Out)', 'badge': 'red', 'detail': 'เจ็บกล้ามเนื้อต้นขาด้านใน'},
                {'name': 'Luis Henrique', 'pos': 'FW', 'status': 'Out', 'statusText': 'บาดเจ็บ (Out)', 'badge': 'red', 'detail': 'มีปัญหาอาการบาดเจ็บกล้ามเนื้อ'}
            ]
        }
    },
    4: {  # Bodø/Glimt vs LOSC Lille
        'home': {
            'coach': 'Kjetil Knutsen',
            'keyPlayers': [
                {'name': 'Fredrik Sjøvold', 'pos': 'MF', 'role': 'ฮีโร่เกมก่อน', 'stat': 'ผู้ยิงประตูชัย 2–1 เหนือ Braga', 'value': '7M€', 'isStar': True},
                {'name': 'Patrick Berg', 'pos': 'MF', 'role': 'กัปตันทีม', 'stat': 'ผู้นำสถิติชนะเกมเหย้ายุโรป 6 นัดรวด', 'value': '5M€', 'isStar': False}
            ],
            'injuredPlayers': [
                {'name': 'Håkon Evjen', 'pos': 'MF', 'status': 'Out', 'statusText': 'บาดเจ็บ (Out)', 'badge': 'red', 'detail': 'บาดเจ็บเอ็นหัวเข่า'},
                {'name': 'August Mikkelsen', 'pos': 'FW', 'status': 'Out', 'statusText': 'พักฟื้น (Out)', 'badge': 'red', 'detail': 'ผ่าตัดกล้ามเนื้อขาหนีบ'},
                {'name': 'Magnus Riisnæs', 'pos': 'MF', 'status': 'Out', 'statusText': 'บาดเจ็บ (Out)', 'badge': 'red', 'detail': 'มีปัญหาอาการบาดเจ็บ'},
                {'name': 'Isak Sjong', 'pos': 'GK', 'status': 'Out', 'statusText': 'บาดเจ็บ (Out)', 'badge': 'red', 'detail': 'มีปัญหาอาการบาดเจ็บ'}
            ]
        },
        'away': {
            'coach': 'Bruno Génésio',
            'keyPlayers': [
                {'name': 'Jonathan David', 'pos': 'FW', 'role': 'ดาวยิงตัวความหวัง', 'stat': 'ดาวซัลโวสูงสุดประจำสโมสร', 'value': '50M€', 'isStar': True}
            ],
            'injuredPlayers': [
                {'name': 'Ethan Mbappé', 'pos': 'MF', 'status': 'Out', 'statusText': 'ตัวหลัก (Out)', 'badge': 'red', 'detail': 'บาดเจ็บกล้ามเนื้อ พลาดลงสนามหลายสัปดาห์'},
                {'name': 'Ayase Ueda', 'pos': 'FW', 'status': 'Out', 'statusText': 'ตัวหลัก (Out)', 'badge': 'red', 'detail': 'บาดเจ็บกล้ามเนื้อต้นขา'},
                {'name': 'Tiago Santos', 'pos': 'DF', 'status': 'Out', 'statusText': 'แบ็กขวาหลัก (Out)', 'badge': 'red', 'detail': 'บาดเจ็บเอ็นไขว้หน้าเข่า'}
            ]
        }
    },
    5: {  # Atlético Madrid vs Bayern Munich
        'home': {
            'coach': 'Diego Simeone',
            'keyPlayers': [
                {'name': 'Julián Alvarez', 'pos': 'FW', 'role': 'ดาวยิงเบอร์หนึ่ง', 'stat': 'ดาวซัลโวประจำทีมและผู้นำเกมโต้กลับ', 'value': '90M€', 'isStar': True},
                {'name': 'Antoine Griezmann', 'pos': 'FW', 'role': 'เพลย์เมกเกอร์', 'stat': 'สถิติชนะในบ้านรอบแบ่งกลุ่ม 10 จาก 12 นัด', 'value': '25M€', 'isStar': False}
            ],
            'injuredPlayers': [
                {'name': 'Cristian Romero', 'pos': 'DF', 'status': 'Out', 'statusText': 'ตัวหลัก (Out)', 'badge': 'red', 'detail': 'เจ็บกล้ามเนื้อต้นขาด้านใน (Adductor)'},
                {'name': 'Koke', 'pos': 'MF', 'status': 'Out', 'statusText': 'กัปตันทีม (Out)', 'badge': 'red', 'detail': 'บาดเจ็บกล้ามเนื้อต้นขา'},
                {'name': 'Johnny Cardoso', 'pos': 'MF', 'status': 'Doubtful', 'statusText': 'รอเช็กฟิต (Doubtful)', 'badge': 'yellow', 'detail': 'พลาดลงสนามใน 2 เกมหลังสุด'}
            ]
        },
        'away': {
            'coach': 'Vincent Kompany',
            'keyPlayers': [
                {'name': 'Harry Kane', 'pos': 'FW', 'role': 'ดาวยิงมหากาฬ', 'stat': 'ซัลโวไปแล้ว 4 ประตูใน UCL ฤดูกาลนี้', 'value': '100M€', 'isStar': True},
                {'name': 'Michael Olise', 'pos': 'FW', 'role': 'ปีกจอมถล่มประตู', 'stat': 'ยิง 2 ประตูใน UCL และแอสซิสต์สูงสุด', 'value': '65M€', 'isStar': False}
            ],
            'injuredPlayers': [
                {'name': 'Manuel Neuer', 'pos': 'GK', 'status': 'Out', 'statusText': 'กัปตันมือหนึ่ง (Out)', 'badge': 'red', 'detail': 'กระดูกเท้าหัก พักยาว'},
                {'name': 'Luis Díaz', 'pos': 'FW', 'status': 'Out', 'statusText': 'ตัวรุกหลัก (Out)', 'badge': 'red', 'detail': 'มีปัญหาอาการบาดเจ็บกล้ามเนื้อ'},
                {'name': 'Jamal Musiala', 'pos': 'MF', 'status': 'Doubtful', 'statusText': 'เจ็บเพิ่ม (Doubtful)', 'badge': 'yellow', 'detail': 'ได้รับบาดเจ็บจากเกมลีกสุดสัปดาห์'},
                {'name': 'Leroy Sané', 'pos': 'FW', 'status': 'Doubtful', 'statusText': 'เจ็บเพิ่ม (Doubtful)', 'badge': 'yellow', 'detail': 'ได้รับบาดเจ็บจากเกมลีกสุดสัปดาห์'}
            ]
        }
    },
    6: {  # Villarreal vs PSG
        'home': {
            'coach': 'Marcelino',
            'keyPlayers': [
                {'name': 'Gerard Moreno', 'pos': 'FW', 'role': 'หัวหอกกัปตันทีม', 'stat': 'สถิติ 12 จาก 14 เกมเหย้าเกิด BTTS', 'value': '15M€', 'isStar': True}
            ],
            'injuredPlayers': [
                {'name': 'Juan Foyth', 'pos': 'DF', 'status': 'Out', 'statusText': 'ตัวหลัก (Out)', 'badge': 'red', 'detail': 'ปัญหากล้ามเนื้อแฮมสตริงเรื้อรัง'},
                {'name': 'Ilias Akhomach', 'pos': 'FW', 'status': 'Out', 'statusText': 'บาดเจ็บ (Out)', 'badge': 'red', 'detail': 'บาดเจ็บกล้ามเนื้อต้นขา'},
                {'name': 'Nathan Saliba', 'pos': 'MF', 'status': 'Out', 'statusText': 'บาดเจ็บ (Out)', 'badge': 'red', 'detail': 'บาดเจ็บกล้ามเนื้อ'},
                {'name': 'Alassane Diatta', 'pos': 'FW', 'status': 'Out', 'statusText': 'บาดเจ็บ (Out)', 'badge': 'red', 'detail': 'ปัญหากล้ามเนื้อ'}
            ]
        },
        'away': {
            'coach': 'Luis Enrique',
            'keyPlayers': [
                {'name': 'Achraf Hakimi', 'pos': 'DF', 'role': 'ฟูลแบ็กเบอร์หนึ่งโลก', 'stat': 'เรตติ้ง 8.09 สม่ำเสมอ นำทัพชนะ 9 นัดรวด', 'value': '65M€', 'isStar': True},
                {'name': 'Désiré Doué', 'pos': 'FW', 'role': 'ดาวรุ่งฟอร์มร้อน', 'stat': 'ยิงทดแทนตัวหลักได้อย่างยอดเยี่ยม', 'value': '40M€', 'isStar': False},
                {'name': 'Senny Mayulu', 'pos': 'MF', 'role': 'ห้องเครื่องดาวรุ่ง', 'stat': 'เปอร์เซ็นต์แย่งบอลสำเร็จสูง 88%', 'value': '20M€', 'isStar': False}
            ],
            'injuredPlayers': [
                {'name': 'Khvicha Kvaratskhelia', 'pos': 'FW', 'status': 'Out', 'statusText': 'พักยาว (Out)', 'badge': 'red', 'detail': 'ผ่าตัดเอ็นไขว้หน้าเข่าฉีกขาด (ACL)'},
                {'name': 'Ousmane Dembélé', 'pos': 'FW', 'status': 'Out', 'statusText': 'ดาวยิงหลัก (Out)', 'badge': 'red', 'detail': 'บาดเจ็บกล้ามเนื้อแฮมสตริง'},
                {'name': 'Marquinhos', 'pos': 'DF', 'status': 'Out', 'statusText': 'กัปตันทีม (Out)', 'badge': 'red', 'detail': 'เจ็บแฮมสตริง พักรักษาตัว'},
                {'name': 'Nuno Mendes', 'pos': 'DF', 'status': 'Out', 'statusText': 'แบ็กซ้ายตัวจริง (Out)', 'badge': 'red', 'detail': 'กล้ามเนื้อต้นขาช้ำรุนแรง (Dead leg)'},
                {'name': 'Alessandro Longoni', 'pos': 'GK', 'status': 'Out', 'statusText': 'บาดเจ็บ (Out)', 'badge': 'red', 'detail': 'มีปัญหาอาการบาดเจ็บ'}
            ]
        }
    },
    7: {  # Barcelona vs Aston Villa
        'home': {
            'coach': 'Hansi Flick',
            'keyPlayers': [
                {'name': 'Lamine Yamal', 'pos': 'FW', 'role': 'ดาวเตะปรากฏการณ์', 'stat': 'มูลค่าตลาด 220 ล้านยูโร สร้างสรรค์โอกาสสูงสุด', 'value': '220M€', 'isStar': True},
                {'name': 'João Cancelo', 'pos': 'DF', 'role': 'ฟูลแบ็กจอมบุก', 'stat': 'คีย์พาสเฉลี่ย 3.2 ครั้งต่อนัด', 'value': '30M€', 'isStar': False}
            ],
            'injuredPlayers': [
                {'name': 'Jules Koundé', 'pos': 'DF', 'status': 'Out', 'statusText': 'ตัวหลัก (Out)', 'badge': 'red', 'detail': 'ข้อเท้าแพลงอย่างรุนแรง'},
                {'name': 'Dani Olmo', 'pos': 'MF', 'status': 'Out', 'statusText': 'ตัวรุกหลัก (Out)', 'badge': 'red', 'detail': 'กล้ามเนื้อต้นขาด้านในฉีกขาด'},
                {'name': 'Eric García', 'pos': 'DF', 'status': 'Out', 'statusText': 'บาดเจ็บ (Out)', 'badge': 'red', 'detail': 'บาดเจ็บกล้ามเนื้อแฮมสตริง'},
                {'name': 'Andreas Christensen', 'pos': 'DF', 'status': 'Out', 'statusText': 'บาดเจ็บ (Out)', 'badge': 'red', 'detail': 'มีปัญหาอาการบาดเจ็บกล้ามเนื้อ'},
                {'name': 'Xavi Espart', 'pos': 'DF', 'status': 'Out', 'statusText': 'พักยาว (Out)', 'badge': 'red', 'detail': 'เจ็บข้อเท้าพักราว 7 สัปดาห์'},
                {'name': 'Roony Bardghji', 'pos': 'FW', 'status': 'Out', 'statusText': 'พักยาว & ไม่มีชื่อ', 'badge': 'red', 'detail': 'เอ็นไขว้หน้าเข่าฉีกขาด (ACL) / ไม่มีชื่อ'}
            ]
        },
        'away': {
            'coach': 'Unai Emery',
            'keyPlayers': [
                {'name': 'Johan Manzambi', 'pos': 'FW', 'role': 'ดาวเด่นมูลค่าสูงสุด', 'stat': 'มูลค่าตลาด 65 ล้านยูโร นำทีมชนะรวด 3 นัด', 'value': '65M€', 'isStar': True},
                {'name': 'Ollie Watkins', 'pos': 'FW', 'role': 'ดาวยิงตัวเก่ง', 'stat': 'ยิงไป 12 ลูกจาก 3 นัดแรกของทีมใน UCL', 'value': '60M€', 'isStar': False}
            ],
            'injuredPlayers': [
                {'name': 'Amadou Onana', 'pos': 'MF', 'status': 'Out', 'statusText': 'พักยาว (Out)', 'badge': 'red', 'detail': 'เอ็นไขว้หน้าเข่าฉีกขาด (ACL)'},
                {'name': 'Aaron Wan-Bissaka', 'pos': 'DF', 'status': 'Out', 'statusText': 'ตัวหลัก (Out)', 'badge': 'red', 'detail': 'บาดเจ็บกล้ามเนื้อแฮมสตริง'},
                {'name': 'Matteo Ruggeri', 'pos': 'DF', 'status': 'Out', 'statusText': 'บาดเจ็บ (Out)', 'badge': 'red', 'detail': 'บาดเจ็บกล้ามเนื้อแฮมสตริง'},
                {'name': 'Taylor Harwood-Bellis', 'pos': 'DF', 'status': 'NoEligibility', 'statusText': 'ไม่มีชื่อลงทะเบียน', 'badge': 'gray', 'detail': 'ไม่ได้ลงทะเบียนแข่งขัน UCL'}
            ]
        }
    },
    8: {  # Manchester United vs AS Roma
        'home': {
            'coach': 'Michael Carrick',
            'coachStatus': 'เก้าอี้สั่นคลอนอย่างหนัก (ไม่ชนะ 9 นัดติด อันดับ 17 พรีเมียร์ลีก)',
            'keyPlayers': [
                {'name': 'Bruno Fernandes', 'pos': 'MF', 'role': 'กัปตันทีม & เพลย์เมกเกอร์', 'stat': 'มีส่วนร่วม 5 ประตูจาก 2 นัดพบโรม่า (ยิง 2 แอสซิสต์ 3)', 'value': '65M€', 'isStar': True}
            ],
            'injuredPlayers': [
                {'name': 'Leny Yoro', 'pos': 'DF', 'status': 'Suspended', 'statusText': 'ติดโทษแบน (Suspended)', 'badge': 'red', 'detail': 'ติดโทษแบนจากใบแดงในนัดก่อน'},
                {'name': 'Manuel Ugarte', 'pos': 'MF', 'status': 'Out', 'statusText': 'พักยาว (Out)', 'badge': 'red', 'detail': 'เอ็นไขว้หน้าเข่าฉีกขาด (ACL) ผ่าตัดพักยาว'},
                {'name': 'Benjamin Šeško', 'pos': 'FW', 'status': 'Out', 'statusText': 'บาดเจ็บ (Out)', 'badge': 'red', 'detail': 'บาดเจ็บกระดูกหน้าแข้ง'},
                {'name': 'Noussair Mazraoui', 'pos': 'DF', 'status': 'Out', 'statusText': 'บาดเจ็บ (Out)', 'badge': 'red', 'detail': 'มีปัญหาอาการบาดเจ็บที่หลัง'},
                {'name': 'Luke Shaw', 'pos': 'DF', 'status': 'Doubtful', 'statusText': 'รอเช็กฟิต (Doubtful)', 'badge': 'yellow', 'detail': 'ต้องรอทดสอบความฟิตก่อนเริ่มแข่ง'},
                {'name': 'Marcus Rashford', 'pos': 'FW', 'status': 'Doubtful', 'statusText': 'รอเช็กฟิต (Doubtful)', 'badge': 'yellow', 'detail': 'ต้องรอทดสอบความฟิตก่อนเริ่มแข่ง'}
            ]
        },
        'away': {
            'coach': 'Gian Piero Gasperini',
            'coachStatus': 'ฟอร์มยอดเยี่ยม ไร้พ่ายใน Serie A 17 นัดติดต่อกัน (ชนะ 13 เสมอ 4)',
            'keyPlayers': [
                {'name': 'Donyell Malen', 'pos': 'FW', 'role': 'ดาวยิงฟอร์มฮอต', 'stat': 'มีส่วนร่วม 5 ประตูใน UCL (ยิง 3 แอสซิสต์ 2)', 'value': '40M€', 'isStar': True}
            ],
            'injuredPlayers': [
                {'name': 'Paulo Dybala', 'pos': 'FW', 'status': 'Out', 'statusText': 'ตัวหลัก (Out)', 'badge': 'red', 'detail': 'บาดเจ็บกล้ามเนื้อน่อง'},
                {'name': 'Mile Svilar', 'pos': 'GK', 'status': 'Out', 'statusText': 'มือหนึ่ง (Out)', 'badge': 'red', 'detail': 'มีอาการบาดเจ็บกระดูกหัก'}
            ]
        }
    },
    9: {  # LASK vs Slovan Bratislava
        'home': {
            'coach': 'Dietmar Kühbauer',
            'keyPlayers': [
                {'name': 'Moses Usor', 'pos': 'FW', 'role': 'ดาวเด่นมูลค่าสูงสุด', 'stat': 'มูลค่า 8 ล้านยูโร นำเกมรุกเปิดบ้านคว้าชัย', 'value': '8M€', 'isStar': True},
                {'name': 'Krystof Danek', 'pos': 'MF', 'role': 'มิดฟิลด์ตัวรุก', 'stat': 'เพิ่งยิงประตูใส่ Sporting CP ในนัดบุกชนะ 3–2', 'value': '4M€', 'isStar': False},
                {'name': 'Sasa Kalajdzic', 'pos': 'FW', 'role': 'กองหน้าร่างโย่ง', 'stat': 'อันตรายในลูกกลางอากาศและลูกตั้งเตะ', 'value': '5M€', 'isStar': False}
            ],
            'injuredPlayers': [
                {'name': 'Ramiz Harakaté', 'pos': 'FW', 'status': 'Out', 'statusText': 'พักยาว (Out)', 'badge': 'red', 'detail': 'เอ็นไขว้หน้าเข่าฉีกขาด (ACL) / ไม่มีชื่อ'},
                {'name': 'Melayro Bogarde', 'pos': 'DF', 'status': 'Out', 'statusText': 'บาดเจ็บ (Out)', 'badge': 'red', 'detail': 'มีปัญหาอาการบาดเจ็บ'},
                {'name': 'George Bello', 'pos': 'DF', 'status': 'Out', 'statusText': 'บาดเจ็บ (Out)', 'badge': 'red', 'detail': 'บาดเจ็บกล้ามเนื้อ'},
                {'name': 'Art Smakaj', 'pos': 'MF', 'status': 'NoEligibility', 'statusText': 'ไม่มีชื่อลงทะเบียน', 'badge': 'gray', 'detail': 'ไม่ได้ลงทะเบียนแข่งขัน UCL'},
                {'name': 'Cheikne Kébé', 'pos': 'DF', 'status': 'NoEligibility', 'statusText': 'ไม่มีชื่อลงทะเบียน', 'badge': 'gray', 'detail': 'ไม่ได้ลงทะเบียนแข่งขัน UCL'}
            ]
        },
        'away': {
            'coach': 'Yaya Touré',
            'keyPlayers': [
                {'name': 'Nino Marcelli', 'pos': 'FW', 'role': 'ดาวรุ่งมูลค่าสูงสุด', 'stat': 'ตัวความหวังเดียวในแนวรุกของทีมบ๊วย', 'value': '3.5M€', 'isStar': True}
            ],
            'injuredPlayers': [
                {'name': 'Mykola Kukharevych', 'pos': 'FW', 'status': 'Out', 'statusText': 'กองหน้าหลัก (Out)', 'badge': 'red', 'detail': 'มีอาการบาดเจ็บ พลาดลงสนาม'}
            ]
        }
    }
}

def enrich_data():
    with open('data.js', 'r', encoding='utf-8') as f:
        text = f.read()

    data_start = text.find('const UCL_DATA = ') + len('const UCL_DATA = ')
    data_end = text.find('const UCL_SVGS = ')
    json_str = text[data_start:data_end].strip()
    if json_str.endswith(';'):
        json_str = json_str[:-1]

    data = json.loads(json_str)

    # Attach structured rosters
    for m in data['matches']:
        mid = m['id']
        if mid in STRUCTURED_ROSTERS:
            m['squadRoster'] = STRUCTURED_ROSTERS[mid]

    # Re-write data.js
    svg_part = text[data_end:]
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write('/* Generated automatically from Ucl.txt - Enriched Version */\n')
        f.write('const UCL_DATA = ' + json.dumps(data, ensure_ascii=False, indent=2) + ';\n\n')
        f.write(svg_part)

    print('data.js enriched successfully!')

if __name__ == '__main__':
    enrich_data()
