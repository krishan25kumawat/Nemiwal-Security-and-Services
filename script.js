/* ============================================================
   NEMIWAL SECURITY & SERVICES — Site JavaScript
   Language switcher · Navigation · FAQ · Form · Animations
   ============================================================ */

(function () {
  'use strict';

  // ---- Constants ----
  const PHONE = '+917734984896';
  const WA_BASE = 'https://wa.me/917734984896';

  // ---- DOM References ----
  const body = document.body;
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const langEnBtn = document.getElementById('lang-en');
  const langHiBtn = document.getElementById('lang-hi');
  const leadForm = document.getElementById('lead-form');
  const formSuccess = document.getElementById('form-success');
  const yearEl = document.getElementById('year');

  // ---- Set current year ----
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ================================================================
  // LANGUAGE SWITCHER
  // ================================================================
  let currentLang = sessionStorage.getItem('nemiwal-lang') || 'en';

  function setLanguage(lang) {
    currentLang = lang;
    sessionStorage.setItem('nemiwal-lang', lang);

    // Update body class
    body.classList.toggle('lang-hi', lang === 'hi');
    body.classList.toggle('lang-en', lang === 'en');

    // Update active button
    langEnBtn.classList.toggle('active', lang === 'en');
    langHiBtn.classList.toggle('active', lang === 'hi');

    // Update html lang attribute
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';

    // Update all data-en / data-hi elements
    const elements = document.querySelectorAll('[data-en][data-hi]');
    elements.forEach(function (el) {
      const text = el.getAttribute('data-' + lang);
      if (text !== null) {
        // For input/select elements, handle differently
        if (el.tagName === 'INPUT') {
          el.placeholder = text;
        } else if (el.tagName === 'OPTION') {
          el.textContent = text;
        } else {
          el.innerHTML = text;
        }
      }
    });

    // Also handle elements that only have one language attribute (labels, etc.)
    const singleLangEls = document.querySelectorAll('[data-en]:not([data-hi]), [data-hi]:not([data-en])');
    singleLangEls.forEach(function (el) {
      const text = el.getAttribute('data-' + lang) || el.getAttribute('data-en') || el.getAttribute('data-hi');
      if (text) el.innerHTML = text;
    });
  }

  // Language button listeners
  langEnBtn.addEventListener('click', function () { setLanguage('en'); });
  langHiBtn.addEventListener('click', function () { setLanguage('hi'); });

  // Initialize language
  setLanguage(currentLang);

  // ================================================================
  // NAVBAR SCROLL STATE
  // ================================================================
  let lastScrollY = 0;
  let ticking = false;

  function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(function () {
        navbar.classList.toggle('scrolled', lastScrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ================================================================
  // MOBILE MENU
  // ================================================================
  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains('active');
    mobileMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', !isOpen);
    body.classList.toggle('menu-open', !isOpen);
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
  }

  hamburger.addEventListener('click', toggleMobileMenu);

  // Close menu on link click
  mobileMenu.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function () {
      closeMobileMenu();
    });
  });

  // Close menu on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // ================================================================
  // SMOOTH SCROLL (for anchor links)
  // ================================================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // ================================================================
  // FAQ ACCORDION
  // ================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-item__question');
    question.addEventListener('click', function () {
      const isActive = item.classList.contains('active');

      // Close all (single-open behavior)
      faqItems.forEach(function (i) {
        i.classList.remove('active');
        i.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ================================================================
  // FORM VALIDATION & SUBMISSION
  // ================================================================
  if (leadForm) {
    leadForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let isValid = true;
      const formRows = leadForm.querySelectorAll('.form-row');

      // Clear previous errors
      formRows.forEach(function (row) { row.classList.remove('has-error'); });

      // Validate name
      const nameInput = document.getElementById('form-name');
      if (!nameInput.value.trim()) {
        nameInput.closest('.form-row').classList.add('has-error');
        isValid = false;
      }

      // Validate phone
      const phoneInput = document.getElementById('form-phone');
      const phoneVal = phoneInput.value.replace(/\D/g, '');
      if (phoneVal.length < 10) {
        phoneInput.closest('.form-row').classList.add('has-error');
        isValid = false;
      }

      // Validate service
      const serviceSelect = document.getElementById('form-service');
      if (!serviceSelect.value) {
        serviceSelect.closest('.form-row').classList.add('has-error');
        isValid = false;
      }

      if (!isValid) return;

      // Build WhatsApp message with form data
      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const service = serviceSelect.options[serviceSelect.selectedIndex].textContent;
      const area = document.getElementById('form-area').value.trim();
      const message = document.getElementById('form-message').value.trim();

      let waMessage = 'Hello, I would like to request a callback.\n\n';
      waMessage += 'Name: ' + name + '\n';
      waMessage += 'Phone: ' + phone + '\n';
      waMessage += 'Service: ' + service + '\n';
      if (area) waMessage += 'Area: ' + area + '\n';
      if (message) waMessage += 'Message: ' + message + '\n';
      waMessage += '\nPlease call me back regarding this enquiry.';

      const waUrl = WA_BASE + '?text=' + encodeURIComponent(waMessage);

      // Show success and open WhatsApp
      leadForm.style.display = 'none';
      formSuccess.classList.add('show');

      // Open WhatsApp with form data
      window.open(waUrl, '_blank');
    });

    // Real-time validation clear
    leadForm.querySelectorAll('input, select, textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        this.closest('.form-row').classList.remove('has-error');
      });
    });
  }

  // ================================================================
  // SCROLL REVEAL ANIMATIONS (Intersection Observer)
  // ================================================================
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ================================================================
  // ANALYTICS-READY EVENT TRACKING (stub)
  // ================================================================
  // These functions fire on CTA interactions. Connect to your analytics
  // provider (e.g. Google Analytics gtag) when ready.
  function trackEvent(action, label) {
    // Example: if (typeof gtag !== 'undefined') gtag('event', action, { event_label: label });
    if (window.console && window.console.debug) {
      console.debug('[Nemiwal Analytics]', action, label);
    }
  }

  // Track CTA clicks
  document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
    link.addEventListener('click', function () {
      trackEvent('call_click', this.id || 'unknown');
    });
  });

  document.querySelectorAll('a[href^="https://wa.me"]').forEach(function (link) {
    link.addEventListener('click', function () {
      trackEvent('whatsapp_click', this.id || 'unknown');
    });
  });

})();
