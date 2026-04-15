/* ═══════════════════════════════════════════════
   VOLO HOME — main.js (Uzbek version)
   ═══════════════════════════════════════════════ */

var BOT_TOKEN = '8637686529:AAE7tDyRx4wGyGijbpZhmizlXlv6wv2B2MI';
var CHAT_ID   = '-5225232338';

/* ── Popup ── */
function openPopup(type) {
  document.querySelectorAll('.popup-overlay').forEach(function(p) {
    p.classList.remove('active');
  });
  var el = document.getElementById('popup-' + type);
  if (el) el.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function submitConsult() {
  var name     = document.getElementById('consult-name').value.trim();
  var phone    = document.getElementById('consult-phone').value.trim();
  var interest = document.getElementById('consult-interest').value || '—';

  if (!name || !phone) {
    alert('Iltimos, ism va telefon raqamni kiriting.');
    return;
  }

  var btn = document.querySelector('#popup-consult .btn-popup');
  btn.textContent = '⏳ Yuborilmoqda...';
  btn.disabled = true;

  sendToTelegram(name, phone, interest, '—', '—')
    .then(function(data) {
      if (data.ok) {
        document.getElementById('consult-form-wrap').style.display = 'none';
        document.getElementById('consult-success').style.display = 'block';
        setTimeout(function() {
          closePopup('popup-consult');
          setTimeout(function() {
            document.getElementById('consult-form-wrap').style.display = 'block';
            document.getElementById('consult-success').style.display = 'none';
            document.getElementById('consult-name').value = '';
            document.getElementById('consult-phone').value = '';
            document.getElementById('consult-interest').value = '';
            btn.textContent = "Ma'lumotlarni yuborish →";
            btn.disabled = false;
          }, 400);
        }, 3000);
      } else {
        alert('Xatolik yuz berdi, qayta urinib ko\'ring.');
        btn.textContent = "Ma'lumotlarni yuborish →";
        btn.disabled = false;
      }
    })
    .catch(function() {
      alert('Xatolik yuz berdi, qayta urinib ko\'ring.');
      btn.textContent = "Ma'lumotlarni yuborish →";
      btn.disabled = false;
    });
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
    var menu = document.getElementById('mobile-menu');
    var burger = document.getElementById('nav-burger');
    if (menu && menu.classList.contains('open')) {
      menu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
}

/* ── Mobile Scroll Dots ── */
function initScrollDots(gridId, dotsId) {
  var grid = document.getElementById(gridId);
  var dotsContainer = document.getElementById(dotsId);
  if (!grid || !dotsContainer) return;

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    if (!isMobile()) return;

    var cards = grid.querySelectorAll('.card');
    if (cards.length === 0) return;

    cards.forEach(function(_, i) {
      var dot = document.createElement('button');
      dot.className = 'scroll-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Karta ' + (i + 1));
      dot.addEventListener('click', function() {
        var card = cards[i];
        grid.scrollTo({ left: card.offsetLeft - 20, behavior: 'smooth' });
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateActiveDot() {
    if (!isMobile()) return;
    var cards = grid.querySelectorAll('.card');
    var dots = dotsContainer.querySelectorAll('.scroll-dot');
    var scrollLeft = grid.scrollLeft;
    var activeIdx = 0;
    var minDist = Infinity;
    cards.forEach(function(card, i) {
      var dist = Math.abs(card.offsetLeft - 20 - scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        activeIdx = i;
      }
    });
    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === activeIdx);
    });
  }

  buildDots();
  grid.addEventListener('scroll', updateActiveDot, { passive: true });
  window.addEventListener('resize', function() {
    buildDots();
    updateActiveDot();
  });
}

/* ── Mobile Scroll Arrows ── */
function initScrollArrows(gridId) {
  var grid = document.getElementById(gridId);
  if (!grid) return;

  var wrapper = grid.parentElement;
  var leftBtn  = wrapper.querySelector('.scroll-arrow-left');
  var rightBtn = wrapper.querySelector('.scroll-arrow-right');
  if (!leftBtn || !rightBtn) return;

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function getScrollStep() {
    var card = grid.querySelector('.card');
    return card ? card.offsetWidth + 14 : 260;
  }

  function updateArrows() {
    if (!isMobile()) {
      leftBtn.classList.add('hidden');
      rightBtn.classList.add('hidden');
      return;
    }
    var maxScroll = grid.scrollWidth - grid.clientWidth;
    leftBtn.classList.toggle('hidden', grid.scrollLeft <= 4);
    rightBtn.classList.toggle('hidden', grid.scrollLeft >= maxScroll - 4);
  }

  leftBtn.addEventListener('click', function() {
    grid.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
  });

  rightBtn.addEventListener('click', function() {
    grid.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
  });

  grid.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);

  updateArrows();
}

/* ── Send to Telegram ── */
function sendToTelegram(ism, telefon, mahsulot, kimUchun, narx) {
  var now = new Date();
  var dateStr = now.toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  var message =
    '🛏 <b>Yangi ariza — VOLO HOME</b>\n\n' +
    '👤 <b>Ism:</b> ' + ism + '\n' +
    '📞 <b>Telefon:</b> ' + telefon + '\n' +
    '🛒 <b>Mahsulot:</b> ' + mahsulot + '\n' +
    '👨‍👩‍👧 <b>Kim uchun:</b> ' + kimUchun + '\n' +
    '💰 <b>Narx oralig\'i:</b> ' + narx + '\n\n' +
    '🕐 <b>Vaqt:</b> ' + dateStr;

  return fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    })
  }).then(function(res) { return res.json(); });
}

/* ── DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', function() {

  /* ── Mobile burger menu ── */
  var burger = document.getElementById('nav-burger');
  var menu   = document.getElementById('mobile-menu');

  if (burger && menu) {
    burger.addEventListener('click', function() {
      var isOpen = menu.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
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

  /* ── Init scroll dots ── */
  initScrollDots('mattress-grid', 'mattress-dots');
  initScrollDots('beds-grid', 'beds-dots');

  /* ── Init scroll arrows ── */
  initScrollArrows('mattress-grid');
  initScrollArrows('beds-grid');

  /* ── Form submit ── */
  var submitBtn = document.querySelector('.btn-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', function() {
      var fields = document.querySelectorAll('.field input, .field select');
      var ok = true;

      fields.forEach(function(inp) {
        if (!inp.value) {
          inp.style.borderColor = '#E87722';
          ok = false;
          setTimeout(function() { inp.style.borderColor = ''; }, 2000);
        }
      });

      if (!ok) return;

      var ism      = fields[0].value;
      var telefon  = fields[1].value;
      var mahsulot = fields[2].value;
      var kimUchun = fields[3].value;
      var narx     = fields[4].value;

      submitBtn.textContent = '⏳ Yuborilmoqda...';
      submitBtn.disabled = true;

      sendToTelegram(ism, telefon, mahsulot, kimUchun, narx)
        .then(function(data) {
          if (data.ok) {
            submitBtn.textContent = '✓ Ariza yuborildi!';
            submitBtn.style.background = '#2a9d2a';
            fields.forEach(function(f) { f.value = ''; });
          } else {
            submitBtn.textContent = '❌ Xatolik yuz berdi';
            submitBtn.style.background = '#cc0000';
            console.error('Telegram error:', data);
          }
        })
        .catch(function(err) {
          submitBtn.textContent = '❌ Xatolik yuz berdi';
          submitBtn.style.background = '#cc0000';
          console.error('Fetch error:', err);
        })
        .finally(function() {
          submitBtn.disabled = false;
          setTimeout(function() {
            submitBtn.textContent = "Ma'lumotlarni yuborish →";
            submitBtn.style.background = '';
          }, 3000);
        });
    });
  }

});