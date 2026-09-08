/**
 * windforsea portfolio - Smooth Seamless Transitions & Liquid Glass Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. 초기 로드 시 조도 복원
  document.body.classList.remove('page-dimmed');

  // 2. 탭 컨테이너 호버 감지
  initTabHover();

  // 3. 탭 & 홈 전환 시 부드러운 전환 (어두워졌다 밝아지는 감성적 노출 트랜지션)
  initSmoothTransitions();

  // 4. 스페이스 갤러리 사진 팝업 모달
  initPhotoModal();
});

// 뒤로가기/앞으로가기 시 페이지가 어두운 상태로 남지 않도록 복원
window.addEventListener('pageshow', () => {
  document.body.classList.remove('page-dimmed');
  initPhotoModal();
});

function initTabHover() {
  const tabContainer = document.querySelector('.tab-container');
  if (!tabContainer) return;

  tabContainer.addEventListener('mouseenter', () => {
    document.body.classList.add('nav-hovered');
  });

  tabContainer.addEventListener('mouseleave', () => {
    document.body.classList.remove('nav-hovered');
  });
}

function initSmoothTransitions() {
  const isHttp = window.location.protocol.startsWith('http');

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // 외부 링크, 새 창, 앵커, mailto 등은 기본 동작 유지
    if (
      link.target === '_blank' ||
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('#') ||
      href.startsWith('javascript:')
    ) {
      return;
    }

    // 현재 활성화된 탭 클릭 시 중복 전환 방지
    if (link.classList.contains('active')) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    const targetUrl = new URL(href, window.location.href).href;

    if (isHttp) {
      // 웹 환경: 조도가 은은하게 어두워졌다가 새 풍경으로 밝아지는 시네마틱 전환
      navigateSmoothSpa(targetUrl, href);
    } else {
      // 로컬 file:// 환경: 화면이 꺼지지 않고 은은히 어두워진 뒤 전환
      navigateSmoothFallback(href);
    }
  });

  if (isHttp) {
    window.addEventListener('popstate', () => {
      navigateSmoothSpa(window.location.href, window.location.pathname, false);
    });
  }
}

// 로컬 환경을 위한 은은한 조도(밝기) 전환
function navigateSmoothFallback(href) {
  document.body.classList.add('page-dimmed');
  setTimeout(() => {
    window.location.href = href;
  }, 260);
}

// 웹서버/GitHub Pages 환경을 위한 어두워졌다 밝아지는 시네마틱 크로스페이드
async function navigateSmoothSpa(url, relativeHref, pushHistory = true) {
  try {
    // 1. 조도를 먼저 차분하게 낮춤 (화면이 꺼지지 않고 은은하게 어두워짐)
    document.body.classList.add('page-dimmed');

    const response = await fetch(url);
    if (!response.ok) throw new Error('Fetch failed');
    const htmlText = await response.text();

    const parser = new DOMParser();
    const newDoc = parser.parseFromString(htmlText, 'text/html');

    const newBgImg = newDoc.querySelector('.background-image');
    const newSrc = newBgImg ? newBgImg.getAttribute('src') : null;

    setTimeout(() => {
      // 2. 어두워진 상태에서 배경 이미지 및 본문 자연스럽게 교체
      const currentBgImg = document.querySelector('.background-image');
      if (currentBgImg && newSrc && currentBgImg.getAttribute('src') !== newSrc) {
        currentBgImg.src = newSrc;
        currentBgImg.alt = newBgImg.alt || '';
      }

      // 서브페이지 여부 업데이트
      const isNewSubpage = newDoc.body.classList.contains('subpage');
      if (isNewSubpage) {
        document.body.classList.add('subpage');
      } else {
        document.body.classList.remove('subpage');
      }

      // 본문 교체
      const currentPageContainer = document.querySelector('.page-container');
      const newPageContainer = newDoc.querySelector('.page-container');

      if (newPageContainer) {
        if (currentPageContainer) {
          currentPageContainer.innerHTML = newPageContainer.innerHTML;
        } else {
          const header = document.querySelector('.top-nav-bar');
          if (header) {
            header.insertAdjacentElement('afterend', newPageContainer.cloneNode(true));
          }
        }
      } else if (currentPageContainer) {
        currentPageContainer.remove();
      }

      // 3. 탭 & 홈 버튼 활성화 상태 부드러운 갱신
      updateNavActiveState(relativeHref);

      // 4. 워터마크 부드러운 갱신
      const currentWatermarkLoc = document.querySelector('.watermark-location');
      const newWatermarkLoc = newDoc.querySelector('.watermark-location');
      if (currentWatermarkLoc && newWatermarkLoc) {
        currentWatermarkLoc.textContent = newWatermarkLoc.textContent;
      }

      // 5. 갤러리 모달 이벤트 바인딩
      initPhotoModal();

      // 6. 타이틀 갱신 및 히스토리 푸시
      document.title = newDoc.title;
      if (pushHistory) {
        history.pushState({ url }, '', url);
      }

      // 7. 조도를 서서히 정상으로 복원 (새로운 풍경으로 밝아짐)
      setTimeout(() => {
        document.body.classList.remove('page-dimmed');
      }, 50);
    }, 240);

  } catch (err) {
    navigateSmoothFallback(relativeHref);
  }
}

function updateNavActiveState(href) {
  const cleanHref = href.split('/').pop().split('?')[0] || 'index.html';
  
  // 홈 버튼 갱신
  const homeBtn = document.querySelector('.home-btn');
  if (homeBtn) {
    if (cleanHref === 'index.html' || cleanHref === '') {
      homeBtn.classList.add('active');
    } else {
      homeBtn.classList.remove('active');
    }
  }

  // 탭 링크들 갱신
  const tabLinks = document.querySelectorAll('.tab-link');
  tabLinks.forEach((link) => {
    const linkHref = (link.getAttribute('href') || '').split('/').pop();
    if (linkHref === cleanHref) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// 스페이스 갤러리 사진 팝업 모달
function initPhotoModal() {
  const photoCards = document.querySelectorAll('.photo-card');
  if (!photoCards.length) return;

  const modal = getOrCreatePhotoModal();
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');

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

  photoCards.forEach((card) => {
    card.onclick = () => {
      const src = card.dataset.src;
      const title = card.dataset.title || '';
      const desc = card.dataset.desc || '';
      openModal(src, title, desc);
    };
  });
}

function getOrCreatePhotoModal() {
  let modal = document.getElementById('photoModal');
  if (modal) return modal;

  modal = document.createElement('div');
  modal.className = 'photo-modal';
  modal.id = 'photoModal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="photo-modal-backdrop"></div>
    <div class="photo-modal-content">
      <button type="button" class="modal-close-btn" aria-label="닫기">✕</button>
      <div class="modal-img-container">
        <img src="" alt="" class="modal-img" id="modalImg" />
      </div>
      <div class="modal-caption">
        <h4 id="modalTitle"></h4>
        <p id="modalDesc"></p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  const closeBtn = modal.querySelector('.modal-close-btn');
  const backdrop = modal.querySelector('.photo-modal-backdrop');
  if (closeBtn) closeBtn.onclick = closeModal;
  if (backdrop) backdrop.onclick = closeModal;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  return modal;
}
