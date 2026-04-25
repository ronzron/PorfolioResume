/* ===== PARTICLE BACKGROUND ===== */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  const COLORS = ['rgba(124,58,237,', 'rgba(6,182,212,', 'rgba(167,139,250,'];

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  function init() {
    resize();
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    particles = Array.from({ length: count }, createParticle);
  }

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(124,58,237,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConnections();
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
    });
    animFrame = requestAnimationFrame(animate);
  }

  init();
  animate();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animFrame);
      init();
      animate();
    }, 200);
  });
})();

/* ===== NAVBAR ===== */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  });

  hamburger && hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger && hamburger.classList.remove('active');
      navLinks && navLinks.classList.remove('open');
    });
  });

  function updateActiveLink() {
    const scrollPos = window.scrollY + 100;
    links.forEach(link => {
      const section = document.querySelector(link.getAttribute('href'));
      if (!section) return;
      if (section.offsetTop <= scrollPos && section.offsetTop + section.offsetHeight > scrollPos) {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }

  updateActiveLink();
})();

/* ===== TYPEWRITER ===== */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words = [
    'Virtual Assistant',
    'Administrative Expert',
    'Inbox Organizer',
    'Schedule Manager',
    'Detail-Oriented Partner',
    'Your Right-Hand VA',
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 120;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      el.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      delay = 60;
    } else {
      el.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      delay = 120;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 500;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 1200);
})();

/* ===== SCROLL REVEAL ===== */
(function initReveal() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    observer.observe(el);
  });
})();

/* ===== COUNTER ANIMATION ===== */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 1500;
          const step = Math.ceil(target / (duration / 16));
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current + suffix;
            if (current >= target) clearInterval(timer);
          }, 16);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => observer.observe(c));
})();

/* ===== BACK TO TOP ===== */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ===== CONTACT FORM ===== */
(function initForm() {
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      if (successMsg) {
        successMsg.style.display = 'block';
      }
    }, 1200);
  });
})();

/* ===== SMOOTH HOVER TILT ON CARDS ===== */
(function initTilt() {
  const cards = document.querySelectorAll('.strength-card, .service-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / rect.height) * 8;
      const tiltY = -(x / rect.width) * 8;
      card.style.transform = `translateY(-8px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
