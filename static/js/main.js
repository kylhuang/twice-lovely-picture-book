/**
 * TWICE LOVELYS えほん | Interactive Experience & Story Parser
 * Handles collapsible #### chapters, bilingual view toggles, 
 * page-by-page reader mode, and cute micro-interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Lovelys character lookup for badge tags
  const LOVELYS_MAP = [
    { name: 'NAVELY', ja: 'ナブリー', color: '#FF5C8D' },
    { name: 'JEONGVELY', ja: 'ジョンブリー', color: '#8ED752' },
    { name: 'MOVELY', ja: 'モブリー', color: '#FFA06D' },
    { name: 'SAVELY', ja: 'サブリー', color: '#BA82E6' },
    { name: 'JIVELY', ja: 'ジブリー', color: '#FFBF2B' },
    { name: 'MIVELY', ja: 'ミブリー', color: '#4BC5B8' },
    { name: 'DAVELY', ja: 'ダブリー', color: '#9F92E5' },
    { name: 'CHAENGVELY', ja: 'チェンブリー', color: '#FF3366' },
    { name: 'TZUVELY', ja: 'ツブリー', color: '#2B76E6' }
  ];

  // Story data collection for the reader modal
  const storyChapters = [];

  // =========================================================================
  // 1. Parse Hugo Markdown Content & Generate Collapsible Story Cards
  // =========================================================================
  function parseAndBuildStoryAccordion() {
    const rawContainer = document.getElementById('rawContentSource');
    const targetContainer = document.getElementById('storyAccordionContainer');
    if (!rawContainer || !targetContainer) return;

    // Find all <h4> elements in the markdown content
    const h4Elements = rawContainer.querySelectorAll('h4');
    if (h4Elements.length === 0) return;

    targetContainer.innerHTML = ''; // Clear container

    h4Elements.forEach((h4, index) => {
      const chapterNum = h4.textContent.trim().padStart(2, '0');
      const chapterId = `chapter-${chapterNum}`;

      // Collect sibling elements until the next H4 or HR or H3/H2
      const contentElements = [];
      let sibling = h4.nextElementSibling;
      while (sibling && !['H4', 'H3', 'H2', 'H1', 'HR'].includes(sibling.tagName)) {
        contentElements.push(sibling.cloneNode(true));
        sibling = sibling.nextElementSibling;
      }

      // Separate Japanese and Traditional Chinese content
      let jaHtml = '';
      let zhHtml = '';
      let firstSnippet = '';

      contentElements.forEach(el => {
        const text = el.textContent || '';
        const html = el.innerHTML || '';

        if (html.includes('日文：') || text.startsWith('日文：')) {
          const cleanHtml = html.replace(/<strong>\s*日文：\s*<\/strong><br\s*\/?>?/g, '')
                                .replace(/日文：/g, '');
          jaHtml += `<div class="story-text-para">${cleanHtml}</div>`;

          if (!firstSnippet) {
            const rawText = el.textContent.replace('日文：', '').trim();
            const firstLine = rawText.split('\n')[0].trim();
            firstSnippet = firstLine.slice(0, 38) + (firstLine.length > 38 ? '...' : '');
          }
        } else if (html.includes('繁中：') || text.startsWith('繁中：')) {
          const cleanHtml = html.replace(/<strong>\s*繁中：\s*<\/strong><br\s*\/?>?/g, '')
                                .replace(/繁中：/g, '');
          zhHtml += `<div class="story-text-para">${cleanHtml}</div>`;
        } else {
          // Additional paragraphs or dialogue
          if (!zhHtml) {
            jaHtml += `<div class="story-text-para">${html}</div>`;
          } else {
            zhHtml += `<div class="story-text-para">${html}</div>`;
          }
        }
      });

      // Highlight dialogues with cute picture book quotes
      jaHtml = formatDialogues(jaHtml);
      zhHtml = formatDialogues(zhHtml);

      // Detect appearing LOVELYS in this chapter
      const fullText = (jaHtml + ' ' + zhHtml);
      const matchedLovelys = LOVELYS_MAP.filter(lov => 
        fullText.includes(lov.name) || fullText.includes(lov.ja)
      );

      // Store in memory for flip reader modal
      storyChapters.push({
        num: chapterNum,
        id: chapterId,
        jaHtml: jaHtml,
        zhHtml: zhHtml,
        preview: firstSnippet || `第 ${chapterNum} 頁故事內容`,
        lovelys: matchedLovelys
      });

      // Build Character Mini Badges HTML
      const badgesHtml = matchedLovelys.map(lov => 
        `<span class="char-badge-mini" style="background: ${lov.color};" title="${lov.name}"><img src="characters/${lov.name}.jpg" class="char-mini-img" alt="${lov.name}"> ${lov.ja}</span>`
      ).join('');

      // Determine next chapter ID for the quick next button
      const nextNum = (index + 2).toString().padStart(2, '0');
      const hasNext = (index + 1) < h4Elements.length;

      // Construct native <details class="story-card" open>
      const card = document.createElement('details');
      card.className = 'story-card';
      card.id = chapterId;
      card.open = true; // Open by default

      card.innerHTML = `
        <summary class="story-card-header" title="點擊展開或收折第 ${chapterNum} 頁">
          <div class="header-left-col">
            <span class="page-badge-number">PAGE ${chapterNum}</span>
            <span class="story-header-snippet">${firstSnippet || '點擊展開繪本內容'}</span>
          </div>
          <div class="header-right-col">
            <div class="story-characters-tags">
              ${badgesHtml}
            </div>
            <div class="story-toggle-indicator">
              <span class="toggle-text">收折</span>
              <span class="toggle-arrow-icon">▼</span>
            </div>
          </div>
        </summary>
        <div class="story-card-body">
          <div class="story-lang-box lang-ja">
            <div class="lang-header-row">
              <span class="story-lang-badge">🇯🇵 日本語原文</span>
              <span class="badge-icon">🍓</span>
            </div>
            <div class="story-content-text">
              ${jaHtml}
            </div>
          </div>
          <div class="story-lang-box lang-zh">
            <div class="lang-header-row">
              <span class="story-lang-badge">🇹🇼 繁體中文翻譯</span>
              <span class="badge-icon">✨</span>
            </div>
            <div class="story-content-text">
              ${zhHtml}
            </div>
          </div>
          <div class="story-card-actions">
            <span class="card-reading-tip">✦ TWICE LOVELYS えほん</span>
            ${hasNext ? `
              <button type="button" class="btn-card-next" data-next-target="chapter-${nextNum}">
                <span>前往第 ${nextNum} 頁</span>
                <span>➔</span>
              </button>
            ` : `
              <span class="btn-card-next" style="cursor: default; background: #FFF2F6; border-color: #FFB3C7;">
                <span>🎉 全劇終 (おわり)</span>
              </span>
            `}
          </div>
        </div>
      `;

      // Update toggle indicator text on toggle
      card.addEventListener('toggle', () => {
        const toggleText = card.querySelector('.toggle-text');
        if (toggleText) {
          toggleText.textContent = card.open ? '收折' : '展開';
        }
        updateReadingProgress();
      });

      targetContainer.appendChild(card);
    });

    updateReadingProgress();
    attachCardActionEvents();
  }

  // Helper to highlight quotation lines
  function formatDialogues(html) {
    return html.replace(/「([^」]+)」/g, '<span class="dialogue">「$1」</span>');
  }

  // =========================================================================
  // 2. Expand All & Collapse All Controls
  // =========================================================================
  const btnExpandAll = document.getElementById('ctrl-expand-all');
  const btnCollapseAll = document.getElementById('ctrl-collapse-all');
  const headerExpandToggle = document.getElementById('header-expand-toggle');

  if (btnExpandAll) {
    btnExpandAll.addEventListener('click', () => {
      document.querySelectorAll('details.story-card').forEach(card => card.open = true);
      updateReadingProgress();
    });
  }

  if (btnCollapseAll) {
    btnCollapseAll.addEventListener('click', () => {
      document.querySelectorAll('details.story-card').forEach(card => card.open = false);
      updateReadingProgress();
    });
  }

  if (headerExpandToggle) {
    headerExpandToggle.addEventListener('click', () => {
      const cards = document.querySelectorAll('details.story-card');
      const allOpen = Array.from(cards).every(c => c.open);
      cards.forEach(card => card.open = !allOpen);
      headerExpandToggle.querySelector('.btn-label').textContent = allOpen ? '全部展開' : '全部收折';
      headerExpandToggle.querySelector('.btn-icon').textContent = allOpen ? '📂' : '📁';
      updateReadingProgress();
    });
  }

  function updateReadingProgress() {
    const cards = document.querySelectorAll('details.story-card');
    const openCount = Array.from(cards).filter(c => c.open).length;
    const progressCountEl = document.getElementById('progressCount');
    if (progressCountEl) {
      progressCountEl.textContent = `已展開 ${openCount} / ${cards.length} 頁`;
    }
  }

  // =========================================================================
  // 3. Language Switcher (日中對照 / 僅日文 / 僅繁中)
  // =========================================================================
  const langPills = document.querySelectorAll('.lang-pill');
  langPills.forEach(pill => {
    pill.addEventListener('click', () => {
      langPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const mode = pill.dataset.langMode;
      document.body.classList.remove('filter-ja', 'filter-zh');

      if (mode === 'ja') {
        document.body.classList.add('filter-ja');
      } else if (mode === 'zh') {
        document.body.classList.add('filter-zh');
      }
    });
  });

  // =========================================================================
  // 4. Chapter Navigation & Fast Jump
  // =========================================================================
  const chapterSelect = document.getElementById('chapter-select');
  if (chapterSelect) {
    chapterSelect.addEventListener('change', (e) => {
      const targetId = e.target.value;
      if (targetId) {
        scrollToAndOpenChapter(targetId);
      }
    });
  }

  // Quick navigation pills (1 ~ 22)
  document.querySelectorAll('.page-nav-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const targetId = pill.dataset.target;
      if (targetId) {
        scrollToAndOpenChapter(targetId);
      }
    });
  });

  // Character card chapter chips jump
  document.querySelectorAll('.chapter-jump-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const targetId = chip.dataset.jumpTo;
      if (targetId) {
        scrollToAndOpenChapter(targetId);
      }
    });
  });

  function attachCardActionEvents() {
    // Next page buttons inside cards
    document.querySelectorAll('.btn-card-next').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const nextId = btn.dataset.nextTarget;
        if (nextId) {
          scrollToAndOpenChapter(nextId);
        }
      });
    });
  }

  function scrollToAndOpenChapter(targetId) {
    const targetCard = document.getElementById(targetId);
    if (targetCard) {
      targetCard.open = true;
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Highlight effect
      targetCard.style.transition = 'box-shadow 0.3s, border-color 0.3s';
      targetCard.style.borderColor = '#FF5C8D';
      targetCard.style.boxShadow = '0 0 0 4px rgba(255, 92, 141, 0.35)';
      setTimeout(() => {
        targetCard.style.borderColor = '';
        targetCard.style.boxShadow = '';
      }, 1400);

      // Sync active page pill
      document.querySelectorAll('.page-nav-pill').forEach(p => {
        p.classList.toggle('active', p.dataset.target === targetId);
      });
    }
  }

  // =========================================================================
  // 5. Immersive Picture Book Modal Reader (翻頁繪本模式)
  // =========================================================================
  let currentReaderPage = 0;
  const readerModal = document.getElementById('bookReaderModal');
  const btnCloseReader = document.getElementById('btnCloseReader');
  const readerBackdrop = document.getElementById('readerBackdrop');
  const btnOpenReaderHeader = document.getElementById('btn-open-reader-header');
  const btnHeroReaderMode = document.getElementById('btn-hero-reader-mode');
  const btnReaderPrev = document.getElementById('btnReaderPrev');
  const btnReaderNext = document.getElementById('btnReaderNext');
  const readerJaPane = document.getElementById('readerJaPane');
  const readerZhPane = document.getElementById('readerZhPane');
  const readerPageText = document.getElementById('readerPageText');
  const readerChapterTitle = document.getElementById('readerChapterTitle');
  const readerProgressDots = document.getElementById('readerProgressDots');

  function openReaderModal(initialPage = 0) {
    if (!storyChapters.length) return;
    currentReaderPage = Math.max(0, Math.min(initialPage, storyChapters.length - 1));
    buildReaderDots();
    renderReaderPage();
    readerModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeReaderModal() {
    readerModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function renderReaderPage() {
    const chapter = storyChapters[currentReaderPage];
    if (!chapter) return;

    readerChapterTitle.textContent = `PAGE ${chapter.num}`;
    readerPageText.textContent = `第 ${chapter.num} / ${storyChapters.length} 頁`;

    readerJaPane.innerHTML = chapter.jaHtml;
    readerZhPane.innerHTML = chapter.zhHtml;

    btnReaderPrev.disabled = (currentReaderPage === 0);
    btnReaderNext.disabled = (currentReaderPage === storyChapters.length - 1);

    // Update dots
    document.querySelectorAll('.progress-dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentReaderPage);
    });
  }

  function buildReaderDots() {
    if (!readerProgressDots) return;
    readerProgressDots.innerHTML = '';
    storyChapters.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = 'progress-dot' + (idx === currentReaderPage ? ' active' : '');
      dot.title = `第 ${idx + 1} 頁`;
      dot.addEventListener('click', () => {
        currentReaderPage = idx;
        renderReaderPage();
      });
      readerProgressDots.appendChild(dot);
    });
  }

  if (btnOpenReaderHeader) {
    btnOpenReaderHeader.addEventListener('click', () => openReaderModal(0));
  }
  if (btnHeroReaderMode) {
    btnHeroReaderMode.addEventListener('click', () => openReaderModal(0));
  }
  if (btnCloseReader) {
    btnCloseReader.addEventListener('click', closeReaderModal);
  }
  if (readerBackdrop) {
    readerBackdrop.addEventListener('click', closeReaderModal);
  }

  if (btnReaderPrev) {
    btnReaderPrev.addEventListener('click', () => {
      if (currentReaderPage > 0) {
        currentReaderPage--;
        renderReaderPage();
      }
    });
  }

  if (btnReaderNext) {
    btnReaderNext.addEventListener('click', () => {
      if (currentReaderPage < storyChapters.length - 1) {
        currentReaderPage++;
        renderReaderPage();
      }
    });
  }

  // Keyboard Navigation for Reader Mode
  window.addEventListener('keydown', (e) => {
    if (!readerModal.classList.contains('active')) return;
    if (e.key === 'Escape') {
      closeReaderModal();
    } else if (e.key === 'ArrowLeft') {
      if (currentReaderPage > 0) {
        currentReaderPage--;
        renderReaderPage();
      }
    } else if (e.key === 'ArrowRight') {
      if (currentReaderPage < storyChapters.length - 1) {
        currentReaderPage++;
        renderReaderPage();
      }
    }
  });

  // Reader Modal Language Switcher
  document.querySelectorAll('.reader-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.reader-lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const lang = btn.dataset.readerLang;
      if (lang === 'ja') {
        readerJaPane.style.display = 'block';
        readerJaPane.style.borderRight = 'none';
        readerZhPane.style.display = 'none';
      } else if (lang === 'zh') {
        readerJaPane.style.display = 'none';
        readerZhPane.style.display = 'block';
      } else {
        readerJaPane.style.display = 'block';
        readerJaPane.style.borderRight = '';
        readerZhPane.style.display = 'block';
      }
    });
  });

  // =========================================================================
  // 6. Back to Top Button
  // =========================================================================
  const btnBackToTop = document.getElementById('btn-back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btnBackToTop.classList.add('visible');
    } else {
      btnBackToTop.classList.remove('visible');
    }
  }, { passive: true });

  if (btnBackToTop) {
    btnBackToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 7. Background Floating Sparkles
  // =========================================================================
  function initFloatingSparkles() {
    const container = document.getElementById('sparkles-container');
    if (!container) return;

    const sparkleChars = ['✧', '✦', '♡', '★', '🍓', '✨'];
    const colors = ['#FF5C8D', '#FFBF2B', '#8ED752', '#FFA06D', '#BA82E6', '#4BC5B8'];

    for (let i = 0; i < 18; i++) {
      const sparkle = document.createElement('span');
      sparkle.className = 'floating-sparkle';
      sparkle.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
      sparkle.style.left = `${Math.random() * 100}vw`;
      sparkle.style.fontSize = `${Math.random() * 14 + 12}px`;
      sparkle.style.color = colors[Math.floor(Math.random() * colors.length)];
      sparkle.style.animationDuration = `${Math.random() * 12 + 10}s`;
      sparkle.style.animationDelay = `${Math.random() * 8}s`;
      container.appendChild(sparkle);
    }
  }

  // Initialize
  parseAndBuildStoryAccordion();
  initFloatingSparkles();
});
