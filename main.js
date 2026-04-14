/* ═══════════════════════════════════════════════
   VOLO HOME — main.js
   ═══════════════════════════════════════════════ */

/* ── Popup ── */
function openPopup(type) {
  document.querySelectorAll('.popup-overlay').forEach(function(p) {
    p.classList.remove('active');
  });
  var el = document.getElementById('popup-' + type);
  if (el) el.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePopup(id) {
  var el = document.getElementById(id);
  if (el) el.classList.remove('active');
  document.body.style.overflow = '';
}

function closePopupOutside(e, id) {
  if (e.target === document.getElementById(id)) closePopup(id);
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.popup-overlay.active').forEach(function(p) {
      p.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
});

/* ── Smooth scroll ── */
function scrollTo(selector) {
  var el = document.querySelector(selector);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    /* close mobile menu if open */
    var menu = document.getElementById('mobile-menu');
    var burger = document.getElementById('nav-burger');
    if (menu && menu.classList.contains('open')) {
      menu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
}

/* ── Mobile burger menu ── */
document.addEventListener('DOMContentLoaded', function() {
  var burger = document.getElementById('nav-burger');
  var menu   = document.getElementById('mobile-menu');

  if (burger && menu) {
    burger.addEventListener('click', function() {
      var isOpen = menu.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      /* prevent page scroll when menu is open */
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* close on link click */
    menu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        menu.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Scroll reveal ── */
  var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(function(el) { observer.observe(el); });

  /* ── Nav scroll shadow ── */
  var nav = document.querySelector('nav');
  window.addEventListener('scroll', function() {
    nav.style.boxShadow = window.scrollY > 60
      ? '0 4px 24px rgba(0,0,0,0.5)'
      : 'none';
  }, { passive: true });

  /* ── Form submit ── */
  var submitBtn = document.querySelector('.btn-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', function() {
      var inputs = document.querySelectorAll('.field input, .field select');
      var ok = true;
      inputs.forEach(function(inp) {
        if (!inp.value) {
          inp.style.borderColor = '#E87722';
          ok = false;
          setTimeout(function() { inp.style.borderColor = ''; }, 2000);
        }
      });
      if (ok) {
        submitBtn.textContent = '✓ Заявка отправлена!';
        submitBtn.style.background = '#2a9d2a';
        setTimeout(function() {
          submitBtn.textContent = 'Отправить данные →';
          submitBtn.style.background = '';
        }, 3000);
      }
    });
  }
});