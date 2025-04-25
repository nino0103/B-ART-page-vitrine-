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




(function () {
    const menuButton = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.nav');
    if (!menuButton || !mainNav) return;
  
    menuButton.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('active');
      menuButton.textContent = isOpen ? '✖' : '☰';
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
  
    setInterval(nextSlide, 5000);
    showSlide(currentIndex);
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    initCarousel();
});

function initTestimonialsCarousel() {
    const track = document.querySelector('.testimonials__list');
    if (!track) return;
    const slides = Array.from(track.children);
    const count = slides.length;
    if (count === 0) return;
  
    // largeur d'une slide (on suppose toutes les mêmes)
    let slideWidth = track.parentElement.getBoundingClientRect().width * 0.6 + 20; // 60% + margin
  
    // 1) Clonage pour l'infini
    const prepend = slides.map(s => s.cloneNode(true));
    const append  = slides.map(s => s.cloneNode(true));
    prepend.forEach(s => track.insertBefore(s, track.firstChild));
    append.forEach (s => track.appendChild(s));
  
    // On recalcule toutes les slides
    const allSlides = Array.from(track.children);
    track.style.width = `${allSlides.length * slideWidth}px`;
  
    // 2) Position initiale sur le premier slide original
    let index = count;
    track.style.transform = `translateX(${-index * slideWidth}px)`;
  
    // 3) Fonction de "snap" vers un index
    function goTo(i, instant = false) {
      if (instant) track.style.transition = 'none';
      else       track.style.transition = 'transform 0.5s ease';
  
      index = i;
      track.style.transform = `translateX(${-index * slideWidth}px)`;
    }
  
    // 4) Quand l’animation se termine, on « saute » si on est sur un clone
    track.addEventListener('transitionend', () => {
      if (index < count)        goTo(index + count, true);
      else if (index >= count*2) goTo(index - count, true);
    });
  
    // 5) Drag avec Pointer Events
    let startX, baseTranslate, isDown = false;
  
    track.addEventListener('pointerdown', e => {
      isDown = true;
      startX = e.clientX;
      // extraire la valeur numérique actuelle du translateX
      baseTranslate = -index * slideWidth;
      track.style.transition = 'none';
      track.setPointerCapture(e.pointerId);
    });
  
    track.addEventListener('pointermove', e => {
      if (!isDown) return;
      const delta = e.clientX - startX;
      track.style.transform = `translateX(${baseTranslate + delta}px)`;
    });
  
    track.addEventListener('pointerup', e => {
      isDown = false;
      const delta = (e.clientX - startX);
      // si on a bougé d’un quart de slide, on change d’index
      if      (delta < -slideWidth/4) goTo(index + 1);
      else if (delta >  slideWidth/4) goTo(index - 1);
      else                             goTo(index);
    });
  
    track.addEventListener('pointerleave', e => {
      if (isDown) track.dispatchEvent(new PointerEvent('pointerup', e));
    });
  
    // 6) Auto-play
    let autoplay = setInterval(() => goTo(index + 1), 5000);
    track.addEventListener('pointerdown', () => clearInterval(autoplay));
  
    // 7) Recalculer au resize
    window.addEventListener('resize', () => {
      slideWidth = track.parentElement.getBoundingClientRect().width * 0.6 + 20;
      goTo(index, true);
    });
  }
  
  document.addEventListener('DOMContentLoaded', initTestimonialsCarousel);

  document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.testimonials__list');
    const slides = Array.from(track.children);
    const gap = parseInt(getComputedStyle(track).gap) || 0;
    const slideWidth = slides[0].offsetWidth + gap;
    let position = 0;
    const speed = 0.5; // pixels par frame, ajuste pour accélérer/ralentir
  
    // 1) Duplique tous les slides pour la boucle infinie
    slides.forEach(slide => {
      const clone = slide.cloneNode(true);
      track.appendChild(clone);
    });
  
    // 2) Animation continue
    let isDragging = false;
    let startX, startPos;
  
    function animate() {
      if (!isDragging) {
        position -= speed;
        // Quand on a défilé la largeur “originale”, on reset
        if (Math.abs(position) >= slideWidth * slides.length) {
          position = 0;
        }
        track.style.transform = `translateX(${position}px)`;
      }
      requestAnimationFrame(animate);
    }
    animate();
  
    // 3) Gestion du drag pour mettre en pause l’auto-scroll
    track.style.cursor = 'grab';
    track.addEventListener('pointerdown', e => {
      isDragging = true;
      startX = e.clientX;
      startPos = position;
      track.setPointerCapture(e.pointerId);
      track.style.cursor = 'grabbing';
    });
  
    track.addEventListener('pointermove', e => {
      if (!isDragging) return;
      const delta = e.clientX - startX;
      position = startPos + delta;
      track.style.transform = `translateX(${position}px)`;
    });
  
    function endDrag(e) {
      isDragging = false;
      track.releasePointerCapture(e.pointerId);
      track.style.cursor = 'grab';
    }
  
    track.addEventListener('pointerup',   endDrag);
    track.addEventListener('pointercancel',endDrag);
    track.addEventListener('pointerleave', endDrag);
  });
  