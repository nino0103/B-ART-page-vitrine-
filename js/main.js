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


  (() => {
   
    const track = document.querySelector('.carousel__track');
console.log('track =', track);

    const slides = Array.from(track.children);
    const prevBtn = document.querySelector('.slider__arrow--prev');
    const nextBtn = document.querySelector('.slider__arrow--next');
    const slideWidth = slides[0].getBoundingClientRect().width + parseInt(getComputedStyle(slides[0]).marginRight);
    let index = 0;
  
    function updatePosition() {
      track.style.transform = `translateX(-${index * slideWidth}px)`;
    }
  
    prevBtn.addEventListener('click', () => {
      if (index > 0) {
        index--;
        updatePosition();
      }
    });
  
    nextBtn.addEventListener('click', () => {
      if (index < slides.length - 1) {
        index++;
        updatePosition();
      }
    });
  })();

  function initCarousel() {
    const track = document.querySelector('.carousel__track');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
  
    let currentIndex = 0;
  
    function showSlide(index) {
      const offset = -index * 100;
      track.style.transform = `translateX(${offset}%)`;
    }
  
    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    }
  
    function prevSlide() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    }
  
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
  
    // Optionnel : défilement automatique toutes les 5 secondes
    setInterval(nextSlide, 5000);
  
    showSlide(currentIndex); // Initialiser à la slide 0
  }
  
  // Exécuter après chargement du DOM
  document.addEventListener('DOMContentLoaded', function () {
    initCarousel();
  });
   