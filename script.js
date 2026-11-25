/* ==========================================================================
   LOWBASS5 RECORDING STUDIO - IN-PAGE SMOOTH SCROLL & ACTIVE SCROLLSPY
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const homeButton = document.getElementById('home-button');
  const navAboutBtn = document.getElementById('nav-about-btn');
  const navPortfolioBtn = document.getElementById('nav-portfolio-btn');
  const navGalleryBtn = document.getElementById('nav-gallery-btn');
  const navReviewsBtn = document.getElementById('nav-reviews-btn');
  const navContactBtn = document.getElementById('nav-contact-btn');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const headerNav = document.getElementById('header-nav') || document.querySelector('.header-nav');

  // Mobile Hamburger Menu Toggle Controller
  if (mobileMenuToggle && headerNav) {
    function toggleMobileMenu(forceClose = false) {
      const isCurrentlyOpen = mobileMenuToggle.classList.contains('open');
      const shouldOpen = forceClose ? false : !isCurrentlyOpen;

      mobileMenuToggle.classList.toggle('open', shouldOpen);
      headerNav.classList.toggle('open', shouldOpen);
      mobileMenuToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
      mobileMenuToggle.setAttribute('aria-label', shouldOpen ? 'Închide meniul de navigare' : 'Deschide meniul de navigare');
    }

    mobileMenuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Close mobile menu when tapping navigation links/buttons (except contact toggle)
    const navItems = headerNav.querySelectorAll('.header-nav-btn, .terms-back-btn');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        if (item.id !== 'nav-contact-btn') {
          toggleMobileMenu(true);
        }
      });
    });

    // Close when clicking outside header
    document.addEventListener('click', (e) => {
      const studioHeader = document.querySelector('.studio-header');
      if (studioHeader && !studioHeader.contains(e.target)) {
        if (mobileMenuToggle.classList.contains('open')) {
          toggleMobileMenu(true);
        }
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenuToggle.classList.contains('open')) {
        toggleMobileMenu(true);
      }
    });

    // Auto-close on viewport resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && mobileMenuToggle.classList.contains('open')) {
        toggleMobileMenu(true);
      }
    }, { passive: true });
  }

  function smoothScrollTo(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Home Button (Logo in top-left)
  if (homeButton) {
    homeButton.addEventListener('click', (e) => {
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const frame = homeButton.querySelector('.brand-frame');
        if (frame) {
          frame.style.transform = 'scale(0.96)';
          setTimeout(() => frame.style.transform = '', 200);
        }
      }
    });
  }

  // Header Navigation buttons
  if (navAboutBtn) {
    navAboutBtn.addEventListener('click', (e) => {
      const el = document.getElementById('about');
      if (el) {
        e.preventDefault();
        smoothScrollTo('about');
      }
    });
  }

  if (navPortfolioBtn) {
    navPortfolioBtn.addEventListener('click', (e) => {
      const el = document.getElementById('portfolio');
      if (el) {
        e.preventDefault();
        smoothScrollTo('portfolio');
      }
    });
  }

  if (navReviewsBtn) {
    navReviewsBtn.addEventListener('click', (e) => {
      const el = document.getElementById('reviews');
      if (el) {
        e.preventDefault();
        smoothScrollTo('reviews');
      }
    });
  }

  // Contact Button Toggle Popover
  const contactPopover = document.getElementById('contact-popover');
  if (navContactBtn && contactPopover) {
    navContactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = contactPopover.classList.toggle('open');
      navContactBtn.classList.toggle('active', isOpen);
      navContactBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      contactPopover.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    });

    // Close when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (!contactPopover.contains(e.target) && e.target !== navContactBtn) {
        contactPopover.classList.remove('open');
        navContactBtn.classList.remove('active');
        navContactBtn.setAttribute('aria-expanded', 'false');
        contactPopover.setAttribute('aria-hidden', 'true');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && contactPopover.classList.contains('open')) {
        contactPopover.classList.remove('open');
        navContactBtn.classList.remove('active');
        navContactBtn.setAttribute('aria-expanded', 'false');
        contactPopover.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Scrollspy: Highlight the current active section in the header nav
  const sections = [
    { id: 'hero', btn: null },
    { id: 'about', btn: navAboutBtn },
    { id: 'portfolio', btn: navPortfolioBtn },
    
    { id: 'reviews', btn: navReviewsBtn }
  ];

  function updateActiveNav() {
    const scrollPos = window.scrollY + 220;

    let currentSection = 'hero';
    sections.forEach(sec => {
      const el = document.getElementById(sec.id);
      if (el && el.offsetTop <= scrollPos) {
        currentSection = sec.id;
      }
    });

    sections.forEach(sec => {
      if (sec.btn) {
        sec.btn.classList.toggle('active', sec.id === currentSection);
      }
    });
  }

  // Dynamic Header Transition: Smooth blend on hero, clearly delimited on scroll
  const studioHeader = document.querySelector('.studio-header');
  function handleHeaderScroll() {
    if (!studioHeader) return;
    if (window.scrollY > 40) {
      studioHeader.classList.add('scrolled');
    } else {
      studioHeader.classList.remove('scrolled');
    }
  }

  function onScroll() {
    handleHeaderScroll();
    updateActiveNav();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  handleHeaderScroll();
  updateActiveNav();

  // ==========================================================================
  // HERO BACKGROUND SLIDESHOW (Auto-advance with smooth crossfade & controls)
  // ==========================================================================
  const studioSlides = document.querySelectorAll('.studio-slide');
  const slideDots = document.querySelectorAll('.hero-slide-dot');
  const slidePrevBtn = document.getElementById('slide-prev-btn');
  const slideNextBtn = document.getElementById('slide-next-btn');

  if (studioSlides.length > 1) {
    let currentSlide = 0;
    const totalSlides = studioSlides.length;
    const slideIntervalTime = 5500; // 5.5 secunde per slide
    let slideTimer = null;

    function goToSlide(targetIndex) {
      if (targetIndex === currentSlide) return;

      studioSlides[currentSlide].classList.remove('active');
      if (slideDots[currentSlide]) {
        slideDots[currentSlide].classList.remove('active');
      }

      currentSlide = (targetIndex + totalSlides) % totalSlides;

      studioSlides[currentSlide].classList.add('active');
      if (slideDots[currentSlide]) {
        slideDots[currentSlide].classList.add('active');
      }
    }

    function nextSlide() {
      goToSlide((currentSlide + 1) % totalSlides);
    }

    function prevSlide() {
      goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
    }

    function startSlideTimer() {
      stopSlideTimer();
      slideTimer = setInterval(nextSlide, slideIntervalTime);
    }

    function stopSlideTimer() {
      if (slideTimer) {
        clearInterval(slideTimer);
        slideTimer = null;
      }
    }

    function restartSlideTimer() {
      startSlideTimer();
    }

    // Dot click events
    slideDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToSlide(idx);
        restartSlideTimer();
      });
    });

    // Arrow button events
    if (slidePrevBtn) {
      slidePrevBtn.addEventListener('click', () => {
        prevSlide();
        restartSlideTimer();
      });
    }

    if (slideNextBtn) {
      slideNextBtn.addEventListener('click', () => {
        nextSlide();
        restartSlideTimer();
      });
    }

    // Pause timer when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopSlideTimer();
      } else {
        startSlideTimer();
      }
    });

    // Start auto-advance
    startSlideTimer();
  }

  // ==========================================================================
  // STUDIO GALLERY LIGHTBOX (Interactive Fullscreen Viewer)
  // ==========================================================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryLightbox = document.getElementById('gallery-lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxCloseBtn = document.getElementById('lightbox-close');
  const lightboxPrevBtn = document.getElementById('lightbox-prev');
  const lightboxNextBtn = document.getElementById('lightbox-next');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');

  if (galleryItems.length > 0 && galleryLightbox && lightboxImage) {
    let currentLightboxIdx = 0;
    const totalGalleryItems = galleryItems.length;

    // Collect all image sources
    const gallerySources = Array.from(galleryItems).map(item => item.getAttribute('data-src'));

    function preloadGalleryImage(index) {
      if (index >= 0 && index < totalGalleryItems) {
        const img = new Image();
        img.src = gallerySources[index];
      }
    }

    function showLightboxPhoto(index) {
      currentLightboxIdx = (index + totalGalleryItems) % totalGalleryItems;

      lightboxImage.classList.remove('loaded');

      const newSrc = gallerySources[currentLightboxIdx];
      const tempImg = new Image();
      tempImg.onload = () => {
        lightboxImage.src = newSrc;
        lightboxImage.alt = `Lowbass5 Studio Photo ${currentLightboxIdx + 1}`;
        lightboxImage.classList.add('loaded');
      };
      tempImg.src = newSrc;

      if (lightboxCounter) {
        lightboxCounter.textContent = `${currentLightboxIdx + 1} / ${totalGalleryItems}`;
      }

      // Preload adjacent images
      preloadGalleryImage((currentLightboxIdx + 1) % totalGalleryItems);
      preloadGalleryImage((currentLightboxIdx - 1 + totalGalleryItems) % totalGalleryItems);
    }

    function openLightbox(index) {
      showLightboxPhoto(index);
      galleryLightbox.classList.add('open');
      galleryLightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      galleryLightbox.classList.remove('open');
      galleryLightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lightboxImage.classList.remove('loaded');
    }

    function nextLightboxPhoto() {
      showLightboxPhoto(currentLightboxIdx + 1);
    }

    function prevLightboxPhoto() {
      showLightboxPhoto(currentLightboxIdx - 1);
    }

    // Attach click and keydown (Enter/Space) to each gallery item
    galleryItems.forEach((item, idx) => {
      item.addEventListener('click', () => openLightbox(idx));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(idx);
        }
      });
    });

    // Control buttons
    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
    if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', prevLightboxPhoto);
    if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', nextLightboxPhoto);

    // Keyboard navigation (Esc, Left arrow, Right arrow)
    document.addEventListener('keydown', (e) => {
      if (!galleryLightbox.classList.contains('open')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        nextLightboxPhoto();
      } else if (e.key === 'ArrowLeft') {
        prevLightboxPhoto();
      }
    });
  }

});
