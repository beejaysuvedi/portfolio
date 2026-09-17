/**
 * Portfolio – Main JavaScript
 * Handles: navigation, typing, scroll reveals, custom cursor, theme toggle, hero entrance
 */
(function () {
  'use strict';

  // ============================================
  // THEME TOGGLE
  // ============================================
  const THEME_KEY = 'bs-portfolio-theme';

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  setTheme(getPreferredTheme());

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ============================================
  // HERO ENTRANCE
  // ============================================
  const heroContainer = document.querySelector('.hero-container');

  function revealHero() {
    if (heroContainer) heroContainer.classList.add('hero-revealed');
  }

  // Trigger hero reveal after a short delay
  setTimeout(revealHero, 100);

  // ============================================
  // CUSTOM CURSOR (desktop only)
  // ============================================
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  if (cursorDot && cursorRing && !('ontouchstart' in window)) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let dotX = 0, dotY = 0;
    let isVisible = false;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        document.body.classList.add('cursor-visible');
        isVisible = true;
      }
    });

    document.addEventListener('mouseleave', function () {
      document.body.classList.remove('cursor-visible');
      isVisible = false;
    });

    // Smooth ring follow with lerp
    function animateCursor() {
      const ringSpeed = 0.12;
      const dotSpeed = 0.25;

      ringX += (mouseX - ringX) * ringSpeed;
      ringY += (mouseY - ringY) * ringSpeed;
      dotX += (mouseX - dotX) * dotSpeed;
      dotY += (mouseY - dotY) * dotSpeed;

      cursorRing.style.transform = 'translate(' + (ringX - 18) + 'px, ' + (ringY - 18) + 'px)';
      cursorDot.style.transform = 'translate(' + (dotX - 3) + 'px, ' + (dotY - 3) + 'px)';

      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hover expansion on interactive elements
    var hoverTargets = 'a, button, .skill-card, .project-card, .tech-tag, input, textarea, .theme-toggle';
    document.querySelectorAll(hoverTargets).forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', function () {
        document.body.classList.remove('cursor-hover');
      });
    });
  }

  // ============================================
  // MOBILE NAVIGATION
  // ============================================
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');
  var navLinks = document.querySelectorAll('.nav-link');
  var overlay = null;

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);
    overlay.addEventListener('click', closeMenu);
  }

  function openMenu() {
    navMenu.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (!overlay) createOverlay();
    requestAnimationFrame(function () {
      overlay.classList.add('active');
    });
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (overlay) overlay.classList.remove('active');
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('open')) {
      closeMenu();
      if (navToggle) navToggle.focus();
    }
  });

  // ============================================
  // NAVBAR SCROLL
  // ============================================
  var navbar = document.getElementById('navbar');

  function handleNavScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ============================================
  // ACTIVE NAV LINK ON SCROLL
  // ============================================
  var sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    var scrollPos = window.scrollY + 140;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ============================================
  // TYPING EFFECT
  // ============================================
  var typedElement = document.getElementById('typed-text');
  var roles = ['Flutter Developer', 'Mobile App Developer', 'Cross-platform Enthusiast', 'Lifelong Learner'];
  var roleIndex = 0, charIndex = 0, isDeleting = false;

  function typeRole() {
    if (!typedElement) return;
    var currentRole = roles[roleIndex];

    if (isDeleting) {
      typedElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    var speed = isDeleting ? 35 : 70;

    if (!isDeleting && charIndex === currentRole.length) {
      speed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 500;
    }

    setTimeout(typeRole, speed);
  }

  // Start typing after hero reveal
  setTimeout(typeRole, 800);

  // ============================================
  // SCROLL REVEAL
  // ============================================
  var revealElements = document.querySelectorAll('.reveal');

  // Assign stagger index to children in stagger-grid containers
  document.querySelectorAll('.stagger-grid').forEach(function (grid) {
    var children = grid.querySelectorAll('.reveal');
    children.forEach(function (child, i) {
      child.style.setProperty('--i', i);
    });
  });

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.08
  });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ============================================
  // CONTACT FORM (UI only)
  // ============================================
  var contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var subject = document.getElementById('subject').value.trim();
      var message = document.getElementById('message').value.trim();

      if (!name || !email || !subject || !message) {
        alert('Please fill in all fields.');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      alert('Thank you for your message! (This form is a UI placeholder — connect a backend to send emails.)');
      contactForm.reset();
    });
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
