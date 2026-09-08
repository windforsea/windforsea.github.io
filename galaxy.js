/**
 * Nebula Ocean Edition - galaxy.js
 * Zero-Asset Interactive Particle Canvas Engine & 3D Glass Physics
 * @windforsea
 */

document.addEventListener('DOMContentLoaded', () => {
  initNebulaCanvas();
  initTiltCards();
  initDeckCarousel();
  initSkillsPhysics();
  initSectionSpy();
});

/* ==========================================================================
   1. Realtime Nebula & Deep Ocean Particle Engine (0MB Pure Canvas)
   ========================================================================== */
function initNebulaCanvas() {
  const canvas = document.getElementById('nebulaCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const isMobile = width < 768;
  const particleCount = isMobile ? 420 : 1100;
  const particles = [];

  const mouse = {
    x: width / 2,
    y: height / 2,
    isHovered: false,
    radius: isMobile ? 130 : 190,
  };

  const shockwaves = [];

  const colors = [
    { r: 56, g: 189, b: 248 },  // Cyan
    { r: 14, g: 165, b: 233 },  // Azure Blue
    { r: 129, g: 140, b: 248 }, // Nebula Purple
    { r: 96, g: 165, b: 250 },  // Electric Blue
    { r: 52, g: 211, b: 153 },  // Bioluminescent Emerald
    { r: 255, g: 255, b: 255 }  // Starlight White
  ];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() < 0.85 ? Math.random() * 1.8 + 0.6 : Math.random() * 2.8 + 1.8;
      this.baseSpeed = Math.random() * 0.55 + 0.15;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -this.baseSpeed;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.baseAlpha = Math.random() * 0.65 + 0.25;
      this.alpha = this.baseAlpha;
      this.pulseSpeed = Math.random() * 0.03 + 0.01;
      this.pulseAngle = Math.random() * Math.PI * 2;
    }

    update(time) {
      this.pulseAngle += this.pulseSpeed;
      this.alpha = this.baseAlpha + Math.sin(this.pulseAngle) * 0.22;

      // 해류/바람 수학적 벡터 유체 흐름
      const waveX = Math.sin(time * 0.0012 + this.y * 0.0035) * 0.35;
      const waveY = Math.cos(time * 0.001 + this.x * 0.003) * 0.15;
      
      this.x += this.vx + waveX;
      this.y += this.vy + waveY;

      // 마우스 인터랙션 (자석 인력 및 부드러운 소용돌이)
      if (mouse.isHovered) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 1) {
          const force = (1 - dist / mouse.radius);
          // 인력 (Attraction)
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 2.5;
          this.y += Math.sin(angle) * force * 2.5;

          // 소용돌이 접선력 (Swirl / Vortex)
          this.x += -Math.sin(angle) * force * 1.4;
          this.y += Math.cos(angle) * force * 1.4;
          this.alpha = Math.min(1, this.alpha + force * 0.4);
        }
      }

      // 클릭 쇼크웨이브 충격파 반응
      for (let i = 0; i < shockwaves.length; i++) {
        const sw = shockwaves[i];
        const dx = this.x - sw.x;
        const dy = this.y - sw.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const waveDiff = Math.abs(dist - sw.radius);

        if (waveDiff < sw.thickness) {
          const pushForce = (1 - waveDiff / sw.thickness) * sw.strength;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * pushForce * 9;
          this.y += Math.sin(angle) * pushForce * 9;
          this.alpha = 1;
        }
      }

      // 화면 경계 순환
      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
      if (this.y < -20) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${Math.max(0, this.alpha)})`;
      ctx.fill();

      // 밝은 파티클 주변 소프트 오로라 글로우
      if (this.size > 2.2) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha * 0.15})`;
        ctx.fill();
      }
    }
  }

  // 파티클 생성
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // 마우스 및 터치 이벤트
  function onPointerMove(e) {
    mouse.x = e.clientX || (e.touches && e.touches[0].clientX) || width / 2;
    mouse.y = e.clientY || (e.touches && e.touches[0].clientY) || height / 2;
    mouse.isHovered = true;
  }

  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.isHovered = false;
  });

  // 클릭 / 탭 시 네뷸라 쇼크웨이브 생성
  function triggerShockwave(x, y) {
    shockwaves.push({
      x: x,
      y: y,
      radius: 5,
      maxRadius: Math.min(width, height) * 0.52,
      speed: 14,
      thickness: 45,
      strength: 1.0,
      opacity: 0.85
    });
  }

  window.addEventListener('click', (e) => {
    // 인터랙티브 버튼 클릭이 아닐 때 파동 생성
    if (!e.target.closest('a, button, input, .deck-card')) {
      triggerShockwave(e.clientX, e.clientY);
    }
  });

  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0] && !e.target.closest('a, button, input')) {
      triggerShockwave(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // 리사이즈 처리
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, 150);
  });

  // 메인 애니메이션 루프
  let lastTime = 0;
  function animate(time) {
    ctx.clearRect(0, 0, width, height);

    // 쇼크웨이브 업데이트 및 그리기
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.radius += sw.speed;
      sw.strength *= 0.96;
      sw.opacity *= 0.95;

      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56, 189, 248, ${sw.opacity * 0.45})`;
      ctx.lineWidth = 3;
      ctx.stroke();

      if (sw.radius > sw.maxRadius || sw.opacity < 0.02) {
        shockwaves.splice(i, 1);
      }
    }

    // 파티클 업데이트 및 렌더링
    for (let i = 0; i < particles.length; i++) {
      particles[i].update(time);
      particles[i].draw();
    }

    // 마우스 주변 별자리 네트워크 연결선 (Constellation Effect)
    if (mouse.isHovered && !isMobile) {
      const connectDist = 65;
      for (let i = 0; i < particles.length; i += 3) {
        const p1 = particles[i];
        const dMouse = Math.hypot(p1.x - mouse.x, p1.y - mouse.y);
        if (dMouse > mouse.radius) continue;

        for (let j = i + 1; j < particles.length; j += 4) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < connectDist) {
            const lineAlpha = (1 - dist / connectDist) * (1 - dMouse / mouse.radius) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/* ==========================================================================
   2. 3D Tilt & Specular Glare Physics
   ========================================================================== */
function initTiltCards() {
  const tiltElements = document.querySelectorAll('[data-tilt], #heroAvatarCard');
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) return; // 모바일/터치는 성능을 위해 CSS 기본 적용

  tiltElements.forEach((el) => {
    const glare = el.querySelector('.card-glare');

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // 회전 각도 계산 (최대 +- 9도)
      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      if (glare) {
        glare.style.opacity = '1';
        glare.style.background = `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(255, 255, 255, 0.16) 0%, transparent 65%)`;
      }
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      if (glare) {
        glare.style.opacity = '0';
      }
    });

    el.addEventListener('mouseenter', () => {
      el.style.transition = 'none';
    });
  });
}

/* ==========================================================================
   3. 3D Perspective Deck Carousel (Projects Showcase)
   ========================================================================== */
function initDeckCarousel() {
  const cards = document.querySelectorAll('.deck-card');
  const dots = document.querySelectorAll('.deck-dot');
  const prevBtn = document.getElementById('deckPrevBtn');
  const nextBtn = document.getElementById('deckNextBtn');
  const total = cards.length;
  if (!total) return;

  let currentIndex = 0;

  function updateDeck(newIndex) {
    currentIndex = (newIndex + total) % total;

    cards.forEach((card, idx) => {
      card.classList.remove('active', 'prev', 'next', 'hidden');

      if (idx === currentIndex) {
        card.classList.add('active');
      } else if (idx === (currentIndex - 1 + total) % total) {
        card.classList.add('prev');
      } else if (idx === (currentIndex + 1) % total) {
        card.classList.add('next');
      } else {
        card.classList.add('hidden');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // 카드 직접 클릭 시 해당 카드로 회전 이동
  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return; // 링크 클릭은 통과
      const targetIdx = parseInt(card.dataset.index, 10);
      if (targetIdx !== currentIndex) {
        updateDeck(targetIdx);
      }
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => updateDeck(currentIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => updateDeck(currentIndex + 1));
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      updateDeck(idx);
    });
  });

  // 키보드 좌우 화살표 탐색
  window.addEventListener('keydown', (e) => {
    const projectsSec = document.getElementById('projects');
    if (!projectsSec) return;
    const rect = projectsSec.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;

    if (inView) {
      if (e.key === 'ArrowLeft') updateDeck(currentIndex - 1);
      if (e.key === 'ArrowRight') updateDeck(currentIndex + 1);
    }
  });

  // 마우스 휠 부드러운 슬라이드
  const carouselWrapper = document.querySelector('.deck-stage-wrapper');
  if (carouselWrapper) {
    let wheelDebounce = false;
    carouselWrapper.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) > 30 || Math.abs(e.deltaY) > 50) {
        if (!wheelDebounce) {
          wheelDebounce = true;
          if (e.deltaX > 0 || e.deltaY > 0) {
            updateDeck(currentIndex + 1);
          } else {
            updateDeck(currentIndex - 1);
          }
          setTimeout(() => { wheelDebounce = false; }, 400);
        }
      }
    }, { passive: true });
  }

  // 초기 상태 렌더링
  updateDeck(0);
}

/* ==========================================================================
   4. Interactive Skills Physics Repulsion
   ========================================================================== */
function initSkillsPhysics() {
  const bubbles = document.querySelectorAll('.skill-bubble');
  if (!bubbles.length) return;

  bubbles.forEach((bubble) => {
    bubble.addEventListener('mousemove', (e) => {
      const rect = bubble.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      bubble.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px) scale(1.12)`;
    });

    bubble.addEventListener('mouseleave', () => {
      bubble.style.transform = 'translate(0px, 0px) scale(1)';
    });
  });
}

/* ==========================================================================
   5. Section Scroll Spy
   ========================================================================== */
function initSectionSpy() {
  const sections = document.querySelectorAll('.galaxy-section');
  const navLinks = document.querySelectorAll('.sec-nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px'
  });

  sections.forEach((sec) => observer.observe(sec));
}
