/**
 * Booklet Edition - windforsea
 * 우에서 좌로 넘기는 책자 인터랙션 & 상단 3개 책갈피 리본 제어
 */

document.addEventListener('DOMContentLoaded', () => {
  const pages = document.querySelectorAll('.book-page');
  const totalPages = pages.length;
  let currentPage = 0;

  const bookmarks = document.querySelectorAll('.bookmark-ribbon');
  const dots = document.querySelectorAll('.book-dots .dot');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const openBookBtn = document.getElementById('openBookBtn');
  const pageCounterPill = document.getElementById('pageCounterPill');
  const bookContainer = document.getElementById('bookContainer');

  const pageNames = [
    'Cover • 표지',
    'Chapter 01 • 자기소개',
    'Chapter 02 • 프로젝트 (1/3)',
    'Chapter 02 • 프로젝트 (2/3)',
    'Chapter 02 • 프로젝트 (3/3)'
  ];

  function goToPage(targetIndex) {
    if (targetIndex < 0 || targetIndex >= totalPages) return;
    currentPage = targetIndex;

    // 1. 책장 넘김 상태 업데이트 (우에서 좌로 넘어감)
    pages.forEach((page, idx) => {
      page.classList.remove('active', 'passed');
      if (idx < currentPage) {
        page.classList.add('passed'); // 왼쪽으로 넘어간 상태
      } else if (idx === currentPage) {
        page.classList.add('active'); // 현재 펼쳐진 상태
      }
    });

    // 2. 상단 2개 책갈피 리본 활성화 갱신 (프로젝트는 2, 3, 4페이지 모두 활성화 유지)
    bookmarks.forEach((bm) => {
      const pageNum = parseInt(bm.dataset.page, 10);
      let isActive = false;
      if (pageNum === 1 && currentPage === 1) {
        isActive = true;
      } else if (pageNum === 2 && (currentPage >= 2 && currentPage <= 4)) {
        isActive = true;
      }

      if (isActive) {
        bm.classList.add('active');
      } else {
        bm.classList.remove('active');
      }
    });

    // 3. 하단 도트 인디케이터 갱신
    dots.forEach((dot, idx) => {
      if (idx === currentPage) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // 4. 상단 페이지 카운터 텍스트 갱신
    if (pageCounterPill) {
      pageCounterPill.textContent = pageNames[currentPage] || `Page ${currentPage}`;
    }

    // 5. 좌/우 버튼 비활성화 처리
    if (btnPrev) btnPrev.disabled = (currentPage === 0);
    if (btnNext) btnNext.disabled = (currentPage === totalPages - 1);
  }

  // --- 이벤트 바인딩 ---

  // 책갈피 클릭
  bookmarks.forEach((bm) => {
    bm.addEventListener('click', () => {
      const target = parseInt(bm.dataset.page, 10);
      goToPage(target);
    });
  });

  // 표지 "책장 열기" 버튼
  if (openBookBtn) {
    openBookBtn.addEventListener('click', () => {
      goToPage(1);
    });
  }

  // 좌우 화살표 버튼
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      goToPage(currentPage - 1);
    });
  }
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      goToPage(currentPage + 1);
    });
  }

  // 하단 도트 클릭
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const target = parseInt(dot.dataset.index, 10);
      goToPage(target);
    });
  });

  // 키보드 좌/우 방향키
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('photoModal');
    if (modal && modal.classList.contains('active')) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      goToPage(currentPage + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      goToPage(currentPage - 1);
    }
  });

  // 모바일 터치 스와이프 지원 (세로 스크롤과 간섭 방지)
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  let touchStartTime = 0;

  if (bookContainer) {
    bookContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
      touchStartTime = Date.now();
    }, { passive: true });

    bookContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    const duration = Date.now() - touchStartTime;

    // 수평 이동량이 45px 이상이고, 수직 이동량의 1.3배 이상이며, 600ms 이내의 스와이프만 책장 넘김으로 인식
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.3 && duration < 600) {
      if (diffX < 0) {
        // 우에서 좌로 스와이프 (다음 페이지)
        goToPage(currentPage + 1);
      } else {
        // 좌에서 우로 스와이프 (이전 페이지)
        goToPage(currentPage - 1);
      }
    }
  }

  // 초기 상태 설정
  goToPage(0);

  // --- 스페이스 갤러리 모달 팝업 ---
  initBookPhotoModal();
});

function initBookPhotoModal() {
  const photoCards = document.querySelectorAll('.b-photo-card');
  const modal = document.getElementById('photoModal');
  if (!modal || !photoCards.length) return;

  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const closeBtn = modal.querySelector('.modal-close-btn');
  const backdrop = modal.querySelector('.photo-modal-backdrop');

  function openModal(src, title, desc) {
    if (modalImg) {
      modalImg.src = src;
      modalImg.alt = title;
    }
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  photoCards.forEach((card) => {
    card.addEventListener('click', () => {
      const src = card.dataset.src;
      const title = card.dataset.title || '';
      const desc = card.dataset.desc || '';
      openModal(src, title, desc);
    });
  });

  if (closeBtn) closeBtn.onclick = closeModal;
  if (backdrop) backdrop.onclick = closeModal;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
