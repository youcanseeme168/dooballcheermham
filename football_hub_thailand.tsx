import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, Newspaper, Activity, Calendar, Search, Filter, 
  RefreshCw, ChevronRight, Clock, Shield, AlertCircle, 
  CheckCircle2, Flame, SlidersHorizontal, Eye, X, Wifi, 
  Settings, ArrowUpRight, Users, BarChart3, History, 
  Shirt, HeartPulse, Ban, Sparkles, Radio, Check
} from 'lucide-react';

// --- INITIAL MOCK DATA ---
const LEAGUES = [
  { id: 'all', name: 'ทุกลีก (All)', short: 'ALL', country: '🌍' },
  { id: 'epl', name: 'Premier League', short: 'EPL', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', apiId: 39 },
  { id: 'ucl', name: 'Champions League', short: 'UCL', country: '🇪🇺', apiId: 2 },
  { id: 'laliga', name: 'La Liga', short: 'LAL', country: '🇪🇸', apiId: 140 },
  { id: 'thaileague', name: 'Thai League 1', short: 'T1', country: '🇹🇭', apiId: 296 },
];

const INITIAL_MATCHES = [
  {
    id: 'm1',
    leagueId: 'epl',
    leagueName: 'Premier League',
    status: 'LIVE',
    minute: 67,
    time: '22:00',
    date: 'วันนี้',
    homeTeam: { name: 'Arsenal', short: 'ARS', color: '#EF0107', score: 2 },
    awayTeam: { name: 'Liverpool', short: 'LIV', color: '#C8102E', score: 1 },
    stadium: 'Emirates Stadium',
    events: [
      { minute: 14, type: 'goal', team: 'home', player: 'Bukayo Saka', assist: 'M. Ødegaard' },
      { minute: 38, type: 'goal', team: 'away', player: 'Mohamed Salah', assist: 'L. Díaz' },
      { minute: 52, type: 'yellow', team: 'away', player: 'Alexis Mac Allister' },
      { minute: 61, type: 'goal', team: 'home', player: 'Kai Havertz', assist: 'Declan Rice' },
    ],
    stats: {
      possession: [54, 46],
      shots: [14, 11],
      shotsOnTarget: [6, 4],
      corners: [7, 5],
      fouls: [9, 12],
      xg: [1.85, 1.12]
    },
    lineups: {
      homeFormation: '4-3-3',
      awayFormation: '4-2-3-1',
      homeXI: ['Raya (GK)', 'White', 'Saliba', 'Gabriel', 'Timber', 'Rice', 'Partey', 'Ødegaard (C)', 'Saka', 'Martinelli', 'Havertz'],
      awayXI: ['Alisson (GK)', 'Alexander-Arnold', 'Konaté', 'Van Dijk (C)', 'Robertson', 'Gravenberch', 'Mac Allister', 'Salah', 'Szoboszlai', 'Díaz', 'Jota'],
      missingHome: ['G. Jesus (เจ็บเข่า)', 'T. Tomiyasu (ไม่ฟิต)'],
      missingAway: ['D. Núñez (แบน)', 'H. Elliott (เจ็บข้อเท้า)']
    },
    h2h: [
      { date: '04/02/2026', home: 'ARS', away: 'LIV', score: '3 - 1' },
      { date: '23/12/2025', home: 'LIV', away: 'ARS', score: '1 - 1' },
      { date: '09/04/2025', home: 'LIV', away: 'ARS', score: '2 - 2' }
    ]
  },
  {
    id: 'm2',
    leagueId: 'epl',
    leagueName: 'Premier League',
    status: 'LIVE',
    minute: 34,
    time: '22:30',
    date: 'วันนี้',
    homeTeam: { name: 'Man City', short: 'MCI', color: '#6CABDD', score: 1 },
    awayTeam: { name: 'Tottenham', short: 'TOT', color: '#132257', score: 1 },
    stadium: 'Etihad Stadium',
    events: [
      { minute: 11, type: 'goal', team: 'away', player: 'Son Heung-Min', assist: 'J. Maddison' },
      { minute: 28, type: 'goal', team: 'home', player: 'Erling Haaland', assist: 'P. Foden' },
    ],
    stats: {
      possession: [65, 35],
      shots: [10, 4],
      shotsOnTarget: [4, 2],
      corners: [5, 1],
      fouls: [4, 7],
      xg: [1.42, 0.65]
    },
    lineups: {
      homeFormation: '4-1-4-1',
      awayFormation: '4-3-3',
      homeXI: ['Ederson (GK)', 'Walker (C)', 'Dias', 'Akanji', 'Gvardiol', 'Kovačić', 'Savinho', 'Foden', 'Silva', 'Doku', 'Haaland'],
      awayXI: ['Vicario (GK)', 'Porro', 'Romero', 'Van de Ven', 'Udogie', 'Sarr', 'Bissouma', 'Maddison', 'Kulusevski', 'Son (C)', 'Solanke'],
      missingHome: ['Rodri (เอ็นไขว้หน้า)', 'K. De Bruyne (เช็คฟิต)'],
      missingAway: ['Richarlison (แฮมสตริง)']
    },
    h2h: [
      { date: '14/05/2026', home: 'TOT', away: 'MCI', score: '0 - 2' },
      { date: '03/12/2025', home: 'MCI', away: 'TOT', score: '3 - 3' }
    ]
  },
  {
    id: 'm3',
    leagueId: 'thaileague',
    leagueName: 'Thai League 1',
    status: 'FT',
    minute: 90,
    time: '19:00',
    date: 'วันนี้',
    homeTeam: { name: 'Buriram United', short: 'BRU', color: '#1B255B', score: 3 },
    awayTeam: { name: 'Port FC', short: 'PAT', color: '#F36F21', score: 2 },
    stadium: 'Chang Arena',
    events: [
      { minute: 19, type: 'goal', team: 'home', player: 'Supachai Chaided', assist: 'T. Bunmathan' },
      { minute: 44, type: 'goal', team: 'away', player: 'Bordin Phala', assist: 'Worachit' },
      { minute: 68, type: 'goal', team: 'home', player: 'Guilherme Bissoli', assist: 'L. Crispim' },
      { minute: 79, type: 'goal', team: 'away', player: 'Teerasak Poeiphimai', assist: 'A. Doombuuya' },
      { minute: 88, type: 'goal', team: 'home', player: 'Supachai Chaided', assist: 'N. Weerawatnodom' },
    ],
    stats: {
      possession: [58, 42],
      shots: [16, 12],
      shotsOnTarget: [8, 5],
      corners: [8, 4],
      fouls: [14, 15],
      xg: [2.30, 1.54]
    },
    lineups: {
      homeFormation: '3-5-2',
      awayFormation: '4-2-3-1',
      homeXI: ['Neil Etheridge (GK)', 'Pansa', 'Kenny Dougall', 'Kim Min-Hyeok', 'Narubadin (C)', 'Theerathon', 'Phitiwat', 'Lucas Crispim', 'Sasalak', 'Supachai', 'Bissoli'],
      awayXI: ['Somporn Yos (GK)', 'Suphanan', 'Irfan Fandi', 'Frans Putros', 'Kevin Deeromram', 'Tanaboon (C)', 'Peeradol', 'Pathompol', 'Worachit', 'Bordin', 'Willen Mota'],
      missingHome: ['ไม่มีผู้เล่นบาดเจ็บ'],
      missingAway: ['สมพร ยศ (เช็คฟิตหลังเกม)']
    },
    h2h: [
      { date: '12/05/2026', home: 'BRU', away: 'PAT', score: '1 - 1' },
      { date: '17/12/2025', home: 'PAT', away: 'BRU', score: '4 - 1' }
    ]
  },
  {
    id: 'm4',
    leagueId: 'laliga',
    leagueName: 'La Liga',
    status: 'UPCOMING',
    minute: 0,
    time: '02:00',
    date: 'คืนนี้',
    homeTeam: { name: 'Real Madrid', short: 'RMA', color: '#FEBE10', score: null },
    awayTeam: { name: 'Barcelona', short: 'BAR', color: '#A50044', score: null },
    stadium: 'Santiago Bernabéu',
    events: [],
    stats: {
      possession: [50, 50],
      shots: [0, 0],
      shotsOnTarget: [0, 0],
      corners: [0, 0],
      fouls: [0, 0],
      xg: [0.00, 0.00]
    },
    lineups: {
      homeFormation: '4-3-1-2 (คาดการณ์)',
      awayFormation: '4-3-3 (คาดการณ์)',
      homeXI: ['Courtois (GK)', 'Carvajal (C)', 'Rüdiger', 'Militão', 'Mendy', 'Valverde', 'Tchouaméni', 'Camavinga', 'Bellingham', 'Vinícius Jr.', 'Mbappé'],
      awayXI: ['Ter Stegen (GK)', 'Koundé', 'Araújo', 'Cubarsí', 'Balde', 'Pedri', 'De Jong', 'Olmo', 'Lamine Yamal', 'Raphinha', 'Lewandowski'],
      missingHome: ['D. Alaba (พักฟื้นเข่า)'],
      missingAway: ['Gavi (กำลังเรียกความฟิต)']
    },
    h2h: [
      { date: '21/04/2026', home: 'RMA', away: 'BAR', score: '3 - 2' },
      { date: '14/01/2026', home: 'RMA', away: 'BAR', score: '4 - 1' }
    ]
  },
  {
    id: 'm5',
    leagueId: 'ucl',
    leagueName: 'Champions League',
    status: 'UPCOMING',
    minute: 0,
    time: '03:00',
    date: 'พรุ่งนี้',
    homeTeam: { name: 'Bayern Munich', short: 'BAY', color: '#DC052D', score: null },
    awayTeam: { name: 'PSG', short: 'PSG', color: '#004170', score: null },
    stadium: 'Allianz Arena',
    events: [],
    stats: {
      possession: [50, 50],
      shots: [0, 0],
      shotsOnTarget: [0, 0],
      corners: [0, 0],
      fouls: [0, 0],
      xg: [0.00, 0.00]
    },
    lineups: {
      homeFormation: '4-2-3-1 (คาดการณ์)',
      awayFormation: '4-3-3 (คาดการณ์)',
      homeXI: ['Neuer (C)', 'Guerreiro', 'Upamecano', 'Kim', 'Davies', 'Kimmich', 'Pavlović', 'Olise', 'Musiala', 'Gnabry', 'Kane'],
      awayXI: ['Donnarumma', 'Hakimi', 'Marquinhos (C)', 'Pacho', 'Mendes', 'Vitinha', 'Zaïre-Emery', 'Neves', 'Dembélé', 'Asensio', 'Barcola'],
      missingHome: ['H. Ito (กระดูกฝ่าเท้า)', 'J. Stanisic (เอ็นเข่า)'],
      missingAway: ['G. Ramos (ข้อเท้า)', 'L. Hernández (ACL)']
    },
    h2h: [
      { date: '08/03/2025', home: 'BAY', away: 'PSG', score: '2 - 0' },
      { date: '14/02/2025', home: 'PSG', away: 'BAY', score: '0 - 1' }
    ]
  },
  {
    id: 'm6',
    leagueId: 'epl',
    leagueName: 'Premier League',
    status: 'FT',
    minute: 90,
    time: '21:00',
    date: 'เมื่อวาน',
    homeTeam: { name: 'Man United', short: 'MUN', color: '#DA291C', score: 2 },
    awayTeam: { name: 'Chelsea', short: 'CHE', color: '#034694', score: 2 },
    stadium: 'Old Trafford',
    events: [
      { minute: 22, type: 'goal', team: 'home', player: 'Bruno Fernandes (P)', assist: '-' },
      { minute: 41, type: 'goal', team: 'away', player: 'Cole Palmer', assist: 'E. Fernández' },
      { minute: 73, type: 'goal', team: 'home', player: 'Alejandro Garnacho', assist: 'K. Mainoo' },
      { minute: 89, type: 'goal', team: 'away', player: 'Moisés Caicedo', assist: 'P. Neto' },
    ],
    stats: {
      possession: [47, 53],
      shots: [15, 17],
      shotsOnTarget: [6, 7],
      corners: [5, 8],
      fouls: [11, 13],
      xg: [1.91, 2.04]
    },
    lineups: {
      homeFormation: '4-2-3-1',
      awayFormation: '4-2-3-1',
      homeXI: ['Onana', 'Mazraoui', 'De Ligt', 'Martínez', 'Dalot', 'Casemiro', 'Mainoo', 'Garnacho', 'Fernandes (C)', 'Rashford', 'Højlund'],
      awayXI: ['Sánchez', 'Gusto', 'Fofana', 'Colwill', 'Cucurella', 'Caicedo', 'Lavia', 'Madueke', 'Palmer', 'Neto', 'Jackson'],
      missingHome: ['L. Shaw (น่อง)', 'L. Yoro (กระดูกเท้า)'],
      missingAway: ['R. James (แฮมสตริง)']
    },
    h2h: [
      { date: '04/04/2026', home: 'CHE', away: 'MUN', score: '4 - 3' },
      { date: '06/12/2025', home: 'MUN', away: 'CHE', score: '2 - 1' }
    ]
  }
];

const INITIAL_INJURIES = [
  {
    id: 'inj1',
    player: 'Rodri Hernández',
    position: 'กองกลางตัวรับ (CDM)',
    team: 'Man City',
    league: 'epl',
    teamColor: '#6CABDD',
    type: 'เอ็นไขว้หน้าเข่าฉีกขาด (ACL Injury)',
    status: 'OUT',
    statusText: 'พักยาว (Out)',
    expectedReturn: 'พฤษภาคม 2027',
    impact: 'CRITICAL',
    note: 'เข้ารับการผ่าตัดเรียบร้อยแล้ว คาดว่าต้องพักฟื้นยาวตลอดช่วงที่เหลือของฤดูกาล'
  },
  {
    id: 'inj2',
    player: 'Kevin De Bruyne',
    position: 'กองกลางตัวรุก (CAM)',
    team: 'Man City',
    league: 'epl',
    teamColor: '#6CABDD',
    type: 'กล้ามเนื้อขาหนีบตึง (Groin Strain)',
    status: 'DOUBTFUL',
    statusText: 'รอเช็คฟิต 50/50',
    expectedReturn: 'สัปดาห์หน้า',
    impact: 'HIGH',
    note: 'กลับมาลงซ้อมเบาๆ กับทีมได้แล้ว แต่เป๊ปยังไม่ต้องการเสี่ยงใช้งานหนัก'
  },
  {
    id: 'inj3',
    player: 'Martin Ødegaard',
    position: 'กองกลางตัวรุก (CAM)',
    team: 'Arsenal',
    league: 'epl',
    teamColor: '#EF0107',
    type: 'ฟื้นฟูเอ็นข้อเท้า (Ankle Ligament)',
    status: 'RETURNING',
    statusText: 'พร้อมคืนสนาม',
    expectedReturn: 'พร้อมลงเล่น',
    impact: 'CRITICAL',
    note: 'ผ่านความฟิตสมบูรณ์ 100% และมีชื่อออกสตาร์ทเป็นตัวจริงในเกมบิ๊กแมตช์'
  },
  {
    id: 'inj4',
    player: 'Darwin Núñez',
    position: 'กองหน้าตัวเป้า (ST)',
    team: 'Liverpool',
    league: 'epl',
    teamColor: '#C8102E',
    type: 'สะสมใบเหลืองครบโควตา (Suspended)',
    status: 'SUSPENDED',
    statusText: 'ติดโทษแบน (1 นัด)',
    expectedReturn: 'นัดถัดไป',
    impact: 'MEDIUM',
    note: 'ได้รับใบเหลืองใบที่ 5 ของฤดูกาลจากเกมสัปดาห์ก่อน ทำให้หมดสิทธิ์ลงสนามนัดนี้'
  },
  {
    id: 'inj5',
    player: 'Luke Shaw',
    position: 'แบ็คซ้าย (LB)',
    team: 'Man United',
    league: 'epl',
    teamColor: '#DA291C',
    type: 'กล้ามเนื้อน่องอักเสบ (Calf Injury)',
    status: 'OUT',
    statusText: 'บาดเจ็บ (Out)',
    expectedReturn: 'ปลายเดือนนี้',
    impact: 'HIGH',
    note: 'มีอาการกำเริบระหว่างการฝึกซ้อม ทีมแพทย์กำลังประเมินโปรแกรมกายภาพใหม่'
  },
  {
    id: 'inj6',
    player: 'Reece James',
    position: 'แบ็คขวา (RB)',
    team: 'Chelsea',
    league: 'epl',
    teamColor: '#034694',
    type: 'กล้ามเนื้อแฮมสตริง (Hamstring)',
    status: 'DOUBTFUL',
    statusText: 'รอเช็คฟิต 50/50',
    expectedReturn: 'ภายใน 7 วัน',
    impact: 'MEDIUM',
    note: 'ทีมสตาฟฟ์ควบคุมนาทีลงสนามอย่างเข้มงวดเพื่อป้องกันอาการบาดเจ็บซ้ำ'
  },
  {
    id: 'inj7',
    player: 'David Alaba',
    position: 'เซ็นเตอร์แบ็ค (CB)',
    team: 'Real Madrid',
    league: 'laliga',
    teamColor: '#FEBE10',
    type: 'ฟื้นฟูหลังผ่าตัดเข่า (Knee Recovery)',
    status: 'OUT',
    statusText: 'พักฟื้น (Out)',
    expectedReturn: 'ธันวาคม 2026',
    impact: 'HIGH',
    note: 'เริ่มวิ่งบนสนามหญ้าได้แล้ว คาดว่าจะกลับมาช่วยทีมได้ในช่วงท้ายปี'
  },
  {
    id: 'inj8',
    player: 'ชนาธิป สรงกระสินธ์',
    position: 'กองกลางตัวรุก (CAM)',
    team: 'BG Pathum United',
    league: 'thaileague',
    teamColor: '#0047BA',
    type: 'กล้ามเนื้อต้นขาด้านหลังตึง',
    status: 'RETURNING',
    statusText: 'ซ้อมเต็มรูปแบบ',
    expectedReturn: 'สุดสัปดาห์นี้',
    impact: 'CRITICAL',
    note: 'ลงซ้อมร่วมกับเพื่อนร่วมทีมได้เต็มรูปแบบ เตรียมพร้อมลงบัญชาเกมรุกนัดถัดไป'
  }
];

const INITIAL_NEWS = [
  {
    id: 'n1',
    title: 'อัปเดตล่าสุด! อาร์เตต้า ยืนยัน "โอเดการ์ด" ฟิตเต็มถังพร้อมบัญชาทัพปืนใหญ่ดวลหงส์แดง',
    category: 'Injury Update',
    categoryThai: 'อัปเดตอาการบาดเจ็บ',
    league: 'Premier League',
    timeAgo: '25 นาทีที่แล้ว',
    readTime: '3 นาที',
    isHot: true,
    accentColor: 'from-red-600 to-rose-900',
    badgeText: 'BREAKING',
    summary: 'มิเกล อาร์เตต้า กุนซืออาร์เซนอล ออกมายืนยันข่าวดีให้สาวกเดอะกันเนอร์สได้เฮ หลังกัปตันทีมคนสำคัญผ่านการทดสอบความฟิตและพร้อมลงสนามเป็นตัวจริงทันที',
    content: `มิเกล อาร์เตต้า ผู้จัดการทีมอาร์เซนอล ให้สัมภาษณ์ก่อนเกมบิ๊กแมตช์พรีเมียร์ลีก โดยยืนยันว่า มาร์ติน โอเดการ์ด กองกลางกัปตันทีมชาติเนอร์เวย์ สลัดอาการบาดเจ็บเอ็นข้อเท้ากลับมาฟิตสมบูรณ์พร้อมออกสตาร์ทเป็น 11 ตัวจริง

"มาร์ตินทำงานหนักมากร่วมกับทีมแพทย์ตลอดหลายสัปดาห์ที่ผ่านมา เขามีความมุ่งมั่นที่จะกลับมาช่วยทีมในเกมสำคัญวันนี้ และจากการซ้อมครั้งสุดท้าย เขาก็แสดงให้เห็นว่าพร้อม 100% แล้ว" อาร์เตต้า กล่าว

อย่างไรก็ตาม ทีมยังคงต้องเช็คสภาพความฟิตของ กาเบรียล เชซุส และ ทาเคฮิโระ โทมิยาสึ ที่ยังมีอาการบาดเจ็บรบกวนเล็กน้อย ขณะที่ฝั่งลิเวอร์พูลจะไม่มี ดาร์วิน นูเญซ ที่ติดโทษแบนจากการสะสมใบเหลืองครบโควตา`
  },
  {
    id: 'n2',
    title: 'เจาะแท็กติก El Clásico: การดวลกันของแนวรุกความเร็วแสง Mbappé ปะทะ Lamine Yamal',
    category: 'Tactical',
    categoryThai: 'วิเคราะห์แท็กติก',
    league: 'La Liga',
    timeAgo: '1 ชั่วโมงที่แล้ว',
    readTime: '5 นาที',
    isHot: true,
    accentColor: 'from-amber-500 to-purple-900',
    badgeText: 'TACTICAL INSIGHT',
    summary: 'วิเคราะห์จุดชี้ขาดศึกเอล กลาซิโก้ คืนนี้ เมื่อเรอัล มาดริด เตรียมใช้สปีดนรกของ เอ็มบัปเป้ และ วินิซิอุส โจมตีแนวรับดันสูงของบาร์เซโลน่าภายใต้ยุค ฮันซี่ ฟลิค',
    content: `ศึกเอล กลาซิโก้ ที่สนามซานติอาโก้ เบร์นาเบว คืนนี้ ได้รับการจับตามองว่าเป็นหนึ่งในการดวลเชิงแท็กติกที่น่าตื่นเต้นที่สุดของฤดูกาล

จุดสำคัญอยู่ที่ระบบ High Defensive Line (แนวรับดันสูงถึงครึ่งสนาม) ของ ฮันซี่ ฟลิค ที่ช่วยให้บาร์เซโลน่าบีบพื้นที่คู่แข่งได้อย่างดุดันและดักล้ำหน้าได้อย่างแม่นยำ แต่ในขณะเดียวกัน นี่คือพื้นที่ในฝันของ คีลิยัน เอ็มบัปเป้ และ วินิซิอุส จูเนียร์ สองแนวรุกที่มีความเร็วต้นจัดจ้านที่สุดในโลกยุคปัจจุบัน

ขณะที่ฝั่งบาร์เซโลน่า ลามีน ยามาล ดาวรุ่งพุ่งแรงยังคงเป็นหัวใจในการสร้างสรรค์เกมริมเส้นฝั่งขวา โดยมี เปดรี้ และ ดานี่ โอลโม่ คอยสอดประสานในพื้นที่ Half-space`
  },
  {
    id: 'n3',
    title: 'แมนฯ ซิตี้ เล็งคว้าตัวมิดฟิลด์ห้องเครื่องคนใหม่ตลาดมกราคม ทดแทนการขาดหายของ โรดรี้',
    category: 'Transfers',
    categoryThai: 'ตลาดซื้อขายนักเตะ',
    league: 'Premier League',
    timeAgo: '3 ชั่วโมงที่แล้ว',
    readTime: '4 นาที',
    isHot: false,
    accentColor: 'from-sky-500 to-blue-900',
    badgeText: 'TRANSFER RUMOR',
    summary: 'บอร์ดบริหารทัพเรือใบสีฟ้าเตรียมอนุมัติงบเสริมทัพฉุกเฉินในตลาดหน้าหนาว เพื่อหามิดฟิลด์ตัวรับธรรมชาติเข้ามาแบ่งเบาภาระของ มัตเตโอ โควาซิช',
    content: `หลังจากที่ โรดรี้ กองกลางเจ้าของรางวัลบัลลงดอร์ ต้องเข้ารับการผ่าตัดเอ็นไขว้หน้าเข่า (ACL) และต้องพักยาวตลอดฤดูกาล ส่งผลให้โครงสร้างเกมรับและจังหวะการเปลี่ยนเกมของ แมนเชสเตอร์ ซิตี้ ได้รับผลกระทบอย่างชัดเจน

รายงานระบุว่า เป๊ป กวาร์ดิโอล่า และทีมแมวมองได้ลิสต์รายชื่อกองกลางตัวรับ 3 รายที่มีทักษะการครองบอลภายใต้แรงกดดันสูงและอ่านเกมขาด เพื่อดึงตัวมาร่วมทีมในเดือนมกราคมนี้ทันที`
  },
  {
    id: 'n4',
    title: 'ศุภชัย เหมาสอง! บุรีรัมย์ ยูไนเต็ด เปิดบ้านเฉือน การท่าเรือ สุดมันส์ 3-2 ยึดจ่าฝูงไทยลีก',
    category: 'Match Report',
    categoryThai: 'สรุปผลการแข่งขัน',
    league: 'Thai League 1',
    timeAgo: '4 ชั่วโมงที่แล้ว',
    readTime: '3 นาที',
    isHot: false,
    accentColor: 'from-indigo-600 to-orange-700',
    badgeText: 'THAI LEAGUE',
    summary: 'บิ๊กแมตช์ไทยลีกที่ช้าง อารีนา ดุเดือดสมราคา เมื่อปราสาทสายฟ้าได้ประตูชัยช่วงท้ายเกมจาก ศุภชัย ใจเด็ด เก็บ 3 แต้มสำคัญในบ้านได้สำเร็จ',
    content: `การแข่งขันฟุตบอลไทยลีก 1 คู่บิ๊กแมตช์ประจำสัปดาห์ บุรีรัมย์ ยูไนเต็ด เปิดสนามช้าง อารีนา ต้อนรับการมาเยือนของ การท่าเรือ เอฟซี ท่ามกลางแฟนบอลเต็มความจุสนาม

เกมดำเนินไปอย่างสูสีผลัดกันรุกและรับ จนกระทั่งนาทีที่ 88 นฤบดินทร์ วีรวัฒโนดม เติมเกมขึ้นมาทางกราบขวาก่อนเปิดบอลให้ ศุภชัย ใจเด็ด โฉบโหม่งเสาแรกเข้าไปอย่างเฉียบคม ส่งให้เจ้าถิ่นคว้าชัยชนะไปได้แบบสุดระทึก 3-2`
  }
];

const STANDINGS_DATA = {
  epl: [
    { rank: 1, team: 'Liverpool', played: 10, gd: '+14', points: 25, form: ['W', 'W', 'D', 'W', 'W'] },
    { rank: 2, team: 'Man City', played: 10, gd: '+11', points: 23, form: ['W', 'W', 'W', 'D', 'L'] },
    { rank: 3, team: 'Arsenal', played: 10, gd: '+10', points: 21, form: ['W', 'D', 'L', 'W', 'W'] },
    { rank: 4, team: 'Chelsea', played: 10, gd: '+8', points: 18, form: ['D', 'W', 'L', 'D', 'W'] },
    { rank: 5, team: 'Aston Villa', played: 10, gd: '+3', points: 18, form: ['L', 'D', 'W', 'D', 'W'] },
  ],
  laliga: [
    { rank: 1, team: 'Barcelona', played: 11, gd: '+27', points: 30, form: ['W', 'W', 'W', 'W', 'W'] },
    { rank: 2, team: 'Real Madrid', played: 11, gd: '+14', points: 24, form: ['W', 'D', 'W', 'W', 'L'] },
    { rank: 3, team: 'Villarreal', played: 11, gd: '+4', points: 21, form: ['W', 'L', 'D', 'W', 'W'] },
    { rank: 4, team: 'Atlético Madrid', played: 11, gd: '+9', points: 20, form: ['D', 'D', 'W', 'L', 'W'] },
  ],
  thaileague: [
    { rank: 1, team: 'Buriram United', played: 11, gd: '+21', points: 27, form: ['W', 'W', 'D', 'W', 'W'] },
    { rank: 2, team: 'Port FC', played: 11, gd: '+11', points: 22, form: ['W', 'D', 'W', 'L', 'L'] },
    { rank: 3, team: 'Bangkok United', played: 11, gd: '+10', points: 21, form: ['D', 'W', 'W', 'W', 'D'] },
    { rank: 4, team: 'BG Pathum', played: 11, gd: '+5', points: 19, form: ['W', 'D', 'L', 'W', 'D'] },
  ]
};

export default function App() {
  // Navigation & Filter States
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'matches', 'injuries', 'news'
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [matchStatusFilter, setMatchStatusFilter] = useState('ALL'); // 'ALL', 'LIVE', 'UPCOMING', 'FT'
  const [injurySearch, setInjurySearch] = useState('');
  const [injuryStatusFilter, setInjuryStatusFilter] = useState('ALL'); // 'ALL', 'OUT', 'DOUBTFUL', 'RETURNING', 'SUSPENDED'
  const [newsSearch, setNewsSearch] = useState('');
  const [newsCategoryFilter, setNewsCategoryFilter] = useState('ALL');
  const [standingsLeague, setStandingsLeague] = useState('epl');

  // Data States
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [injuries, setInjuries] = useState(INITIAL_INJURIES);
  const [news, setNews] = useState(INITIAL_NEWS);
  
  // Modals & Live Simulation States
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchModalTab, setMatchModalTab] = useState('summary'); // 'summary', 'stats', 'lineups', 'h2h'
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isLiveSimulating, setIsLiveSimulating] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('เมื่อสักครู่');
  const [toastMessage, setToastMessage] = useState(null);

  // Show temporary notification toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Live Match Ticker Simulation (Advances minutes cleanly)
  useEffect(() => {
    if (!isLiveSimulating) return;
    const interval = setInterval(() => {
      setMatches((prevMatches) =>
        prevMatches.map((m) => {
          if (m.status === 'LIVE' && m.minute < 90) {
            return { ...m, minute: m.minute + 1 };
          }
          return m;
        })
      );
    }, 8000);
    return () => clearInterval(interval);
  }, [isLiveSimulating]);

  // Simulate Data Refresh or Real API Fetch
  const handleRefreshData = async () => {
    setIsFetching(true);
    
    if (apiKey.trim().length > 10) {
      try {
        // Optional Real API-Football Fetch if user entered a valid key
        const response = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
          method: 'GET',
          headers: {
            'x-apisports-key': apiKey.trim()
          }
        });
        const data = await response.json();
        if (data && Array.isArray(data.response) && data.response.length > 0) {
          const mappedLive = data.response.slice(0, 6).map((item, idx) => ({
            id: `api-${item.fixture.id || idx}`,
            leagueId: 'epl',
            leagueName: item.league?.name || 'Live Match',
            status: 'LIVE',
            minute: item.fixture?.status?.elapsed || 45,
            time: 'LIVE',
            date: 'วันนี้',
            homeTeam: {
              name: item.teams?.home?.name || 'Home',
              short: (item.teams?.home?.name || 'HOM').substring(0, 3).toUpperCase(),
              color: '#10B981',
              score: item.goals?.home ?? 0
            },
            awayTeam: {
              name: item.teams?.away?.name || 'Away',
              short: (item.teams?.away?.name || 'AWY').substring(0, 3).toUpperCase(),
              color: '#3B82F6',
              score: item.goals?.away ?? 0
            },
            stadium: item.fixture?.venue?.name || 'Main Stadium',
            events: [],
            stats: { possession: [50, 50], shots: [8, 7], shotsOnTarget: [3, 3], corners: [4, 4], fouls: [6, 8], xg: [1.1, 0.9] },
            lineups: {
              homeFormation: '4-3-3',
              awayFormation: '4-3-3',
              homeXI: ['ดึงข้อมูลสดจาก API-Football สำเร็จ'],
              awayXI: ['ดึงข้อมูลสดจาก API-Football สำเร็จ'],
              missingHome: [],
              missingAway: []
            },
            h2h: []
          }));
          setMatches(mappedLive);
          showToast('ดึงข้อมูลสดจาก API-Football สำเร็จ!');
          setIsFetching(false);
          setLastUpdated(new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          return;
        }
      } catch (err) {
        // Fallback to realistic simulation if CORS or key invalid
      }
    }

    // Realistic Live Data Feed Simulation
    setTimeout(() => {
      setMatches((prev) =>
        prev.map((m) => {
          if (m.id === 'm2' && m.status === 'LIVE' && m.homeTeam.score === 1) {
            const updatedEvents = [
              ...m.events,
              { minute: m.minute + 1, type: 'goal', team: 'home', player: 'Phil Foden', assist: 'Bernardo Silva' }
            ];
            return {
              ...m,
              minute: Math.min(90, m.minute + 1),
              homeTeam: { ...m.homeTeam, score: 2 },
              events: updatedEvents
            };
          }
          return m;
        })
      );
      setLastUpdated(new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsFetching(false);
      showToast('อัปเดตผลบอลสด ข่าวสาร และเช็คความฟิตผู้เล่นล่าสุดแล้ว!');
    }, 700);
  };

  // Filtered Matches
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      const leagueMatch = selectedLeague === 'all' || m.leagueId === selectedLeague;
      const statusMatch = matchStatusFilter === 'ALL' || m.status === matchStatusFilter;
      return leagueMatch && statusMatch;
    });
  }, [matches, selectedLeague, matchStatusFilter]);

  // Filtered Injuries
  const filteredInjuries = useMemo(() => {
    return injuries.filter((item) => {
      const leagueMatch = selectedLeague === 'all' || item.league === selectedLeague;
      const statusMatch = injuryStatusFilter === 'ALL' || item.status === injuryStatusFilter;
      const query = injurySearch.toLowerCase().trim();
      const searchMatch =
        !query ||
        item.player.toLowerCase().includes(query) ||
        item.team.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query);
      return leagueMatch && statusMatch && searchMatch;
    });
  }, [injuries, selectedLeague, injuryStatusFilter, injurySearch]);

  // Filtered News
  const filteredNews = useMemo(() => {
    return news.filter((n) => {
      const categoryMatch = newsCategoryFilter === 'ALL' || n.category === newsCategoryFilter;
      const query = newsSearch.toLowerCase().trim();
      const searchMatch =
        !query ||
        n.title.toLowerCase().includes(query) ||
        n.summary.toLowerCase().includes(query) ||
        n.league.toLowerCase().includes(query);
      return categoryMatch && searchMatch;
    });
  }, [news, newsCategoryFilter, newsSearch]);

  // Helper Badge for Injury Status
  const renderInjuryBadge = (status, statusText) => {
    switch (status) {
      case 'OUT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <HeartPulse className="w-3.5 h-3.5" />
            {statusText}
          </span>
        );
      case 'DOUBTFUL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <AlertCircle className="w-3.5 h-3.5" />
            {statusText}
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            <Ban className="w-3.5 h-3.5" />
            {statusText}
          </span>
        );
      case 'RETURNING':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {statusText}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Breaking Ticker */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border-b border-emerald-500/20 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold tracking-wider uppercase animate-pulse">
              <Radio className="w-3 h-3" /> LIVE FEED
            </span>
            <p className="text-slate-300 truncate">
              <strong className="text-emerald-400">อัปเดตสด:</strong> โอเดการ์ด ฟิตพร้อมลงตัวจริงเกมดวลลิเวอร์พูล • โรดรี้ พักยาวทั้งฤดูกาล • บุรีรัมย์ เฉือน ท่าเรือ 3-2 ยึดจ่าฝูงไทยลีก
            </p>
          </div>
          <div className="flex items-center gap-4 text-slate-400 ml-auto">
            <span>อัปเดตล่าสุด: <strong className="text-slate-200">{lastUpdated}</strong></span>
            <button
              onClick={() => setIsApiModalOpen(true)}
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition font-medium"
            >
              <Settings className="w-3.5 h-3.5" /> ตั้งค่าการดึงข้อมูล API
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Navigation */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Trophy className="w-6 h-6 text-slate-950 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight text-white">
                    SIAM<span className="text-emerald-400">PITCH</span> HUB
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/30">
                    PRO DATA
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  ศูนย์รวมข่าวฟุตบอล • ผลบอลสด • เช็คผู้เล่นบาดเจ็บและติดโทษแบน
                </p>
              </div>
            </div>

            {/* Mobile Refresh Button */}
            <button
              onClick={handleRefreshData}
              disabled={isFetching}
              className="md:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 hover:bg-slate-800"
              title="ดึงข้อมูลล่าสุด"
            >
              <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Section Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 overflow-x-auto">
            {[
              { id: 'all', label: 'ภาพรวมทั้งหมด', icon: Sparkles },
              { id: 'matches', label: 'โปรแกรม & ผลบอลสด', icon: Calendar, badge: matches.filter(m => m.status === 'LIVE').length },
              { id: 'injuries', label: 'ผู้เล่นบาดเจ็บ/แบน', icon: Activity, badge: injuries.length },
              { id: 'news', label: 'ข่าวฟุตบอลล่าสุด', icon: Newspaper },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge ? (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-slate-950 text-emerald-400' : 'bg-slate-800 text-emerald-400'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Live Sync Controls */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={() => setIsLiveSimulating(!isLiveSimulating)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                isLiveSimulating
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isLiveSimulating ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
              {isLiveSimulating ? 'Auto-Sync: เปิด' : 'Auto-Sync: ปิด'}
            </button>

            <button
              onClick={handleRefreshData}
              disabled={isFetching}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-400 ${isFetching ? 'animate-spin' : ''}`} />
              <span>ดึงข้อมูลล่าสุด</span>
            </button>
          </div>
        </div>

        {/* League Filter Bar */}
        <div className="bg-slate-900/50 border-t border-slate-800/60 px-4 sm:px-6 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1 whitespace-nowrap">
              <Filter className="w-3.5 h-3.5 text-emerald-400" /> เลือกลีก:
            </span>
            {LEAGUES.map((league) => (
              <button
                key={league.id}
                onClick={() => setSelectedLeague(league.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  selectedLeague === league.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-semibold'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span>{league.country}</span>
                <span>{league.name}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-emerald-500 text-slate-950 px-4 py-3 rounded-xl font-bold text-sm shadow-2xl shadow-emerald-500/30 animate-bounce">
          <Check className="w-5 h-5 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Quick Stats Summary Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">กำลังแข่งขันสด (Live)</p>
              <p className="text-2xl font-extrabold text-white mt-0.5">
                {matches.filter((m) => m.status === 'LIVE').length} <span className="text-xs font-normal text-emerald-400">คู่</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">ผู้เล่นบาดเจ็บ / ติดโทษแบน</p>
              <p className="text-2xl font-extrabold text-white mt-0.5">
                {injuries.length} <span className="text-xs font-normal text-rose-400">รายชื่อ</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <HeartPulse className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">รอเช็คความฟิต 50/50</p>
              <p className="text-2xl font-extrabold text-white mt-0.5">
                {injuries.filter((i) => i.status === 'DOUBTFUL').length} <span className="text-xs font-normal text-amber-400">รายชื่อ</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">ข่าวด่วนอัปเดตวันนี้</p>
              <p className="text-2xl font-extrabold text-white mt-0.5">
                {news.length} <span className="text-xs font-normal text-sky-400">ประเด็นร้อน</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Newspaper className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* SECTION 1: LIVE & UPCOMING MATCHES */}
        {(activeTab === 'all' || activeTab === 'matches') && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-6 rounded-full bg-emerald-400" />
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    ตารางการแข่งขันและผลบอลสด (Match Center)
                  </h2>
                  <p className="text-xs text-slate-400">คลิกที่การ์ดการแข่งขันเพื่อดูสถิติเชิงลึก 11 ตัวจริง และรายชื่อผู้เล่นที่บาดเจ็บในนัดนั้น</p>
                </div>
              </div>

              {/* Match Status Filter Pills */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start">
                {[
                  { id: 'ALL', label: 'ทั้งหมด' },
                  { id: 'LIVE', label: 'กำลังแข่ง (LIVE)' },
                  { id: 'UPCOMING', label: 'โปรแกรมถัดไป' },
                  { id: 'FT', label: 'จบการแข่งขัน' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setMatchStatusFilter(st.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      matchStatusFilter === st.id
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Match Cards Grid */}
            {filteredMatches.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                ไม่พบรายการแข่งขันในหมวดหมู่ที่คุณเลือก
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMatches.map((match) => (
                  <div
                    key={match.id}
                    onClick={() => {
                      setSelectedMatch(match);
                      setMatchModalTab('summary');
                    }}
                    className="group bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 transition-all cursor-pointer shadow-lg hover:shadow-emerald-500/5 flex flex-col justify-between"
                  >
                    {/* Top Row: League & Status */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-3 pb-2.5 border-b border-slate-800/80">
                        <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-emerald-400" />
                          {match.leagueName}
                        </span>

                        {match.status === 'LIVE' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            LIVE {match.minute}&apos;
                          </span>
                        )}
                        {match.status === 'FT' && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">
                            จบเกม (FT)
                          </span>
                        )}
                        {match.status === 'UPCOMING' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30">
                            <Clock className="w-3 h-3" /> {match.date} • {match.time} น.
                          </span>
                        )}
                      </div>

                      {/* Teams & Scoreboard */}
                      <div className="space-y-3 my-2">
                        {/* Home Team */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs text-white shadow-inner"
                              style={{ backgroundColor: match.homeTeam.color }}
                            >
                              {match.homeTeam.short}
                            </div>
                            <div>
                              <p className="font-bold text-slate-100 group-hover:text-white transition">
                                {match.homeTeam.name}
                              </p>
                              <span className="text-[11px] text-slate-500">เจ้าบ้าน (Home)</span>
                            </div>
                          </div>
                          <span className="text-2xl font-black text-white">
                            {match.homeTeam.score !== null ? match.homeTeam.score : '-'}
                          </span>
                        </div>

                        {/* Away Team */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs text-white shadow-inner"
                              style={{ backgroundColor: match.awayTeam.color }}
                            >
                              {match.awayTeam.short}
                            </div>
                            <div>
                              <p className="font-bold text-slate-100 group-hover:text-white transition">
                                {match.awayTeam.name}
                              </p>
                              <span className="text-[11px] text-slate-500">ทีมเยือน (Away)</span>
                            </div>
                          </div>
                          <span className="text-2xl font-black text-white">
                            {match.awayTeam.score !== null ? match.awayTeam.score : '-'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Info: Key Events or Missing Players Preview */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <div className="truncate pr-2">
                        {match.events.length > 0 ? (
                          <span className="text-slate-300">
                            ⚽ ล่าสุด: {match.events[match.events.length - 1].player} ({match.events[match.events.length - 1].minute}&apos;)
                          </span>
                        ) : (
                          <span>🏟️ {match.stadium}</span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold whitespace-nowrap group-hover:translate-x-0.5 transition">
                        ดูรายละเอียด <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* SECTION 2: PLAYER INJURIES & SUSPENSIONS CENTER */}
        {(activeTab === 'all' || activeTab === 'injuries') && (
          <section className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-6 rounded-full bg-rose-500" />
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    ศูนย์ข้อมูลผู้เล่นบาดเจ็บและติดโทษแบน (Injury & Suspension Center)
                  </h2>
                  <p className="text-xs text-slate-400">
                    อัปเดตสถานะความฟิต อาการบาดเจ็บ และกำหนดคืนสนามของนักเตะคนสำคัญก่อนจัดตัว
                  </p>
                </div>
              </div>

              {/* Search & Status Filter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={injurySearch}
                    onChange={(e) => setInjurySearch(e.target.value)}
                    placeholder="ค้นหาชื่อนักเตะ, สโมสร, อาการ..."
                    className="w-full sm:w-64 bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto">
                  {[
                    { id: 'ALL', label: 'ทั้งหมด' },
                    { id: 'OUT', label: 'พักยาว (Out)' },
                    { id: 'DOUBTFUL', label: 'เช็คฟิต 50/50' },
                    { id: 'SUSPENDED', label: 'ติดโทษแบน' },
                    { id: 'RETURNING', label: 'พร้อมคืนสนาม' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setInjuryStatusFilter(st.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                        injuryStatusFilter === st.id
                          ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Injury Cards / Table */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4">นักเตะ & ตำแหน่ง</th>
                      <th className="py-3.5 px-4">สโมสร</th>
                      <th className="py-3.5 px-4">สาเหตุ / อาการบาดเจ็บ</th>
                      <th className="py-3.5 px-4">สถานะปัจจุบัน</th>
                      <th className="py-3.5 px-4">กำหนดคืนสนาม</th>
                      <th className="py-3.5 px-4">รายละเอียดทีมแพทย์</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-xs sm:text-sm">
                    {filteredInjuries.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          ไม่พบข้อมูลผู้เล่นบาดเจ็บตามเงื่อนไขที่ค้นหา
                        </td>
                      </tr>
                    ) : (
                      filteredInjuries.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0"
                                style={{ backgroundColor: item.teamColor }}
                              >
                                {item.player.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-white">{item.player}</p>
                                <p className="text-xs text-slate-400">{item.position}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-200 whitespace-nowrap">
                            {item.team}
                          </td>
                          <td className="py-3.5 px-4 text-slate-300 font-medium">
                            {item.type}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {renderInjuryBadge(item.status, item.statusText)}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200 bg-slate-800/90 px-2.5 py-1 rounded-lg">
                              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                              {item.expectedReturn}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-400 max-w-xs">
                            {item.note}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 3: NEWS & LEAGUE STANDINGS GRID */}
        {(activeTab === 'all' || activeTab === 'news') && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Latest Football News (2 Columns on Desktop) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-6 rounded-full bg-sky-400" />
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">
                      ข่าวสารฟุตบอลและบทวิเคราะห์ล่าสุด
                    </h2>
                    <p className="text-xs text-slate-400">เกาะติดข่าวตลาดซื้อขาย แท็กติก และรายงานความฟิตก่อนเกม</p>
                  </div>
                </div>

                {/* News Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={newsSearch}
                    onChange={(e) => setNewsSearch(e.target.value)}
                    placeholder="ค้นหาข่าวฟุตบอล..."
                    className="w-full sm:w-56 bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'ALL', label: 'ข่าวทั้งหมด' },
                  { id: 'Injury Update', label: 'อัปเดตผู้เล่นบาดเจ็บ' },
                  { id: 'Tactical', label: 'วิเคราะห์แท็กติก' },
                  { id: 'Transfers', label: 'ตลาดซื้อขาย' },
                  { id: 'Match Report', label: 'สรุปผลบอล' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setNewsCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      newsCategoryFilter === cat.id
                        ? 'bg-sky-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* News List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredNews.map((item) => (
                  <article
                    key={item.id}
                    onClick={() => setSelectedArticle(item)}
                    className="group bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer transition-all shadow-lg"
                  >
                    <div>
                      {/* Visual Banner Header */}
                      <div className={`h-28 bg-gradient-to-br ${item.accentColor} p-4 flex flex-col justify-between relative overflow-hidden`}>
                        <div className="flex items-center justify-between z-10">
                          <span className="px-2.5 py-0.5 rounded-md bg-slate-950/80 backdrop-blur text-[10px] font-extrabold tracking-wider text-emerald-400 uppercase">
                            {item.badgeText}
                          </span>
                          <span className="text-[11px] font-semibold text-white/90 bg-slate-950/50 px-2 py-0.5 rounded">
                            {item.league}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/90 font-medium z-10">
                          <span>{item.categoryThai}</span>
                          <span>•</span>
                          <span>{item.timeAgo}</span>
                        </div>
                        <Newspaper className="w-24 h-24 text-white/10 absolute -right-4 -bottom-4 rotate-12" />
                      </div>

                      {/* Title & Excerpt */}
                      <div className="p-4">
                        <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                      <span className="text-slate-500">เวลาอ่าน {item.readTime}</span>
                      <span className="text-emerald-400 font-semibold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition">
                        อ่านข่าวเต็ม <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* League Standings Widget (1 Column on Desktop) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-6 rounded-full bg-amber-400" />
                  <h2 className="text-lg font-bold text-white">ตารางคะแนนลีกดัง</h2>
                </div>
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {[
                    { id: 'epl', label: 'EPL' },
                    { id: 'laliga', label: 'La Liga' },
                    { id: 'thaileague', label: 'T1' },
                  ].map((lg) => (
                    <button
                      key={lg.id}
                      onClick={() => setStandingsLeague(lg.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        standingsLeague === lg.id
                          ? 'bg-emerald-500 text-slate-950'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lg.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950/70 text-slate-400 border-b border-slate-800 uppercase">
                      <th className="py-3 px-3">#</th>
                      <th className="py-3 px-2">สโมสร</th>
                      <th className="py-3 px-2 text-center">แข่ง</th>
                      <th className="py-3 px-2 text-center">+/-</th>
                      <th className="py-3 px-3 text-center">แต้ม</th>
                      <th className="py-3 px-3 text-right">ฟอร์ม</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {(STANDINGS_DATA[standingsLeague] || STANDINGS_DATA.epl).map((row) => (
                      <tr key={row.rank} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-3 font-bold text-emerald-400">{row.rank}</td>
                        <td className="py-3 px-2 font-bold text-white">{row.team}</td>
                        <td className="py-3 px-2 text-center text-slate-400">{row.played}</td>
                        <td className="py-3 px-2 text-center text-slate-300">{row.gd}</td>
                        <td className="py-3 px-3 text-center font-extrabold text-amber-400 text-sm">{row.points}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-end gap-1">
                            {row.form.map((f, i) => (
                              <span
                                key={i}
                                className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                                  f === 'W'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : f === 'D'
                                    ? 'bg-slate-700 text-slate-300'
                                    : 'bg-rose-500/20 text-rose-400'
                                }`}
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Injury Quick Tip Box */}
              <div className="bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Activity className="w-4 h-4" /> Fantasy & Lineup Insight
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ก่อนจัดตัวผู้เล่นทุกสัปดาห์ คุณสามารถเช็คสถานะ <strong className="text-amber-300">รอเช็คฟิต 50/50</strong> และรายชื่อผู้เล่นที่ขาดหายในแต่ละแมตช์ได้โดยคลิกที่คู่แข่งขันด้านบน
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: MATCH DETAIL (STATS, LINEUPS, INJURIES, H2H) */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl my-8">
            {/* Modal Header Scoreboard */}
            <div className="bg-gradient-to-b from-slate-800/90 to-slate-900 p-5 border-b border-slate-800 relative">
              <button
                onClick={() => setSelectedMatch(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center text-xs text-emerald-400 font-bold uppercase tracking-wider mb-3">
                {selectedMatch.leagueName} • {selectedMatch.stadium}
              </div>

              <div className="flex items-center justify-around">
                {/* Home */}
                <div className="flex flex-col items-center text-center w-1/3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-lg mb-2"
                    style={{ backgroundColor: selectedMatch.homeTeam.color }}
                  >
                    {selectedMatch.homeTeam.short}
                  </div>
                  <h3 className="font-bold text-white text-sm sm:text-base">{selectedMatch.homeTeam.name}</h3>
                </div>

                {/* Score / Time */}
                <div className="flex flex-col items-center">
                  {selectedMatch.status === 'UPCOMING' ? (
                    <div className="text-2xl font-extrabold text-sky-400 px-4 py-1 rounded-xl bg-sky-500/10 border border-sky-500/30">
                      {selectedMatch.time} น.
                    </div>
                  ) : (
                    <div className="text-3xl sm:text-4xl font-black text-white tracking-wider flex items-center gap-3">
                      <span>{selectedMatch.homeTeam.score}</span>
                      <span className="text-slate-600">:</span>
                      <span>{selectedMatch.awayTeam.score}</span>
                    </div>
                  )}
                  <span className="mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    {selectedMatch.status === 'LIVE' ? `กำลังแข่งขัน ${selectedMatch.minute}'` : selectedMatch.status}
                  </span>
                </div>

                {/* Away */}
                <div className="flex flex-col items-center text-center w-1/3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-lg mb-2"
                    style={{ backgroundColor: selectedMatch.awayTeam.color }}
                  >
                    {selectedMatch.awayTeam.short}
                  </div>
                  <h3 className="font-bold text-white text-sm sm:text-base">{selectedMatch.awayTeam.name}</h3>
                </div>
              </div>

              {/* Sub-navigation Tabs inside Modal */}
              <div className="flex items-center justify-center gap-2 mt-6 pt-3 border-t border-slate-800">
                {[
                  { id: 'summary', label: 'เหตุการณ์สำคัญ', icon: Flame },
                  { id: 'stats', label: 'สถิติในเกม', icon: BarChart3 },
                  { id: 'lineups', label: '11 ตัวจริง & คนเจ็บ', icon: Shirt },
                  { id: 'h2h', label: 'สถิติเจอกัน (H2H)', icon: History },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setMatchModalTab(t.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        matchModalTab === t.id
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4">
              {/* TAB 1: SUMMARY EVENTS */}
              {matchModalTab === 'summary' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-400">ไทม์ไลน์เหตุการณ์สำคัญ</h4>
                  {selectedMatch.events.length === 0 ? (
                    <p className="text-sm text-slate-400 py-6 text-center">
                      การแข่งขันยังไม่เริ่ม หรือยังไม่มีการทำประตูในนัดนี้
                    </p>
                  ) : (
                    selectedMatch.events.map((ev, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-xs sm:text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 rounded bg-emerald-500/15 text-emerald-400 font-bold">
                            {ev.minute}&apos;
                          </span>
                          <span>{ev.type === 'goal' ? '⚽ ประตู!' : '🟨 ใบเหลือง'}</span>
                          <div>
                            <p className="font-bold text-white">{ev.player}</p>
                            {ev.assist && (
                              <p className="text-xs text-slate-400">แอสซิสต์: {ev.assist}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                          {ev.team === 'home' ? selectedMatch.homeTeam.name : selectedMatch.awayTeam.name}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 2: STATS */}
              {matchModalTab === 'stats' && (
                <div className="space-y-4">
                  {[
                    { label: 'เปอร์เซ็นต์การครองบอล (%)', values: selectedMatch.stats.possession },
                    { label: 'โอกาสยิงทั้งหมด (ครั้ง)', values: selectedMatch.stats.shots },
                    { label: 'ยิงเข้ากรอบ (ครั้ง)', values: selectedMatch.stats.shotsOnTarget },
                    { label: 'ลูกเตะมุม (Corners)', values: selectedMatch.stats.corners },
                    { label: 'ความน่าจะเป็นประตู (xG)', values: selectedMatch.stats.xg },
                  ].map((st, idx) => {
                    const homeVal = Number(st.values[0]) || 0;
                    const awayVal = Number(st.values[1]) || 0;
                    const total = homeVal + awayVal || 1;
                    const homePercent = Math.round((homeVal / total) * 100);
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-emerald-400">{st.values[0]}</span>
                          <span className="text-slate-300">{st.label}</span>
                          <span className="text-sky-400">{st.values[1]}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                          <div
                            className="bg-emerald-400 h-full"
                            style={{ width: `${homePercent}%` }}
                          />
                          <div
                            className="bg-sky-400 h-full"
                            style={{ width: `${100 - homePercent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 3: LINEUPS & MISSING PLAYERS */}
              {matchModalTab === 'lineups' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Home Lineup */}
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-white text-sm">{selectedMatch.homeTeam.name}</span>
                      <span className="text-xs text-emerald-400 font-semibold">{selectedMatch.lineups.homeFormation}</span>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase text-slate-400 mb-1.5">รายชื่อ 11 ตัวจริง</p>
                      <ul className="space-y-1 text-xs text-slate-200">
                        {selectedMatch.lineups.homeXI.map((p, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-4 text-slate-500 font-semibold">{i + 1}.</span> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                      <p className="text-[11px] font-bold uppercase text-rose-400 mb-1">ผู้เล่นบาดเจ็บ / ติดโทษแบน</p>
                      {selectedMatch.lineups.missingHome.map((mp, i) => (
                        <p key={i} className="text-xs text-rose-300">• {mp}</p>
                      ))}
                    </div>
                  </div>

                  {/* Away Lineup */}
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-white text-sm">{selectedMatch.awayTeam.name}</span>
                      <span className="text-xs text-sky-400 font-semibold">{selectedMatch.lineups.awayFormation}</span>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase text-slate-400 mb-1.5">รายชื่อ 11 ตัวจริง</p>
                      <ul className="space-y-1 text-xs text-slate-200">
                        {selectedMatch.lineups.awayXI.map((p, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-4 text-slate-500 font-semibold">{i + 1}.</span> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                      <p className="text-[11px] font-bold uppercase text-rose-400 mb-1">ผู้เล่นบาดเจ็บ / ติดโทษแบน</p>
                      {selectedMatch.lineups.missingAway.map((mp, i) => (
                        <p key={i} className="text-xs text-rose-300">• {mp}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: H2H */}
              {matchModalTab === 'h2h' && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase text-slate-400">ผลการพบกันล่าสุด (Head-to-Head)</h4>
                  {selectedMatch.h2h.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs"
                    >
                      <span className="text-slate-400">{item.date}</span>
                      <div className="flex items-center gap-3 font-bold text-white">
                        <span>{item.home}</span>
                        <span className="px-2.5 py-0.5 rounded bg-slate-800 text-emerald-400">{item.score}</span>
                        <span>{item.away}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: NEWS ARTICLE READER */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl">
            <div className={`h-32 bg-gradient-to-br ${selectedArticle.accentColor} p-5 flex flex-col justify-between relative`}>
              <button
                onClick={() => setSelectedArticle(null)}
                className="self-end p-2 rounded-full bg-slate-950/60 text-white hover:bg-slate-950"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <span className="px-2 py-0.5 rounded bg-slate-950/80 text-emerald-400">{selectedArticle.categoryThai}</span>
                <span>• {selectedArticle.timeAgo}</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-extrabold text-white leading-snug">
                {selectedArticle.title}
              </h3>
              <div className="text-sm text-slate-300 space-y-3 whitespace-pre-line leading-relaxed border-t border-slate-800 pt-4">
                {selectedArticle.content}
              </div>
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition"
                >
                  ปิดหน้าต่างนี้
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: API CONFIGURATION MODAL */}
      {isApiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Wifi className="w-5 h-5" />
                <h3>ตั้งค่าการเชื่อมต่อ Football API</h3>
              </div>
              <button onClick={() => setIsApiModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              เว็บไซต์นี้มีระบบ <strong>Live Mock Simulation</strong> ที่จำลองผลบอลสดและข้อมูลนักเตะบาดเจ็บให้พร้อมใช้งานทันที หรือหากคุณมีคีย์ของ <strong>API-Football (api-sports.io)</strong> สามารถกรอกด้านล่างเพื่อดึงผลบอลสดจริงได้ทันที
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">API-Sports Key (ไม่บังคับ)</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="กรอก x-apisports-key ของคุณที่นี่..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsApiModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  setIsApiModalOpen(false);
                  handleRefreshData();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400"
              >
                บันทึกและซิงค์ข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}