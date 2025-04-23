  (function() {
    const menuButton = document.querySelector('.menu-toggle');
    const mainNav    = document.querySelector('.nav');
    if (!menuButton || !mainNav) return; // on sort si les éléments n'existent pas

    menuButton.addEventListener('click', function() {
      const isOpen = mainNav.classList.toggle('active');

      // bascule l’icône en fonction de l’état du menu
      menuButton.textContent = isOpen ? '✖' : '☰';
    });
  })();
