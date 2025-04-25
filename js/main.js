/*
 * Menu Toggle Function
 * Cette fonction permet d'ajouter l'interactivité au bouton hamburger
 * pour ouvrir et fermer le menu de navigation.
 */
(function() {
    // Sélectionner le bouton menu et la navigation principale dans le DOM
    const menuButton = document.querySelector('.menu-toggle');
    const mainNav    = document.querySelector('.nav');
  
    // Si l'un des éléments n'existe pas, on quitte immédiatement la fonction
    if (!menuButton || !mainNav) return;
  
    /*
     * Écouteur d'événement sur le bouton menu
     * Lors d'un clic, on bascule la classe 'active' sur la navigation
     */
    menuButton.addEventListener('click', function() {
      // Toggle la classe 'active' sur la navigation et conserve l'état (ouvert/fermé)
      const isOpen = mainNav.classList.toggle('active');
  
      /*
       * Mise à jour de l'icône du bouton:
       * - si le menu est ouvert (isOpen = true) on affiche '✖'
       * - sinon on affiche '☰'
       */
      menuButton.textContent = isOpen ? '✖' : '☰';
    });
  })();
  
// initCarousel : Configure et lance le carrousel d'images avec navigation manuelle et automatique
function initCarousel() {
    // 1) Sélection des éléments du DOM :
    //    - track : élément contenant toutes les "slides" qui va défiler horizontalement
    const track = document.querySelector('.carousel__track');
    //    - slides : collection de toutes les diapos du carrousel
    const slides = document.querySelectorAll('.slide');
    //    - prevBtn / nextBtn : boutons pour passer à la diapo précédente ou suivante
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
  
    // 2) Index de la diapo actuellement visible
    let currentIndex = 0;
  
    // showSlide : Affiche la diapo correspondant à l'indice fourni
    function showSlide(index) {
      // Calcul du décalage horizontal en pourcentage : chaque slide occupe 100% de la largeur de track
      const offset = -index * 100;
      // Application du décalage via transform CSS
      track.style.transform = `translateX(${offset}%)`;
    }
  
    // nextSlide : Passe à la diapo suivante
    function nextSlide() {
      // Incrémente l'indice et revient à 0 si on dépasse le nombre de slides
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    }
  
    // prevSlide : Revient à la diapo précédente
    function prevSlide() {
      // Décrémente l'indice et passe à la dernière slide si on était à 0
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    }
  
    // 3) Gestion des clics sur les boutons pour navigation manuelle
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
  
    // 4) Configuration du défilement automatique : appel de nextSlide toutes les 5 secondes
    setInterval(nextSlide, 5000);
  
    // 5) Affichage initial de la première diapo
    showSlide(currentIndex);
  }
  
  // Lorsque le DOM est entièrement chargé, initialise le carrousel
  // Cela garantit que tous les éléments existent avant de les manipuler
  document.addEventListener('DOMContentLoaded', function () {
    initCarousel(); // Démarrage du carrousel
  });

/**
 * initTestimonialsCarousel
 * ------------------------
 * Cette fonction initialise un carrousel de témoignages "infini".
 * Elle gère le clonage des slides pour la boucle, la position initiale,
 * le snap vers un index, le drag & drop, l'autoplay et la mise à jour au resize.
 */
