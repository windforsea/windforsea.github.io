document.addEventListener('DOMContentLoaded', () => {
  const tabContainer = document.querySelector('.tab-container');
  
  if (tabContainer) {
    tabContainer.addEventListener('mouseenter', () => {
      document.body.classList.add('nav-hovered');
    });

    tabContainer.addEventListener('mouseleave', () => {
      document.body.classList.remove('nav-hovered');
    });
  }
});
