(function () {
  const STORAGE_KEY = 'theme-preference';

  function getPreference() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // Apply immediately to prevent flash
  setTheme(getPreference());

  document.addEventListener('DOMContentLoaded', () => {

    /* ── Theme toggle ── */
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
        // Add a brief class for transition flash effect
        document.body.classList.add('theme-transitioning');
        setTimeout(() => document.body.classList.remove('theme-transitioning'), 600);
      });
    }

    /* ── Mobile nav toggle ── */
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
      });
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navToggle.classList.remove('active');
          navLinks.classList.remove('open');
        });
      });
    }

    /* ── Cursor glow effect ── */
    const glow = document.createElement('div');
    glow.classList.add('cursor-glow');
    document.body.appendChild(glow);

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();

    /* ── Word reveal animation for hero h1 ── */
    const heroH1 = document.querySelector('.hero h1');
    if (heroH1) {
      const text = heroH1.textContent.trim();
      const words = text.split(/\s+/);
      heroH1.innerHTML = '';

      words.forEach((word, i) => {
        const wrapper = document.createElement('span');
        wrapper.classList.add('word-reveal');
        const inner = document.createElement('span');
        inner.textContent = word;
        inner.style.transitionDelay = (i * 0.08 + 0.3) + 's';
        wrapper.appendChild(inner);
        heroH1.appendChild(wrapper);

        // Add space between words
        if (i < words.length - 1) {
          heroH1.appendChild(document.createTextNode(' '));
        }
      });

      // Trigger reveal after a short delay
      setTimeout(() => {
        heroH1.querySelectorAll('.word-reveal').forEach(w => w.classList.add('revealed'));
      }, 200);
    }

    /* ── Hero elements staggered entrance ── */
    const heroLabel = document.querySelector('.hero-label');
    const heroDesc = document.querySelector('.hero-description');
    const heroLinks = document.querySelector('.hero-links');

    [heroLabel, heroDesc, heroLinks].forEach((el, i) => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.6 + i * 0.15}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.6 + i * 0.15}s`;
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 100);
      }
    });

    /* ── Scroll-based fade-in animations ── */
    const fadeEls = document.querySelectorAll('.fade-in');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
      );
      fadeEls.forEach(el => observer.observe(el));
    } else {
      fadeEls.forEach(el => el.classList.add('visible'));
    }

    /* ── Animated horizontal rules ── */
    const hrAnims = document.querySelectorAll('.hr-anim');
    if (hrAnims.length && 'IntersectionObserver' in window) {
      const hrObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              hrObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      hrAnims.forEach(el => hrObserver.observe(el));
    }

    /* ── Active nav link highlight on scroll ── */
    const sections = document.querySelectorAll('.section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    function updateActiveNav() {
      let current = '';
      sections.forEach(section => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) {
          current = section.getAttribute('id');
        }
      });
      navAnchors.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + current) {
          a.classList.add('active');
        }
      });
    }

    /* ── Navbar background opacity on scroll ── */
    const navbar = document.querySelector('.navbar');
    function updateNavbar() {
      if (window.scrollY > 50) {
        navbar.style.borderBottomColor = '';
      } else {
        navbar.style.borderBottomColor = 'transparent';
      }
    }

    // Throttled scroll handler
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveNav();
          updateNavbar();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initial call
    updateNavbar();
    updateActiveNav();

    /* ── Smooth link scrolling with offset ── */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const top = target.offsetTop - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });

  });
})();