function initTestimonialsCarousel() {
  // 1) Récupère l'élément parent contenant tous les témoignages
  const track = document.querySelector('.testimonials__list');
  if (!track) return; // Si le conteneur n'existe pas, on arrête tout

  // 2) Transforme les enfants en tableau pour pouvoir les manipuler plus facilement
  const slides = Array.from(track.children);
  const count = slides.length;
  if (count === 0) return; // Si aucun slide, rien à faire

  // 3) Calcule la largeur d'une slide (ici 60% du conteneur + marge de 20px)
  let slideWidth = track.parentElement.getBoundingClientRect().width * 0.6 + 20;

  // 4) Clonage des slides en début et fin pour créer un effet de boucle infinie
  const prepend = slides.map(s => s.cloneNode(true));
  const append  = slides.map(s => s.cloneNode(true));
  prepend.forEach(s => track.insertBefore(s, track.firstChild));
  append.forEach (s => track.appendChild(s));

  // 5) Met à jour la largeur totale du conteneur en fonction de tous les clones + originaux
  const allSlides = Array.from(track.children);
  track.style.width = `${allSlides.length * slideWidth}px`;

  // 6) Positionne le carrousel sur la première slide "originale"
  let index = count;
  track.style.transform = `translateX(${-index * slideWidth}px)`;

  /**
   * goTo(i, instant)
   * Déplace le carrousel vers l'index i.
   * Si instant=true, désactive la transition pour un saut sans animation.
   */
  function goTo(i, instant = false) {
    if (instant) track.style.transition = 'none';
    else         track.style.transition = 'transform 0.5s ease';

    index = i;
    track.style.transform = `translateX(${-index * slideWidth}px)`;
  }

  // 7) Quand la transition se termine, si on est sur un clone, on saute sans animation
  track.addEventListener('transitionend', () => {
    if      (index < count)        goTo(index + count, true);
    else if (index >= count * 2)   goTo(index - count, true);
  });

  // 8) Gestion du drag : cliqué / bougé / relâché
  let startX, baseTranslate, isDown = false;

  // Au clic, on bloque la transition et on stocke la position initiale
  track.addEventListener('pointerdown', e => {
    isDown = true;
    startX = e.clientX;
    baseTranslate = -index * slideWidth;
    track.style.transition = 'none';
    track.setPointerCapture(e.pointerId);
  });

  // Au déplacement de la souris (ou du doigt) on fait glisser le carrousel
  track.addEventListener('pointermove', e => {
    if (!isDown) return;
    const delta = e.clientX - startX;
    track.style.transform = `translateX(${baseTranslate + delta}px)`;
  });

  // Au relâchement, on regarde si on a dépassé un quart de largeur pour changer de slide
  track.addEventListener('pointerup', e => {
    isDown = false;
    const delta = e.clientX - startX;
    if      (delta < -slideWidth / 4) goTo(index + 1);
    else if (delta >  slideWidth / 4) goTo(index - 1);
    else                               goTo(index);
  });

  // Si on sort de la zone alors qu'on drag, on simule un pointerup
  track.addEventListener('pointerleave', e => {
    if (isDown) track.dispatchEvent(new PointerEvent('pointerup', e));
  });

  // 9) Auto-play : avance automatiquement toutes les 5s
  let autoplay = setInterval(() => goTo(index + 1), 5000);
  // Si l'utilisateur interagit, on stoppe l'autoplay
  track.addEventListener('pointerdown', () => clearInterval(autoplay));

  // 10) Au redimensionnement de la fenêtre, on recalcule la largeur et on repositionne
  window.addEventListener('resize', () => {
    slideWidth = track.parentElement.getBoundingClientRect().width * 0.6 + 20;
    goTo(index, true);
  });
}

// On attend que tout le DOM soit chargé avant d’exécuter la fonction
document.addEventListener('DOMContentLoaded', () => {
    // Sélection de l’élément contenant les témoignages
    const track = document.querySelector('.testimonials__list');
    // On récupère tous les enfants (slides) dans un tableau
    const slides = Array.from(track.children);
    // On calcule l’écart (gap) défini en CSS entre les slides
    const gap = parseInt(getComputedStyle(track).gap) || 0;
    // Largeur d’une slide = largeur affichée + margin
    const slideWidth = slides[0].offsetWidth + gap;
    // Position de défilement initiale (en pixels)
    let position = 0;
    // Vitesse de défilement automatique (pixels par frame)
    const speed = 0.5;
  
    // 1) Dupliquer les slides originales pour créer l’effet de boucle infinie
    slides.forEach(slide => {
      const clone = slide.cloneNode(true);
      track.appendChild(clone);
    });
  
    // 2) Fonction d’animation principale, appelée à chaque frame
    let isDragging = false; // flag pour savoir si l’utilisateur fait un drag
    let startX, startPos;   // variables pour mémoriser le point de départ du drag
  
    function animate() {
      if (!isDragging) {
        // On décale la position vers la gauche
        position -= speed;
        // Si on a roulé toute la longueur des slides originales, on remet à zéro
        if (Math.abs(position) >= slideWidth * slides.length) {
          position = 0;
        }
        // Applique la transformation CSS
        track.style.transform = `translateX(${position}px)`;
      }
      // On demande la frame suivante
      requestAnimationFrame(animate);
    }
    // On lance l’animation
    animate();
  
    // 3) Gestion du drag pour mettre en pause l’auto-scroll
    track.style.cursor = 'grab';  // curseur indiquant qu’on peut attraper
    track.addEventListener('pointerdown', e => {
      isDragging = true;           // on passe en mode drag
      startX = e.clientX;          // point de départ du drag
      startPos = position;         // on mémorise la position courante
      track.setPointerCapture(e.pointerId);
      track.style.cursor = 'grabbing';
    });
  
    // Pendant le drag, on déplace la liste en fonction du déplacement de la souris
    track.addEventListener('pointermove', e => {
      if (!isDragging) return;
      const delta = e.clientX - startX;
      position = startPos + delta;
      track.style.transform = `translateX(${position}px)`;
    });
  
    // Fin du drag : on remet les choses en place et on relâche le pointer
    function endDrag(e) {
      isDragging = false;
      track.releasePointerCapture(e.pointerId);
      track.style.cursor = 'grab';
    }
    track.addEventListener('pointerup',    endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('pointerleave',  endDrag);
  });
  