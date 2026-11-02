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
        const stadium = m.stadium.toLowerCase();
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
                <i class="ri-map-pin-line"></i> ${m.stadium.split('(')[0].trim()}
              </span>
              <span class="score-pred-badge">
                <i class="ri-football-line"></i> คาด: ${m.scorePrediction.prediction.split(' ')[0]}
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
  function handleRouting() {
    const hash = window.location.hash || '#overview';

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