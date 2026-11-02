# -*- coding: utf-8 -*-
"""
Generate crisp, authentic SVG crests for UEFA Champions League and all 18 clubs
"""
import os

SVGS = {
    'ucl': '''<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="uclGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#020817" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#a5f3fc"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="#040b1e" stroke="#00f0ff" stroke-width="2"/>
  <circle cx="50" cy="50" r="46" fill="url(#uclGlow)"/>
  <!-- Starball 8 stars connected -->
  <g fill="url(#starGrad)" stroke="#020817" stroke-width="1.2">
    <!-- Star 1 Top -->
    <polygon points="50,14 53,24 63,24 55,30 58,40 50,34 42,40 45,30 37,24 47,24" />
    <!-- Star 2 Top Right -->
    <polygon points="76,25 74,35 84,39 74,42 73,53 67,45 57,48 62,39 57,31 67,34" />
    <!-- Star 3 Right -->
    <polygon points="85,50 78,57 84,65 74,64 69,73 68,63 58,61 66,54 64,44 73,50" />
    <!-- Star 4 Bot Right -->
    <polygon points="69,76 60,78 61,88 53,81 45,87 48,77 41,71 51,72 56,63 60,71" />
    <!-- Star 5 Bot Left -->
    <polygon points="31,76 39,71 44,79 46,69 56,66 49,60 52,50 44,55 38,48 39,58" />
    <!-- Star 6 Left -->
    <polygon points="15,50 24,53 23,63 31,58 38,65 37,55 46,51 38,47 40,37 32,42" />
    <!-- Star 7 Top Left -->
    <polygon points="24,25 32,32 28,41 38,39 42,48 44,38 54,36 46,31 48,21 40,26" />
    <!-- Star 8 Center -->
    <polygon points="50,42 53,49 61,49 55,54 57,61 50,57 43,61 45,54 39,49 47,49" />
  </g>
  <circle cx="50" cy="50" r="1.5" fill="#38bdf8"/>
</svg>''',

    'galatasaray': '''<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gsRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C8102E"/><stop offset="100%" stop-color="#8a071d"/>
    </linearGradient>
    <linearGradient id="gsGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDB913"/><stop offset="100%" stop-color="#d49204"/>
    </linearGradient>
  </defs>
  <!-- Shield/Oval -->
  <ellipse cx="50" cy="53" rx="42" ry="43" fill="#111827" stroke="url(#gsGold)" stroke-width="3"/>
  <ellipse cx="50" cy="53" rx="38" ry="39" fill="url(#gsRed)"/>
  <!-- Intertwined G and S -->
  <path d="M48 28 C34 28 26 38 26 53 C26 68 35 78 48 78 C57 78 64 73 67 66 L57 66 C54 70 51 72 48 72 C39 72 34 64 34 53 C34 42 39 34 48 34 C54 34 58 37 60 41 L68 37 C64 31 57 28 48 28 Z" fill="url(#gsGold)"/>
  <path d="M52 38 C45 38 42 42 42 47 C42 56 62 53 62 64 C62 70 56 74 48 74 C41 74 36 70 34 66 L29 70 C33 77 40 80 48 80 C59 80 68 74 68 64 C68 53 48 55 48 46 C48 43 51 42 55 42 C60 42 63 45 65 48 L69 44 C66 40 60 38 52 38 Z" fill="#FFFFFF"/>
  <!-- Stars -->
  <g fill="#FDB913">
    <polygon points="32,15 34,20 39,20 35,23 37,28 32,25 27,28 29,23 25,20 30,20"/>
    <polygon points="44,12 46,17 51,17 47,20 49,25 44,22 39,25 41,20 37,17 42,17"/>
    <polygon points="56,12 58,17 63,17 59,20 61,25 56,22 51,25 53,20 49,17 54,17"/>
    <polygon points="68,15 70,20 75,20 71,23 73,28 68,25 63,28 65,23 61,20 66,20"/>
  </g>
</svg>''',

    'stuttgart': '''<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Shield with red ring -->
  <path d="M50 8 C76 8 84 15 84 48 C84 75 50 92 50 92 C50 92 16 75 16 48 C16 15 24 8 50 8 Z" fill="#FFFFFF" stroke="#E32219" stroke-width="4"/>
  <!-- Red continuous ring band -->
  <path d="M17 40 C35 34 65 34 83 40 L84 56 C65 50 35 50 16 56 Z" fill="#E32219"/>
  <!-- Antlers / Württemberg crest motif -->
  <g fill="#000000">
    <path d="M30 26 C38 23 48 23 52 28 C48 30 40 28 34 32 Z"/>
    <path d="M70 26 C62 23 52 23 48 28 C52 30 60 28 66 32 Z"/>
    <circle cx="50" cy="27" r="3"/>
  </g>
  <!-- Text 1893 -->
  <text x="50" y="51" font-family="Arial, sans-serif" font-weight="900" font-size="12" fill="#FFFFFF" text-anchor="middle">1893</text>
  <!-- VfB lettering -->
  <text x="50" y="74" font-family="Arial, sans-serif" font-weight="900" font-size="18" fill="#E32219" text-anchor="middle">VfB</text>
</svg>''',

    'shakhtar': '''<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shkFlame" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F36F21"/><stop offset="100%" stop-color="#b84605"/>
    </linearGradient>
  </defs>
  <path d="M50 6 C78 6 86 16 86 46 C86 76 50 94 50 94 C50 94 14 76 14 46 C14 16 22 6 50 6 Z" fill="#000000" stroke="#F36F21" stroke-width="3"/>
  <!-- Orange flame crown -->
  <path d="M22 28 Q35 12 50 24 Q65 12 78 28 Q84 46 84 50 Q66 42 50 42 Q34 42 16 50 Q16 46 22 28 Z" fill="url(#shkFlame)"/>
  <!-- Crossed hammers in white -->
  <g stroke="#FFFFFF" stroke-width="3" stroke-linecap="round">
    <line x1="38" y1="52" x2="62" y2="72"/>
    <line x1="62" y1="52" x2="38" y2="72"/>
  </g>
  <rect x="34" y="49" width="8" height="5" fill="#FFFFFF"/>
  <rect x="58" y="49" width="8" height="5" fill="#FFFFFF"/>
  <text x="50" y="86" font-family="Arial, sans-serif" font-weight="bold" font-size="9" fill="#F36F21" text-anchor="middle">1936</text>
</svg>''',

    'sporting': '''<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="scpGreen" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#008057"/><stop offset="100%" stop-color="#005035"/>
    </linearGradient>
  </defs>
  <path d="M50 8 C80 8 84 20 84 52 C84 78 50 94 50 94 C50 94 16 78 16 52 C16 20 20 8 50 8 Z" fill="url(#scpGreen)" stroke="#FFD700" stroke-width="3"/>
  <!-- Horizontal white stripes -->
  <path d="M17 38 L83 38 L83 45 L17 45 Z" fill="#FFFFFF"/>
  <path d="M18 53 L82 53 L82 60 L18 60 Z" fill="#FFFFFF"/>
  <!-- Golden Lion Rampant -->
  <g fill="#FFD700" stroke="#B8860B" stroke-width="0.5">
    <circle cx="50" cy="46" r="6"/>
    <path d="M48 50 C44 54 44 64 48 70 L52 70 C56 64 54 54 50 50 Z"/>
    <path d="M52 52 C60 50 63 46 64 42 L61 41 C59 44 56 46 51 49 Z"/>
    <path d="M46 54 C39 52 36 48 35 44 L38 43 C40 46 43 48 47 51 Z"/>
    <path d="M48 68 C42 72 38 76 36 80 L39 81 C42 78 45 74 49 71 Z"/>
    <path d="M52 68 C58 72 62 76 64 80 L61 81 C58 78 55 74 51 71 Z"/>
  </g>
  <!-- SCP letters -->
  <rect x="28" y="16" width="44" height="13" rx="3" fill="#005035" stroke="#FFD700" stroke-width="1"/>
  <text x="50" y="26" font-family="Arial, sans-serif" font-weight="900" font-size="10" fill="#FFD700" text-anchor="middle">SPORTING</text>
</svg>''',

    'feyenoord': '''<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="46" fill="#000000" stroke="#DA291C" stroke-width="2"/>
  <!-- Split circle: Red left, White right -->
  <clipPath id="feyCircle">
    <circle cx="50" cy="50" r="40"/>
  </clipPath>
  <g clip-path="url(#feyCircle)">
    <rect x="10" y="10" width="40" height="80" fill="#DA291C"/>
    <rect x="50" y="10" width="40" height="80" fill="#FFFFFF"/>
    <line x1="50" y1="10" x2="50" y2="90" stroke="#000000" stroke-width="2"/>
  </g>
  <!-- Circular outer ring with dots -->
  <circle cx="50" cy="50" r="40" fill="none" stroke="#000000" stroke-width="4"/>
  <!-- Gold Letter F -->
  <text x="50" y="66" font-family="Times New Roman, serif" font-weight="bold" font-size="46" fill="#FDB913" stroke="#8B6914" stroke-width="1.5" text-anchor="middle">F</text>
</svg>''',

    'inter': '''<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Blue and black circles -->
  <circle cx="50" cy="50" r="47" fill="#005CA9" stroke="#000000" stroke-width="2"/>
  <circle cx="50" cy="50" r="41" fill="#000000"/>
  <circle cx="50" cy="50" r="35" fill="#005CA9"/>
  <circle cx="50" cy="50" r="28" fill="#000000"/>
  <!-- Monogram IM -->
  <g fill="#FFFFFF">
    <path d="M42 32 L46 32 L46 68 L42 68 Z"/>
    <path d="M48 32 L54 50 L60 32 L66 32 L66 68 L61 68 L61 44 L56 60 L52 60 L47 44 L47 68 L43 68 L48 32 Z"/>
  </g>
  <circle cx="50" cy="50" r="44" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-dasharray="2 3"/>
</svg>''',

    'bodo': '''<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Bright yellow circle -->
  <circle cx="50" cy="50" r="46" fill="#FFD100" stroke="#000000" stroke-width="4"/>
  <!-- Black stripes and stylized B with lightning -->
  <circle cx="50" cy="50" r="40" fill="none" stroke="#000000" stroke-width="2"/>
  <!-- Stylized B emblem -->
  <path d="M38 24 L56 24 C64 24 70 29 70 36 C70 41 66 45 61 47 C68 49 72 54 72 61 C72 69 65 76 56 76 L38 76 Z" fill="#000000"/>
  <path d="M46 32 L54 32 C58 32 61 34 61 38 C61 42 58 44 54 44 L46 44 Z" fill="#FFD100"/>
  <path d="M46 54 L55 54 C60 54 63 56 63 61 C63 66 60 68 55 68 L46 68 Z" fill="#FFD100"/>
  <!-- Lightning flash bolt -->
  <polygon points="51,20 62,35 55,36 65,54 47,38 54,37" fill="#000000" stroke="#FFD100" stroke-width="1"/>
</svg>''',

    'lille': '''<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lilRed" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#D71920"/><stop offset="100%" stop-color="#9b0e13"/>
    </linearGradient>
  </defs>
  <!-- Pentagonal crest -->
  <polygon points="50,6 88,26 80,82 50,96 20,82 12,26" fill="url(#lilRed)" stroke="#11224D" stroke-width="4"/>
  <!-- Flemish mastiff head in white -->
  <path d="M50 34 C42 34 35 38 32 46 C30 52 33 60 38 65 C44 70 50 74 50 74 C50 74 56 70 62 65 C67 60 70 52 68 46 C65 38 58 34 50 34 Z" fill="#FFFFFF"/>
  <circle cx="44" cy="48" r="2.5" fill="#11224D"/>
  <circle cx="56" cy="48" r="2.5" fill="#11224D"/>
  <polygon points="50,56 46,60 54,60" fill="#11224D"/>
  <!-- Fleur-de-lis top -->
  <path d="M50 16 C48 20 46 24 50 28 C54 24 52 20 50 16 Z" fill="#FFFFFF"/>
  <path d="M43 23 C46 24 48 27 48 28 C45 28 42 27 43 23 Z" fill="#FFFFFF"/>
  <path d="M57 23 C54 24 52 27 52 28 C55 28 58 27 57 23 Z" fill="#FFFFFF"/>
  <text x="50" y="88" font-family="Arial, sans-serif" font-weight="900" font-size="11" fill="#FFFFFF" text-anchor="middle">LOSC</text>
</svg>''',

    'atletico': '''<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="atmClip">
      <path d="M50 8 C80 8 84 15 84 48 C84 75 50 94 50 94 C50 94 16 75 16 48 C16 15 20 8 50 8 Z"/>
    </clipPath>
  </defs>
  <g clip-path="url(#atmClip)">
    <!-- White background -->
    <rect x="0" y="0" width="100" height="100" fill="#FFFFFF"/>
    <!-- Red stripes -->
    <rect x="25" y="0" width="10" height="100" fill="#CB3524"/>
    <rect x="45" y="0" width="10" height="100" fill="#CB3524"/>
    <rect x="65" y="0" width="10" height="100" fill="#CB3524"/>
    <!-- Navy Blue top section with Bear & Tree -->
    <path d="M16 8 L84 8 L84 48 L16 48 Z" fill="#272E61"/>
    <!-- Strawberry Tree and Bear -->
    <ellipse cx="60" cy="24" rx="12" ry="10" fill="#2E7D32"/>
    <rect x="58" y="28" width="4" height="14" fill="#5D4037"/>
    <!-- Bear silhouette climbing -->
    <path d="M46 36 C44 32 44 26 48 24 C50 26 50 30 52 34 L54 38 L48 40 Z" fill="#8D6E63"/>
    <!-- Stars -->
    <g fill="#FFFFFF">
      <polygon points="26,16 27,19 30,19 28,21 29,24 26,22 23,24 24,21 22,19 25,19"/>
      <polygon points="36,14 37,17 40,17 38,19 39,22 36,20 33,22 34,19 32,17 35,17"/>
      <polygon points="46,14 47,17 50,17 48,19 49,22 46,20 43,22 44,19 42,17 45,17"/>
    </g>
  </g>
  <path d="M50 8 C80 8 84 15 84 48 C84 75 50 94 50 94 C50 94 16 75 16 48 C16 15 20 8 50 8 Z" fill="none" stroke="#272E61" stroke-width="4"/>
</svg>''',

    'bayern': '''<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="47" fill="#DC052D" stroke="#0066B2" stroke-width="2"/>
  <circle cx="50" cy="50" r="43" fill="#FFFFFF"/>
  <circle cx="50" cy="50" r="40" fill="#DC052D"/>
  <!-- Ring text space -->
  <circle cx="50" cy="50" r="26" fill="#FFFFFF"/>
  <circle cx="50" cy="50" r="24" fill="#0066B2"/>
  <!-- Bavarian Diamonds Clip -->
  <clipPath id="bayernClip">
    <circle cx="50" cy="50" r="23"/>
  </clipPath>
  <g clip-path="url(#bayernClip)" fill="#FFFFFF">
    <polygon points="40,28 48,36 40,44 32,36"/>
    <polygon points="56,28 64,36 56,44 48,36"/>
    <polygon points="48,44 56,52 48,60 40,52"/>
    <polygon points="64,44 72,52 64,60 56,52"/>
    <polygon points="40,60 48,68 40,76 32,68"/>
    <polygon points="56,60 64,68 56,76 48,68"/>
  </g>
  <text x="50" y="20" font-family="Arial, sans-serif" font-weight="900" font-size="7.5" fill="#FFFFFF" text-anchor="middle">FC BAYERN</text>
  <text x="50" y="86" font-family="Arial, sans-serif" font-weight="900" font-size="7.5" fill="#FFFFFF" text-anchor="middle">MÜNCHEN</text>
</svg>''',

    'villarreal': '''<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Shield with Crown -->
  <path d="M50 18 C78 18 82 26 82 56 C82 78 50 94 50 94 C50 94 18 78 18 56 C18 26 22 18 50 18 Z" fill="#FFE600" stroke="#00519E" stroke-width="3"/>
  <!-- Senyera stripes in center shield -->
  <g clip-path="url(#vilInner)">
    <clipPath id="vilInner">
      <path d="M50 36 C66 36 70 42 70 60 C70 74 50 84 50 84 C50 84 30 74 30 60 C30 42 34 36 50 36 Z"/>
    </clipPath>
    <rect x="30" y="36" width="40" height="50" fill="#FFE600"/>
    <rect x="36" y="36" width="4" height="50" fill="#D71920"/>
    <rect x="44" y="36" width="4" height="50" fill="#D71920"/>
    <rect x="52" y="36" width="4" height="50" fill="#D71920"/>
    <rect x="60" y="36" width="4" height="50" fill="#D71920"/>
  </g>
  <path d="M50 36 C66 36 70 42 70 60 C70 74 50 84 50 84 C50 84 30 74 30 60 C30 42 34 36 50 36 Z" fill="none" stroke="#00519E" stroke-width="2"/>
  <!-- Crown on top -->
  <polygon points="34,18 38,10 50,15 62,10 66,18" fill="#FFE600" stroke="#D71920" stroke-width="1.5"/>
  <circle cx="38" cy="10" r="2" fill="#D71920"/>
  <circle cx="50" cy="15" r="2" fill="#00519E"/>
  <circle cx="62" cy="10" r="2" fill="#D71920"/>
</svg>''',

    'psg': '''<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Navy circle with red and white rings -->
  <circle cx="50" cy="50" r="47" fill="#004170" stroke="#DA291C" stroke-width="3"/>
  <circle cx="50" cy="50" r="42" fill="#FFFFFF"/>
  <circle cx="50" cy="50" r="40" fill="#004170"/>
  <!-- Central white circle with Eiffel tower -->
  <circle cx="50" cy="50" r="26" fill="#FFFFFF"/>
  <!-- Eiffel Tower in Red -->
  <g fill="#DA291C">
    <!-- Top spire -->
    <rect x="48.5" y="27" width="3" height="12"/>
    <!-- Middle tower -->
    <path d="M46 39 L54 39 L56 50 L44 50 Z"/>
    <!-- Arch base -->
    <path d="M43 50 L37 68 L43 68 C45 61 55 61 57 68 L63 68 L57 50 Z"/>
  </g>
  <!-- Golden Fleur de lis underneath -->
  <path d="M50 58 C48 61 46 64 50 67 C54 64 52 61 50 58 Z" fill="#FFD700"/>
  <!-- PARIS lettering -->
  <text x="50" y="21" font-family="Arial, sans-serif" font-weight="900" font-size="8" fill="#FFFFFF" text-anchor="middle">PARIS</text>
  <!-- SAINT-GERMAIN -->
  <text x="50" y="87" font-family="Arial, sans-serif" font-weight="900" font-size="6" fill="#FFFFFF" text-anchor="middle">SAINT-GERMAIN</text>
</svg>''',

    'barcelona': '''<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="barcaClip">
      <path d="M50 8 C80 8 84 15 84 48 C84 76 50 94 50 94 C50 94 16 76 16 48 C16 15 20 8 50 8 Z"/>
    </clipPath>
  </defs>
  <g clip-path="url(#barcaClip)">
    <!-- Yellow border background -->
    <rect x="0" y="0" width="100" height="100" fill="#EDBB00"/>
    <!-- Top Left: St George Cross -->
    <rect x="18" y="10" width="31" height="30" fill="#FFFFFF"/>
    <rect x="31" y="10" width="5" height="30" fill="#C8102E"/>
    <rect x="18" y="22" width="31" height="6" fill="#C8102E"/>
    <!-- Top Right: Senyera Catalan stripes -->
    <rect x="51" y="10" width="31" height="30" fill="#EDBB00"/>
    <rect x="56" y="10" width="4" height="30" fill="#C8102E"/>
    <rect x="65" y="10" width="4" height="30" fill="#C8102E"/>
    <rect x="74" y="10" width="4" height="30" fill="#C8102E"/>
    <!-- Gold horizontal stripe with FCB -->
    <rect x="16" y="40" width="68" height="12" fill="#EDBB00"/>
    <text x="50" y="49" font-family="Arial, sans-serif" font-weight="900" font-size="10" fill="#004D98" text-anchor="middle">FCB</text>
    <!-- Bottom: Blaugrana vertical stripes -->
    <rect x="16" y="52" width="68" height="42" fill="#004D98"/>
    <rect x="28" y="52" width="9" height="42" fill="#A50044"/>
    <rect x="46" y="52" width="8" height="42" fill="#A50044"/>
    <rect x="63" y="52" width="9" height="42" fill="#A50044"/>
    <!-- Golden Football in center -->
    <circle cx="50" cy="71" r="9" fill="#EDBB00" stroke="#8B6914" stroke-width="1"/>
    <polygon points="50,68 53,70 52,74 48,74 47,70" fill="#8B6914"/>
  </g>
  <path d="M50 8 C80 8 84 15 84 48 C84 76 50 94 50 94 C50 94 16 76 16 48 C16 15 20 8 50 8 Z" fill="none" stroke="#EDBB00" stroke-width="3"/>
</svg>''',

    'astonvilla': '''<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Claret shield with light blue border -->
  <path d="M50 8 C78 8 84 16 84 50 C84 76 50 94 50 94 C50 94 16 76 16 50 C16 16 22 8 50 8 Z" fill="#670E36" stroke="#95BFE5" stroke-width="4"/>
  <!-- AVFC letters / star -->
  <text x="50" y="25" font-family="Arial, sans-serif" font-weight="900" font-size="11" fill="#95BFE5" text-anchor="middle">AVFC</text>
  <!-- Roaring golden lion rampant -->
  <g fill="#FEE12B" stroke="#B8860B" stroke-width="0.5">
    <circle cx="50" cy="42" r="7"/>
    <path d="M46 48 C42 53 43 64 47 70 L53 70 C57 64 56 53 50 48 Z"/>
    <path d="M53 49 C62 47 65 42 66 38 L62 37 C60 41 57 44 51 47 Z"/>
    <path d="M47 51 C39 49 35 44 34 40 L38 39 C40 43 43 46 48 49 Z"/>
    <path d="M48 68 C41 72 37 77 35 81 L39 82 C42 78 45 74 50 71 Z"/>
    <path d="M52 68 C59 72 63 77 65 81 L61 82 C58 78 55 74 50 71 Z"/>
  </g>
  <!-- White star of European Cup 1982 -->
  <polygon points="50,73 52,78 57,78 53,81 55,86 50,83 45,86 47,81 43,78 48,78" fill="#FFFFFF"/>
</svg>''',

    'manutd': '''<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Red and Yellow circular crest -->
  <circle cx="50" cy="50" r="47" fill="#DA291C" stroke="#FBE122" stroke-width="3"/>
  <!-- Yellow banner ribbons -->
  <path d="M22 18 C35 12 65 12 78 18 L76 30 C65 24 35 24 24 30 Z" fill="#FBE122"/>
  <path d="M22 82 C35 88 65 88 78 82 L76 70 C65 76 35 76 24 70 Z" fill="#FBE122"/>
  <!-- Central shield with Ship and Red Devil -->
  <rect x="30" y="32" width="40" height="36" rx="4" fill="#FFFFFF" stroke="#FBE122" stroke-width="2"/>
  <!-- Ship at sea in upper half of shield -->
  <path d="M34 45 L66 45 L62 50 L38 50 Z" fill="#FBE122" stroke="#DA291C" stroke-width="1"/>
  <polygon points="50,35 50,45 57,45" fill="#DA291C"/>
  <polygon points="46,37 46,45 41,45" fill="#DA291C"/>
  <!-- Red Devil holding pitchfork -->
  <circle cx="50" cy="56" r="3.5" fill="#DA291C"/>
  <path d="M47 59 L53 59 L54 66 L46 66 Z" fill="#DA291C"/>
  <line x1="42" y1="52" x2="42" y2="67" stroke="#DA291C" stroke-width="1.5"/>
  <polygon points="42,50 40,53 44,53" fill="#DA291C"/>
  <!-- Text MANCHESTER UNITED -->
  <text x="50" y="24" font-family="Arial, sans-serif" font-weight="900" font-size="6.5" fill="#000000" text-anchor="middle">MANCHESTER</text>
  <text x="50" y="79" font-family="Arial, sans-serif" font-weight="900" font-size="6.5" fill="#000000" text-anchor="middle">UNITED</text>
</svg>''',

    'roma': '''<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Giallorossi split shield -->
  <path d="M50 8 C78 8 84 15 84 48 C84 76 50 94 50 94 C50 94 16 76 16 48 C16 15 22 8 50 8 Z" fill="#F0BC42" stroke="#8E1F2F" stroke-width="3"/>
  <!-- Upper half Carmine Red -->
  <clipPath id="romaClip">
    <path d="M50 8 C78 8 84 15 84 48 C84 76 50 94 50 94 C50 94 16 76 16 48 C16 15 22 8 50 8 Z"/>
  </clipPath>
  <g clip-path="url(#romaClip)">
    <rect x="0" y="0" width="100" height="52" fill="#8E1F2F"/>
    <!-- Capitoline Wolf silhouette in golden bronze -->
    <path d="M30 38 C32 30 40 28 50 28 C56 28 64 30 68 36 C72 40 70 46 64 46 C60 46 58 43 54 43 C50 43 46 47 40 47 C34 47 28 44 30 38 Z" fill="#F0BC42"/>
    <circle cx="67" cy="33" r="3" fill="#F0BC42"/>
    <polygon points="68,30 71,26 73,31" fill="#F0BC42"/>
    <!-- Twins Romulus and Remus drinking -->
    <circle cx="44" cy="48" r="2.5" fill="#F0BC42"/>
    <circle cx="50" cy="48" r="2.5" fill="#F0BC42"/>
    <!-- ROMA 1927 in lower yellow half -->
    <text x="50" y="70" font-family="Arial, sans-serif" font-weight="900" font-size="14" fill="#8E1F2F" text-anchor="middle">ROMA</text>
    <text x="50" y="84" font-family="Arial, sans-serif" font-weight="bold" font-size="9" fill="#8E1F2F" text-anchor="middle">1927</text>
  </g>
</svg>''',

    'lask': '''<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M50 8 C78 8 84 15 84 48 C84 76 50 94 50 94 C50 94 16 76 16 48 C16 15 22 8 50 8 Z" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
  <!-- Black and white vertical stripes -->
  <clipPath id="laskClip">
    <path d="M50 8 C78 8 84 15 84 48 C84 76 50 94 50 94 C50 94 16 76 16 48 C16 15 22 8 50 8 Z"/>
  </clipPath>
  <g clip-path="url(#laskClip)">
    <rect x="16" y="8" width="68" height="86" fill="#FFFFFF"/>
    <rect x="28" y="8" width="11" height="86" fill="#000000"/>
    <rect x="50" y="8" width="11" height="86" fill="#000000"/>
    <rect x="71" y="8" width="11" height="86" fill="#000000"/>
    <!-- Black banner on top -->
    <rect x="16" y="8" width="68" height="34" fill="#000000"/>
    <text x="50" y="32" font-family="Arial, sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle">LASK</text>
    <!-- Linz text -->
    <rect x="25" y="66" width="50" height="15" rx="3" fill="#000000"/>
    <text x="50" y="77" font-family="Arial, sans-serif" font-weight="bold" font-size="9" fill="#FFFFFF" text-anchor="middle">LINZ</text>
  </g>
</svg>''',

    'slovan': '''<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Sky blue & navy shield with gold star -->
  <path d="M50 8 C78 8 84 16 84 50 C84 76 50 94 50 94 C50 94 16 76 16 50 C16 16 22 8 50 8 Z" fill="#2D82C8" stroke="#FFFFFF" stroke-width="3"/>
  <path d="M50 14 C74 14 78 20 78 50 C78 72 50 88 50 88 C50 88 22 72 22 50 C22 20 26 14 50 14 Z" fill="#0D2E5C"/>
  <!-- Gold star on top -->
  <polygon points="50,18 53,25 60,25 55,30 57,37 50,33 43,37 45,30 40,25 47,25" fill="#FFD700"/>
  <!-- White stylized S -->
  <path d="M56 38 C46 38 40 43 40 50 C40 59 60 56 60 67 C60 74 53 77 47 77 C39 77 34 72 33 66 L39 64 C40 68 43 71 47 71 C51 71 54 69 54 66 C54 58 34 60 34 49 C34 42 41 33 56 33 C62 33 66 36 68 40 L62 43 C61 40 59 38 56 38 Z" fill="#FFFFFF"/>
  <text x="50" y="85" font-family="Arial, sans-serif" font-weight="900" font-size="7" fill="#FFFFFF" text-anchor="middle">SLOVAN</text>
</svg>'''
}

def generate_svgs():
    os.makedirs('assets/logos', exist_ok=True)
    for name, svg_content in SVGS.items():
        filepath = os.path.join('assets', 'logos', f'{name}.svg')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(svg_content.strip())
        print(f'Generated {filepath}')

if __name__ == '__main__':
    generate_svgs()
