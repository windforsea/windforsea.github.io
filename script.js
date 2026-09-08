document.addEventListener('DOMContentLoaded', () => {
  const homeBtn = document.getElementById('homeBtn');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const contentPanels = document.querySelectorAll('.content-panel');
  const body = document.body;

  /**
   * Return to pure fullpage Home state
   */
  function showHome() {
    body.classList.remove('content-active');

    // Deactivate all tab buttons & panels
    tabButtons.forEach((btn) => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });

    contentPanels.forEach((panel) => {
      panel.classList.remove('active');
    });

    // Activate home button
    if (homeBtn) {
      homeBtn.classList.add('active');
    }

    // Update URL hash
    if (history.pushState) {
      history.pushState(null, '', window.location.pathname);
    } else {
      location.hash = '';
    }
  }

  /**
   * Switch to a specific tab panel
   * @param {string} targetId - ID of the content panel
   */
  function switchTab(targetId) {
    if (targetId === 'home' || !targetId) {
      showHome();
      return;
    }

    const targetPanel = document.getElementById(targetId);
    if (!targetPanel) {
      showHome();
      return;
    }

    body.classList.add('content-active');

    if (homeBtn) {
      homeBtn.classList.remove('active');
    }

    // Update tab buttons
    tabButtons.forEach((btn) => {
      const isTarget = btn.getAttribute('data-target') === targetId;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    // Update content panels
    contentPanels.forEach((panel) => {
      panel.classList.toggle('active', panel.id === targetId);
    });

    // Update URL hash
    if (history.pushState) {
      history.pushState(null, '', `#${targetId}`);
    } else {
      location.hash = targetId;
    }
  }

  // Home button click listener
  if (homeBtn) {
    homeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showHome();
    });
  }

  // Tab buttons click listeners
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      switchTab(targetId);
    });
  });

  // Handle URL hash on initial load
  const currentHash = window.location.hash.replace('#', '');
  if (currentHash && currentHash !== 'home') {
    switchTab(currentHash);
  } else {
    showHome();
  }

  // Support browser Back/Forward buttons
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && hash !== 'home') {
      switchTab(hash);
    } else {
      showHome();
    }
  });
});
