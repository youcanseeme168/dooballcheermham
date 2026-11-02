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
    return `<img src="assets/logos/${teamId}.png" alt="${teamName || teamId}" class="team-logo-img" onerror="this.onerror=null; this.src='assets/logos/${teamId}.svg';">`;
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

    // Supported
    const supEl = document.getElementById('ranking-supported');
    if (supEl) {
      supEl.innerHTML = `
        <div class="ranking-item">
          <span class="ranking-item-badge badge-rank-1">อันดับ 1 • ความน่าเชื่อถือ 88/100</span>
          <div style="font-weight:700;color:#fff;margin-bottom:0.25rem;">Villarreal พบ PSG</div>
          <p>มีข้อมูลครบถ้วนตั้งแต่สถิติชนะรวด 9 นัด (ยิง 30 ประตู) ของ PSG, สถิติ 12 จาก 14 เกมเหย้าของ Villarreal ที่เกิด BTTS + Over 2.5, รายชื่อผู้เล่นบาดเจ็บครบทั้งสองฝั่ง และราคาต่อรองครบทุกตลาดหลัก</p>
        </div>
        <div class="ranking-item">
          <span class="ranking-item-badge badge-rank-2">อันดับ 2 • ความน่าเชื่อถือ 87/100 & 86/100</span>
          <div style="font-weight:700;color:#fff;margin-bottom:0.25rem;">Barcelona พบ Aston Villa & Atlético Madrid พบ Bayern Munich</div>
          <p>ข้อมูลสถิติ 18 นัดหลังสุดใน UCL ของบาร์ซา และสถิติเกมเหย้าที่แข็งแกร่งของตราหมี รองรับทิศทางการวิเคราะห์ได้อย่างแน่นหนา</p>
        </div>
      `;
    }

    // Advantage & Value
    const advEl = document.getElementById('ranking-advantage');
    if (advEl) {
      advEl.innerHTML = `
        <div class="ranking-item">
          <span class="ranking-item-badge badge-rank-1">อันดับ 1 • ราคาคุ้มค่าที่สุด</span>
          <div style="font-weight:700;color:#fff;margin-bottom:0.25rem;">Bodø/Glimt พบ LOSC Lille — เจ้าบ้านชนะ (@ 1.92)</div>
          <p>เจ้าบ้านชนะเกมเหย้ายุโรป 6 นัดรวด ขณะที่ Lille แพ้รวด 3 นัดใน UCL (เสีย 10 ลูก) แพ้เกมยุโรป 5 นัดติด เสียประตูครึ่งหลัง 7 ลูกรวด และขาดตัวหลักทั้ง Mbappé, Ueda, Santos</p>
        </div>
        <div class="ranking-item">
          <span class="ranking-item-badge badge-rank-2">อันดับ 2</span>
          <div style="font-weight:700;color:#fff;margin-bottom:0.25rem;">LASK พบ Slovan Bratislava — LASK ชนะ (@ 1.50)</div>
          <p>LASK เพิ่งบุกชนะ Sporting 3-2 เปิดบ้านรับทีมบ๊วยที่เสียถึง 13 ประตูและยิงได้เพียงลูกเดียวจาก 3 นัด</p>
        </div>
        <div class="ranking-item">
          <span class="ranking-item-badge badge-rank-3">อันดับ 3</span>
          <div style="font-weight:700;color:#fff;margin-bottom:0.25rem;">Villarreal พบ PSG — PSG ชนะ (@ 1.65)</div>
          <p>PSG ชนะรวด 9 นัดในทุกรายการและมีเรตติ้งเฉลี่ยสูงสุด 8.09</p>
        </div>
      `;
    }

    // Over/Under
    const ouEl = document.getElementById('ranking-overunder');
    if (ouEl) {
      ouEl.innerHTML = `
        <div class="ranking-item">
          <span class="ranking-item-badge badge-rank-1">อันดับ 1</span>
          <div style="font-weight:700;color:#fff;margin-bottom:0.25rem;">Galatasaray พบ VfB Stuttgart — Over 2.5 (@ 1.43)</div>
          <p>6 จาก 7 นัดยุโรปหลังสุดของกาลาตาซารายจบเกิน 2.5 ประตู และทั้งคู่เพิ่งยิง 4 ประตูในเกมลีกสุดสัปดาห์</p>
        </div>
        <div class="ranking-item">
          <span class="ranking-item-badge badge-rank-2">อันดับ 2</span>
          <div style="font-weight:700;color:#fff;margin-bottom:0.25rem;">Feyenoord พบ Inter — Over 2.5 (@ 1.41)</div>
          <p>9 จาก 13 นัดหลังสุดของ Feyenoord มีสกอร์รวมเกิน 3.5 ประตู และทั้งคู่ขาดกองหลังตัวหลักหลายราย</p>
        </div>
        <div class="ranking-item">
          <span class="ranking-item-badge badge-rank-3">อันดับ 3</span>
          <div style="font-weight:700;color:#fff;margin-bottom:0.25rem;">LASK พบ Slovan Bratislava — Over 2.5 (@ 1.44)</div>
          <p>ทั้งสองทีมเสียประตูรวมกันถึง 22 ลูกจาก 3 นัดแรกใน UCL</p>
        </div>
      `;
    }

    // BTTS
    const bttsEl = document.getElementById('ranking-btts');
    if (bttsEl) {
      bttsEl.innerHTML = `
        <div class="ranking-item">
          <span class="ranking-item-badge badge-rank-1">อันดับ 1</span>
          <div style="font-weight:700;color:#fff;margin-bottom:0.25rem;">Barcelona พบ Aston Villa — BTTS Yes (@ 1.50)</div>
          <p>Barcelona ไม่คลีนชีตใน UCL มา 18 นัดติด (เฉลี่ยประตูรวม 5.06 ลูก/นัด) ขาดกองหลัง 4 ราย ขณะที่วิลลายิงไป 12 ลูกจาก 3 นัดแรก</p>
        </div>
        <div class="ranking-item">
          <span class="ranking-item-badge badge-rank-2">อันดับ 2</span>
          <div style="font-weight:700;color:#fff;margin-bottom:0.25rem;">Villarreal พบ PSG — BTTS Yes (@ 1.43)</div>
          <p>12 จาก 14 นัดเหย้าของ Villarreal เกิด BTTS และ PSG เสียประตูเกมเยือน 7 จาก 8 นัดหลังสุดพร้อมขาด Marquinhos กับ Mendes</p>
        </div>
        <div class="ranking-item">
          <span class="ranking-item-badge badge-rank-3">อันดับ 3</span>
          <div style="font-weight:700;color:#fff;margin-bottom:0.25rem;">Atlético Madrid พบ Bayern Munich — BTTS Yes (@ 1.36)</div>
          <p>Atlético ยิงในบ้าน UCL 20 นัดรวด, Bayern ยิงใน UCL 24 นัดรวด และ 9 นัดเยือนหลังสุดใน UCL ของเสือใต้เกิด BTTS 100%</p>
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

  // Render Table
  function renderSummaryTable(rows) {
    const tbody = document.getElementById('summary-table-body');
    if (!tbody || !rows) return;

    tbody.innerHTML = rows.map(r => {
      let riskBadgeClass = 'badge-gray';
      if (r.risk.includes('ต่ำ')) riskBadgeClass = 'badge-green';
      else if (r.risk.includes('ปานกลาง')) riskBadgeClass = 'badge-gold';
      else if (r.risk.includes('สูง')) riskBadgeClass = 'badge-red';

      return `
        <tr>
          <td style="font-family:var(--font-mono);font-weight:bold;color:var(--accent-ucl);">${r.id}</td>
          <td>
            <div class="table-match-name">
              <span>${r.match}</span>
              ${r.isNeutral ? '<span class="badge badge-ucl" style="font-size:0.68rem;padding:0.15rem 0.4rem;">สนามกลาง</span>' : ''}
            </div>
            <div style="font-size:0.75rem;color:var(--text-dim);margin-top:0.15rem;">เตะ ${r.time} น.</div>
          </td>
          <td>
            <span class="badge badge-gold" style="font-family:var(--font-mono);font-size:0.84rem;">${r.predictedScore}</span>
          </td>
          <td>
            <div class="table-picks-list">
              ${r.bestPicks.map(p => `<span class="table-pick-item"><i class="ri-check-line"></i> ${p}</span>`).join('')}
            </div>
          </td>
          <td style="font-family:var(--font-mono);font-weight:600;font-size:0.82rem;white-space:nowrap;">
            ${r.prob1X2}
          </td>
          <td>
            <span style="font-family:var(--font-mono);font-weight:bold;color:var(--accent-ucl);">${r.confidence}</span>
          </td>
          <td>
            <span class="badge ${riskBadgeClass}">${r.risk}</span>
          </td>
          <td>
            <button class="table-btn-action" onclick="window.location.hash='#match-${r.id}'">
              อ่านบทวิเคราะห์ <i class="ri-arrow-right-line"></i>
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
      if (state.activeFilter === 'low-risk' && !m.summaryAndRisk.riskLevel.includes('ต่ำ')) return false;

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
      if (m.summaryAndRisk.riskLevel.includes('ต่ำ')) riskBadgeClass = 'badge-green';
      else if (m.summaryAndRisk.riskLevel.includes('ปานกลาง')) riskBadgeClass = 'badge-gold';
      else if (m.summaryAndRisk.riskLevel.includes('สูง')) riskBadgeClass = 'badge-red';

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
    const rawForm = m.formAnalysis.overview;
    const awayName = m.awayTeam.name;

    let homeFormText = rawForm;
    let awayFormText = '';

    // Split home and away form cleanly
    const awaySplitIdx = rawForm.indexOf(awayName + ':');
    if (awaySplitIdx !== -1) {
      homeFormText = rawForm.substring(0, awaySplitIdx).trim();
      awayFormText = rawForm.substring(awaySplitIdx).trim();
    }

    return `
      <div class="form-cards-grid">
        <div class="form-team-card">
          <div class="form-team-header">
            <img src="assets/logos/${m.homeTeam.id}.png" class="injury-team-badge-mini" alt="${m.homeTeam.name}">
            <div>
              <div style="font-weight:800;color:#fff;">${m.homeTeam.name}</div>
              <div style="font-size:0.75rem;color:var(--accent-gold);">${m.homeTeam.league}</div>
            </div>
          </div>
          <div class="form-body-text">${homeFormText}</div>
        </div>

        <div class="form-team-card">
          <div class="form-team-header">
            <img src="assets/logos/${m.awayTeam.id}.png" class="injury-team-badge-mini" alt="${m.awayTeam.name}">
            <div>
              <div style="font-weight:800;color:#fff;">${m.awayTeam.name}</div>
              <div style="font-size:0.75rem;color:var(--accent-gold);">${m.awayTeam.league}</div>
            </div>
          </div>
          <div class="form-body-text">${awayFormText || 'ฟอร์มการเล่นยอดเยี่ยมตามข้อมูลสถิติ'}</div>
        </div>
      </div>

      ${m.formAnalysis.h2h ? `
        <div class="h2h-highlight-card">
          <div class="h2h-head">
            <i class="ri-history-line"></i> สถิติการพบกัน Head-to-Head (H2H)
          </div>
          <div class="h2h-text">${m.formAnalysis.h2h}</div>
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

    state.selectedMatchId = matchId;

    const prevId = matchId > 1 ? matchId - 1 : 9;
    const nextId = matchId < 9 ? matchId + 1 : 1;

    let riskBadgeClass = 'badge-gray';
    if (m.summaryAndRisk.riskLevel.includes('ต่ำ')) riskBadgeClass = 'badge-green';
    else if (m.summaryAndRisk.riskLevel.includes('ปานกลาง')) riskBadgeClass = 'badge-gold';
    else if (m.summaryAndRisk.riskLevel.includes('สูง')) riskBadgeClass = 'badge-red';

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
              <span>${typeof m.stadium === 'object' ? m.stadium.thaiName + ' (' + m.stadium.city + ')' : m.stadium}</span>
            </div>
            <div class="detail-meta-item">
              <strong>โปรแกรมและเวลาพัก</strong>
              <span>${m.scheduleAndRest}</span>
            </div>
            <div class="detail-meta-item">
              <strong>สภาพแวดล้อมสนาม</strong>
              <span>${m.pitchAndWeather}</span>
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
              <p>${m.standings}</p>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;">
              <div style="background:rgba(5,8,17,0.4);border:1px solid rgba(255,255,255,0.05);padding:1.2rem;border-radius:var(--radius-md);">
                <strong style="color:var(--accent-ucl);display:block;margin-bottom:0.35rem;"><i class="ri-time-line"></i> เวลาพักและความสด</strong>
                <p style="font-size:0.9rem;color:var(--text-muted);">${m.scheduleAndRest}</p>
              </div>
              <div style="background:rgba(5,8,17,0.4);border:1px solid rgba(255,255,255,0.05);padding:1.2rem;border-radius:var(--radius-md);">
                <strong style="color:var(--accent-ucl);display:block;margin-bottom:0.35rem;"><i class="ri-temp-hot-line"></i> สภาพสนามและบรรยากาศ</strong>
                <p style="font-size:0.9rem;color:var(--text-muted);">${m.pitchAndWeather}</p>
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

  window.switchLeagueCategory = function(cat) {
    if (cat === 'superliga') {
      window.location.hash = '#superliga';
    } else {
      window.location.hash = '#overview';
    }
  };

  function handleRouting() {
    const hash = window.location.hash || '#overview';

    const catBtnUcl = document.getElementById('cat-btn-ucl');
    const catBtnSuperliga = document.getElementById('cat-btn-superliga');
    const danishView = document.getElementById('danish-view');

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
    const targetKickoffGMT7 = new Date(Date.UTC(2026, 10, 3, 17, 45, 0)); // 17:45 UTC = 00:45 GMT+7

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
