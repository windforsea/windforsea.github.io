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
    'Chapter 02 • 프로젝트 (1/4)',
    'Chapter 02 • 프로젝트 (2/4)',
    'Chapter 02 • 프로젝트 (3/4)',
    'Chapter 02 • 프로젝트 (4/4)',
    'Chapter 03 • 방명록'
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

    // 2. 상단 3개 책갈피 리본 활성화 갱신
    bookmarks.forEach((bm) => {
      const pageNum = parseInt(bm.dataset.page, 10);
      let isActive = false;
      if (pageNum === 1 && currentPage === 1) {
        isActive = true;
      } else if (pageNum === 2 && (currentPage >= 2 && currentPage <= 5)) {
        isActive = true;
      } else if (pageNum === 6 && currentPage === 6) {
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

    // 6. 방명록 페이지 진입 시 데이터 자동 로드
    if (currentPage === 5 && typeof window.loadGuestbookMessages === 'function') {
      window.loadGuestbookMessages();
    }
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

  // --- 방명록(Guestbook) 모듈 초기화 ---
  initBookGuestbook();
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

/**
 * 방명록(Guestbook) 통합 컨트롤러
 * Supabase 보안 RPC 및 XSS 방어 렌더링
 */
function initBookGuestbook() {
  const form = document.getElementById('guestbookForm');
  if (!form) return;

  const authorInput = document.getElementById('gbAuthor');
  const passwordInput = document.getElementById('gbPassword');
  const contentInput = document.getElementById('gbContent');
  const charCurrent = document.getElementById('gbCharCurrent');
  const submitBtn = document.getElementById('gbSubmitBtn');
  const formStatus = document.getElementById('gbFormStatus');
  const refreshBtn = document.getElementById('gbRefreshBtn');
  const messagesList = document.getElementById('gbMessagesList');
  const totalCountEl = document.getElementById('gbTotalCount');

  // 삭제 모달 엘리먼트
  const deleteModal = document.getElementById('gbDeleteModal');
  const deleteModalClose = document.getElementById('gbModalClose');
  const deleteModalCancel = document.getElementById('gbModalCancel');
  const deleteModalConfirm = document.getElementById('gbModalConfirm');
  const deletePasswordInput = document.getElementById('gbDeletePasswordInput');
  const deleteModalError = document.getElementById('gbModalError');
  const deleteBackdrop = document.getElementById('gbModalBackdrop');

  let activeDeleteId = null;
  let isSubmitting = false;
  let isDeleting = false;

  // 글자수 카운터
  if (contentInput && charCurrent) {
    contentInput.addEventListener('input', () => {
      charCurrent.textContent = contentInput.value.length;
    });
  }

  // 시간 포맷팅 헬퍼 (상대 시간)
  function formatRelativeTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return '방금 전';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}분 전`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}시간 전`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 7) return `${diffDay}일 전`;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  }

  // 상태 메시지 표시
  function showStatus(text, type = 'success', duration = 3500) {
    if (!formStatus) return;
    formStatus.textContent = text;
    formStatus.className = `gb-form-status ${type}`;
    if (duration > 0) {
      setTimeout(() => {
        if (formStatus.textContent === text) {
          formStatus.textContent = '';
          formStatus.className = 'gb-form-status';
        }
      }, duration);
    }
  }

  // 방명록 목록 불러오기 및 렌더링 (XSS 방지)
  async function loadGuestbookMessages() {
    if (!messagesList) return;
    if (!window.GuestbookAPI) {
      messagesList.innerHTML = '<div class="gb-empty-state"><span class="empty-icon">⚠️</span><p>Supabase 연동 모듈을 불러올 수 없습니다.</p></div>';
      return;
    }

    try {
      const entries = await window.GuestbookAPI.fetch();
      if (totalCountEl) {
        totalCountEl.textContent = entries.length;
      }

      if (!entries || entries.length === 0) {
        messagesList.innerHTML = `
          <div class="gb-empty-state">
            <span class="empty-icon">🌱</span>
            <p>아직 등록된 방명록이 없습니다.<br />첫 번째 방문 메시지를 남겨보세요!</p>
          </div>
        `;
        return;
      }

      messagesList.innerHTML = '';
      entries.forEach((item) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'gb-message-item';
        itemEl.dataset.id = item.id;

        // 상단 헤더 (작성자, 시간, 삭제 버튼)
        const headerEl = document.createElement('div');
        headerEl.className = 'gb-item-header';

        const authorWrap = document.createElement('div');
        authorWrap.className = 'gb-item-author-wrap';

        const authorBadge = document.createElement('span');
        authorBadge.className = 'gb-author-badge';
        authorBadge.textContent = item.name; // XSS 방어: textContent

        const timeSpan = document.createElement('span');
        timeSpan.className = 'gb-item-time';
        timeSpan.textContent = formatRelativeTime(item.created_at);

        authorWrap.appendChild(authorBadge);
        authorWrap.appendChild(timeSpan);

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'gb-delete-trigger-btn';
        deleteBtn.title = '방명록 삭제';
        deleteBtn.setAttribute('aria-label', '방명록 삭제');
        deleteBtn.textContent = '🗑️';
        deleteBtn.addEventListener('click', () => {
          openDeleteModal(item.id);
        });

        headerEl.appendChild(authorWrap);
        headerEl.appendChild(deleteBtn);

        // 본문 내용
        const contentEl = document.createElement('p');
        contentEl.className = 'gb-item-content';
        contentEl.textContent = item.content; // XSS 방어: textContent

        itemEl.appendChild(headerEl);
        itemEl.appendChild(contentEl);
        messagesList.appendChild(itemEl);
      });
    } catch (err) {
      console.error('방명록 로딩 중 오류:', err);
      messagesList.innerHTML = `
        <div class="gb-empty-state">
          <span class="empty-icon">⚠️</span>
          <p>방명록 목록을 가져오지 못했습니다.<br />잠시 후 다시 시도해 주세요.</p>
        </div>
      `;
    }
  }

  // 전역 등록 (goToPage 등 외부 호출용)
  window.loadGuestbookMessages = loadGuestbookMessages;

  // 폼 등록 이벤트
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const name = (authorInput.value || '').trim();
    const password = (passwordInput.value || '').trim();
    const content = (contentInput.value || '').trim();

    if (!name) {
      showStatus('작성자 이름을 입력해주세요.', 'error');
      authorInput.focus();
      return;
    }
    if (!password || password.length < 4) {
      showStatus('삭제 비밀번호를 4자 이상 입력해주세요.', 'error');
      passwordInput.focus();
      return;
    }
    if (!content) {
      showStatus('방명록 내용을 입력해주세요.', 'error');
      contentInput.focus();
      return;
    }

    try {
      isSubmitting = true;
      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text').textContent = '등록 중...';

      const result = await window.GuestbookAPI.add(name, password, content);

      if (result && !result.success) {
        showStatus(result.message || '등록 중 오류가 발생했습니다.', 'error');
        return;
      }

      // 성공 처리
      form.reset();
      if (charCurrent) charCurrent.textContent = '0';
      showStatus('소중한 방명록이 등록되었습니다! ✨', 'success');
      await loadGuestbookMessages();
    } catch (err) {
      console.error('방명록 등록 실패:', err);
      showStatus('등록 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
    } finally {
      isSubmitting = false;
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = '방명록 등록하기';
    }
  });

  // 새로고침 버튼 클릭
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadGuestbookMessages();
    });
  }

  // 삭제 모달 관리
  function openDeleteModal(id) {
    activeDeleteId = id;
    if (deletePasswordInput) {
      deletePasswordInput.value = '';
    }
    if (deleteModalError) {
      deleteModalError.textContent = '';
    }
    if (deleteModal) {
      deleteModal.classList.add('active');
      deleteModal.setAttribute('aria-hidden', 'false');
      setTimeout(() => {
        if (deletePasswordInput) deletePasswordInput.focus();
      }, 100);
    }
  }

  function closeDeleteModal() {
    activeDeleteId = null;
    if (deleteModal) {
      deleteModal.classList.remove('active');
      deleteModal.setAttribute('aria-hidden', 'true');
    }
    if (deletePasswordInput) {
      deletePasswordInput.value = '';
    }
    if (deleteModalError) {
      deleteModalError.textContent = '';
    }
  }

  if (deleteModalClose) deleteModalClose.addEventListener('click', closeDeleteModal);
  if (deleteModalCancel) deleteModalCancel.addEventListener('click', closeDeleteModal);
  if (deleteBackdrop) deleteBackdrop.addEventListener('click', closeDeleteModal);

  // 삭제 확인 실행
  if (deleteModalConfirm) {
    deleteModalConfirm.addEventListener('click', async () => {
      if (isDeleting || !activeDeleteId) return;

      const password = (deletePasswordInput.value || '').trim();
      if (!password) {
        if (deleteModalError) deleteModalError.textContent = '비밀번호를 입력해주세요.';
        deletePasswordInput.focus();
        return;
      }

      try {
        isDeleting = true;
        deleteModalConfirm.disabled = true;
        deleteModalConfirm.textContent = '삭제 중...';
        if (deleteModalError) deleteModalError.textContent = '';

        const result = await window.GuestbookAPI.delete(activeDeleteId, password);

        if (result && result.success) {
          closeDeleteModal();
          showStatus('방명록 글이 삭제되었습니다.', 'success');
          await loadGuestbookMessages();
        } else {
          const msg = (result && result.message) ? result.message : '비밀번호가 일치하지 않습니다.';
          if (deleteModalError) deleteModalError.textContent = msg;
          deletePasswordInput.focus();
        }
      } catch (err) {
        console.error('방명록 삭제 오류:', err);
        if (deleteModalError) deleteModalError.textContent = '삭제 처리 중 오류가 발생했습니다.';
      } finally {
        isDeleting = false;
        deleteModalConfirm.disabled = false;
        deleteModalConfirm.textContent = '삭제 확인';
      }
    });
  }

  // 엔터키로 삭제 확인 실행
  if (deletePasswordInput) {
    deletePasswordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (deleteModalConfirm) deleteModalConfirm.click();
      }
    });
  }
}
