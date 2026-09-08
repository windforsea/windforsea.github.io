document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  /**
   * Switch active tab by target ID
   * @param {string} targetId - ID of the tab panel to show
   */
  function switchTab(targetId) {
    // 1. Update tab buttons
    tabButtons.forEach((btn) => {
      const isTarget = btn.getAttribute('data-target') === targetId;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    // 2. Update tab panels
    tabPanels.forEach((panel) => {
      const isTarget = panel.id === targetId;
      panel.classList.toggle('active', isTarget);
    });

    // 3. Update URL hash without scrolling
    if (history.pushState) {
      history.pushState(null, '', `#${targetId}`);
    } else {
      location.hash = targetId;
    }
  }

  // Add click listeners to tab buttons
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      if (targetId) {
        switchTab(targetId);
      }
    });
  });

  // Handle URL hash on initial load
  const currentHash = window.location.hash.replace('#', '');
  if (currentHash && document.getElementById(currentHash)) {
    switchTab(currentHash);
  }

  // Support browser Back/Forward navigation
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
      switchTab(hash);
    }
  });
});
