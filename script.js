/**
 * AI ไอปันยาอ่อน วิเคราะห์บอล - UEFA CHAMPIONS LEAGUE 2026–27
 * Vanilla JavaScript Controller & Renderer (Mobile Optimized & Sofascore Injury Board)
 */

(function () {
  'use strict';

  // Ensure UCL_DATA is loaded
  if (typeof UCL_DATA === 'undefined') {
    console.error('UCL_DATA not loaded! Please check data.js.');
    return;
  }

  const state = {
    currentView: 'overview', // 'overview' or 'detail'
    selectedMatchId: 1,
    activeFilter: 'all',
    searchQuery: '',
    activePillarTab: 'info'
  };

  // Helper to render official logo image with SVG fallback
  function getTeamLogo(teamId, teamName) {
    let id = teamId;
    if (!id && teamName) {
      id = teamName.toLowerCase().replace(/[^a-z0-9]/g, '');
    }
    return `<img src="assets/logos/${id}.png" alt="${teamName || id}" class="team-logo-img" onerror="this.onerror=null; this.src='assets/logos/${id}.svg';">`;
  }

  // DOM Elements
  const overviewView = document.getElementById('overview-view');
  const detailView = document.getElementById('detail-view');
  const matchesGrid = document.getElementById('matches-grid');
  const searchInput = document.getElementById('search-input');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const heroQuoteText = document.getElementById('hero-quote-text');
  const heroQuoteMeta = document.getElementById('hero-quote-meta');
  const heroDateText = document.getElementById('hero-date-text');

  // Initialize Page
  function init() {
    renderHero();
    renderOverviewContent();
    renderMatchesList();
    bindEvents();
    setupSmartScrollNavbar();
    handleRouting();
    window.addEventListener('hashchange', handleRouting);
  }

  // Smart Auto-hide Navbar on Scroll (Mobile & Desktop)
  function setupSmartScrollNavbar() {
    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    const nav = document.querySelector('.site-nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScrollY > 70 && currentScrollY > lastScrollY) {
        // Scrolling DOWN -> Hide navbar
        nav.classList.add('nav-hidden');
      } else {
        // Scrolling UP -> Show navbar
        nav.classList.remove('nav-hidden');
      }
      lastScrollY = Math.max(0, currentScrollY);
    }, { passive: true });
  }

  // Render Hero Section content
  function renderHero() {
    if (heroQuoteText && UCL_DATA.quote) {
      heroQuoteText.textContent = `“${UCL_DATA.quote}”`;
    }
    if (heroQuoteMeta && UCL_DATA.quoteAuthor) {
      heroQuoteMeta.innerHTML = `<span><i class="ri-shield-flash-line"></i> ${UCL_DATA.quoteAuthor}</span> <span><i class="ri-time-line"></i> ${UCL_DATA.analysisDateThai}</span>`;
    }
    if (heroDateText) {
      heroDateText.textContent = UCL_DATA.analysisDateThai;
    }
  }

  // Render Overview Section (Rankings & Summary Table)
  function renderOverviewContent() {
    const ov = UCL_DATA.overview;

        // Supported / Confidence
    const supEl = document.getElementById('ranking-supported');
    if (supEl) {
      supEl.innerHTML = `
        <div class="ranking-item">
          <span class="ranking-item-badge badge-rank-1">อันดับ 1 • ความน่าเชื่อถือ 90/100</span>
          <div style="font-weight:700;color:#fff;margin-bottom:0.25rem;">AEK Athens พบ Real Madrid</div>
          <p>เรอัล มาดริด เหนือกว่าทุกมิติ ขุมกำลังเวิลด์คลาส เอ็มบัปเป้, วินิซิอุส, เบลลิงแฮม แม้ขาดการ์บาฆาล แต่เจ้าถิ่นเออีเคที่เปิดหน้าแลกจะโดนสวนกลับพังยับ</p>
        </div>
        <div class="ranking-item">
          <span class="ranking-item-badge badge-rank-2">อันดับ 2 • ความน่าเชื่อถือ 89/100 & 88/100</span>
          <div style="font-weight:700;color:#fff;margin-bottom:0.25rem;">Slavia Praha พบ Arsenal & Viking FK พบ Sabah FK</div>
          <p>อาร์เซน่อลคลีนชีต 3 นัดรวด เสีย 0 ประตูใน UCL สลาเวียไร้โกล์มือหนึ่ง ขณะที่ไวกิ้งได้เปรียบสนามหญ้าเทียม ลมหนาว 5 องศา และทีมเยือนล้าเดินทาง 4,500 กม.</p>
        </div>
      `;
    }

    // Advantage & Value
    const advEl = document.getElementById('ranking-advantage');
    if (advEl) {
      advEl.innerHTML = `
        <div class="ranking-item">
          <span class="ranking-item-badge badge-rank-1">อันดับ 1 • ราคาคุ้มค่าที่สุด</span>
          <div style="font-weight:700;color:#fff;margin-bottom:0.25rem;">AEK Athens พบ Real Madrid — เรอัล มาดริด ชนะ (@ 1.30) / ต่อ -1.0/1.5 (@ 1.70)</div>
          <p>ชั้นบอลต่างกันมาก มาดริดต้องการ 3 แต้มการันตีหัวตาราง คลาสบอลและสปีดเกมรุกฉีกแนวรับกรีซแน่นอน</p>
        </div>
        <div class="ranking-item">
          <span class="ranking-item-badge badge-rank-2">อันดับ 2</span>
          <div style="font-weight:700;color:#fff;margin-bottom:0.25rem;">Slavia Praha พบ Arsenal — อาร์เซน่อล ชนะ (@ 1.48) / ต่อ -1.0 (@ 1.78)</div>
          <p>ปืนใหญ่เน้นผลการแข่งขัน แนวรับ กาเบรียล & ซาลิบา แกร่งทั่วแผ่น พร้อมบุกเชือดเก็บ 3 แต้ม</p>
        </div>
        <div class="ranking-item">
          <span class="ranking-item-badge badge-rank-3">อันดับ 3</span>
          <div style="font-weight:700;color:#fff;margin-bottom:0.25rem;">Viking FK พบ Sabah FK — ไวกิ้ง เอฟเค ชนะ (@ 1.58)</div>
          <p>สถิติในบ้านบนหญ้าเทียมชนะ 8 จาก 10 นัด ทีมเยือนจากอาเซอร์ไบจานปรับตัวไม่ทันแน่นอน</p>
        </div>
      `;
    }

    // Over/Under
    const ouEl = document.getElementById('ranking-overunder');
    if (ouEl) {
      ouEl.innerHTML = `
        <div class="ranking-item">
          <span class="ranking-item-badge badge-rank-1">อันดับ 1</span>
          <div style="font-weight:700;color:#fff;margin-bottom:0.25rem;">Borussia Dortmund พบ Real Betis — Over 2.5 (@ 1.62)</div>
          <p>เสือเหลืองในบ้านเปิดหน้าแลกดุดัน กีราสซี่ ยิงคมกริบ เบติสมี โล เซลโซ่ และ วิตอร์ โรเก้ สวนกลับอันตราย</p>
        </div>
        <div class="ranking-item">
          <span class="ranking-item-badge badge-rank-2">อันดับ 2</span>
          <div style="font-weight:700;color:#fff;margin-bottom:0.25rem;">RB Leipzig พบ Man City — Over 2.5 (@ 1.55)</div>
          <p>ไลป์ซิกหลังชนฝาต้องบุกสู้ ฮาแลนด์เยือนถิ่นเก่าพร้อมยิง สถิติพบกัน 4 นัดหลังยิงรวมกัน 18 ประตู</p>
        </div>
        <div class="ranking-item">
          <span class="ranking-item-badge badge-rank-3">อันดับ 3</span>
          <div style="font-weight:700;color:#fff;margin-bottom:0.25rem;">PSV Eindhoven พบ Club Brugge — Over 2.5 (@ 1.55)</div>
          <p>พีเอสวียิงในบ้านเฉลี่ย 3.4 ลูกต่อเกม สไตล์บอลบุกเพรสซิ่งสูงของ ปีเตอร์ บอสซ์ การันตีสกอร์</p>
        </div>
      `;
    }

    // BTTS / Value Special
    const bttsEl = document.getElementById('ranking-btts');
    if (bttsEl) {
      bttsEl.innerHTML = `
        <div class="ranking-item">
          <span class="ranking-item-badge badge-rank-1">อันดับ 1</span>
          <div style="font-weight:700;color:#fff;margin-bottom:0.25rem;">Fenerbahçe พบ Liverpool — ลิเวอร์พูล ชนะ (@ 1.50) / X2 & Under 3.5 (@ 1.68)</div>
          <p>มูรินโญ่จะเล่นเกมรัดกุม ขณะที่ สล็อต เน้นโครงสร้างเกมรับที่เหนียวแน่น ลิเวอร์พูลบุกเบียดชนะได้</p>
        </div>
        <div class="ranking-item">
          <span class="ranking-item-badge badge-rank-2">อันดับ 2</span>
          <div style="font-weight:700;color:#fff;margin-bottom:0.25rem;">RC Lens พบ Como 1907 — ล็องส์ ชนะ (@ 1.75)</div>
          <p>ความเคี่ยวของ วิล สติล และประสบการณ์เวทียุโรปเหนือกว่าน้องใหม่โคโม่ของ เชส ฟาเบรกาส ชัดเจน</p>
        </div>
        <div class="ranking-item">
          <span class="ranking-item-badge badge-rank-3">อันดับ 3</span>
          <div style="font-weight:700;color:#fff;margin-bottom:0.25rem;">FC Porto พบ SSC Napoli — ปอร์โต้ 1X (@ 1.45) & Under 2.5 (@ 1.80)</div>
          <p>รังมังกรของปอร์โต้เหนียวแน่นสุดๆ คอนเต้มาเยือนเพื่อรัดกุม เกมตึงเปรี๊ยะชิงจังหวะสกอร์ต่ำ</p>
        </div>
      `;
    }

    // Risk Warnings
    const riskEl = document.getElementById('ranking-warnings');
    if (riskEl) {
      riskEl.innerHTML = `
        <div class="ranking-item">
          <div style="font-weight:700;color:#f43f5e;margin-bottom:0.25rem;"><i class="ri-alarm-warning-line"></i> Man Utd พบ Roma: ระวังการต่อเจ้าบ้าน (@ 2.30–2.38)</div>
          <p>แมนฯ ยูไนเต็ด ไม่ชนะใครมา 9 นัดติด อยู่อันดับ 17 พรีเมียร์ลีก ขาดทั้ง Yoro, Ugarte, Šeško ขณะที่ Roma ไร้พ่ายใน Serie A 17 นัดติด แนะนำให้มองฝั่ง X2 หรือ BTTS แทน</p>
        </div>
        <div class="ranking-item">
          <div style="font-weight:700;color:#f43f5e;margin-bottom:0.25rem;"><i class="ri-alarm-warning-line"></i> Atlético Madrid พบ Bayern Munich: ระวังการต่อ Bayern (@ 2.04)</div>
          <p>Bayern เสมอใน UCL มา 2 นัดติด ขาด Neuer, Luis Díaz และตัวรุกเจ็บเพิ่ม 3 ราย ขณะที่ตราหมีชนะในบ้านรอบแบ่งกลุ่ม 10 จาก 12 นัด</p>
        </div>
        <div class="ranking-item">
          <div style="font-weight:700;color:#f43f5e;margin-bottom:0.25rem;"><i class="ri-alarm-warning-line"></i> Barcelona พบ Aston Villa: ราคาเจ้าบ้านชนะ (@ 1.23–1.28) ต่ำเกินความคุ้มค่า</div>
          <p>ไม่คุ้มเสี่ยงเมื่อเทียบกับ Aston Villa ที่ชนะรวด 3 นัดใน UCL และบาร์ซาขาดกองหลังตัวหลักถึง 4 ราย</p>
        </div>
      `;
    }

    // Render Table
    renderSummaryTable(ov.summaryTable);
  }

  // Helper to parse picks string into clean title & odds
  function formatPickItem(pickStr) {
    if (!pickStr) return { title: '', odds: '' };
    let clean = pickStr.replace(/^\d+\.\s*/, '').trim();
    let odds = '';
    const atMatch = clean.match(/\((@\s*[\d\.]+)\)/);
    if (atMatch) {
      odds = atMatch[1].trim();
      clean = clean.replace(atMatch[0], '').trim();
    } else if (clean.includes('(เชิงวิเคราะห์)')) {
      odds = 'วิเคราะห์';
      clean = clean.replace('(เชิงวิเคราะห์)', '').trim();
    } else {
      const endParen = clean.match(/\(([\d\.\+\/\-]+)\)$/);
      if (endParen) {
        odds = endParen[1].trim();
        clean = clean.replace(endParen[0], '').trim();
      }
    }
    return { title: clean, odds };
  }

  // Render High-End Modern Summary Table
  function renderSummaryTable(rows) {
    const tbody = document.getElementById('summary-table-body');
    if (!tbody || !rows) return;

    tbody.innerHTML = rows.map(r => {
      // Find match in UCL_DATA for official logos and metadata
      const m = (typeof UCL_DATA !== 'undefined' && UCL_DATA.matches)
        ? UCL_DATA.matches.find(item => item.id === r.id)
        : null;

      // Parse 1X2 Probabilities (e.g. "43% / 26% / 31%")
      let pHome = 33, pDraw = 33, pAway = 34;
      if (r.prob1X2) {
        const parts = r.prob1X2.split('/').map(s => parseInt(s.replace(/[^0-9]/g, ''), 10));
        if (parts.length >= 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
          pHome = parts[0];
          pDraw = parts[1];
          pAway = parts[2];
        }
      }

      // Confidence score & color
      let confScore = r.confidenceScore || parseInt(r.confidence, 10) || 85;
      let confColor = '#00f0ff';
      if (confScore >= 87) confColor = '#10b981';
      else if (confScore >= 84) confColor = '#00f0ff';
      else confColor = '#f59e0b';

            // Risk badge styling (bulletproof safe check)
      let riskHtml = '';
      const riskVal = (r.risk || r.riskLevel || '').toString();
      if (riskVal.includes('ต่ำ')) {
        riskHtml = `
          <div class="summary-risk-badge risk-low">
            <i class="ri-shield-check-fill"></i>
            <span>เสี่ยงต่ำ</span>
          </div>
        `;
      } else if (riskVal.includes('สูง')) {
        riskHtml = `
          <div class="summary-risk-badge risk-high">
            <i class="ri-alert-fill"></i>
            <span>เสี่ยงสูง</span>
          </div>
        `;
      } else {
        riskHtml = `
          <div class="summary-risk-badge risk-med">
            <i class="ri-shield-line"></i>
            <span>เสี่ยงปานกลาง</span>
          </div>
        `;
      }

      if (riskVal.includes('BTTS')) {
        riskHtml += `<div class="risk-sub-note">เฉพาะ BTTS</div>`;
      }

      // Format Picks list into sleek chips (supports bestPicks or marketPicks)
      const rawPicks = r.bestPicks || r.marketPicks || [];
      const picksHtml = rawPicks.map(p => {
        const parsed = formatPickItem(p);
        return `
          <div class="summary-pick-chip">
            <span class="pick-chip-icon"><i class="ri-checkbox-circle-fill"></i></span>
            <span class="pick-chip-text" title="${parsed.title}">${parsed.title}</span>
            ${parsed.odds ? `<span class="pick-chip-odds">${parsed.odds.startsWith('@') ? parsed.odds : '@ ' + parsed.odds}</span>` : ''}
          </div>
        `;
      }).join('');

      // Teams markup with official crest logos
      let matchDisplayHtml = '';
      if (m && m.homeTeam && m.awayTeam) {
        matchDisplayHtml = `
          <div class="summary-fixture-row">
            <div class="summary-fixture-teams">
              <div class="summary-team-side home">
                <span class="summary-team-title">${m.homeTeam.name}</span>
                <span class="summary-team-logo-wrap">${getTeamLogo(m.homeTeam.id, m.homeTeam.name)}</span>
              </div>
              <span class="summary-fixture-vs">VS</span>
              <div class="summary-team-side away">
                <span class="summary-team-logo-wrap">${getTeamLogo(m.awayTeam.id, m.awayTeam.name)}</span>
                <span class="summary-team-title">${m.awayTeam.name}</span>
              </div>
            </div>
            <div class="summary-fixture-sub">
              <span class="summary-time-pill"><i class="ri-time-line"></i> ${m.kickoffSlot || r.time} น.</span>
              ${(m.isNeutralGround || r.isNeutral) ? '<span class="summary-neutral-pill"><i class="ri-map-pin-2-line"></i> สนามกลาง</span>' : ''}
            </div>
          </div>
        `;
      } else {
        const cleanMatchName = r.match.replace(/\\bwu\\b/gi, 'vs').replace(/\\s+พบ\\s+/g, ' vs ');
        matchDisplayHtml = `
          <div class="summary-fixture-row">
            <div style="font-weight:700;color:#fff;font-size:0.92rem;">${cleanMatchName}</div>
            <div class="summary-fixture-sub">
              <span class="summary-time-pill"><i class="ri-time-line"></i> ${r.time} น.</span>
            </div>
          </div>
        `;
      }

      return `
        <tr class="summary-row" onclick="window.location.hash='#match-${r.id}'">
          <td class="summary-col-id">
            <span class="summary-id-badge">#${r.id}</span>
          </td>
          <td class="summary-col-match">
            ${matchDisplayHtml}
          </td>
          <td class="summary-col-score">
            <div class="summary-score-capsule">
              <i class="ri-football-fill score-ball-icon"></i>
              <span class="score-digits">${r.predictedScore}</span>
            </div>
          </td>
          <td class="summary-col-picks">
            <div class="summary-picks-wrapper">
              ${picksHtml}
            </div>
          </td>
          <td class="summary-col-prob">
            <div class="summary-prob-widget">
              <div class="summary-prob-bar">
                <div class="prob-seg prob-seg-home" style="width:${pHome}%;" title="เจ้าบ้านชนะ ${pHome}%"></div>
                <div class="prob-seg prob-seg-draw" style="width:${pDraw}%;" title="เสมอ ${pDraw}%"></div>
                <div class="prob-seg prob-seg-away" style="width:${pAway}%;" title="ทีมเยือนชนะ ${pAway}%"></div>
              </div>
              <div class="summary-prob-labels">
                <span class="lbl-home"><strong>1</strong> ${pHome}%</span>
                <span class="lbl-draw"><strong>X</strong> ${pDraw}%</span>
                <span class="lbl-away"><strong>2</strong> ${pAway}%</span>
              </div>
            </div>
          </td>
          <td class="summary-col-conf">
            <div class="summary-conf-widget">
              <div class="summary-conf-top">
                <span class="conf-digit" style="color:${confColor};">${confScore}</span>
                <span class="conf-unit">/100</span>
              </div>
              <div class="summary-conf-track">
                <div class="summary-conf-fill" style="width:${confScore}%;background:${confColor};box-shadow:0 0 8px ${confColor}66;"></div>
              </div>
            </div>
          </td>
          <td class="summary-col-risk">
            ${riskHtml}
          </td>
          <td class="summary-col-action">
            <button class="summary-view-btn" onclick="event.stopPropagation(); window.location.hash='#match-${r.id}';">
              <span>วิเคราะห์</span>
              <i class="ri-arrow-right-line"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Filter & Search Matches
  function getFilteredMatches() {
    return UCL_DATA.matches.filter(m => {
      // Filter by slot or condition
      if (state.activeFilter === '0045' && m.kickoffSlot !== '00:45') return false;
      if (state.activeFilter === '0300' && m.kickoffSlot !== '03:00') return false;
      if (state.activeFilter === 'high-conf' && m.metaAnalysis.confidenceScore < 85) return false;
      const rLvl = (m.summaryAndRisk && (m.summaryAndRisk.riskLevel || m.summaryAndRisk.level || '')) || '';
      if (state.activeFilter === 'low-risk' && !rLvl.includes('ต่ำ')) return false;

      // Filter by search query
      if (state.searchQuery.trim() !== '') {
        const q = state.searchQuery.toLowerCase().trim();
        const homeName = m.homeTeam.name.toLowerCase();
        const awayName = m.awayTeam.name.toLowerCase();
        const homeThai = m.homeTeam.thaiName.toLowerCase();
        const awayThai = m.awayTeam.thaiName.toLowerCase();
        const stadium = typeof m.stadium === 'object' ? `${m.stadium.name} ${m.stadium.thaiName} ${m.stadium.city}`.toLowerCase() : (m.stadium || '').toLowerCase();
        const title = m.matchTitle.toLowerCase();
        if (!homeName.includes(q) && !awayName.includes(q) && !homeThai.includes(q) && !awayThai.includes(q) && !stadium.includes(q) && !title.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }

  // Render Match Cards Grid
  function renderMatchesList() {
    if (!matchesGrid) return;
    const matches = getFilteredMatches();

    if (matches.length === 0) {
      matchesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-dim);">
          <i class="ri-search-line" style="font-size: 3rem; margin-bottom: 1rem; display: block; color: var(--border-light);"></i>
          <h3>ไม่พบคู่การแข่งขันที่ตรงกับเงื่อนไขการค้นหา</h3>
          <p style="margin-top: 0.5rem;">ลองเปลี่ยนคำค้นหา หรือเลือกตัวกรอง "ทั้งหมด"</p>
        </div>
      `;
      return;
    }

    matchesGrid.innerHTML = matches.map(m => {
      const topPick = m.rankedPicks && m.rankedPicks.length > 0 ? m.rankedPicks[0] : null;

      let riskBadgeClass = 'badge-gray';
      const mRisk = (m.summaryAndRisk && (m.summaryAndRisk.riskLevel || m.summaryAndRisk.level || '')) || '';
      if (mRisk.includes('ต่ำ')) riskBadgeClass = 'badge-green';
      else if (mRisk.includes('ปานกลาง')) riskBadgeClass = 'badge-gold';
      else if (mRisk.includes('สูง')) riskBadgeClass = 'badge-red';

      return `
        <div class="match-card" data-match-id="${m.id}">
          <div>
            <!-- Header -->
            <div class="card-header">
              <span class="match-id-tag">${m.matchNumber}</span>
              <div class="match-time-tag">
                <i class="ri-time-line"></i> ${m.kickoffSlot} น.
                ${m.isNeutralGround ? '<span class="badge badge-ucl" style="font-size:0.65rem;padding:0.15rem 0.4rem;">สนามกลาง</span>' : ''}
              </div>
            </div>

            <!-- Versus Arena -->
            <div class="versus-arena">
              <div class="team-box">
                <div class="team-crest">${getTeamLogo(m.homeTeam.id, m.homeTeam.name)}</div>
                <div class="team-name">${m.homeTeam.name}</div>
                <div class="team-meta">${m.homeTeam.country}</div>
              </div>

              <div class="vs-badge">VS</div>

              <div class="team-box">
                <div class="team-crest">${getTeamLogo(m.awayTeam.id, m.awayTeam.name)}</div>
                <div class="team-name">${m.awayTeam.name}</div>
                <div class="team-meta">${m.awayTeam.country}</div>
              </div>
            </div>

            <!-- Stadium & Score Pred -->
            <div class="card-context-bar">
              <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:180px;">
                <i class="ri-map-pin-line"></i> ${typeof m.stadium === "object" && m.stadium ? (m.stadium.thaiName || m.stadium.name || "") : String(m.stadium || "").split("(")[0].trim()}
              </span>
              <span class="score-pred-badge">
                <i class="ri-football-line"></i> คาด: ${m.scorePrediction && m.scorePrediction.prediction ? m.scorePrediction.prediction.split(" ")[0] : "–"}
              </span>
            </div>

            <!-- Best Pick Box -->
            ${topPick ? `
              <div class="best-pick-card">
                <div class="pick-label"><i class="ri-fire-line"></i> ตลาดเด่น: ${topPick.marketName}</div>
                <div class="pick-selection">
                  <span>${topPick.selection}</span>
                  <span class="pick-odds">${topPick.odds}</span>
                </div>
              </div>
            ` : ''}

            <!-- Summary snippet -->
            <p class="card-summary-snippet">${m.summaryAndRisk.summary}</p>
          </div>

          <!-- Card Footer -->
          <div class="card-footer">
            <div class="confidence-box">
              <span class="confidence-label">ความน่าเชื่อถือ</span>
              <div class="confidence-bar-wrapper">
                <div class="confidence-bar">
                  <div class="confidence-fill" style="width: ${m.metaAnalysis.confidenceScore}%"></div>
                </div>
                <span class="confidence-val">${m.metaAnalysis.confidenceScore}%</span>
              </div>
            </div>

            <button class="btn-read-analysis" onclick="window.location.hash='#match-${m.id}'">
              อ่านบทวิเคราะห์ <i class="ri-arrow-right-line"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Form & H2H Clean Cards (Fix for Image 2)
  function renderCleanFormCards(m) {
    if (!m) return '';
    const formObj = m.formAnalysis || {};
    const rawForm = (typeof formObj === 'string' ? formObj : (formObj.overview || formObj.raw || ''));
    const awayName = (m.awayTeam && m.awayTeam.name) || '';

    let homeFormText = rawForm;
    let awayFormText = '';

    if (rawForm && awayName && typeof rawForm === 'string') {
      const awaySplitIdx = rawForm.indexOf(awayName + ':');
      if (awaySplitIdx !== -1) {
        homeFormText = rawForm.substring(0, awaySplitIdx).trim();
        awayFormText = rawForm.substring(awaySplitIdx).trim();
      }
    }

    const homeId = (m.homeTeam && m.homeTeam.id) || 'team';
    const awayId = (m.awayTeam && m.awayTeam.id) || 'team';
    const homeName = (m.homeTeam && m.homeTeam.name) || 'เจ้าบ้าน';
    const awayNameDisplay = (m.awayTeam && m.awayTeam.name) || 'ทีมเยือน';
    const homeLeague = (m.homeTeam && m.homeTeam.league) || '';
    const awayLeague = (m.awayTeam && m.awayTeam.league) || '';

    return `
      <div class="form-cards-grid">
        <div class="form-team-card">
          <div class="form-team-header">
            <img src="assets/logos/${homeId}.png" class="injury-team-badge-mini" alt="${homeName}" onerror="this.onerror=null; this.src='assets/logos/${homeId}.svg';">
            <div>
              <div style="font-weight:800;color:#fff;">${homeName}</div>
              <div style="font-size:0.75rem;color:var(--accent-gold);">${homeLeague}</div>
            </div>
          </div>
          <div class="form-body-text">${homeFormText || 'ฟอร์มการเล่นยอดเยี่ยมตามสถิติล่าสุด'}</div>
        </div>

        <div class="form-team-card">
          <div class="form-team-header">
            <img src="assets/logos/${awayId}.png" class="injury-team-badge-mini" alt="${awayNameDisplay}" onerror="this.onerror=null; this.src='assets/logos/${awayId}.svg';">
            <div>
              <div style="font-weight:800;color:#fff;">${awayNameDisplay}</div>
              <div style="font-size:0.75rem;color:var(--accent-gold);">${awayLeague}</div>
            </div>
          </div>
          <div class="form-body-text">${awayFormText || 'ฟอร์มการเล่นยอดเยี่ยมตามสถิติล่าสุด'}</div>
        </div>
      </div>

      ${formObj.h2h ? `
        <div class="h2h-highlight-card">
          <div class="h2h-head">
            <i class="ri-history-line"></i> สถิติการพบกัน Head-to-Head (H2H)
          </div>
          <div class="h2h-text">${formObj.h2h}</div>
        </div>
      ` : ''}
    `;
  }

  // Render Sofascore-style Squad & Injury Board (Fix for Image 3 -> Image 4)
  function renderSofascoreInjuryBoard(m) {
    const roster = m.squadRoster;
    if (!roster) {
      return `<div style="background:rgba(5,8,17,0.5);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:1.4rem;"><p>${m.squadReadiness.raw}</p></div>`;
    }

    // Helper for status badge
    function getBadgeClass(status) {
      if (status === 'Out') return 'badge-status-out';
      if (status === 'Suspended') return 'badge-status-suspended';
      if (status === 'Doubtful') return 'badge-status-doubtful';
      return 'badge-status-noelig';
    }

    // Render player row (Sofascore style with real face photos)
    function renderPlayerRow(p, teamId) {
      const photoHtml = p.image
        ? `<img src="${p.image}" class="injury-player-photo-img" alt="${p.name}" onerror="this.onerror=null; this.src='assets/logos/${teamId}.png';">`
        : `<span class="pos-fallback">${p.pos}</span>`;

      return `
        <div class="injury-player-row">
          <div class="injury-player-left">
            <div class="injury-player-avatar-wrap">
              ${photoHtml}
              ${p.status === 'Out' ? '<span class="avatar-status-dot dot-out"></span>' : ''}
              ${p.status === 'Suspended' ? '<span class="avatar-status-dot dot-suspended"></span>' : ''}
            </div>
            <div class="injury-player-info">
              <div class="injury-player-name">${p.name}</div>
              <div class="injury-player-pos-detail">${p.detail || p.role || ''}</div>
            </div>
          </div>
          <span class="injury-player-badge ${getBadgeClass(p.status)}">
            ${p.statusText || p.stat || ''}
          </span>
        </div>
      `;
    }

    return `
      <div class="injury-board-section">
        <!-- 2 Column Squad Grid (Exact Sofascore Image 4) -->
        <div class="injury-board-grid">
          <!-- Home Team Column -->
          <div class="injury-team-col">
            <div class="injury-team-head">
              <div class="injury-team-info">
                <img src="assets/logos/${m.homeTeam.id}.png" class="injury-team-badge-mini" alt="${m.homeTeam.name}">
                <div class="injury-team-name-text">${m.homeTeam.name}</div>
              </div>
              <span class="injury-coach-pill"><i class="ri-user-star-line"></i> กุนซือ: ${roster.home.coach}</span>
            </div>

            ${roster.home.coachStatus ? `
              <div style="font-size:0.78rem;color:#fca5a5;background:rgba(239,68,68,0.1);padding:0.4rem 0.65rem;border-radius:var(--radius-sm);margin-bottom:0.8rem;border:1px solid rgba(239,68,68,0.25);">
                <i class="ri-alarm-warning-line"></i> ${roster.home.coachStatus}
              </div>
            ` : ''}

            <div class="injury-players-list">
              ${roster.home.injuredPlayers.length > 0 
                ? roster.home.injuredPlayers.map(p => renderPlayerRow(p, m.homeTeam.id)).join('')
                : '<div style="color:var(--text-dim);font-size:0.85rem;padding:0.5rem 0;">ไม่มีรายงานผู้เล่นบาดเจ็บเพิ่มเติม</div>'
              }
            </div>
          </div>

          <!-- Away Team Column -->
          <div class="injury-team-col">
            <div class="injury-team-head">
              <div class="injury-team-info">
                <img src="assets/logos/${m.awayTeam.id}.png" class="injury-team-badge-mini" alt="${m.awayTeam.name}">
                <div class="injury-team-name-text">${m.awayTeam.name}</div>
              </div>
              <span class="injury-coach-pill"><i class="ri-user-star-line"></i> กุนซือ: ${roster.away.coach}</span>
            </div>

            ${roster.away.coachStatus ? `
              <div style="font-size:0.78rem;color:var(--accent-gold);background:rgba(251,191,36,0.1);padding:0.4rem 0.65rem;border-radius:var(--radius-sm);margin-bottom:0.8rem;border:1px solid rgba(251,191,36,0.25);">
                <i class="ri-checkbox-circle-line"></i> ${roster.away.coachStatus}
              </div>
            ` : ''}

            <div class="injury-players-list">
              ${roster.away.injuredPlayers.length > 0 
                ? roster.away.injuredPlayers.map(p => renderPlayerRow(p, m.awayTeam.id)).join('')
                : '<div style="color:var(--text-dim);font-size:0.85rem;padding:0.5rem 0;">ไม่มีรายงานผู้เล่นบาดเจ็บเพิ่มเติม</div>'
              }
            </div>
          </div>
        </div>

        <!-- Key Impact Players Showcase -->
        <div style="margin-top:2rem;">
          <h4 style="color:#fff;font-size:1.05rem;font-weight:800;margin-bottom:0.9rem;display:flex;align-items:center;gap:0.45rem;">
            <i class="ri-star-smile-line" style="color:var(--accent-gold);"></i> ผู้เล่นแกนหลักและตัวความหวังของเกม (Key Impact Players)
          </h4>
          <div class="key-players-grid">
            ${roster.home.keyPlayers.map(kp => `
              <div class="key-player-card">
                <div class="key-player-details">
                  <div class="key-player-avatar"><i class="ri-user-star-fill"></i></div>
                  <div>
                    <div class="key-player-name">${kp.name} <span style="font-size:0.75rem;color:var(--accent-ucl);font-weight:normal;">(${m.homeTeam.name})</span></div>
                    <div class="key-player-stat">${kp.role} • ${kp.stat}</div>
                  </div>
                </div>
                ${kp.value ? `<span class="key-player-val-tag">${kp.value}</span>` : ''}
              </div>
            `).join('')}

            ${roster.away.keyPlayers.map(kp => `
              <div class="key-player-card">
                <div class="key-player-details">
                  <div class="key-player-avatar" style="border-color:var(--text-highlight);color:var(--text-highlight);background:rgba(56,189,248,0.15);"><i class="ri-user-star-fill"></i></div>
                  <div>
                    <div class="key-player-name">${kp.name} <span style="font-size:0.75rem;color:var(--accent-gold);font-weight:normal;">(${m.awayTeam.name})</span></div>
                    <div class="key-player-stat">${kp.role} • ${kp.stat}</div>
                  </div>
                </div>
                ${kp.value ? `<span class="key-player-val-tag">${kp.value}</span>` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Collapsible Raw Notes -->
        <div style="margin-top:1.5rem;">
          <details style="background:rgba(5,8,17,0.3);border:1px solid rgba(255,255,255,0.05);border-radius:var(--radius-sm);padding:0.75rem 1rem;">
            <summary style="cursor:pointer;font-size:0.82rem;color:var(--text-dim);font-weight:600;">
              <i class="ri-file-text-line"></i> แสดงรายงานสรุปความพร้อมฉบับเต็มจาก Ucl.txt
            </summary>
            <p style="font-size:0.85rem;line-height:1.7;color:var(--text-muted);margin-top:0.6rem;">${m.squadReadiness.raw}</p>
          </details>
        </div>
      </div>
    `;
  }

  // Render Match Detail View
  
  // Render Stadium Showcase Card
  function renderStadiumCard(m) {
    const stad = m.stadium;
    if (!stad || typeof stad === 'string') return '';
    const bgImg = stad.image || `assets/stadiums/match${m.id}.jpg`;
    return `
      <div class="stadium-showcase-card">
        <div class="stadium-backdrop" style="background-image: url('${bgImg}');">
          <div class="stadium-badge-top">
            <i class="ri-map-pin-2-fill"></i> ${stad.countryFlag || '🏟️'} ${stad.city}, ${stad.country}
          </div>
        </div>
        <div class="stadium-content">
          <div class="stadium-title-row">
            <div>
              <div class="stadium-name-thai"><i class="ri-government-line" style="color:var(--accent-gold);"></i> ${stad.thaiName}</div>
              <div class="stadium-name-en">${stad.name}</div>
            </div>
            <div class="stadium-location-pill">
              <i class="ri-user-voice-line"></i> ความจุ ${stad.capacity}
            </div>
          </div>
          <div class="stadium-specs-grid">
            <div class="stadium-spec-item">
              <div class="stadium-spec-label"><i class="ri-football-line"></i> พื้นผิวสนาม</div>
              <div class="stadium-spec-value">${stad.surface}</div>
            </div>
            <div class="stadium-spec-item">
              <div class="stadium-spec-label"><i class="ri-temp-cold-line"></i> สภาพอากาศ</div>
              <div class="stadium-spec-value">${stad.climate}</div>
            </div>
            <div class="stadium-spec-item">
              <div class="stadium-spec-label"><i class="ri-sound-module-line"></i> ระดับเสียงเชียร์</div>
              <div class="stadium-spec-value" style="font-size:0.9rem;color:var(--accent-gold);">ดังกึกก้อง (High Pressure)</div>
            </div>
          </div>
          <div class="stadium-atmosphere-box">
            <strong style="color:var(--accent-gold);"><i class="ri-fire-line"></i> บรรยากาศ & จุดที่ต้องระวัง:</strong> ${stad.atmosphere}
          </div>
        </div>
      </div>
    `;
  }

  // Render Star Duel Matchup Card
  function renderStarDuelCard(m) {
    const duel = m.keyDuel;
    if (!duel) return '';
    const h = duel.homeStar;
    const a = duel.awayStar;
    return `
      <div class="star-duel-card">
        <div class="star-duel-header">
          <div class="pillar-title" style="font-size:1.05rem;display:flex;align-items:center;gap:0.5rem;">
            <i class="ri-flashlight-fill" style="color:var(--accent-gold);"></i> การ์ดดวลแข้งคีย์แมนฟอร์มฮอต (Star vs Star Matchup)
          </div>
          <span class="badge badge-ucl">คีย์แมนตัดสินเกม</span>
        </div>
        <div class="star-duel-grid">
          <!-- Home Star -->
          <div class="star-player-side">
            <div class="star-photo-wrap">
              <img src="${h.image}" class="star-photo-img" alt="${h.name}" onerror="this.onerror=null; this.src='assets/logos/${m.homeTeam.id}.png';">
            </div>
            <div class="star-player-name">${h.thaiName}</div>
            <div class="star-player-sub">${h.name} (#${h.number || ''} • ${h.pos})</div>
            <div class="star-form-tag">${h.formTag}</div>
            <div class="star-player-stat">${h.stat}</div>
            <div class="star-player-val">มูลค่าประเมิน: <strong style="color:#fff;">${h.value}</strong></div>
          </div>

          <!-- Center VS -->
          <div class="star-duel-center-vs">
            <div class="star-vs-badge">VS</div>
            <span style="font-size:0.75rem;color:var(--text-dim);font-weight:700;">DUEL</span>
          </div>

          <!-- Away Star -->
          <div class="star-player-side">
            <div class="star-photo-wrap">
              <img src="${a.image}" class="star-photo-img" alt="${a.name}" onerror="this.onerror=null; this.src='assets/logos/${m.awayTeam.id}.png';">
            </div>
            <div class="star-player-name">${a.thaiName}</div>
            <div class="star-player-sub">${a.name} (#${a.number || ''} • ${a.pos})</div>
            <div class="star-form-tag">${a.formTag}</div>
            <div class="star-player-stat">${a.stat}</div>
            <div class="star-player-val">มูลค่าประเมิน: <strong style="color:#fff;">${a.value}</strong></div>
          </div>
        </div>
      </div>
    `;
  }

  // Render 1-Minute Quick Verdict Card
  function renderQuickVerdictCard(m) {
    const v = m.quickVerdict;
    if (!v) return '';
    return `
      <div class="quick-verdict-card">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem;">
          <div style="font-size:1.05rem;font-weight:900;color:#fff;display:flex;align-items:center;gap:0.5rem;">
            <i class="ri-timer-flash-line" style="color:var(--accent-ucl);font-size:1.25rem;"></i> บทสรุปย่อ 1 นาที (Quick Verdict & Key Factors)
          </div>
          <span class="badge badge-gold" style="font-size:0.75rem;"><i class="ri-shield-check-line"></i> สรุปชี้ชัด</span>
        </div>
        <div class="quick-verdict-grid">
          <div class="quick-verdict-item">
            <div class="quick-verdict-label label-pick"><i class="ri-focus-3-line"></i> 1. ตลาดน่าเล่น & สกอร์คาดการณ์</div>
            <div class="quick-verdict-text">
              <strong style="color:var(--accent-ucl);font-size:0.95rem;display:block;margin-bottom:0.35rem;">${v.pick}</strong>
              <span style="color:var(--accent-gold);font-weight:700;">สกอร์คาดการณ์: ${v.score}</span>
            </div>
          </div>
          <div class="quick-verdict-item">
            <div class="quick-verdict-label label-key"><i class="ri-key-2-line"></i> 2. จุดตัดสำคัญ / แท็กติกชี้ขาด</div>
            <div class="quick-verdict-text">${v.keyPoint}</div>
          </div>
          <div class="quick-verdict-item">
            <div class="quick-verdict-label label-trap"><i class="ri-alert-line"></i> 3. กับดักราคา & ข้อควรระวัง</div>
            <div class="quick-verdict-text">${v.trapAlert}</div>
          </div>
        </div>
      </div>
    `;
  }

function renderMatchDetail(matchId) {
        const m = UCL_DATA.matches.find(item => item.id === matchId);
    if (!m) return;

    // Safety fallbacks to prevent any possible undefined property crash
    m.winProbability = m.winProbability || { home: 33, draw: 34, away: 33, raw: '' };
    m.rankedPicks = m.rankedPicks || [];
    m.metaAnalysis = m.metaAnalysis || { strengths: '', weaknesses: '', confidenceDisplay: '85/100', raw: '' };
    m.summaryAndRisk = m.summaryAndRisk || { riskLevel: 'ปานกลาง', summary: '', raw: '' };
    m.marketOdds = m.marketOdds || { odds1X2: '', oddsOverUnder: '', oddsBTTS: '', valueAssessment: '', raw: '' };
    m.formAnalysis = m.formAnalysis || { raw: '', overview: '', h2h: '' };
    m.statsAnalysis = m.statsAnalysis || { raw: '' };
    m.tacticsAnalysis = m.tacticsAnalysis || { raw: '' };
    m.scorePrediction = m.scorePrediction || { raw: '' };

    state.selectedMatchId = matchId;

    const prevId = matchId > 1 ? matchId - 1 : 9;
    const nextId = matchId < 9 ? matchId + 1 : 1;

    let riskBadgeClass = 'badge-gray';
    const detailRisk = (m.summaryAndRisk && (m.summaryAndRisk.riskLevel || m.summaryAndRisk.level || '')) || '';
    if (detailRisk.includes('ต่ำ')) riskBadgeClass = 'badge-green';
    else if (detailRisk.includes('ปานกลาง')) riskBadgeClass = 'badge-gold';
    else if (detailRisk.includes('สูง')) riskBadgeClass = 'badge-red';

    detailView.innerHTML = `
      <div class="container">
        <!-- Top Navigation -->
        <div class="detail-nav-bar">
          <button class="btn-back" onclick="window.location.hash='#overview'">
            <i class="ri-arrow-left-line"></i> กลับสู่หน้ารวมบทวิเคราะห์
          </button>

          <div class="match-switchers">
            <button class="btn-nav-match" onclick="window.location.hash='#match-${prevId}'">
              <i class="ri-arrow-left-s-line"></i> คู่ที่ ${prevId}
            </button>
            <span class="badge badge-ucl">${m.matchNumber} จาก 9</span>
            <button class="btn-nav-match" onclick="window.location.hash='#match-${nextId}'">
              คู่ที่ ${nextId} <i class="ri-arrow-right-s-line"></i>
            </button>
          </div>
        </div>

        <!-- Detail Hero Banner (Mobile Compact Layout) -->
        <div class="detail-hero-banner">
          <div class="detail-hero-top">
            <div style="display:flex;align-items:center;gap:0.75rem;">
              <span class="badge badge-ucl">${m.tournamentRound}</span>
              <span class="badge ${riskBadgeClass}">ความเสี่ยง: ${m.summaryAndRisk.riskLevel}</span>
            </div>
            <div style="font-size:0.85rem;color:var(--text-muted);">
              <i class="ri-calendar-line"></i> ${m.matchDateTime}
            </div>
          </div>

          <div class="detail-arena">
            <!-- Home Team Box -->
            <div class="detail-team-box">
              <div class="detail-team-crest">${getTeamLogo(m.homeTeam.id, m.homeTeam.name)}</div>
              <div class="detail-team-name">${m.homeTeam.name}</div>
              <div class="detail-team-league">${m.homeTeam.thaiName} (${m.homeTeam.country})</div>
            </div>

            <!-- VS Center -->
            <div class="detail-vs-center">
              <div class="detail-vs-badge">VS</div>
            </div>

            <!-- Away Team Box -->
            <div class="detail-team-box">
              <div class="detail-team-crest">${getTeamLogo(m.awayTeam.id, m.awayTeam.name)}</div>
              <div class="detail-team-name">${m.awayTeam.name}</div>
              <div class="detail-team-league">${m.awayTeam.thaiName} (${m.awayTeam.country})</div>
            </div>
          </div>

          <!-- Dedicated Full-Width Prediction Banner (Zero Mobile Clipping) -->
          <div class="detail-score-prediction-banner">
            <i class="ri-football-line" style="color:var(--accent-gold);"></i> สกอร์คาดการณ์: <strong>${m.scorePrediction.prediction}</strong>
          </div>

          <div class="detail-hero-meta-grid">
            <div class="detail-meta-item">
              <strong>สนามแข่งขัน</strong>
              <span>${typeof m.stadium === 'object' ? (m.stadium.thaiName || m.stadium.name || '') + ' (' + (m.stadium.city || '') + ')' : (m.stadium || '')}</span>
            </div>
            <div class="detail-meta-item">
              <strong>โปรแกรมและเวลาพัก</strong>
              <span>${typeof m.scheduleAndRest === 'object' ? (m.scheduleAndRest.raw || '') : (m.scheduleAndRest || '')}</span>
            </div>
            <div class="detail-meta-item">
              <strong>สภาพแวดล้อมสนาม</strong>
              <span>${typeof m.pitchAndWeather === 'object' ? (m.pitchAndWeather.raw || '') : (m.pitchAndWeather || '')}</span>
            </div>
          </div>
        </div>

        <!-- 1-Minute Quick Verdict Card -->
        ${renderQuickVerdictCard(m)}

        <!-- Stadium Showcase Card -->
        ${renderStadiumCard(m)}

        <!-- Star vs Star Duel Card -->
        ${renderStarDuelCard(m)}

        <!-- Pillar Navigation Tabs -->
        <div class="pillar-tabs">
          <button class="pillar-tab-btn active" data-target="sec-info"><i class="ri-information-line"></i> 1. ข้อมูลแข่งขัน</button>
          <button class="pillar-tab-btn" data-target="sec-form"><i class="ri-line-chart-line"></i> 2. ฟอร์ม & H2H</button>
          <button class="pillar-tab-btn" data-target="sec-stats"><i class="ri-bar-chart-2-line"></i> 3. สถิติรุก-รับ</button>
          <button class="pillar-tab-btn" data-target="sec-squad"><i class="ri-user-star-line"></i> 4. ตัวเจ็บ & ความพร้อม</button>
          <button class="pillar-tab-btn" data-target="sec-tactics"><i class="ri-compass-3-line"></i> 5. แท็กติก</button>
          <button class="pillar-tab-btn" data-target="sec-odds"><i class="ri-price-tag-3-line"></i> 6. ราคา & Value</button>
          <button class="pillar-tab-btn" data-target="sec-picks"><i class="ri-medal-line"></i> 7. ตลาดแนะนำ</button>
        </div>

        <!-- Pillar 1: Match Info -->
        <div id="sec-info" class="pillar-card">
          <div class="pillar-header">
            <div class="pillar-icon"><i class="ri-information-line"></i></div>
            <div>
              <div class="pillar-title">1. ข้อมูลภาพรวมการแข่งขันและสถานการณ์</div>
              <div class="pillar-subtitle">อันดับตารางคะแนน บริบทความพร้อม และเวลาพักผ่อน</div>
            </div>
          </div>
          <div style="font-size:0.95rem;line-height:1.8;color:var(--text-main);">
            <div style="background:rgba(5,8,17,0.5);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:1.4rem;margin-bottom:1.2rem;">
              <h4 style="color:var(--accent-gold);margin-bottom:0.6rem;"><i class="ri-trophy-line"></i> อันดับตารางคะแนน UCL ล่าสุดและสถานะในลีก</h4>
              <p>${typeof m.standings === 'object' ? ((m.standings.home ? m.standings.home + ' | ' + m.standings.away : m.standings.raw) || '') : (m.standings || '')}</p>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;">
              <div style="background:rgba(5,8,17,0.4);border:1px solid rgba(255,255,255,0.05);padding:1.2rem;border-radius:var(--radius-md);">
                <strong style="color:var(--accent-ucl);display:block;margin-bottom:0.35rem;"><i class="ri-time-line"></i> เวลาพักและความสด</strong>
                <p style="font-size:0.9rem;color:var(--text-muted);">${typeof m.scheduleAndRest === 'object' ? (m.scheduleAndRest.raw || '') : (m.scheduleAndRest || '')}</p>
              </div>
              <div style="background:rgba(5,8,17,0.4);border:1px solid rgba(255,255,255,0.05);padding:1.2rem;border-radius:var(--radius-md);">
                <strong style="color:var(--accent-ucl);display:block;margin-bottom:0.35rem;"><i class="ri-temp-hot-line"></i> สภาพสนามและบรรยากาศ</strong>
                <p style="font-size:0.9rem;color:var(--text-muted);">${typeof m.pitchAndWeather === 'object' ? (m.pitchAndWeather.raw || '') : (m.pitchAndWeather || '')}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pillar 2: Form & H2H (Clean Separated Cards) -->
        <div id="sec-form" class="pillar-card">
          <div class="pillar-header">
            <div class="pillar-icon"><i class="ri-line-chart-line"></i></div>
            <div>
              <div class="pillar-title">2. วิเคราะห์ฟอร์มการเล่นและสถิติ Head-to-Head</div>
              <div class="pillar-subtitle">ผลงาน 5-10 นัดล่าสุด สถิติเหย้า-เยือน และการพบกันในอดีต (แยกฝั่งชัดเจน)</div>
            </div>
          </div>
          <div>
            ${renderCleanFormCards(m)}
          </div>
        </div>

        <!-- Pillar 3: Attack / Defense Stats -->
        <div id="sec-stats" class="pillar-card">
          <div class="pillar-header">
            <div class="pillar-icon"><i class="ri-bar-chart-2-line"></i></div>
            <div>
              <div class="pillar-title">3. สถิติเกมรุก เกมรับ และประสิทธิภาพเชิงลึก</div>
              <div class="pillar-subtitle">Goals Scored/Conceded, Sofascore Ratings, การสร้างโอกาสยิง และแนวโน้มสกอร์</div>
            </div>
          </div>
          <div style="font-size:0.95rem;line-height:1.8;color:var(--text-main);">
            <p>${m.statsAnalysis.raw}</p>
          </div>
        </div>

        <!-- Pillar 4: Sofascore-style Injury Board (Image 4 format) -->
        <div id="sec-squad" class="pillar-card">
          <div class="pillar-header">
            <div class="pillar-icon"><i class="ri-user-star-line"></i></div>
            <div>
              <div class="pillar-title">4. ความพร้อมของนักเตะ ข่าวทีม และอาการบาดเจ็บ</div>
              <div class="pillar-subtitle">กระดานเปรียบเทียบผู้เล่นบาดเจ็บและแบน 2 ฝั่ง (Injuries & Suspensions Squad Board)</div>
            </div>
          </div>
          <div>
            ${renderSofascoreInjuryBoard(m)}
          </div>
        </div>

        <!-- Pillar 5: Tactics -->
        <div id="sec-tactics" class="pillar-card">
          <div class="pillar-header">
            <div class="pillar-icon"><i class="ri-compass-3-line"></i></div>
            <div>
              <div class="pillar-title">5. วิเคราะห์แท็กติกและรูปแบบการเล่น</div>
              <div class="pillar-subtitle">แผนการเล่น กุนซือ การขึ้นเกม เพรสซิ่ง จุดแข็ง และจุดอ่อน</div>
            </div>
          </div>
          <div style="font-size:0.95rem;line-height:1.8;color:var(--text-main);">
            <p>${m.tacticsAnalysis.raw}</p>
          </div>
        </div>

        <!-- Pillar 6: Market Odds & Value Analysis -->
        <div id="sec-odds" class="pillar-card">
          <div class="pillar-header">
            <div class="pillar-icon"><i class="ri-price-tag-3-line"></i></div>
            <div>
              <div class="pillar-title">6. วิเคราะห์ราคาเดิมพันและความน่าจะเป็น (Value Betting)</div>
              <div class="pillar-subtitle">ตลาด 1X2, Over/Under 2.5, BTTS และการประเมินความคุ้มค่าทางสถิติ</div>
            </div>
          </div>

          <!-- Odds Cells -->
          <div class="odds-table-grid">
            <div class="odds-cell">
              <div class="odds-cell-title">ราคา 1X2 (เหย้า / เสมอ / เยือน)</div>
              <div class="odds-cell-val">${m.marketOdds.odds1X2 || 'ดูรายละเอียด'}</div>
            </div>
            <div class="odds-cell">
              <div class="odds-cell-title">Over / Under 2.5 Goals</div>
              <div class="odds-cell-val">${m.marketOdds.oddsOverUnder || 'ดูรายละเอียด'}</div>
            </div>
            <div class="odds-cell">
              <div class="odds-cell-title">Both Teams To Score (BTTS)</div>
              <div class="odds-cell-val">${m.marketOdds.oddsBTTS || 'ดูรายละเอียด'}</div>
            </div>
          </div>

          <!-- Probability Bar -->
          <div class="prob-bar-container">
            <div class="prob-bar-labels">
              <span style="color:#38bdf8;">${m.homeTeam.name} ชนะ (${m.winProbability.home}%)</span>
              <span style="color:#94a3b8;">เสมอ (${m.winProbability.draw}%)</span>
              <span style="color:#f59e0b;">${m.awayTeam.name} ชนะ (${m.winProbability.away}%)</span>
            </div>
            <div class="prob-bar">
              <div class="prob-fill-home" style="width:${m.winProbability.home}%;"></div>
              <div class="prob-fill-draw" style="width:${m.winProbability.draw}%;"></div>
              <div class="prob-fill-away" style="width:${m.winProbability.away}%;"></div>
            </div>
          </div>

          <div style="font-size:0.95rem;line-height:1.8;color:var(--text-main);margin-top:1.2rem;">
            <p>${m.winProbability.raw}</p>
          </div>

          ${m.marketOdds.valueAssessment ? `
            <div style="background:rgba(0,240,255,0.05);border-left:3px solid var(--accent-ucl);padding:1rem 1.2rem;border-radius:0 var(--radius-sm) var(--radius-sm) 0;margin-top:1.2rem;">
              <strong style="color:var(--accent-ucl);display:block;margin-bottom:0.25rem;"><i class="ri-scales-3-line"></i> การประเมินความคุ้มค่าของราคาตลาด (Value Assessment)</strong>
              <p style="font-size:0.92rem;color:var(--text-main);">${m.marketOdds.valueAssessment}</p>
            </div>
          ` : ''}

          <!-- In-depth O/U & BTTS -->
          <div style="background:rgba(5,8,17,0.45);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:1.4rem;margin-top:1.5rem;">
            <h4 style="color:var(--accent-gold);margin-bottom:0.5rem;"><i class="ri-line-chart-line"></i> วิเคราะห์เจาะลึกตลาด Over / Under และ BTTS</h4>
            <p style="font-size:0.92rem;line-height:1.7;color:var(--text-muted);">${m.overUnderBttsAnalysis}</p>
          </div>
        </div>

        <!-- Pillar 7: Ranked Picks & Summary -->
        <div id="sec-picks" class="pillar-card">
          <div class="pillar-header">
            <div class="pillar-icon"><i class="ri-medal-line"></i></div>
            <div>
              <div class="pillar-title">7. การคัดเลือกและจัดอันดับตลาดเดิมพันที่น่าสนใจ & บทสรุป</div>
              <div class="pillar-subtitle">ตัวเลือกที่ 1, 2, 3 พร้อมเหตุผลสนับสนุน ปัจจัยเสี่ยง และระดับความน่าเชื่อถือ</div>
            </div>
          </div>

          <!-- Ranked Picks Cards -->
          <div>
            ${m.rankedPicks.map((pick, pIdx) => `
              <div class="pick-detail-card">
                <div class="pick-detail-header">
                  <div>
                    <span class="badge ${pIdx === 0 ? 'badge-gold' : 'badge-ucl'}" style="margin-bottom:0.35rem;">
                      ${pick.title}
                    </span>
                    <div class="pick-title-text">${pick.category || pick.selection}</div>
                  </div>
                  <div class="pick-meta-badges">
                    <span class="badge badge-gray" style="font-family:var(--font-mono);font-size:0.85rem;">
                      ราคาจริง: <strong style="color:#fff;margin-left:0.25rem;">${pick.odds}</strong>
                    </span>
                    ${pick.prob ? `
                      <span class="badge badge-ucl" style="font-family:var(--font-mono);font-size:0.85rem;">
                        โอกาส: <strong style="color:#fff;margin-left:0.25rem;">${pick.prob}</strong>
                      </span>
                    ` : ''}
                    ${pick.fairOdds ? `
                      <span class="badge badge-gold" style="font-family:var(--font-mono);font-size:0.85rem;">
                        Fair Odds: <strong style="color:#fff;margin-left:0.25rem;">${pick.fairOdds}</strong>
                      </span>
                    ` : ''}
                  </div>
                </div>

                <div class="pick-detail-content">
                  <div style="font-size:0.88rem;color:var(--text-dim);margin-bottom:0.5rem;">
                    <strong>ชื่อตลาด:</strong> ${pick.marketName} | <strong>ตัวเลือก:</strong> ${pick.selection}
                  </div>

                  <div class="pick-reason-box">
                    <strong style="color:var(--accent-ucl);display:block;margin-bottom:0.25rem;">
                      <i class="ri-checkbox-circle-line"></i> เหตุผลที่เลือกและความได้เปรียบ:
                    </strong>
                    <p>${pick.reasons}</p>
                  </div>

                  <div class="pick-risk-box">
                    <strong style="color:var(--accent-red);display:block;margin-bottom:0.25rem;">
                      <i class="ri-alert-line"></i> ปัจจัยเสี่ยงที่ต้องระวัง:
                    </strong>
                    <p>${pick.risks}</p>
                  </div>

                  ${pick.attractiveness ? `
                    <div style="margin-top:0.6rem;font-size:0.88rem;color:var(--accent-gold);">
                      <strong>ระดับความน่าสนใจ:</strong> ${pick.attractiveness}
                    </div>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Strengths, Weaknesses, Reliability -->
          <div class="sw-grid">
            <div class="sw-box sw-strengths">
              <div class="sw-header"><i class="ri-thumb-up-line"></i> จุดแข็งของการคาดการณ์</div>
              <p style="font-size:0.9rem;line-height:1.6;color:var(--text-main);">${m.metaAnalysis.strengths}</p>
            </div>

            <div class="sw-box sw-weaknesses">
              <div class="sw-header"><i class="ri-thumb-down-line"></i> จุดอ่อนและข้อจำกัดข้อมูล</div>
              <p style="font-size:0.9rem;line-height:1.6;color:var(--text-main);">${m.metaAnalysis.weaknesses}</p>
            </div>
          </div>

          <!-- Summary & Confidence -->
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.5rem;background:rgba(5,8,17,0.6);border:1px solid var(--border-light);border-radius:var(--radius-md);padding:1.4rem;margin-top:1.5rem;">
            <div>
              <div style="font-size:0.78rem;color:var(--text-dim);text-transform:uppercase;font-weight:700;">คะแนนความน่าเชื่อถือของการวิเคราะห์</div>
              <div style="font-size:1.8rem;font-weight:900;color:var(--accent-ucl);font-family:var(--font-mono);">${m.metaAnalysis.confidenceDisplay}</div>
            </div>

            <div style="max-width:550px;">
              <div style="font-size:0.85rem;color:var(--text-muted);">${m.summaryAndRisk.summary}</div>
            </div>

            <div>
              <span class="badge ${riskBadgeClass}" style="font-size:0.92rem;padding:0.5rem 1.1rem;">
                ระดับความเสี่ยง: ${m.summaryAndRisk.riskLevel}
              </span>
            </div>
          </div>
        </div>

        <!-- Back to Top button -->
        <div style="text-align:center;margin-top:3rem;">
          <button class="btn-back" onclick="window.scrollTo({top:0,behavior:'smooth'})">
            <i class="ri-arrow-up-line"></i> กลับขึ้นด้านบน
          </button>
        </div>
      </div>
    `;

    // Re-bind pillar tab scroll
    const tabBtns = detailView.querySelectorAll('.pillar-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // Handle URL Hash Navigation
  
  // ==========================================================================
  // DANISH SUPERLIGA DEDICATED CATEGORY VIEW (SEPARATED FROM UCL)
  // ==========================================================================
    // ==========================================================================
  // DANISH SUPERLIGA DEDICATED CATEGORY VIEW (UPDATED 2 NOV 2026)
  // ==========================================================================
  function renderDanishView() {
    const container = document.getElementById('danish-content-container');
    if (!container || typeof DANISH_SUPERLIGA_DATA === 'undefined') return;

    const d = DANISH_SUPERLIGA_DATA;

    // 1. Matches Cards (7 Matches)
    let matchesHtml = d.matches.map(m => {
      const probHome = m.probabilities.home;
      const probDraw = m.probabilities.draw;
      const probAway = m.probabilities.away;

      return `
        <div class="danish-match-card">
          <div class="danish-match-header">
            <span class="danish-badge-top" style="margin-bottom:0;font-size:0.75rem;">
              <i class="ri-shield-flash-line"></i> ${m.matchday}
            </span>
            <div class="danish-match-time">
              <i class="ri-time-line"></i> ${m.kickoff}
            </div>
          </div>

          <div style="font-size:1.1rem;font-weight:900;color:#fff;margin-bottom:0.75rem;">
            ${m.matchTitle}
          </div>

          <div class="danish-teams-row">
            <div class="danish-team-item">
              <div class="danish-team-name">${m.homeTeam.name}</div>
              <div class="danish-team-rank">อันดับ ${m.homeTeam.rank} (${m.homeTeam.pts} แต้ม)</div>
              <div style="font-size:0.75rem;color:var(--accent-ucl);margin-top:0.25rem;">
                <i class="ri-dashboard-line"></i> แผน: ${m.homeTeam.system}
              </div>
            </div>
            <div class="danish-vs-badge">VS</div>
            <div class="danish-team-item">
              <div class="danish-team-name">${m.awayTeam.name}</div>
              <div class="danish-team-rank">อันดับ ${m.awayTeam.rank} (${m.awayTeam.pts} แต้ม)</div>
              <div style="font-size:0.75rem;color:var(--accent-ucl);margin-top:0.25rem;">
                <i class="ri-dashboard-line"></i> แผน: ${m.awayTeam.system}
              </div>
            </div>
          </div>

          <!-- Handicap & 1X2 Odds Banner -->
          <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.04);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:0.45rem 0.75rem;margin-bottom:0.85rem;font-size:0.82rem;flex-wrap:wrap;gap:0.4rem;">
            <div><span style="color:var(--text-dim);">เรตต่อรอง:</span> <strong style="color:#f87171;">${m.asianHandicap}</strong></div>
            <div><span style="color:var(--text-dim);">ราคา 1X2:</span> <strong style="color:var(--accent-gold);">${m.odds1X2}</strong></div>
          </div>

          <div class="danish-pred-banner">
            <i class="ri-football-line"></i> คาดการณ์สกอร์: <strong>${m.predictedScore}</strong>
          </div>

          <div class="danish-picks-list">
            <div class="danish-pick-tag">
              <span style="color:var(--text-muted);"><i class="ri-focus-3-line" style="color:var(--accent-gold);"></i> <strong>ทีเด็ดคัดกรอง:</strong> ${m.bestPick}</span>
              <strong style="color:var(--accent-gold);">${m.confidence}</strong>
            </div>
          </div>

          <div class="danish-prob-bar-wrap">
            <div class="danish-prob-labels">
              <span>${m.homeTeam.name.split(' ')[0]} ${probHome}%</span>
              <span>เสมอ ${probDraw}%</span>
              <span>${m.awayTeam.name.split(' ')[0]} ${probAway}%</span>
            </div>
            <div class="danish-prob-bar">
              <div class="danish-prob-home" style="width:${probHome}%;"></div>
              <div class="danish-prob-draw" style="width:${probDraw}%;"></div>
              <div class="danish-prob-away" style="width:${probAway}%;"></div>
            </div>
          </div>

          <div style="background:rgba(0,0,0,0.25);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:0.85rem;margin-bottom:0.75rem;">
            <div style="font-size:0.78rem;font-weight:800;color:var(--accent-ucl);margin-bottom:0.35rem;">
              <i class="ri-sword-line"></i> แท็กติก & แผนการเล่น:
            </div>
            <p style="font-size:0.82rem;color:var(--text-dim);line-height:1.5;margin:0;">
              ${m.tactics}
            </p>
          </div>

          <p style="font-size:0.82rem;color:var(--text-muted);line-height:1.5;margin:0;">
            <strong>บทวิเคราะห์:</strong> ${m.analysisText}
          </p>
        </div>
      `;
    }).join('');

    // 2. Standings Rows
    let standingsRows = d.standings.map(s => {
      const isChamp = s.rank <= 6;
      const zoneBorder = isChamp ? 'style="border-left:3px solid #10b981;"' : 'style="border-left:3px solid #64748b;"';
      const zoneBadge = isChamp
        ? `<span style="font-size:0.7rem;font-weight:800;color:#10b981;background:rgba(16,185,129,0.12);padding:0.15rem 0.5rem;border-radius:var(--radius-full);">กลุ่มชิงแชมป์ (1-6)</span>`
        : `<span style="font-size:0.7rem;font-weight:800;color:#94a3b8;background:rgba(148,163,184,0.12);padding:0.15rem 0.5rem;border-radius:var(--radius-full);">หนีตกชั้น (7-12)</span>`;

      return `
        <tr ${zoneBorder}>
          <td style="font-weight:900;color:${isChamp ? 'var(--accent-ucl)' : 'var(--text-dim)'};">${s.rank}</td>
          <td><strong style="color:#fff;">${s.team}</strong></td>
          <td>${s.played}</td>
          <td>${s.w}</td>
          <td>${s.d}</td>
          <td>${s.l}</td>
          <td>${s.gf}</td>
          <td>${s.ga}</td>
          <td style="color:${s.gd.startsWith('+') ? '#10b981' : (s.gd.startsWith('-') ? '#ef4444' : '#fff')};font-weight:700;">${s.gd}</td>
          <td><strong style="color:var(--accent-gold);font-size:1rem;">${s.pts}</strong></td>
          <td>${zoneBadge}</td>
        </tr>
      `;
    }).join('');

    // 3. Tiers Breakdown Rows
    let tiersHtml = d.tiers.map(t => `
      <div style="background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:1rem;margin-bottom:0.75rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;flex-wrap:wrap;gap:0.4rem;">
          <strong style="color:var(--accent-gold);font-size:0.95rem;">${t.tier}: ${t.teams}</strong>
          <span style="font-size:0.75rem;color:var(--accent-ucl);background:rgba(0,240,255,0.1);padding:0.15rem 0.5rem;border-radius:var(--radius-full);">แผน: ${t.system}</span>
        </div>
        <p style="font-size:0.83rem;color:var(--text-dim);line-height:1.5;margin-bottom:0.35rem;">
          ${t.style}
        </p>
        <div style="font-size:0.78rem;color:var(--text-muted);">
          แนวโน้มสกอร์: <strong style="color:#fff;">${t.scoreTrend}</strong>
        </div>
      </div>
    `).join('');

    // 4. Key Tactical Insights
    let insightsHtml = d.keyTacticalNotes.map(n => `
      <div style="background:rgba(255,255,255,0.03);border-left:3px solid #ef4444;border-radius:0 var(--radius-md) var(--radius-md) 0;padding:0.85rem 1rem;margin-bottom:0.75rem;">
        <strong style="color:#fff;font-size:0.9rem;display:block;margin-bottom:0.25rem;">
          <i class="ri-lightbulb-line" style="color:var(--accent-gold);"></i> ${n.title}
        </strong>
        <p style="font-size:0.82rem;color:var(--text-dim);line-height:1.5;margin:0;">
          ${n.desc}
        </p>
      </div>
    `).join('');

    // 5. Top Scorers Rows
    let scorersHtml = d.topScorers.map((sc, idx) => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:0.6rem 0;border-bottom:1px solid rgba(255,255,255,0.05);">
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <span style="font-size:0.9rem;font-weight:900;color:${idx === 0 ? 'var(--accent-gold)' : 'var(--text-muted)'};width:20px;">#${idx+1}</span>
          <div>
            <div style="font-weight:800;color:#fff;font-size:0.9rem;">${sc.name}</div>
            <div style="font-size:0.75rem;color:var(--text-dim);">${sc.team} (${sc.matches} นัด)</div>
          </div>
        </div>
        <div style="text-align:right;">
          <strong style="font-size:1.1rem;color:var(--accent-gold);">${sc.goals}</strong> <span style="font-size:0.75rem;color:var(--text-dim);">ประตู</span>
          <div style="font-size:0.7rem;color:var(--text-dim);">${sc.assists} แอสซิสต์</div>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="container danish-view-section">
        <!-- Danish Hero -->
        <div class="danish-hero">
          <div class="danish-badge-top">
            <span>🇩🇰</span> DANISH SUPERLIGA (3F SUPERLIGA 2026–27)
          </div>
          <h1 class="danish-hero-title">รายงานวิเคราะห์ฟุตบอลเดนิช ซูเปอร์ลีกา</h1>
          <p class="danish-hero-desc">
            ${d.overview}
          </p>

          <!-- 4 League Key Metrics -->
          <div class="danish-quick-stats">
            <div class="danish-stat-pill">
              <span>ประตูรวมเฉลี่ย</span>
              <strong style="color:var(--accent-gold);">${d.leagueStats.avgGoals}</strong>
            </div>
            <div class="danish-stat-pill">
              <span>อัตราสกอร์สูง Over 2.5</span>
              <strong style="color:#10b981;">${d.leagueStats.over25Rate}</strong>
            </div>
            <div class="danish-stat-pill">
              <span>ยิงสองฝั่ง (BTTS)</span>
              <strong style="color:var(--accent-ucl);">${d.leagueStats.bttsRate}</strong>
            </div>
            <div class="danish-stat-pill">
              <span>เตะมุมเฉลี่ยต่อเกม</span>
              <strong style="color:#fff;">${d.leagueStats.avgCorners}</strong>
            </div>
          </div>

          <!-- Recent Results Banner -->
          <div style="background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.08);border-radius:var(--radius-md);padding:0.75rem 1rem;margin-top:1.25rem;font-size:0.82rem;color:var(--text-dim);">
            <strong style="color:#fff;"><i class="ri-history-line"></i> ผลการแข่งขันนัดที่ 13:</strong> ${d.recentResults}
          </div>

          <div style="margin-top:1.5rem;display:flex;gap:0.75rem;flex-wrap:wrap;">
            <button onclick="switchLeagueCategory('ucl')" class="btn-hero-primary" style="padding:0.6rem 1.4rem;font-size:0.88rem;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);cursor:pointer;">
              <i class="ri-arrow-left-line"></i> สลับกลับไปหน้า UEFA Champions League (9 คู่)
            </button>
            <a href="hub.html" class="btn-hero-primary" style="padding:0.6rem 1.4rem;font-size:0.88rem;background:rgba(251,191,36,0.12);border:1px solid rgba(251,191,36,0.3);color:var(--accent-gold);cursor:pointer;text-decoration:none;">
              <i class="ri-flashlight-line"></i> เปิดดู Live Multi-Hub
            </a>
          </div>
        </div>

        <!-- Section 1: Matches Program & Odds -->
        <div style="margin-bottom:1.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;">
          <div>
            <h2 style="font-size:1.5rem;font-weight:900;color:#fff;">⚽ โปรแกรมการแข่งขัน (เวลาไทย GMT+7) & ราคาต่อรอง (7 คู่)</h2>
            <p style="font-size:0.85rem;color:var(--text-muted);">นัดที่ 13 (ตกค้าง) และนัดที่ 14 พร้อมราคา 1X2, แฮนดิแคป และแผนการเล่น</p>
          </div>
          <span class="league-tab-badge badge-red" style="font-size:0.82rem;padding:0.35rem 0.85rem;">7 แมตช์วิเคราะห์</span>
        </div>

        <div class="danish-matches-grid">
          ${matchesHtml}
        </div>

        <!-- Section 2: Standings Table & Scorers -->
        <div class="danish-standings-grid">
          <!-- Standings -->
          <div class="standings-wrap" style="background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:1.4rem;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem;">
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <i class="ri-trophy-line" style="color:#ef4444;font-size:1.2rem;"></i>
                <h3 style="font-size:1.15rem;font-weight:800;color:#fff;">ตารางคะแนน Danish Superliga 2026–27</h3>
              </div>
              <span style="font-size:0.75rem;color:var(--text-dim);">อัปเดต 2 พ.ย. 2026</span>
            </div>
            <div style="overflow-x:auto;">
              <table class="standings-table" style="width:100%;font-size:0.85rem;">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>สโมสร</th>
                    <th>แข่ง</th>
                    <th>ชนะ</th>
                    <th>เสมอ</th>
                    <th>แพ้</th>
                    <th>ได้</th>
                    <th>เสีย</th>
                    <th>ต่าง</th>
                    <th>แต้ม</th>
                    <th>โซน</th>
                  </tr>
                </thead>
                <tbody>
                  ${standingsRows}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Top Scorers -->
          <div class="standings-wrap" style="background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:1.4rem;">
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem;">
              <i class="ri-medal-fill" style="color:var(--accent-gold);font-size:1.2rem;"></i>
              <h3 style="font-size:1.15rem;font-weight:800;color:#fff;">ดาวซัลโวเดนิช ซูเปอร์ลีกา</h3>
            </div>
            <div>
              ${scorersHtml}
            </div>
          </div>
        </div>

        <!-- Section 3: Tier Breakdown & Tactical Insights -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(360px, 1fr));gap:2rem;margin-bottom:3rem;">
          <!-- Tiers -->
          <div class="standings-wrap" style="background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:1.4rem;">
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem;">
              <i class="ri-node-tree" style="color:var(--accent-ucl);font-size:1.2rem;"></i>
              <h3 style="font-size:1.15rem;font-weight:800;color:#fff;">โครงสร้างกลุ่มสโมสร & สไตล์การเล่น (Tier 1–4)</h3>
            </div>
            <div>
              ${tiersHtml}
            </div>
          </div>

          <!-- Tactical Insights -->
          <div class="standings-wrap" style="background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:1.4rem;">
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem;">
              <i class="ri-compass-3-line" style="color:#ef4444;font-size:1.2rem;"></i>
              <h3 style="font-size:1.15rem;font-weight:800;color:#fff;">ข้อสังเกตสำคัญ & สล็อตเวลาเตะ (GMT+7)</h3>
            </div>
            <div>
              ${insightsHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  
  // ==========================================================================
  // ALL LEAGUES & CUPS STANDINGS VIEW IMPLEMENTATION (100% REAL DATA)
  // ==========================================================================
  state.activeStandingsKey = state.activeStandingsKey || 'epl';
  state.standingsSearch = state.standingsSearch || '';

  window.switchStandingsLeague = function(key) {
    state.activeStandingsKey = key;
    state.standingsSearch = '';
    renderStandingsView();
  };

  window.filterStandings = function(val) {
    state.standingsSearch = (val || '').toLowerCase().trim();
    const tbody = document.getElementById('standings-table-body');
    if (!tbody) return;

    const dataObj = getActiveStandingsData();
    if (!dataObj || !dataObj.table) return;

    const filtered = dataObj.table.filter(item => {
      const q = state.standingsSearch;
      if (!q) return true;
      const name = (item.team || '').toLowerCase();
      const thai = (item.thaiName || '').toLowerCase();
      return name.includes(q) || thai.includes(q);
    });

    tbody.innerHTML = renderStandingsRows(filtered, dataObj);
  };

  function getActiveStandingsData() {
    if (typeof ALL_STANDINGS_DATA === 'undefined') return null;
    const key = state.activeStandingsKey;
    if (ALL_STANDINGS_DATA.leagues && ALL_STANDINGS_DATA.leagues[key]) {
      return ALL_STANDINGS_DATA.leagues[key];
    }
    if (ALL_STANDINGS_DATA.cups && ALL_STANDINGS_DATA.cups[key]) {
      return ALL_STANDINGS_DATA.cups[key];
    }
    return ALL_STANDINGS_DATA.leagues.epl;
  }

  function getZoneBadge(zone) {
    if (!zone) return '';
    if (zone === 'ucl' || zone === 'direct16' || zone === 'champ' || zone === 'acl') {
      return 'border-left: 4px solid #10b981; background: rgba(16, 185, 129, 0.05);';
    }
    if (zone === 'playoff' || zone === 'acl2') {
      return 'border-left: 4px solid #00f0ff; background: rgba(0, 240, 255, 0.05);';
    }
    if (zone === 'uel') {
      return 'border-left: 4px solid #f59e0b; background: rgba(245, 158, 11, 0.05);';
    }
    if (zone === 'uecl') {
      return 'border-left: 4px solid #06b6d4; background: rgba(6, 182, 212, 0.05);';
    }
    if (zone === 'relegation' || zone === 'eliminated') {
      return 'border-left: 4px solid #ef4444; background: rgba(239, 68, 68, 0.05);';
    }
    return '';
  }

  function renderStandingsRows(rows, dataObj) {
    if (!rows || rows.length === 0) {
      return `<tr><td colspan="11" style="text-align:center;padding:2.5rem;color:var(--text-dim);">ไม่พบสโมสรที่ตรงกับคำค้นหา</td></tr>`;
    }

    return rows.map((s, idx) => {
      const zoneStyle = getZoneBadge(s.zone);
      const formDots = (s.form || []).map(f => {
        let color = '#6b7280';
        let label = 'D';
        if (f === 'W') { color = '#10b981'; label = 'W'; }
        else if (f === 'L') { color = '#ef4444'; label = 'L'; }
        return `<span style="display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:4px;font-size:0.7rem;font-weight:700;color:#fff;background:${color};">${label}</span>`;
      }).join(' ');

      return `
        <tr style="${zoneStyle}border-bottom:1px solid rgba(255,255,255,0.05);transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.04)'" onmouseout="this.style.background=''">
          <td style="padding:0.75rem 0.6rem;text-align:center;font-weight:800;color:var(--accent-gold);">${s.rank}</td>
          <td style="padding:0.75rem 0.6rem;">
            <div style="display:flex;align-items:center;gap:0.6rem;">
              <div style="font-weight:700;color:#fff;font-size:0.95rem;">${s.team}</div>
              ${s.thaiName && s.thaiName !== s.team ? `<span style="font-size:0.75rem;color:var(--text-dim);">(${s.thaiName})</span>` : ''}
              ${s.country ? `<span style="font-size:0.68rem;padding:0.1rem 0.35rem;border-radius:3px;background:rgba(255,255,255,0.1);color:var(--text-dim);">${s.country}</span>` : ''}
            </div>
          </td>
          <td style="padding:0.75rem 0.5rem;text-align:center;font-weight:600;">${s.played}</td>
          <td style="padding:0.75rem 0.5rem;text-align:center;color:#10b981;">${s.w}</td>
          <td style="padding:0.75rem 0.5rem;text-align:center;color:#9ca3af;">${s.d}</td>
          <td style="padding:0.75rem 0.5rem;text-align:center;color:#ef4444;">${s.l}</td>
          <td style="padding:0.75rem 0.5rem;text-align:center;color:var(--text-dim);">${s.gf}</td>
          <td style="padding:0.75rem 0.5rem;text-align:center;color:var(--text-dim);">${s.ga}</td>
          <td style="padding:0.75rem 0.5rem;text-align:center;font-weight:700;color:${String(s.gd).startsWith('+') ? '#10b981' : (String(s.gd).startsWith('-') ? '#ef4444' : '#fff')};">${s.gd}</td>
          <td style="padding:0.75rem 0.6rem;text-align:center;font-weight:800;font-size:1.05rem;color:var(--accent-gold);">${s.pts}</td>
          <td style="padding:0.75rem 0.6rem;text-align:center;">
            <div style="display:flex;align-items:center;justify-content:center;gap:3px;">
              ${formDots}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderStandingsView() {
    const container = document.getElementById('standings-content-container');
    if (!container) return;

    if (typeof ALL_STANDINGS_DATA === 'undefined') {
      container.innerHTML = '<div style="padding:3rem;text-align:center;color:#fff;">กำลังโหลดข้อมูลตารางคะแนน...</div>';
      return;
    }

    const currentKey = state.activeStandingsKey || 'epl';
    const isDomestic = currentKey === 'domestic';
    const dataObj = getActiveStandingsData();

    // League / Cup selector pills
    const tabs = [
      { key: 'epl', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 พรีเมียร์ลีก', type: 'league' },
      { key: 'ucl', label: '🏆 แชมเปียนส์ลีก (36 ทีม)', type: 'cup' },
      { key: 'laliga', label: '🇪🇸 ลาลีกา', type: 'league' },
      { key: 'seriea', label: '🇮🇹 เซเรียอา', type: 'league' },
      { key: 'bundesliga', label: '🇩🇪 บุนเดสลีกา', type: 'league' },
      { key: 'danish', label: '🇩🇰 เดนิช ซูเปอร์ลีกา', type: 'league' },
      { key: 'thaileague', label: '🇹🇭 ไทยลีก 1', type: 'league' },
      { key: 'uel', label: '🥈 ยูโรปาลีก (36 ทีม)', type: 'cup' },
      { key: 'uecl', label: '🥉 คอนเฟอเรนซ์ลีก', type: 'cup' },
      { key: 'domestic', label: '🥊 บอลถ้วยในประเทศ', type: 'cup' }
    ];

    const pillsHtml = tabs.map(t => {
      const active = t.key === currentKey;
      const border = active ? 'border-color:var(--accent-gold);background:rgba(251,191,36,0.15);color:var(--accent-gold);font-weight:700;' : 'background:rgba(255,255,255,0.05);color:var(--text-dim);border-color:transparent;';
      return `
        <button onclick="switchStandingsLeague('${t.key}')" class="tab-btn" style="padding:0.55rem 1.1rem;border-radius:var(--radius-full);border:1px solid;font-size:0.86rem;cursor:pointer;white-space:nowrap;transition:all 0.2s;${border}">
          ${t.label}
        </button>
      `;
    }).join('');

    let mainContentHtml = '';

    if (isDomestic) {
      // Domestic Cup View
      const domData = ALL_STANDINGS_DATA.cups.domestic;
      const tourneys = domData.tournaments || [];

      mainContentHtml = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:1.5rem;margin-top:1.5rem;">
          ${tourneys.map(trn => `
            <div style="background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:1.4rem;">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.8rem;">
                <div>
                  <h3 style="font-size:1.15rem;font-weight:800;color:#fff;">${trn.thaiName || trn.name}</h3>
                  <span style="font-size:0.8rem;color:var(--accent-gold);">${trn.country} • ${trn.round}</span>
                </div>
                <span class="badge badge-ucl">${trn.status}</span>
              </div>

              ${trn.recentResults ? `
                <div style="margin-top:0.8rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:var(--radius-md);padding:0.8rem;">
                  <div style="font-size:0.75rem;color:var(--text-dim);margin-bottom:0.3rem;"><i class="ri-history-line"></i> ผลการแข่งขันล่าสุด:</div>
                  <div style="font-size:0.88rem;color:#fff;line-height:1.4;">${trn.recentResults}</div>
                </div>
              ` : ''}

              ${trn.matches && trn.matches.length > 0 ? `
                <div style="margin-top:1rem;">
                  <div style="font-size:0.8rem;font-weight:700;color:#fff;margin-bottom:0.5rem;"><i class="ri-calendar-event-line"></i> โปรแกรมประกบคู่แข่งขัน:</div>
                  <div style="display:flex;flex-direction:column;gap:0.5rem;">
                    ${trn.matches.map(m => `
                      <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.05);border-radius:var(--radius-sm);padding:0.6rem 0.8rem;">
                        <span style="font-weight:700;color:#fff;font-size:0.88rem;">${m.home} vs ${m.away}</span>
                        <span style="font-size:0.75rem;color:var(--accent-cyan);">${m.date}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              ${trn.notes ? `
                <div style="margin-top:0.8rem;font-size:0.82rem;color:var(--text-dim);font-style:italic;">
                  ℹ️ ${trn.notes}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      `;
    } else if (dataObj && dataObj.table) {
      // Standard League or 36-team Cup Table
      const filtered = dataObj.table.filter(item => {
        const q = state.standingsSearch;
        if (!q) return true;
        const name = (item.team || '').toLowerCase();
        const thai = (item.thaiName || '').toLowerCase();
        return name.includes(q) || thai.includes(q);
      });

      // Zones Legend
      let zonesLegend = '';
      if (dataObj.zones) {
        zonesLegend = Object.entries(dataObj.zones).map(([k, desc]) => {
          let dotColor = '#6b7280';
          if (k === 'ucl' || k === 'direct16' || k === 'champ' || k === 'acl') dotColor = '#10b981';
          else if (k === 'playoff' || k === 'acl2') dotColor = '#00f0ff';
          else if (k === 'uel') dotColor = '#f59e0b';
          else if (k === 'uecl') dotColor = '#06b6d4';
          else if (k === 'relegation' || k === 'eliminated') dotColor = '#ef4444';
          return `
            <div style="display:inline-flex;align-items:center;gap:0.4rem;font-size:0.75rem;color:var(--text-dim);margin-right:1rem;margin-top:0.4rem;">
              <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${dotColor};"></span>
              <span>${desc}</span>
            </div>
          `;
        }).join('');
      }

      // Top Scorers Block
      let scorersHtml = '';
      if (dataObj.topScorers && dataObj.topScorers.length > 0) {
        scorersHtml = `
          <div style="margin-top:2rem;background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:1.4rem;">
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem;">
              <i class="ri-fire-fill" style="color:var(--accent-gold);font-size:1.3rem;"></i>
              <h3 style="font-size:1.15rem;font-weight:800;color:#fff;">ดาวซัลโวสูงสุด (Top Scorers) • ${dataObj.thaiName || dataObj.name}</h3>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:0.8rem;">
              ${dataObj.topScorers.map((sc, i) => `
                <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:var(--radius-md);padding:0.75rem 1rem;">
                  <div>
                    <div style="font-weight:800;color:#fff;font-size:0.92rem;">#${i+1} ${sc.name}</div>
                    <div style="font-size:0.78rem;color:var(--text-dim);">${sc.team}</div>
                  </div>
                  <div style="font-size:1.25rem;font-weight:800;color:var(--accent-gold);">${sc.goals} <span style="font-size:0.75rem;color:var(--text-dim);font-weight:400;">ประตู</span></div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      mainContentHtml = `
        <div style="margin-top:1.5rem;background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);overflow:hidden;">
          <div style="padding:1.2rem 1.4rem;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
            <div>
              <div style="display:flex;align-items:center;gap:0.6rem;">
                <span style="font-size:1.6rem;">${dataObj.flag || dataObj.badge || '🏆'}</span>
                <div>
                  <h3 style="font-size:1.3rem;font-weight:800;color:#fff;">${dataObj.name}</h3>
                  <div style="font-size:0.82rem;color:var(--accent-gold);">${dataObj.thaiName || ''} • ฤดูกาล ${dataObj.season} (${dataObj.matchday}) • ${dataObj.totalTeams} ทีม</div>
                </div>
              </div>
            </div>

            <!-- Search box -->
            <div style="position:relative;width:260px;">
              <i class="ri-search-line" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-dim);"></i>
              <input type="text" placeholder="ค้นหาชื่อทีม..." oninput="window.filterStandings(this.value)" value="${state.standingsSearch || ''}" style="width:100%;padding:0.45rem 0.8rem 0.45rem 2.2rem;border-radius:var(--radius-full);background:rgba(0,0,0,0.3);border:1px solid var(--border-light);color:#fff;font-size:0.85rem;outline:none;">
            </div>
          </div>

          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;font-size:0.88rem;white-space:nowrap;">
              <thead>
                <tr style="background:rgba(255,255,255,0.03);border-bottom:1px solid var(--border-subtle);color:var(--text-dim);font-size:0.8rem;text-transform:uppercase;">
                  <th style="padding:0.8rem 0.6rem;text-align:center;width:40px;">#</th>
                  <th style="padding:0.8rem 0.6rem;text-align:left;">สโมสร</th>
                  <th style="padding:0.8rem 0.5rem;text-align:center;width:50px;">แข่ง</th>
                  <th style="padding:0.8rem 0.5rem;text-align:center;width:45px;">ชนะ</th>
                  <th style="padding:0.8rem 0.5rem;text-align:center;width:45px;">เสมอ</th>
                  <th style="padding:0.8rem 0.5rem;text-align:center;width:45px;">แพ้</th>
                  <th style="padding:0.8rem 0.5rem;text-align:center;width:50px;">ได้</th>
                  <th style="padding:0.8rem 0.5rem;text-align:center;width:50px;">เสีย</th>
                  <th style="padding:0.8rem 0.5rem;text-align:center;width:55px;">+/-</th>
                  <th style="padding:0.8rem 0.6rem;text-align:center;width:60px;">แต้ม</th>
                  <th style="padding:0.8rem 0.6rem;text-align:center;width:130px;">ฟอร์ม 5 นัด</th>
                </tr>
              </thead>
              <tbody id="standings-table-body">
                ${renderStandingsRows(filtered, dataObj)}
              </tbody>
            </table>
          </div>

          ${zonesLegend ? `
            <div style="padding:1rem 1.4rem;background:rgba(0,0,0,0.2);border-top:1px solid var(--border-subtle);display:flex;flex-wrap:wrap;align-items:center;">
              <span style="font-size:0.8rem;font-weight:700;color:#fff;margin-right:1rem;">ความหมายแถบสี:</span>
              ${zonesLegend}
            </div>
          ` : ''}
        </div>

        ${scorersHtml}
      `;
    }

    container.innerHTML = `
      <div class="container" style="padding-top:2.5rem;padding-bottom:5rem;">
        <!-- Header -->
        <div style="margin-bottom:2rem;text-align:center;">
          <div style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.35rem 1rem;background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.25);border-radius:var(--radius-full);color:var(--accent-gold);font-size:0.85rem;font-weight:700;margin-bottom:0.75rem;">
            <i class="ri-table-fill"></i> ศูนย์รวมตารางคะแนนมาตรฐาน ข้อมูลเท็จจริง 100%
          </div>
          <h1 style="font-size:2.2rem;font-weight:900;color:#fff;margin-bottom:0.5rem;line-height:1.2;">
            ตารางคะแนนฟุตบอลทุกลีก & บอลถ้วย ฤดูกาล 2026–27
          </h1>
          <p style="font-size:0.95rem;color:var(--text-dim);max-width:750px;margin:0 auto;">
            รวบรวมอันดับคะแนนจริง สถิติประตูได้-เสีย ฟอร์มการเล่นล่าสุด และโซนโควต้า ยูฟ่า แชมเปียนส์ลีก / ยูโรปาลีก / หนีตกชั้น ทั้ง 5 ลีกใหญ่, ซูเปอร์ลีกา เดนมาร์ก, ไทยลีก 1 และบอลถ้วยยุโรป 36 ทีมเต็มตาราง
          </p>
        </div>

        <!-- League / Cup Tabs -->
        <div style="display:flex;gap:0.5rem;overflow-x:auto;padding-bottom:0.6rem;margin-bottom:1rem;justify-content:flex-start;scrollbar-width:none;">
          ${pillsHtml}
        </div>

        <!-- Main Dynamic Table or Cup Content -->
        ${mainContentHtml}
      </div>
    `;
  }

  
  window.filterAuditMatches = function(f) {
    state.activeAuditFilter = f;
    renderAuditView();
  };

  function renderAuditView() {
    const container = document.getElementById('audit-content-container');
    if (!container) return;

    if (typeof POST_MATCH_AUDIT_DATA === 'undefined') {
      container.innerHTML = '<div style="padding:4rem;text-align:center;color:#fff;">กำลังโหลดข้อมูล Post-Match Audit...</div>';
      return;
    }

    const d = POST_MATCH_AUDIT_DATA;
    const filter = state.activeAuditFilter || 'all';

    const filteredMatches = d.matches.filter(m => {
      if (filter === 'exact') return m.exactScoreHit;
      if (filter === 'correct') return m.status === 'correct' || m.status === 'exact';
      if (filter === 'wrong') return m.status === 'wrong';
      if (filter === 'outlier') return m.matchId === 'UCL-2026-MD4-07';
      return true;
    });

    const kpiCardsHtml = d.kpiSummary.map(k => `
      <div style="background:var(--bg-card);border:1px solid rgba(255,255,255,0.08);border-radius:var(--radius-lg);padding:1.4rem;box-shadow:0 8px 25px rgba(0,0,0,0.4);border-top:3px solid ${k.color};transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform=''">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.6rem;">
          <span style="font-size:0.85rem;color:var(--text-dim);font-weight:600;">${k.label}</span>
          <i class="${k.icon}" style="color:${k.color};font-size:1.3rem;"></i>
        </div>
        <div style="font-size:2.2rem;font-weight:900;color:${k.color};line-height:1;margin-bottom:0.4rem;">${k.value}</div>
        <div style="font-size:0.78rem;color:var(--text-muted);">${k.sub}</div>
      </div>
    `).join('');

    const filterTabs = [
      { key: 'all', label: `ทั้งหมด (${d.matches.length} คู่)` },
      { key: 'exact', label: `สกอร์ตรงเป๊ะ 🎯 (${d.matches.filter(m=>m.exactScoreHit).length} คู่)` },
      { key: 'correct', label: `ทายผล 1X2 ถูก ✅ (${d.matches.filter(m=>m.status==='correct'||m.status==='exact').length} คู่)` },
      { key: 'wrong', label: `ทายผลผิด ⚠️ (${d.matches.filter(m=>m.status==='wrong').length} คู่)` },
      { key: 'outlier', label: `คู่หลุดโลก Outlier ⚡ (1 คู่)` }
    ];

    const filterPillsHtml = filterTabs.map(t => {
      const active = t.key === filter;
      const border = active ? 'border-color:var(--accent-gold);background:rgba(251,191,36,0.18);color:var(--accent-gold);font-weight:800;' : 'background:rgba(255,255,255,0.05);color:var(--text-dim);border-color:transparent;';
      return `
        <button onclick="window.filterAuditMatches('${t.key}')" class="tab-btn" style="padding:0.5rem 1.1rem;border-radius:var(--radius-full);border:1px solid;font-size:0.85rem;cursor:pointer;white-space:nowrap;transition:all 0.2s;${border}">
          ${t.label}
        </button>
      `;
    }).join('');

    const matchCardsHtml = filteredMatches.map(m => {
      const isExact = m.exactScoreHit;
      const isWrong = m.status === 'wrong';
      const borderColor = isExact ? '#fbbf24' : (isWrong ? '#ef4444' : '#10b981');
      const badgeClass = isExact ? 'badge-gold' : (isWrong ? 'badge-red' : 'badge-green');
      const icon = isExact ? 'ri-crosshair-2-line' : (isWrong ? 'ri-close-circle-line' : 'ri-checkbox-circle-line');

      return `
        <div style="background:var(--bg-card);border:1px solid rgba(255,255,255,0.08);border-left:4px solid ${borderColor};border-radius:var(--radius-lg);padding:1.4rem;box-shadow:0 8px 24px rgba(0,0,0,0.35);margin-bottom:1.25rem;">
          <!-- Top Row -->
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;margin-bottom:1rem;border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:0.8rem;">
            <div style="display:flex;align-items:center;gap:0.6rem;">
              <span style="font-size:0.75rem;font-weight:800;color:var(--accent-gold);background:rgba(251,191,36,0.12);padding:0.2rem 0.55rem;border-radius:var(--radius-sm);">${m.matchId}</span>
              <h3 style="font-size:1.15rem;font-weight:800;color:#fff;margin:0;">${m.match}</h3>
            </div>
            <div style="display:flex;align-items:center;gap:0.5rem;">
              <span class="badge ${badgeClass}" style="font-size:0.82rem;padding:0.3rem 0.75rem;font-weight:800;">
                <i class="${icon}"></i> ${m.statusLabel}
              </span>
              <span style="font-size:0.78rem;font-weight:700;color:${m.betResult.startsWith('+') ? '#10b981' : '#ef4444'};background:rgba(0,0,0,0.3);padding:0.25rem 0.6rem;border-radius:var(--radius-sm);border:1px solid rgba(255,255,255,0.08);">
                ผลเดิมพันจำลอง: ${m.betResult}
              </span>
            </div>
          </div>

          <!-- Score Comparison Center Stage -->
          <div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:1.5rem;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.05);border-radius:var(--radius-md);padding:1.2rem;margin-bottom:1.2rem;">
            <!-- Home Team -->
            <div style="display:flex;align-items:center;gap:0.8rem;">
              <img src="${m.homeLogo}" alt="${m.homeTeam}" style="width:40px;height:40px;object-fit:contain;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6));">
              <div>
                <div style="font-weight:800;color:#fff;font-size:1rem;">${m.homeTeam}</div>
                <div style="font-size:0.75rem;color:var(--text-dim);">เจ้าบ้าน</div>
              </div>
            </div>

            <!-- Scores Box -->
            <div style="text-align:center;">
              <div style="display:flex;align-items:center;gap:1rem;justify-content:center;">
                <div style="text-align:center;">
                  <div style="font-size:0.7rem;color:var(--text-dim);font-weight:700;margin-bottom:0.2rem;">ทำนายไว้เดิม</div>
                  <div style="font-size:1.35rem;font-weight:800;color:var(--accent-gold);background:rgba(251,191,36,0.12);padding:0.2rem 0.8rem;border-radius:var(--radius-sm);border:1px solid rgba(251,191,36,0.3);">${m.predictedScore}</div>
                </div>
                <div style="font-size:1.1rem;color:var(--text-muted);font-weight:700;">VS</div>
                <div style="text-align:center;">
                  <div style="font-size:0.7rem;color:#10b981;font-weight:800;margin-bottom:0.2rem;">ผลการแข่งจริง (FT)</div>
                  <div style="font-size:1.5rem;font-weight:900;color:#fff;background:${isExact ? 'rgba(251,191,36,0.25)' : 'rgba(16,185,129,0.25)'};padding:0.2rem 0.9rem;border-radius:var(--radius-sm);border:2px solid ${isExact ? '#fbbf24' : '#10b981'};box-shadow:0 0 15px ${isExact ? 'rgba(251,191,36,0.3)' : 'rgba(16,185,129,0.3)'};">${m.actualScore}</div>
                </div>
              </div>
              <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.4rem;">
                คลาดเคลื่อนประตูรวม: <strong style="color:#fff;">${m.errorGoals}</strong>
              </div>
            </div>

            <!-- Away Team -->
            <div style="display:flex;align-items:center;gap:0.8rem;justify-content:flex-end;text-align:right;">
              <div>
                <div style="font-weight:800;color:#fff;font-size:1rem;">${m.awayTeam}</div>
                <div style="font-size:0.75rem;color:var(--text-dim);">ทีมเยือน</div>
              </div>
              <img src="${m.awayLogo}" alt="${m.awayTeam}" style="width:40px;height:40px;object-fit:contain;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6));">
            </div>
          </div>

          <!-- Analysis & Root Cause Cards -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1rem;font-size:0.85rem;line-height:1.6;">
            <!-- Root Cause / สิ่งที่เกิดขึ้นจริง -->
            <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:var(--radius-md);padding:0.9rem 1rem;">
              <strong style="color:${isWrong ? '#ef4444' : (isExact ? '#fbbf24' : '#10b981')};display:flex;align-items:center;gap:0.4rem;margin-bottom:0.35rem;">
                <i class="ri-search-eye-line"></i> สิ่งที่เกิดขึ้นจริง & สาเหตุ (Root Cause):
              </strong>
              <p style="color:var(--text-main);margin:0;">${m.rootCause}</p>
            </div>

            <!-- Lesson Learned -->
            <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:var(--radius-md);padding:0.9rem 1rem;">
              <strong style="color:var(--accent-cyan);display:flex;align-items:center;gap:0.4rem;margin-bottom:0.35rem;">
                <i class="ri-lightbulb-flash-line"></i> บทเรียนเพื่อปรับปรุงโมเดล (Lesson Learned):
              </strong>
              <p style="color:var(--text-main);margin:0;">${m.lesson}</p>
            </div>
          </div>

          <!-- Bottom Footer Info -->
          <div style="margin-top:0.8rem;font-size:0.76rem;color:var(--text-dim);display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;padding-top:0.6rem;border-top:1px solid rgba(255,255,255,0.04);">
            <span>ราคาตลาดก่อนแข่ง: <strong>${m.preMatchOdds}</strong></span>
            <span>ทำนายผู้ชนะ: <strong>${m.predictedWinner}</strong> | ผู้ชนะจริง: <strong style="color:#fff;">${m.actualWinner}</strong></span>
          </div>
        </div>
      `;
    }).join('');

    const lessonsHtml = d.lessonsLearned.map(l => `
      <div style="background:var(--bg-card);border:1px solid rgba(255,255,255,0.08);border-radius:var(--radius-md);padding:1.2rem;">
        <h4 style="font-size:0.98rem;font-weight:800;color:var(--accent-gold);margin-bottom:0.4rem;">${l.title}</h4>
        <p style="font-size:0.86rem;color:var(--text-muted);line-height:1.6;margin:0;">${l.desc}</p>
      </div>
    `).join('');

    const rulesHtml = d.rulesForNextMatch.map(r => `
      <div style="display:flex;align-items:flex-start;gap:0.6rem;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:var(--radius-md);padding:0.9rem 1.1rem;">
        <i class="ri-checkbox-circle-fill" style="color:#10b981;font-size:1.1rem;margin-top:0.1rem;flex-shrink:0;"></i>
        <span style="font-size:0.88rem;color:#fff;font-weight:600;line-height:1.5;">${r}</span>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="container" style="padding-top:2.5rem;padding-bottom:5rem;">
        <!-- Top Hero Navigation -->
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:2rem;">
          <button class="btn-back" onclick="switchLeagueCategory('ucl')" style="display:flex;align-items:center;gap:0.5rem;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);color:#fff;padding:0.6rem 1.2rem;border-radius:var(--radius-full);cursor:pointer;font-size:0.85rem;font-weight:700;">
            <i class="ri-arrow-left-line"></i> กลับสู่หน้าวิเคราะห์ UCL
          </button>
          <div style="display:flex;gap:0.75rem;">
            <a href="learning_database.json" download="learning_database.json" style="text-decoration:none;display:flex;align-items:center;gap:0.4rem;background:rgba(251,191,36,0.12);border:1px solid rgba(251,191,36,0.3);color:var(--accent-gold);padding:0.55rem 1.1rem;border-radius:var(--radius-full);font-size:0.82rem;font-weight:700;">
              <i class="ri-download-2-line"></i> โหลด JSON ฐานข้อมูล
            </a>
            <a href="learning_database.csv" download="learning_database.csv" style="text-decoration:none;display:flex;align-items:center;gap:0.4rem;background:rgba(0,240,255,0.12);border:1px solid rgba(0,240,255,0.3);color:var(--accent-cyan);padding:0.55rem 1.1rem;border-radius:var(--radius-full);font-size:0.82rem;font-weight:700;">
              <i class="ri-file-excel-line"></i> โหลด CSV
            </a>
          </div>
        </div>

        <!-- Section Title & Intro -->
        <div style="background:var(--bg-card);border:1px solid rgba(255,255,255,0.08);border-radius:var(--radius-lg);padding:2rem;margin-bottom:2rem;position:relative;overflow:hidden;">
          <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.6rem;">
            <span class="badge badge-green" style="font-size:0.78rem;font-weight:800;padding:0.25rem 0.75rem;">
              <i class="ri-shield-check-line"></i> POST-MATCH VERIFICATION & CONTINUOUS LEARNING
            </span>
            <span style="font-size:0.8rem;color:var(--text-dim);">${d.matchday} • วันที่ตรวจสอบ: ${d.auditDate}</span>
          </div>
          <h1 style="font-size:1.85rem;font-weight:900;color:#fff;margin-bottom:0.7rem;line-height:1.3;">
            ระบบประเมินผลหลังการแข่งขัน & <span class="highlight-gold">บันทึกข้อผิดพลาดจริง (AI Audit)</span>
          </h1>
          <p style="font-size:0.95rem;color:var(--text-muted);line-height:1.7;max-width:880px;margin:0;">
            ระบบตรวจสอบความถูกต้องแบบโปร่งใส 100% เปรียบเทียบผลที่ AI ทำนายไว้เดิมกับผลการแข่งขันจริงที่เกิดขึ้นจาก UEFA วิเคราะห์เจาะลึก Root Cause สาเหตุที่ทำนายผิด สรุปดัชนีความแม่นยำ พร้อมบันทึกกฎเหล็กเพื่อปรับปรุงคุณภาพการทำนายอย่างเป็นรูปธรรม
          </p>
        </div>

        <!-- 6 KPI Scorecards Grid -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:1.2rem;margin-bottom:2.5rem;">
          ${kpiCardsHtml}
        </div>

        <!-- Match Filter Tabs -->
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;">
          <div>
            <h2 style="font-size:1.4rem;font-weight:900;color:#fff;">กระดานเปรียบเทียบผลจริงรายคู่ (9 Matches Audit Board)</h2>
            <p style="font-size:0.84rem;color:var(--text-muted);">คลิกเลือกดูตามผลลัพธ์เพื่อตรวจสอบจุดที่ทำนายแม่นยำและจุดที่เกิดข้อผิดพลาด</p>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            ${filterPillsHtml}
          </div>
        </div>

        <!-- Match Cards Stream -->
        <div style="margin-bottom:3.5rem;">
          ${matchCardsHtml}
        </div>

        <!-- Continuous Learning: 4 Key Lessons -->
        <div style="margin-bottom:3rem;">
          <div style="margin-bottom:1.2rem;">
            <h3 style="font-size:1.35rem;font-weight:900;color:#fff;">4 บทเรียนหลักที่ได้จากการแข่งขัน (Root Cause Takeaways)</h3>
            <p style="font-size:0.84rem;color:var(--text-muted);">ข้อสรุปเชิงโครงสร้างจากผลการแข่งขันจริง เพื่อนำไปปรับปรุงตรรกะของอัลกอริทึม</p>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(270px, 1fr));gap:1.2rem;">
            ${lessonsHtml}
          </div>
        </div>

        <!-- Rules for Next Matchday (Anti-Overfitting Directive) -->
        <div style="background:var(--bg-card);border:1px solid rgba(16,185,129,0.3);border-radius:var(--radius-lg);padding:1.8rem;margin-bottom:3rem;box-shadow:0 0 30px rgba(16,185,129,0.08);">
          <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.7rem;">
            <i class="ri-shield-star-line" style="color:#10b981;font-size:1.4rem;"></i>
            <h3 style="font-size:1.25rem;font-weight:900;color:#fff;margin:0;">กฎเหล็ก 4 ข้อสำหรับวิเคราะห์การแข่งขันรอบถัดไป (Next Analysis Rules)</h3>
          </div>
          <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:1.2rem;">
            ภายใต้มาตรการ Anti-Overfitting Protocol: ห้ามปรับโมเดลตามเกมผิดปกติเพียงนัดเดียว และต้องบังคับใช้กฎเหล่านี้ใน Matchday 5 เป็นต้นไป
          </p>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:0.85rem;">
            ${rulesHtml}
          </div>
        </div>

        <!-- Bottom Return Button -->
        <div style="text-align:center;padding:2rem 0;">
          <button onclick="switchLeagueCategory('ucl')" class="btn-hero-primary" style="padding:0.75rem 2.2rem;font-size:0.95rem;background:linear-gradient(135deg, #10b981 0%, #059669 100%);color:#000;font-weight:800;border:none;border-radius:var(--radius-full);cursor:pointer;box-shadow:0 0 25px rgba(16,185,129,0.4);">
            <i class="ri-arrow-left-line"></i> กลับสู่หน้าหลักการแข่งขัน
          </button>
        </div>
      </div>
    `;
  }

  
  window.filterUelMatches = function(filter) {
    state.activeUelFilter = filter;
    renderUelView();
  };

  window.searchUelMatches = function(q) {
    state.uelSearchQuery = q;
    renderUelView();
  };

  function renderUelView() {
    const container = document.getElementById('uel-content-container');
    if (!container) return;

    if (typeof UEL_DATA === 'undefined') {
      container.innerHTML = '<div style="padding:4rem;text-align:center;color:#fff;">กำลังโหลดข้อมูล UEFA Europa League...</div>';
      return;
    }

    const d = UEL_DATA;
    const filter = state.activeUelFilter || 'all';
    const q = (state.uelSearchQuery || '').toLowerCase().trim();

    // 1. Curated Low-Risk Showcase Cards
    const curatedCardsHtml = d.curatedLowRisk.map(c => `
      <div style="background:var(--bg-card);border:1px solid rgba(16,185,129,0.35);border-top:4px solid #10b981;border-radius:var(--radius-lg);padding:1.3rem;box-shadow:0 8px 24px rgba(0,0,0,0.4);position:relative;overflow:hidden;transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform=''">
        <div style="position:absolute;right:-15px;top:-15px;width:70px;height:70px;background:rgba(16,185,129,0.1);border-radius:50%;display:flex;align-items:flex-end;justify-content:flex-start;padding:12px;font-size:1.4rem;">
          ⭐
        </div>
        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.6rem;">
          <span style="font-size:0.75rem;font-weight:900;color:#000;background:#10b981;padding:0.15rem 0.6rem;border-radius:var(--radius-full);">อันดับ ${c.rank}</span>
          <span class="badge ${c.badge}" style="font-size:0.72rem;padding:0.2rem 0.5rem;font-weight:800;">${c.risk}</span>
          <span style="font-size:0.75rem;color:var(--text-dim);margin-left:auto;"><i class="ri-time-line"></i> ${c.time}</span>
        </div>
        <h3 style="font-size:1.15rem;font-weight:900;color:#fff;margin-bottom:0.4rem;">${c.match}</h3>
        <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:var(--radius-sm);padding:0.65rem 0.8rem;margin-bottom:0.7rem;">
          <div style="font-size:0.72rem;color:#10b981;font-weight:800;text-transform:uppercase;margin-bottom:0.2rem;">ตัวเลือกแนะนำความเสี่ยงต่ำ:</div>
          <div style="font-size:0.95rem;font-weight:900;color:#fff;">${c.pick}</div>
        </div>
        <div style="font-size:0.8rem;color:var(--text-muted);line-height:1.5;margin-bottom:0.6rem;">
          <strong>สกอร์คาดการณ์:</strong> <span style="color:var(--accent-gold);font-weight:800;">${c.score}</span>
        </div>
        <div style="font-size:0.8rem;color:var(--text-dim);line-height:1.4;background:rgba(0,0,0,0.25);border-radius:var(--radius-sm);padding:0.5rem 0.7rem;">
          <i class="ri-shield-check-line" style="color:#10b981;"></i> ${c.reasons}
        </div>
      </div>
    `).join('');

    // 2. Filter matches
    const filteredMatches = d.matches.filter(m => {
      if (filter === 'low-risk' && !m.isCuratedLowRisk) return false;
      if (filter === '0045' && m.kickoffSlot !== '00:45') return false;
      if (filter === '0300' && m.kickoffSlot !== '03:00') return false;

      if (q !== '') {
        const title = m.matchTitle.toLowerCase();
        const home = m.homeTeam.name.toLowerCase() + ' ' + (m.homeTeam.thaiName || '').toLowerCase();
        const away = m.awayTeam.name.toLowerCase() + ' ' + (m.awayTeam.thaiName || '').toLowerCase();
        const std = (m.stadium || '').toLowerCase();
        if (!title.includes(q) && !home.includes(q) && !away.includes(q) && !std.includes(q)) {
          return false;
        }
      }
      return true;
    });

    // 3. Summary Table Rows (All 17 matches)
    const summaryRowsHtml = d.matches.map(m => {
      const riskClass = m.riskLevel.includes('ต่ำ') ? 'badge-green' : (m.riskLevel.includes('ปานกลาง') ? 'badge-gold' : 'badge-red');
      const star = m.isCuratedLowRisk ? '<span style="color:#fbbf24;font-size:0.9rem;" title="คู่เด่นความเสี่ยงต่ำ">⭐</span> ' : '';
      return `
        <tr style="border-bottom:1px solid rgba(255,255,255,0.05);transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.04)'" onmouseout="this.style.background=''">
          <td style="padding:0.75rem 0.6rem;text-align:center;font-weight:800;color:var(--accent-gold);">${m.kickoffSlot} น.</td>
          <td style="padding:0.75rem 0.8rem;">
            <div style="font-weight:800;color:#fff;font-size:0.95rem;">
              ${star}${m.matchTitle}
            </div>
            <div style="font-size:0.75rem;color:var(--text-dim);">${m.homeTeam.thaiName} พบ ${m.awayTeam.thaiName}</div>
          </td>
          <td style="padding:0.75rem 0.6rem;text-align:center;">
            <span style="font-weight:700;color:#fff;">${m.uelStats.homePts}</span> <span style="color:var(--text-dim);">-</span> <span style="font-weight:700;color:#fff;">${m.uelStats.awayPts}</span>
          </td>
          <td style="padding:0.75rem 0.6rem;text-align:center;font-size:0.8rem;color:var(--text-muted);">
            <span>${m.uelStats.homeForm}</span> <span style="color:var(--text-dim);">vs</span> <span>${m.uelStats.awayForm}</span>
          </td>
          <td style="padding:0.75rem 0.6rem;text-align:center;">
            <span style="font-weight:800;color:var(--accent-gold);background:rgba(251,191,36,0.1);padding:0.2rem 0.6rem;border-radius:var(--radius-sm);">${m.predictedScore}</span>
          </td>
          <td style="padding:0.75rem 0.8rem;font-size:0.85rem;color:#fff;">
            <strong>${m.marketOdds.mainPick || '-'}</strong>
          </td>
          <td style="padding:0.75rem 0.6rem;text-align:center;">
            <span class="badge ${riskClass}" style="font-size:0.72rem;padding:0.2rem 0.6rem;font-weight:800;">${m.riskLevel}</span>
          </td>
        </tr>
      `;
    }).join('');

    // 4. Match Cards Stream (Filtered)
    const matchCardsHtml = filteredMatches.map(m => {
      const riskClass = m.riskLevel.includes('ต่ำ') ? 'badge-green' : (m.riskLevel.includes('ปานกลาง') ? 'badge-gold' : 'badge-red');
      const starPill = m.isCuratedLowRisk ? `
        <span style="background:rgba(251,191,36,0.15);border:1px solid rgba(251,191,36,0.4);color:var(--accent-gold);font-size:0.72rem;font-weight:800;padding:0.2rem 0.6rem;border-radius:var(--radius-full);display:flex;align-items:center;gap:0.3rem;">
          ⭐ คู่เด่นความเสี่ยงต่ำ
        </span>
      ` : '';

      return `
        <div style="background:var(--bg-card);border:1px solid rgba(255,255,255,0.08);border-left:4px solid ${m.isCuratedLowRisk ? '#10b981' : 'rgba(255,255,255,0.2)'};border-radius:var(--radius-lg);padding:1.4rem;box-shadow:0 8px 25px rgba(0,0,0,0.35);margin-bottom:1.4rem;">
          <!-- Card Header -->
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.6rem;margin-bottom:1rem;border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:0.75rem;">
            <div style="display:flex;align-items:center;gap:0.6rem;flex-wrap:wrap;">
              <span style="font-size:0.75rem;font-weight:900;color:var(--accent-gold);background:rgba(251,191,36,0.12);padding:0.2rem 0.6rem;border-radius:var(--radius-sm);">คู่ที่ ${m.matchNumber}</span>
              <h3 style="font-size:1.2rem;font-weight:900;color:#fff;margin:0;">${m.matchTitle}</h3>
              ${starPill}
            </div>
            <div style="display:flex;align-items:center;gap:0.6rem;">
              <span style="font-size:0.8rem;color:var(--text-dim);"><i class="ri-time-line"></i> ${m.kickoffSlot} น.</span>
              <span class="badge ${riskClass}" style="font-size:0.76rem;padding:0.25rem 0.65rem;font-weight:800;">${m.riskLevel}</span>
            </div>
          </div>

          <!-- Stadium & Managers Line -->
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.8rem;font-size:0.8rem;color:var(--text-muted);background:rgba(0,0,0,0.25);border-radius:var(--radius-sm);padding:0.6rem 0.9rem;margin-bottom:1rem;">
            <div><i class="ri-map-pin-line" style="color:var(--accent-gold);"></i> ${m.stadium}</div>
            <div style="display:flex;gap:1.2rem;">
              <span>กุนซือ ${m.homeTeam.name}: <strong style="color:#fff;">${m.homeTeam.manager}</strong></span>
              <span>กุนซือ ${m.awayTeam.name}: <strong style="color:#fff;">${m.awayTeam.manager}</strong></span>
            </div>
          </div>

          <!-- Stats & Predicted Score Stage -->
          <div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:1.2rem;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:var(--radius-md);padding:1.1rem;margin-bottom:1.1rem;">
            <!-- Home Team -->
            <div>
              <div style="font-size:1.05rem;font-weight:900;color:#fff;">${m.homeTeam.name}</div>
              <div style="font-size:0.75rem;color:var(--text-dim);">${m.homeTeam.thaiName} (${m.homeTeam.country})</div>
              <div style="font-size:0.8rem;color:var(--accent-gold);margin-top:0.3rem;">
                แต้ม: <strong>${m.uelStats.homePts}</strong> | ประตู: <strong>${m.uelStats.homeGf}-${m.uelStats.homeGa}</strong> | ฟอร์ม: <strong>${m.uelStats.homeForm}</strong>
              </div>
            </div>

            <!-- Score Box -->
            <div style="text-align:center;">
              <div style="font-size:0.7rem;color:var(--text-dim);font-weight:700;margin-bottom:0.2rem;">สกอร์คาดการณ์</div>
              <div style="font-size:1.5rem;font-weight:900;color:var(--accent-gold);background:rgba(251,191,36,0.12);padding:0.25rem 0.9rem;border-radius:var(--radius-sm);border:1px solid rgba(251,191,36,0.3);box-shadow:0 0 15px rgba(251,191,36,0.2);">
                ${m.predictedScore}
              </div>
              <div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.3rem;">ความน่าจะเป็น: ${m.winProbability.home}% / ${m.winProbability.draw}% / ${m.winProbability.away}%</div>
            </div>

            <!-- Away Team -->
            <div style="text-align:right;">
              <div style="font-size:1.05rem;font-weight:900;color:#fff;">${m.awayTeam.name}</div>
              <div style="font-size:0.75rem;color:var(--text-dim);">${m.awayTeam.thaiName} (${m.awayTeam.country})</div>
              <div style="font-size:0.8rem;color:var(--accent-cyan);margin-top:0.3rem;">
                แต้ม: <strong>${m.uelStats.awayPts}</strong> | ประตู: <strong>${m.uelStats.awayGf}-${m.uelStats.awayGa}</strong> | ฟอร์ม: <strong>${m.uelStats.awayForm}</strong>
              </div>
            </div>
          </div>

          <!-- Team News & Tactical Breakdown -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:0.9rem;font-size:0.84rem;line-height:1.6;margin-bottom:1rem;">
            <div style="background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.05);border-radius:var(--radius-md);padding:0.85rem 1rem;">
              <strong style="color:#ef4444;display:flex;align-items:center;gap:0.4rem;margin-bottom:0.3rem;">
                <i class="ri-user-unfollow-line"></i> ข่าวความพร้อม & ผู้เล่นบาดเจ็บ:
              </strong>
              <div style="margin-bottom:0.3rem;"><strong>${m.homeTeam.name}:</strong> ${m.teamNews.home}</div>
              <div><strong>${m.awayTeam.name}:</strong> ${m.teamNews.away}</div>
            </div>

            <div style="background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.05);border-radius:var(--radius-md);padding:0.85rem 1rem;">
              <strong style="color:var(--accent-cyan);display:flex;align-items:center;gap:0.4rem;margin-bottom:0.3rem;">
                <i class="ri-football-line"></i> รูปเกม & แท็กติกสำคัญ:
              </strong>
              <p style="margin:0;color:var(--text-main);">${m.tactics}</p>
            </div>
          </div>

          <!-- Bottom Market Odds & Recommendation -->
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.8rem;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.2);border-radius:var(--radius-md);padding:0.8rem 1.1rem;">
            <div>
              <span style="font-size:0.75rem;color:var(--text-dim);">ราคาตลาดอ้างอิง:</span>
              <span style="font-size:0.85rem;color:#fff;font-weight:700;margin-left:0.4rem;">
                ${m.homeTeam.name} ${m.marketOdds.homeWin || '-'} | เสมอ ${m.marketOdds.draw || '-'} | ${m.awayTeam.name} ${m.marketOdds.awayWin || '-'}
              </span>
            </div>
            <div style="display:flex;align-items:center;gap:0.6rem;">
              <span style="font-size:0.75rem;color:var(--text-dim);">ตัวเลือกแนะนำ:</span>
              <strong style="font-size:0.92rem;color:#10b981;">${m.marketOdds.mainPick}</strong>
              ${m.marketOdds.valuePick ? `<span style="font-size:0.82rem;color:var(--accent-gold);background:rgba(251,191,36,0.1);padding:0.15rem 0.5rem;border-radius:var(--radius-sm);">${m.marketOdds.valuePick}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    const filterPillsHtml = [
      { key: 'all', label: `ทั้งหมด (17 คู่)` },
      { key: 'low-risk', label: `⭐ คัดคู่ความเสี่ยงต่ำ (${d.curatedLowRisk.length} คู่)` },
      { key: '0045', label: `สล็อต 00:45 น. (8 คู่)` },
      { key: '0300', label: `สล็อต 03:00 น. (9 คู่)` }
    ].map(t => {
      const active = t.key === filter;
      const border = active ? 'border-color:#10b981;background:rgba(16,185,129,0.2);color:#10b981;font-weight:800;' : 'background:rgba(255,255,255,0.05);color:var(--text-dim);border-color:transparent;';
      return `
        <button onclick="window.filterUelMatches('${t.key}')" class="tab-btn" style="padding:0.5rem 1.1rem;border-radius:var(--radius-full);border:1px solid;font-size:0.85rem;cursor:pointer;white-space:nowrap;transition:all 0.2s;${border}">
          ${t.label}
        </button>
      `;
    }).join('');

    container.innerHTML = `
      <div class="container" style="padding-top:2.5rem;padding-bottom:5rem;">
        <!-- Header Banner -->
        <div style="background:var(--bg-card);border:1px solid rgba(255,255,255,0.08);border-radius:var(--radius-lg);padding:2rem;margin-bottom:2.2rem;position:relative;overflow:hidden;">
          <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.6rem;flex-wrap:wrap;">
            <span class="badge badge-green" style="font-size:0.78rem;font-weight:900;padding:0.25rem 0.75rem;background:#10b981;color:#000;">
              <i class="ri-fire-fill"></i> MATCHDAY 4 • LEAGUE PHASE (17 คู่วันนี้)
            </span>
            <span style="font-size:0.8rem;color:var(--text-dim);">${d.date} • ข้อมูล ณ ${d.updatedTime}</span>
          </div>
          <h1 style="font-size:2rem;font-weight:900;color:#fff;margin-bottom:0.7rem;line-height:1.3;">
            UEFA Europa League <span class="highlight-gold">Matchday 4 of 8</span> (ครบ 17 คู่)
          </h1>
          <p style="font-size:0.95rem;color:var(--text-muted);line-height:1.7;max-width:860px;margin:0;">
            รายงานบทวิเคราะห์เชิงลึก ข้อมูลคะแนน 3 นัดแรก ฟอร์มการเล่น สภาพความพร้อมผู้เล่นบาดเจ็บ และการประเมินราคาต่อรอง คืนวันพฤหัสบดีที่ 5 เข้าสู่เช้ามืดวันศุกร์ที่ 6 พฤศจิกายน 2026 พร้อมคัดพิเศษ 5 คู่เด่นความเสี่ยงต่ำ-ปานกลาง
          </p>
        </div>

        <!-- Section 1: Curated Low-Risk Showcase (Highlight 5 Matches) -->
        <div style="margin-bottom:3rem;">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.8rem;margin-bottom:1.3rem;">
            <div>
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <span style="font-size:1.3rem;">⭐</span>
                <h2 style="font-size:1.45rem;font-weight:900;color:#fff;margin:0;">5 คู่คัดพิเศษ ความเสี่ยงต่ำ-ปานกลาง (Curated Low-Risk Picks)</h2>
              </div>
              <p style="font-size:0.85rem;color:var(--text-muted);margin-top:0.25rem;">คัดกรองจากทีมที่ฟอร์ม 3 นัดแรกขาดลอย คลีนชีต 100% หรือคู่แข่งแนวรับพังทลาย</p>
            </div>
            <span class="badge badge-green" style="font-size:0.8rem;padding:0.35rem 0.85rem;font-weight:800;">คัดเกรด A / A+</span>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.2rem;">
            ${curatedCardsHtml}
          </div>
        </div>

        <!-- Section 2: Master Summary Table -->
        <div style="background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:1.4rem;margin-bottom:3rem;box-shadow:0 8px 25px rgba(0,0,0,0.35);">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.8rem;margin-bottom:1.1rem;">
            <div style="display:flex;align-items:center;gap:0.6rem;">
              <i class="ri-table-line" style="color:var(--accent-gold);font-size:1.3rem;"></i>
              <h3 style="font-size:1.2rem;font-weight:900;color:#fff;margin:0;">ตารางสรุปโปรแกรมและมุมมองก่อนแข่งทั้ง 17 คู่</h3>
            </div>
            <span style="font-size:0.78rem;color:var(--text-dim);">อ้างอิงตารางแข่งและผลจริง Matchday 1–3 จาก UEFA</span>
          </div>

          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;font-size:0.86rem;white-space:nowrap;">
              <thead>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.1);color:var(--text-dim);font-size:0.78rem;text-transform:uppercase;">
                  <th style="padding:0.7rem 0.6rem;text-align:center;">เวลา</th>
                  <th style="padding:0.7rem 0.8rem;text-align:left;">คู่แข่งขัน</th>
                  <th style="padding:0.7rem 0.6rem;text-align:center;">คะแนน</th>
                  <th style="padding:0.7rem 0.6rem;text-align:center;">ฟอร์ม UEL 3 นัด</th>
                  <th style="padding:0.7rem 0.6rem;text-align:center;">สกอร์คาด</th>
                  <th style="padding:0.7rem 0.8rem;text-align:left;">มุมมอง / ตัวเลือกแนะนำ</th>
                  <th style="padding:0.7rem 0.6rem;text-align:center;">ระดับเสี่ยง</th>
                </tr>
              </thead>
              <tbody>
                ${summaryRowsHtml}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 3: Filter & Match Cards Stream -->
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;">
          <div>
            <h2 style="font-size:1.45rem;font-weight:900;color:#fff;margin:0;">กระดานบทวิเคราะห์เจาะลึกรายคู่ (${filteredMatches.length} คู่)</h2>
            <p style="font-size:0.84rem;color:var(--text-muted);margin-top:0.25rem;">อ่านบทวิเคราะห์ สภาพความพร้อมนักเตะ และแท็กติกก่อนเกม</p>
          </div>

          <div style="display:flex;gap:0.8rem;align-items:center;flex-wrap:wrap;">
            <!-- Search -->
            <div style="position:relative;width:240px;">
              <i class="ri-search-line" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-dim);"></i>
              <input type="text" placeholder="ค้นหาทีมใน UEL..." oninput="window.searchUelMatches(this.value)" value="${state.uelSearchQuery || ''}" style="width:100%;padding:0.45rem 0.8rem 0.45rem 2.2rem;border-radius:var(--radius-full);background:rgba(0,0,0,0.3);border:1px solid var(--border-light);color:#fff;font-size:0.85rem;outline:none;">
            </div>

            <!-- Filter tabs -->
            <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
              ${filterPillsHtml}
            </div>
          </div>
        </div>

        <!-- Stream of Cards -->
        <div>
          ${matchCardsHtml}
        </div>
      </div>
    `;
  }

  window.switchLeagueCategory = function(cat) {
    if (cat === 'uel') {
      window.location.hash = '#uel';
    } else if (cat === 'ucl') {
      window.location.hash = '#ucl';
    } else if (cat === 'audit') {
      window.location.hash = '#audit';
    } else if (cat === 'superliga') {
      window.location.hash = '#superliga';
    } else if (cat === 'standings') {
      window.location.hash = '#standings';
    } else {
      window.location.hash = '#uel';
    }
  };

  function handleRouting() {
    const hash = window.location.hash || '#overview';

    const catBtnUel = document.getElementById('cat-btn-uel');
    const catBtnUcl = document.getElementById('cat-btn-ucl');
    const catBtnSuperliga = document.getElementById('cat-btn-superliga');
    const catBtnStandings = document.getElementById('cat-btn-standings');
    const catBtnAudit = document.getElementById('cat-btn-audit');
    const uelView = document.getElementById('uel-view');
    const danishView = document.getElementById('danish-view');
    const standingsView = document.getElementById('standings-view');
    const auditView = document.getElementById('audit-view');

    // Route: UEFA Europa League (17 Matches Tonight)
    if (hash === '#uel' || hash === '' || hash === '#overview') {
      state.currentView = 'uel';
      if (overviewView) overviewView.style.display = 'none';
      if (detailView) detailView.style.display = 'none';
      if (danishView) danishView.style.display = 'none';
      if (standingsView) standingsView.style.display = 'none';
      if (auditView) auditView.style.display = 'none';
      if (uelView) {
        uelView.style.display = 'block';
        renderUelView();
      }
      if (catBtnUel) catBtnUel.classList.add('active');
      if (catBtnUcl) catBtnUcl.classList.remove('active');
      if (catBtnSuperliga) catBtnSuperliga.classList.remove('active');
      if (catBtnStandings) catBtnStandings.classList.remove('active');
      if (catBtnAudit) catBtnAudit.classList.remove('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (uelView) uelView.style.display = 'none';
    if (catBtnUel) catBtnUel.classList.remove('active');

    // Route: UEFA Champions League (9 Matches)
    if (hash === '#ucl') {
      state.currentView = 'ucl';
      if (overviewView) overviewView.style.display = 'block';
      if (detailView) detailView.style.display = 'none';
      if (danishView) danishView.style.display = 'none';
      if (standingsView) standingsView.style.display = 'none';
      if (auditView) auditView.style.display = 'none';
      if (uelView) uelView.style.display = 'none';
      if (catBtnUcl) catBtnUcl.classList.add('active');
      if (catBtnUel) catBtnUel.classList.remove('active');
      if (catBtnSuperliga) catBtnSuperliga.classList.remove('active');
      if (catBtnStandings) catBtnStandings.classList.remove('active');
      if (catBtnAudit) catBtnAudit.classList.remove('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Route: Post-Match Audit View
    if (hash === '#audit' || hash.startsWith('#audit')) {
      state.currentView = 'audit';
      overviewView.style.display = 'none';
      detailView.style.display = 'none';
      if (danishView) danishView.style.display = 'none';
      if (standingsView) standingsView.style.display = 'none';
      if (auditView) {
        auditView.style.display = 'block';
        renderAuditView();
      }
      if (catBtnUcl) catBtnUcl.classList.remove('active');
      if (catBtnSuperliga) catBtnSuperliga.classList.remove('active');
      if (catBtnStandings) catBtnStandings.classList.remove('active');
      if (catBtnAudit) catBtnAudit.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (auditView) auditView.style.display = 'none';
    if (catBtnAudit) catBtnAudit.classList.remove('active');

        // Route: Standings Category View (All Leagues & Cups)
    if (hash === '#standings' || hash.startsWith('#standings')) {
      state.currentView = 'standings';
      overviewView.style.display = 'none';
      detailView.style.display = 'none';
      if (danishView) danishView.style.display = 'none';
      if (standingsView) {
        standingsView.style.display = 'block';
        renderStandingsView();
      }
      if (catBtnUcl) catBtnUcl.classList.remove('active');
      if (catBtnSuperliga) catBtnSuperliga.classList.remove('active');
      if (catBtnStandings) catBtnStandings.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (standingsView) standingsView.style.display = 'none';
    if (catBtnStandings) catBtnStandings.classList.remove('active');
    // Route: Danish Superliga View
    if (hash === '#superliga' || hash.startsWith('#superliga')) {
      state.currentView = 'danish';
      overviewView.style.display = 'none';
      detailView.style.display = 'none';
      if (danishView) {
        danishView.style.display = 'block';
        renderDanishView();
      }
      if (catBtnUcl) catBtnUcl.classList.remove('active');
      if (catBtnSuperliga) catBtnSuperliga.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Route: Return to UCL Mode
    if (danishView) danishView.style.display = 'none';
    if (catBtnUcl) catBtnUcl.classList.add('active');
    if (catBtnSuperliga) catBtnSuperliga.classList.remove('active');

    if (hash.startsWith('#match-')) {
      const matchId = parseInt(hash.replace('#match-', ''), 10);
      if (matchId >= 1 && matchId <= 9) {
        state.currentView = 'detail';
        overviewView.style.display = 'none';
        detailView.style.display = 'block';
        renderMatchDetail(matchId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // Default to Overview
    state.currentView = 'overview';
    overviewView.style.display = 'block';
    detailView.style.display = 'none';

    if (hash === '#overview') {
      const ovSection = document.getElementById('match-overview-section');
      if (ovSection) {
        ovSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (hash === '#rankings') {
      const rankSection = document.getElementById('rankings-section');
      if (rankSection) {
        rankSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // Bind Event Listeners
  function bindEvents() {
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderMatchesList();
      });
    }

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeFilter = btn.getAttribute('data-filter');
        renderMatchesList();
      });
    });

    const heroCtaBtn = document.getElementById('btn-enter-analysis');
    if (heroCtaBtn) {
      heroCtaBtn.addEventListener('click', () => {
        window.location.hash = '#overview';
      });
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

  // =========================================================================
  // Live GMT+7 Clock & First Match Kickoff Countdown with Dynamic Color States
  // =========================================================================
  let simulatedHoursRemaining = null; // null = real time calculation

  function simulateCountdown(hours, btn) {
    simulatedHoursRemaining = hours;
    document.querySelectorAll('.sim-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    updateLiveClockAndCountdown();
  }

  function updateLiveClockAndCountdown() {
    const banner = document.getElementById('ucl-live-countdown-banner');
    const clockDigits = document.getElementById('clock-gmt7-digits');
    const clockDate = document.getElementById('clock-gmt7-date');
    const timerDigits = document.getElementById('countdown-timer-digits');
    const statusPill = document.getElementById('countdown-status-pill');
    const statusText = document.getElementById('countdown-status-text');

    if (!banner || !timerDigits) return;

    // Current Time in GMT+7
    const now = new Date();
    // Convert to GMT+7 timestamp
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const gmt7Time = new Date(utcTime + (3600000 * 7));

    // Update Live Clock Display
    const h = String(gmt7Time.getHours()).padStart(2, '0');
    const m = String(gmt7Time.getMinutes()).padStart(2, '0');
    const s = String(gmt7Time.getSeconds()).padStart(2, '0');
    if (clockDigits) clockDigits.textContent = `${h}:${m}:${s} น.`;

    const thaiDays = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
    const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    if (clockDate) {
      clockDate.textContent = `${thaiDays[gmt7Time.getDay()]}ที่ ${gmt7Time.getDate()} ${thaiMonths[gmt7Time.getMonth()]} 2026`;
    }

    // Target Kickoff: Wednesday 4 Nov 2026 00:45:00 GMT+7
    // Year 2026, Month 10 (November is 10), Day 4, 00:45:00
    const targetKickoffGMT7 = new Date(Date.UTC(2026, 10, 5, 17, 45, 0)); // 5 Nov 17:45 UTC = 6 Nov 00:45 GMT+7 (UEL Matchday 4)

    let diffMs;
    if (simulatedHoursRemaining !== null) {
      diffMs = simulatedHoursRemaining * 3600 * 1000;
    } else {
      diffMs = targetKickoffGMT7.getTime() - now.getTime();
    }

    const totalHoursRemaining = diffMs / (1000 * 3600);

    // Remove old state classes
    banner.classList.remove('countdown-state-normal', 'countdown-state-warning', 'countdown-state-danger', 'countdown-state-live');
    if (statusPill) statusPill.className = 'countdown-pill-badge';

    if (totalHoursRemaining <= 0) {
      // Live In Play
      banner.classList.add('countdown-state-live');
      timerDigits.textContent = '00:00:00 (เริ่มเตะแล้ว!)';
      if (statusPill) {
        statusPill.classList.add('badge-green');
        statusText.textContent = '🔥 LIVE IN PLAY (กำลังเตะสด!)';
      }
    } else {
      // Calculate remaining days, hours, minutes, seconds
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

      const daysStr = days > 0 ? `${days} วัน ` : '';
      const hrsStr = `${String(hours).padStart(2, '0')} ชม. `;
      const minsStr = `${String(mins).padStart(2, '0')} นาที `;
      const secsStr = `${String(secs).padStart(2, '0')} วินาที`;
      timerDigits.textContent = `${daysStr}${hrsStr}${minsStr}${secsStr}`;

      // Color rules:
      // <= 6 hours -> Danger Red Pulse
      // <= 12 hours -> Warning Gold
      // > 12 hours -> Normal Cyan
      if (totalHoursRemaining <= 6) {
        banner.classList.add('countdown-state-danger');
        if (statusPill) {
          statusPill.classList.add('badge-red');
          statusText.textContent = `🔴 ด่วนมาก! (เหลืออีก ${totalHoursRemaining.toFixed(1)} ชม.)`;
        }
      } else if (totalHoursRemaining <= 12) {
        banner.classList.add('countdown-state-warning');
        if (statusPill) {
          statusPill.classList.add('badge-gold');
          statusText.textContent = `🟡 เตือน (เหลืออีก ${totalHoursRemaining.toFixed(1)} ชม.)`;
        }
      } else {
        banner.classList.add('countdown-state-normal');
        if (statusPill) {
          statusPill.classList.add('badge-cyan');
          statusText.textContent = `🟢 ปกติ (เหลืออีก ${totalHoursRemaining.toFixed(1)} ชม.)`;
        }
      }
    }
  }

  // Ticking every 1 second
  setInterval(updateLiveClockAndCountdown, 1000);
  document.addEventListener('DOMContentLoaded', updateLiveClockAndCountdown);
