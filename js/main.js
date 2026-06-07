(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  /* ── Custom cursor ── */
  function initCursor() {
    if (isTouchDevice || prefersReducedMotion) return;

    const cursor = document.querySelector('.cursor');
    if (!cursor) return;

    const label = cursor.querySelector('.cursor-label');
    document.body.classList.add('has-custom-cursor');

    let x = 0;
    let y = 0;
    let cx = 0;
    let cy = 0;

    document.addEventListener('mousemove', (e) => {
      x = e.clientX;
      y = e.clientY;
      cursor.classList.remove('is-hidden');
    });

    document.addEventListener('mouseleave', () => {
      cursor.classList.add('is-hidden');
    });

    function animate() {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
      requestAnimationFrame(animate);
    }
    animate();

    const projectLinks = document.querySelectorAll('[data-cursor="view"]');
    projectLinks.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-project');
        if (label) label.textContent = el.dataset.cursorLabel || 'View';
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-project', 'is-hover');
        if (label) label.textContent = '';
      });
    });

    const hoverLinks = document.querySelectorAll('a:not([data-cursor]), button');
    hoverLinks.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (!cursor.classList.contains('is-project')) {
          cursor.classList.add('is-hover');
          if (label) label.textContent = '';
        }
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hover');
      });
    });
  }

  /* ── Scroll reveal ── */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (prefersReducedMotion) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ── Hero character animation ── */
  function initHeroTitle() {
    const title = document.querySelector('[data-split-text]');
    if (!title || prefersReducedMotion) return;

    const text = title.textContent;
    title.textContent = '';
    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char === ' ' ? '\u00a0' : char;
      span.style.animationDelay = i * 0.03 + 's';
      title.appendChild(span);
    });
  }

  /* ── Horizontal drag scroll (Palmer-style) ── */
  function initDragScroll() {
    const tracks = document.querySelectorAll('.project-track');
    tracks.forEach((track) => {
      let isDown = false;
      let startX;
      let scrollLeft;

      track.addEventListener('mousedown', (e) => {
        isDown = true;
        track.classList.add('is-dragging');
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
      });

      track.addEventListener('mouseleave', () => {
        isDown = false;
        track.classList.remove('is-dragging');
      });

      track.addEventListener('mouseup', () => {
        isDown = false;
        track.classList.remove('is-dragging');
      });

      track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.4;
        track.scrollLeft = scrollLeft - walk;
      });
    });
  }

  /* ── Mobile menu ── */
  function initMenu() {
    const toggle = document.querySelector('.floating-nav__toggle');
    const overlay = document.querySelector('.menu-overlay');
    if (!toggle || !overlay) return;

    toggle.addEventListener('click', () => {
      const isOpen = overlay.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    overlay.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        overlay.classList.remove('is-open');
        toggle.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Floating nav hide on scroll down ── */
  function initNavScroll() {
    const nav = document.querySelector('.floating-nav');
    if (!nav) return;

    let lastY = window.scrollY;
    window.addEventListener(
      'scroll',
      () => {
        const currentY = window.scrollY;
        if (currentY > lastY && currentY > 200) {
          nav.classList.add('is-hidden');
        } else {
          nav.classList.remove('is-hidden');
        }
        lastY = currentY;
      },
      { passive: true }
    );
  }

  document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initReveal();
    initHeroTitle();
    initDragScroll();
    initMenu();
    initNavScroll();
  });
})();
