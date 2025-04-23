document.addEventListener('DOMContentLoaded', function () {
    const menuButton = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.nav');
  
    menuButton.addEventListener('click', function () {
      mainNav.classList.toggle('active');
  
      // Animation de l'icône : ☰ → ✖
      if (menuButton.textContent === '☰') {
        menuButton.textContent = '✖';
      } else {
        menuButton.textContent = '☰';
      }
    });
  });
   