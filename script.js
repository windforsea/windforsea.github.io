/**
 * windforsea portfolio - Smooth Seamless Transitions & Liquid Glass Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. 초기 로드 시 페이드 진입
  document.body.classList.remove('page-leaving');

  // 2. 탭 컨테이너 호버 감지
  initTabHover();

  // 3. 탭 & 홈 전환 시 부드러운 전환 (알게 모르게 스르륵 바뀌는 효과)
  initSmoothTransitions();
});

// 뒤로가기/앞으로가기 시 페이지가 숨겨진 상태로 남지 않도록 복원
window.addEventListener('pageshow', () => {
  document.body.classList.remove('page-leaving');
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
      // GitHub Pages / 웹서버 환경: 사진과 본문이 알게 모르게 스르륵 페이드되는 SPA 전환
      navigateSmoothSpa(targetUrl, href);
    } else {
      // 로컬 file:// 환경: 브라우저 깜빡임 없이 부드러운 페이드아웃 후 전환
      navigateSmoothFallback(href);
    }
  });

  if (isHttp) {
    window.addEventListener('popstate', () => {
      navigateSmoothSpa(window.location.href, window.location.pathname, false);
    });
  }
}

// 로컬 환경을 위한 부드러운 페이드아웃 전환
function navigateSmoothFallback(href) {
  document.body.classList.add('page-leaving');
  setTimeout(() => {
    window.location.href = href;
  }, 350);
}

// 웹서버/GitHub Pages 환경을 위한 알게 모르게 바뀌는 시네마틱 크로스페이드
async function navigateSmoothSpa(url, relativeHref, pushHistory = true) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Fetch failed');
    const htmlText = await response.text();

    const parser = new DOMParser();
    const newDoc = parser.parseFromString(htmlText, 'text/html');

    // 1. 배경 이미지 부드러운 크로스 페이드
    const currentBgImg = document.querySelector('.background-image');
    const newBgImg = newDoc.querySelector('.background-image');
    if (currentBgImg && newBgImg && currentBgImg.getAttribute('src') !== newBgImg.getAttribute('src')) {
      currentBgImg.style.opacity = '0';
      setTimeout(() => {
        currentBgImg.src = newBgImg.getAttribute('src');
        currentBgImg.alt = newBgImg.alt || '';
        currentBgImg.style.opacity = '1';
      }, 400);
    }

    // 2. 메인 본문 카드 부드러운 전환
    const currentPageContainer = document.querySelector('.page-container');
    const newPageContainer = newDoc.querySelector('.page-container');

    if (currentPageContainer) {
      currentPageContainer.style.opacity = '0';
      currentPageContainer.style.transform = 'translateY(10px)';
    }

    setTimeout(() => {
      // 서브페이지 여부 업데이트
      const isNewSubpage = newDoc.body.classList.contains('subpage');
      if (isNewSubpage) {
        document.body.classList.add('subpage');
      } else {
        document.body.classList.remove('subpage');
      }

      // 본문 교체
      if (newPageContainer) {
        if (currentPageContainer) {
          currentPageContainer.innerHTML = newPageContainer.innerHTML;
          currentPageContainer.style.opacity = '1';
          currentPageContainer.style.transform = 'translateY(0)';
        } else {
          // 홈에서 서브페이지로 전환 시
          const header = document.querySelector('.top-nav-bar');
          if (header) {
            header.insertAdjacentElement('afterend', newPageContainer.cloneNode(true));
          }
        }
      } else if (currentPageContainer) {
        // 서브페이지에서 홈으로 전환 시 본문 제거
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

      // 5. 타이틀 갱신 및 히스토리 푸시
      document.title = newDoc.title;
      if (pushHistory) {
        history.pushState({ url }, '', url);
      }
    }, 320);

  } catch (err) {
    // 네트워크 오류 또는 file:// 보안 정책 시 fallback 실행
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
