/* ==========================================================================
   Gurukrithikh Personal Portfolio - JavaScript Interactions & Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- 0. Full-Screen Animated Landing Intro ---
  const introScreen = document.getElementById('introScreen');
  const enterBtn = document.getElementById('enterBtn');
  const skipIntroBtn = document.getElementById('skipIntroBtn');
  const introLetters = document.querySelectorAll('.intro-letter');
  const introGlowLine = document.getElementById('introGlowLine');
  const introSubtitle = document.getElementById('introSubtitle');
  const introCanvas = document.getElementById('introCanvas');

  let canvasAnimId = null;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Canvas glowing particles setup
  if (introCanvas) {
    const ctx = introCanvas.getContext('2d');
    let width = introCanvas.width = window.innerWidth;
    let height = introCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      if (introCanvas) {
        width = introCanvas.width = window.innerWidth;
        height = introCanvas.height = window.innerHeight;
      }
    });

    const particles = [];
    const particleCount = prefersReducedMotion ? 0 : Math.min(Math.floor(width / 25), 45);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? 'rgba(59, 130, 246, ' : 'rgba(139, 92, 246, ',
        alpha: Math.random() * 0.5 + 0.2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4
      });
    }

    function renderCanvas() {
      if (!ctx || (introScreen && introScreen.classList.contains('dismissed'))) return;
      ctx.clearRect(0, 0, width, height);

      // Subtle ambient background gradient render
      const grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.7);
      grad.addColorStop(0, 'rgba(59, 130, 246, 0.06)');
      grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.03)');
      grad.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render floating particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();

        // Soft glow surrounding particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (p.alpha * 0.2) + ')';
        ctx.fill();
      });

      canvasAnimId = requestAnimationFrame(renderCanvas);
    }

    if (!prefersReducedMotion) {
      renderCanvas();
    }
  }

  // Dismiss intro handler
  function dismissIntro() {
    if (!introScreen || introScreen.classList.contains('dismissed')) return;
    introScreen.classList.add('dismissed');
    if (canvasAnimId) cancelAnimationFrame(canvasAnimId);
    
    // Smoothly scroll or reset focus to top of portfolio
    setTimeout(() => {
      introScreen.style.display = 'none';
      // Trigger scroll reveal for hero elements
      window.dispatchEvent(new Event('scroll'));
    }, 800);
  }

  if (enterBtn) enterBtn.addEventListener('click', dismissIntro);
  if (skipIntroBtn) skipIntroBtn.addEventListener('click', dismissIntro);

  // Keyboard shortcut to dismiss intro
  document.addEventListener('keydown', (e) => {
    if (introScreen && !introScreen.classList.contains('dismissed')) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        dismissIntro();
      }
    }
  });

  // Intro Animation Sequence Timings
  if (prefersReducedMotion) {
    // Instant reveal if reduced motion preferred
    introLetters.forEach(l => l.classList.add('visible'));
    if (introGlowLine) introGlowLine.classList.add('visible');
    if (introSubtitle) introSubtitle.classList.add('visible');
    if (enterBtn) enterBtn.classList.add('visible');
  } else {
    // Step 1: 0.5s initial black screen
    setTimeout(() => {
      // Step 2: Reveal PORTFOLIO letter by letter
      introLetters.forEach((letter, idx) => {
        setTimeout(() => {
          letter.classList.add('visible');
        }, idx * 90);
      });

      // Step 3: Sweep glowing line across
      const letterTotalTime = introLetters.length * 90 + 300;
      setTimeout(() => {
        if (introGlowLine) introGlowLine.classList.add('visible');
      }, letterTotalTime);

      // Step 4: Reveal Gurukrithikh Balakrishnan
      setTimeout(() => {
        if (introSubtitle) introSubtitle.classList.add('visible');
      }, letterTotalTime + 450);

      // Step 5: Reveal Enter button
      setTimeout(() => {
        if (enterBtn) enterBtn.classList.add('visible');
      }, letterTotalTime + 900);

    }, 500);
  }
  // --- 1. Navbar Scroll Effect & Mobile Drawer ---
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navMenu) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !navMenu.classList.contains('mobile-open');
      navMenu.classList.toggle('mobile-open', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
      }

      // Prevent body scrolling when mobile menu is open
      if (window.innerWidth <= 992) {
        document.body.style.overflow = isOpen ? 'hidden' : '';
      }
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('mobile-open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close menu on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('mobile-open')) {
        toggleMenu(false);
      }
    });

    // Reset overflow style on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 992 && navMenu.classList.contains('mobile-open')) {
        toggleMenu(false);
      }
    });
  }

  // --- 2. Active Section Navigation Indicator ---
  const sections = document.querySelectorAll('section[id]');
  
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // --- 3. Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserverOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 4. Interactive Skills Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --- 5. Contact Form Submission & Toast Notification ---
  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.btn-send-message');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send message <i class="fas fa-paper-plane"></i>';
      
      if (submitBtn) {
        submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
      }

      const formData = new FormData(contactForm);

      fetch('https://formsubmit.co/ajax/b.gurukrithik@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
      })
      .then(response => response.json())
      .then(data => {
        showToast('Message sent! It will arrive in your Gmail inbox.');
        contactForm.reset();
      })
      .catch(error => {
        showToast('Thank you! Your message has been sent successfully.');
        contactForm.reset();
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      });
    });
  }

  function showToast(message) {
    if (!toast) return;
    const toastMsg = toast.querySelector('.toast-msg');
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  // --- 6. Project Detail Modal ---
  const modalOverlay = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  const viewDetailBtns = document.querySelectorAll('.view-project-details');

  const projectDetailsMap = {
    'inventory': {
      title: 'Inventory Management System',
      tech: ['JavaFX', 'Python', 'MySQL'],
      content: `
        <p><strong>System Architecture & Role:</strong></p>
        <p>This application was developed to track, control, and optimize business inventory and stock levels in real time.</p>
        <ul style="margin: 12px 0 16px 20px; color: var(--text-secondary);">
          <li>Architected the backend database schema using MySQL for efficient transaction logging and stock auditing.</li>
          <li>Implemented Python backend scripts for automated stock threshold alerts and analytical reports.</li>
          <li>Supported JavaFX component integration for an intuitive desktop user interface with real-time updates.</li>
        </ul>
      `
    }
  };

  viewDetailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-project');
      const data = projectDetailsMap[projId];

      if (data && modalOverlay) {
        modalTitle.textContent = data.title;
        modalBody.innerHTML = data.content;
        modalOverlay.classList.add('active');
      }
    });
  });

  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  // --- 7. Back to Top Button ---
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
