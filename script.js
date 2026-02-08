/* =====================
   Smooth Scroll
   （元の動きは維持しつつ、少し強化）
   ===================== */
document.querySelectorAll('.nav-sticky a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* =====================
   Title fade-in（元の動き）
   ===================== */
window.addEventListener("load", () => {
  const title = document.querySelector(".site-title");
  if (!title) return;

  title.style.opacity = 0;
  title.style.transform = "translateY(-10px)";

  setTimeout(() => {
    title.style.transition = "0.8s ease";
    title.style.opacity = 1;
    title.style.transform = "translateY(0)";
  }, 200);
});

/* =====================
   Reveal on scroll（ふわっと登場）
   ===================== */
(() => {
  const items = Array.from(document.querySelectorAll('.reveal'));
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.15 });

  items.forEach(el => io.observe(el));
})();

/* =====================
   Scroll Spy（今いるセクションを目次でハイライト）
   ===================== */
(() => {
  const links = Array.from(document.querySelectorAll('.nav-sticky a'));
  const sections = links
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (!links.length || !sections.length) return;

  const setActive = (id) => {
    links.forEach(a => {
      const href = a.getAttribute('href');
      a.classList.toggle('is-active', href === `#${id}`);
    });
  };

  const io = new IntersectionObserver((entries) => {
    // 画面内に入ってる候補のうち、最も上に近いものをactiveにする
    const visible = entries.filter(e => e.isIntersecting);
    if (!visible.length) return;

    visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    const id = visible[0].target.id;
    if (id) setActive(id);
  }, {
    root: null,
    threshold: 0.35
  });

  sections.forEach(sec => io.observe(sec));
})();

/* =====================
   Works Card hover parallax（やりすぎない範囲）
   ===================== */
(() => {
  const cards = Array.from(document.querySelectorAll('.work-card'));
  if (!cards.length) return;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;  // 0..1
      const y = (e.clientY - rect.top) / rect.height;  // 0..1
      const rx = clamp((0.5 - y) * 6, -6, 6);          // rotateX
      const ry = clamp((x - 0.5) * 8, -8, 8);          // rotateY
      card.style.transform = `translateY(-4px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* =====================
   Topへ戻るボタン
   ===================== */
(() => {
  const btn = document.getElementById('toTop');
  if (!btn) return;

  const toggle = () => {
    const show = window.scrollY > 500;
    btn.classList.toggle('is-show', show);
  };

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();