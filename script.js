// ══════════════════════════════════════════════════════════════
// Dieses Script enthält nur Verhalten (Animationen, Slider,
// Overlay-Steuerung) – keine Texte. Texte findest du in index.html.
// ══════════════════════════════════════════════════════════════

// ── CURSOR ─────────────────────────────────────────
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});
document.querySelectorAll('a, button, .skill-item').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

document.querySelectorAll('.project-row').forEach((row, i) => {
  row.addEventListener('mouseenter', () => cursor.classList.add('project-hover'));
  row.addEventListener('mouseleave', () => cursor.classList.remove('project-hover'));
  row.addEventListener('click', () => openOverlay(i));
});

// ── OVERLAY ────────────────────────────────────────
const overlay = document.getElementById('overlay');
const overlayClose = document.getElementById('overlayClose');
const overlayInner = document.getElementById('overlayInner');

// Bilder für die "Impressionen"-Galerie im Overlay von Projekt 01 (KOMMSE ÜCKEN?!)
const KU_GALLERY_IMAGES = [
  "images/img025.jpg",
  "images/img026.jpg",
  "images/img027.jpg",
  "images/img028.jpg",
  "images/img029.jpg",
  "images/img030.jpg",
  "images/img031.jpg",
  "images/img032.jpg",
  "images/img033.jpg",
  "images/img034.jpg",
  "images/img035.jpg",
  "images/img036.jpg",
  "images/img037.jpg",
  "images/img038.jpg",
  "images/img039.jpg",
  "images/img040.jpg",
  "images/img041.jpg"
];

// Logo-Entwürfe für den Slider im Overlay von Projekt 02 (FeltedLocks).
// "label" ist der Beschriftungstext unter dem Bild – hier direkt änderbar.
const FL_LOGOS = [
  { src: "images/fl-logo-1.svg", label: "Variante A — Rundform, Serifenschrift" },
  { src: "images/fl-logo-2.svg", label: "Variante B — Rechteckrahmen, clean" },
  { src: "images/fl-logo-3.svg", label: "Variante C — LockBar · Wordmark mit Linie" },
  { src: "images/fl-logo-4.svg", label: "Variante D — Kompaktform, gerundete Ecken" },
  { src: "images/fl-logo-5.svg", label: "Variante E — LockBar · Stilisierter Anfangsbuchstabe" },
  { src: "images/fl-logo-6.svg", label: "Variante F — LockBar · Minimales Wordmark" },
  { src: "images/fl-logo-7.svg", label: "Variante G — Invertierte Fläche" }
];

function openOverlay(i) {
  const template = document.getElementById('overlay-' + i);
  overlayInner.innerHTML = template.innerHTML;

  applyLang(overlayInner, currentLang);   // Overlay-Texte in aktueller Sprache

  if (i === 0) {
    initKuGallery();
  } else if (i === 1) {
    initFlLogoSlider();
  }

  overlay.classList.add('open');
  overlayInner.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

// ── PROJEKT 01: Impressionen-Galerie ────────────────
function makeGallery(trackId, counterId, items, renderTile, prevName, nextName) {
  // gleichzeitig sichtbare Bilder: 3 auf großen Bildschirmen, 1 auf dem Handy
  const PER = window.matchMedia('(max-width: 600px)').matches ? 1 : 3;
  let idx = 0;
  const track = overlayInner.querySelector('#' + trackId);
  const counter = overlayInner.querySelector('#' + counterId);
  if (!track) return;

  track.innerHTML = items.map(it =>
    '<div style="min-width:calc(100%/' + PER + ');padding:3px;box-sizing:border-box">' + renderTile(it) + '</div>'
  ).join('');

  function go(n) {
    const max = items.length - PER;
    idx = Math.max(0, Math.min(n, max));
    track.style.transform = 'translateX(-' + (idx * (100 / PER)).toFixed(4) + '%)';
    counter.textContent = (PER === 1 ? (idx + 1) : (idx + 1) + ' – ' + (idx + PER)) + ' / ' + items.length;
  }
  window[prevName] = () => go(idx - 1);
  window[nextName] = () => go(idx + 1);
  go(0);
}

function initKuGallery() {
  makeGallery('ku-track', 'ku-counter', KU_GALLERY_IMAGES,
    src => '<img src="' + src + '" style="width:100%;height:240px;object-fit:cover;display:block" class="ku-gallery-img">',
    'kuPrev', 'kuNext');
}

// ── PROJEKT 02: Logo-Entwürfe (Galerie wie Projekt 01) ─────
function initFlLogoSlider() {
  makeGallery('fl-track', 'fl-counter', FL_LOGOS,
    l => '<div class="fl-logo-tile"><img src="' + l.src + '" alt="' + l.label + '"></div>',
    'flPrev', 'flNext');
}

overlayClose.addEventListener('click', closeOverlay);
overlay.addEventListener('click', e => { if (e.target === overlay) closeOverlay(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeOverlay(); });
overlayClose.addEventListener('mouseenter', () => cursor.classList.add('hover'));
overlayClose.addEventListener('mouseleave', () => cursor.classList.remove('hover'));

function closeOverlay() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ── SCROLL REVEALS ─────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = el.dataset.delay || 0;
    setTimeout(() => el.classList.add('visible'), parseInt(delay));
    observer.unobserve(el);
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
document.querySelectorAll('.project-row').forEach(el => observer.observe(el));
document.querySelectorAll('.about-headline, .about-text').forEach(el => observer.observe(el));
document.querySelectorAll('.section-label').forEach(el => observer.observe(el));

// ── SPRACHE (DE / EN) ───────────────────────────────
// Deutsch steht zwischen den Tags, Englisch im Attribut data-en="...".
// Der Schalter oben rechts tauscht beides; die Wahl wird gemerkt.
let currentLang = 'de';

function applyLang(root, lang) {
  root.querySelectorAll('[data-en]').forEach(el => {
    if (!el.hasAttribute('data-de')) el.setAttribute('data-de', el.innerHTML);
    el.innerHTML = (lang === 'en') ? el.getAttribute('data-en') : el.getAttribute('data-de');
  });
}

function setLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  applyLang(document, lang);
  if (overlay.classList.contains('open')) applyLang(overlayInner, lang);
  document.querySelectorAll('.lang-switch button').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === lang));
  try { localStorage.setItem('lb-lang', lang); } catch (e) {}
}

document.querySelectorAll('.lang-switch button').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

(function () {
  let saved = 'de';
  try { saved = localStorage.getItem('lb-lang') || 'de'; } catch (e) {}
  if (saved === 'en') setLang('en');
})();

// ── EXTERNE INHALTE ERST NACH KLICK LADEN ─────────────
// Figma, Rundgang-Website und Instagram werden erst geladen, wenn man
// auf „Inhalt laden“ klickt. Ein Klick lädt alle Inhalte desselben Anbieters
// auf der aktuellen Projektseite. Die Zustimmung wird nicht gespeichert.
document.addEventListener('click', e => {
  const btn = e.target.closest('.consent-load');
  if (!btn) return;
  const box = btn.closest('.consent-embed');
  const scope = box.closest('#overlayInner') || document;
  scope.querySelectorAll('.consent-embed[data-provider="' + box.dataset.provider + '"]').forEach(b => {
    const f = b.querySelector('iframe[data-src]');
    if (f && !f.getAttribute('src')) f.src = f.dataset.src;
    b.classList.add('is-loaded');
  });
});
