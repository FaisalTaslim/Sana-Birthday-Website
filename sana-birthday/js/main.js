/* ============================================================
   main.js — all site behavior.
   Content comes from data.js (SANA_DATA). This file just wires
   it up to the DOM and handles interactions/animations.
   ============================================================ */

(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------
     Photo frame helper — used by timeline + gallery.
     Tries to load assets/images/<filename>. If it exists, shows
     it. If not, shows a clean placeholder with the filename, so
     it's obvious what to add later.
  ------------------------------------------------------------ */
  function buildPhotoFrame(filename, altText) {
    const frame = document.createElement("div");
    frame.className = "photo-frame";

    const placeholder = document.createElement("div");
    placeholder.className = "photo-frame__placeholder";
    placeholder.innerHTML = `
      <span class="photo-frame__icon"></span>
      <span class="photo-frame__filename">assets/images/${filename}</span>
    `;
    frame.appendChild(placeholder);

    if (filename) {
      const test = new Image();
      test.onload = () => {
        frame.innerHTML = "";
        const img = document.createElement("img");
        img.src = `assets/images/${filename}`;
        img.alt = altText || "";
        img.loading = "lazy";
        frame.appendChild(img);
      };
      test.onerror = () => { /* keep placeholder */ };
      test.src = `assets/images/${filename}`;
    }
    return frame;
  }

  /* ------------------------------------------------------------
     Populate static text from data.js
  ------------------------------------------------------------ */
  function populateContent() {
    const d = SANA_DATA;

    $("#heroEyebrow").textContent = d.hero.eyebrow;
    $("#heroLine1").textContent = d.hero.headlineTop;
    $("#heroLine2").textContent = d.hero.headlineName;
    $("#heroSubline").textContent = d.hero.subline;
    $("#scrollCue").textContent = d.hero.scrollCue;

    $("#envelopeLabel").textContent = d.letter.label;
    $("#letterDate").textContent = new Date(d.birthdayISO + "T00:00:00").toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric"
    });
    $("#letterBody").innerHTML = d.letter.body.map(p => `<p>${p}</p>`).join("");
    $("#letterSignoff").textContent = d.letter.signoff;

    // notes pinboard
    const pinboard = $("#pinboard");
    d.notes.forEach((text, i) => {
      const card = document.createElement("div");
      card.className = "note-card";
      card.tabIndex = 0;
      card.innerHTML = `<p class="note-card__text">${text}</p><span class="note-card__index">${String(i + 1).padStart(2, "0")}</span>`;
      pinboard.appendChild(card);
    });

    // timeline
    const timeline = $("#timeline");
    d.timeline.forEach((item, i) => {
      const el = document.createElement("div");
      el.className = "timeline-item";
      el.setAttribute("data-reveal", "");
      const media = buildPhotoFrame(item.image, item.title);
      media.classList.add("timeline-item__media");
      el.appendChild(media);

      const copy = document.createElement("div");
      copy.className = "timeline-item__copy";
      copy.innerHTML = `
        <span class="timeline-item__label">${item.label}</span>
        <h3 class="timeline-item__title">${item.title}</h3>
        <p class="timeline-item__caption">${item.caption}</p>
      `;
      el.appendChild(copy);
      timeline.appendChild(el);
    });

    // gallery
    const galleryGrid = $("#galleryGrid");
    d.gallery.forEach((item) => {
      const frame = buildPhotoFrame(item.image, item.caption);
      frame.setAttribute("data-reveal", "");
      frame.tabIndex = 0;
      frame.addEventListener("click", () => openLightbox(item));
      frame.addEventListener("keydown", (e) => { if (e.key === "Enter") openLightbox(item); });
      galleryGrid.appendChild(frame);
    });

    // cake
    $("#cakePrompt").textContent = d.cake.prompt;
    $("#wishMessage").textContent = d.cake.wishRevealed;
    buildCandles(d.cake.candleCount);
    updateWishPrompt(0, d.cake.candleCount);

    // guestbook
    $("#guestbookPrompt").textContent = d.guestbook.prompt;
    $("#gbMsg").placeholder = d.guestbook.placeholder;

    // footer
    $("#footerSignature").textContent = `Happy Birthday, ${d.recipientName}.`;
    $("#footerLine").textContent = d.footer.line;

    document.title = `Happy Birthday, ${d.recipientName}`;
  }

  /* ------------------------------------------------------------
     Nav: mobile toggle + active link highlighting
  ------------------------------------------------------------ */
  function initNav() {
    const nav = $("#siteNav");
    const toggle = $("#navToggle");
    const links = $("#navLinks");

    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("is-open");
      nav.classList.toggle("is-menu-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    $$("[data-nav]").forEach(link => {
      link.addEventListener("click", () => {
        links.classList.remove("is-open");
        nav.classList.remove("is-menu-open");
      });
    });

    const sections = $$("section[id], header[id]");
    const navLinks = $$("[data-nav]");
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.toggle("is-active", l.getAttribute("href") === `#${entry.target.id}`));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(s => spy.observe(s));
  }

  /* ------------------------------------------------------------
     Scroll reveal
  ------------------------------------------------------------ */
  function initReveal() {
    const els = $$("[data-reveal]");
    if (prefersReducedMotion) {
      els.forEach(el => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
  }

  /* ------------------------------------------------------------
     Countdown to birthday
  ------------------------------------------------------------ */
  function initCountdown() {
    const target = new Date(SANA_DATA.birthdayISO + "T00:00:00");
    const el = $("#countdown");
    const days = $("#cdDays"), hours = $("#cdHours"), mins = $("#cdMins"), secs = $("#cdSecs");

    function tick() {
      const now = new Date();
      let diff = target - now;

      if (diff <= 0) {
        el.classList.add("countdown--arrived");
        days.textContent = "00"; hours.textContent = "00"; mins.textContent = "00"; secs.textContent = "00";
        $("#cdDays").nextElementSibling; // no-op, keep structure
        el.setAttribute("aria-label", "It's here.");
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      days.textContent = String(d).padStart(2, "0");
      hours.textContent = String(h).padStart(2, "0");
      mins.textContent = String(m).padStart(2, "0");
      secs.textContent = String(s).padStart(2, "0");
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------
     Floating embers in hero
  ------------------------------------------------------------ */
  function initEmbers() {
    if (prefersReducedMotion) return;
    const wrap = $("#embers");
    const count = window.innerWidth < 640 ? 10 : 18;
    for (let i = 0; i < count; i++) {
      const ember = document.createElement("span");
      ember.className = "ember";
      ember.style.left = `${Math.random() * 100}%`;
      ember.style.setProperty("--drift", `${(Math.random() - 0.5) * 80}px`);
      ember.style.animationDuration = `${6 + Math.random() * 6}s`;
      ember.style.animationDelay = `${Math.random() * 8}s`;
      wrap.appendChild(ember);
    }
  }

  /* ------------------------------------------------------------
     Envelope / letter interaction
  ------------------------------------------------------------ */
  function initEnvelope() {
    const envelope = $("#envelope");
    const panel = $("#letterPanel");

    function open() {
      envelope.classList.add("is-open");
      envelope.setAttribute("aria-expanded", "true");
      panel.hidden = false;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => panel.classList.add("is-visible"));
      });
      setTimeout(() => panel.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" }), 400);
    }

    envelope.addEventListener("click", open);
    envelope.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  }

  /* ------------------------------------------------------------
     Candles / make a wish
  ------------------------------------------------------------ */
  function buildCandles(count) {
    const wrap = $("#candles");
    for (let i = 0; i < count; i++) {
      const btn = document.createElement("button");
      btn.className = "candle";
      btn.setAttribute("aria-label", `Blow out candle ${i + 1}`);
      btn.innerHTML = `<span class="candle__flame"></span><span class="candle__smoke"></span><span class="candle__stick"></span>`;
      btn.addEventListener("click", () => handleCandleClick(btn));
      wrap.appendChild(btn);
    }
  }

  function updateWishPrompt(out, total) {
    $("#wishPrompt").textContent = out >= total ? "All out. Make it count." : `${out} / ${total} candles out`;
  }

  function handleCandleClick(btn) {
    if (btn.classList.contains("is-out")) return;
    btn.classList.add("is-out");
    const all = $$(".candle");
    const out = all.filter(c => c.classList.contains("is-out")).length;
    updateWishPrompt(out, all.length);

    if (out === all.length) {
      setTimeout(() => {
        $("#wishMessage").classList.add("is-visible");
        fireConfetti();
        playChime();
      }, 300);
    }
  }

  /* ------------------------------------------------------------
     Confetti (lightweight canvas burst)
  ------------------------------------------------------------ */
  function fireConfetti() {
    if (prefersReducedMotion) return;
    const canvas = $("#confetti-canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#E8A84C", "#E8637A", "#F2C784", "#F6EFE3"];
    const originX = window.innerWidth / 2;
    const originY = window.innerHeight * 0.55;

    const particles = Array.from({ length: 90 }, () => ({
      x: originX,
      y: originY,
      r: 3 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 12,
      vy: -Math.random() * 12 - 4,
      rot: Math.random() * Math.PI,
      vrot: (Math.random() - 0.5) * 0.3,
      life: 0
    }));

    let frame = 0;
    function step() {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.vy += 0.35; // gravity
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;
        p.life++;
        if (p.y < canvas.height + 20) alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - p.life / 140);
        ctx.fillRect(-p.r, -p.r * 0.6, p.r * 2, p.r * 1.2);
        ctx.restore();
      });
      if (alive && frame < 160) requestAnimationFrame(step);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    step();
  }

  window.addEventListener("resize", () => {
    const canvas = $("#confetti-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  /* ------------------------------------------------------------
     Gallery lightbox
  ------------------------------------------------------------ */
  function openLightbox(item) {
    const lightbox = $("#lightbox");
    const frameHost = $("#lightboxFrame");
    frameHost.innerHTML = "";
    frameHost.appendChild(buildPhotoFrame(item.image, item.caption));
    $("#lightboxCaption").textContent = item.caption || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  }
  function closeLightbox() {
    const lightbox = $("#lightbox");
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
  }
  function initLightbox() {
    $("#lightboxClose").addEventListener("click", closeLightbox);
    $("#lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") closeLightbox(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
  }

  /* ------------------------------------------------------------
     Guestbook (localStorage)
  ------------------------------------------------------------ */
  function initGuestbook() {
    const key = SANA_DATA.guestbook.storageKey;
    const list = $("#guestbookList");
    const form = $("#guestbookForm");

    function load() {
      try { return JSON.parse(localStorage.getItem(key)) || []; }
      catch { return []; }
    }
    function save(entries) {
      localStorage.setItem(key, JSON.stringify(entries));
    }
    function render() {
      const entries = load();
      list.innerHTML = "";
      if (!entries.length) {
        list.innerHTML = `<p class="guestbook-empty">No notes yet — be the first.</p>`;
        return;
      }
      entries.slice().reverse().forEach(entry => {
        const el = document.createElement("div");
        el.className = "guestbook-entry";
        el.innerHTML = `<div class="guestbook-entry__name">${escapeHtml(entry.name)}</div><div class="guestbook-entry__msg">${escapeHtml(entry.message)}</div>`;
        list.appendChild(el);
      });
    }
    function escapeHtml(str) {
      const div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#gbName").value.trim();
      const message = $("#gbMsg").value.trim();
      if (!name || !message) return;
      const entries = load();
      entries.push({ name, message, ts: Date.now() });
      save(entries);
      render();
      form.reset();
    });

    render();
  }

  /* ------------------------------------------------------------
     Sound toggle — plays a short original procedural chime
     using the Web Audio API (no external audio files needed).
     Swap in a real track by adding an <audio> element if you'd
     rather use an actual song — see README for notes.
  ------------------------------------------------------------ */
  let audioCtx;
  function playChime() {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523.25, 587.33, 659.25, 523.25, 659.25, 783.99, 880.00]; // little original riff
      const now = audioCtx.currentTime;
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        const start = now + i * 0.16;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.16, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.32);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(start);
        osc.stop(start + 0.34);
      });
    } catch (err) { /* audio not available — fail silently */ }
  }
  function initSoundToggle() {
    $("#soundToggle").addEventListener("click", playChime);
  }

  /* ------------------------------------------------------------
     Init
  ------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    populateContent();
    initNav();
    initReveal();
    initCountdown();
    initEmbers();
    initEnvelope();
    initLightbox();
    initGuestbook();
    initSoundToggle();
  });
})();
