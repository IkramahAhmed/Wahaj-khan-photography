(() => {
  const WA = '923218278118', MAIL = 'wahajkhan350@gmail.com';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // ---- placeholder photos (swap `src` with real image paths later) ----
  const works = [
    { t: 'Pakistani Bridal, Lahore', c: 'bridal', r: '2/3', src: 'photos/bridal-15.jpg' },
    { t: 'The Nikkah Hand', c: 'details', r: '3/2', src: 'photos/bridal-17.jpg' },
    { t: 'Golden Hour Couple', c: 'couples', r: '3/2', src: 'photos/bridal-7.jpg' },
    { t: 'Teal Bridal', c: 'bridal', r: '2/3', src: 'photos/bridal-1.jpg' },
    { t: 'Henna in Progress', c: 'mehndi', r: '3/2', src: 'photos/bridal-5.jpg' },
    { t: 'Maroon Bride', c: 'bridal', r: '2/3', src: 'photos/bridal-3.jpg' },
    { t: 'Hand in Hand', c: 'details', r: '2/3', src: 'photos/bridal-2.jpg' },
    { t: 'Red Lehenga Portrait', c: 'bridal', r: '2/3', src: 'photos/bridal-8.jpg' },
    { t: 'Stage & Decor', c: 'decor', r: '16/9', src: 'photos/bridal-14.jpg' },
    { t: 'Mehndi Details', c: 'mehndi', r: '3/2', src: 'photos/bridal-6.jpg' },
  ];
  const grid = $('#grid');
  works.forEach(w => {
    const d = document.createElement('div');
    d.className = 'item reveal'; d.dataset.c = w.c; d.dataset.cap = w.t;
    d.innerHTML = `<div class="ph" style="--r:${w.r};background-image:url(${w.src})" role="img" aria-label="${w.t}"></div>`;
    d.addEventListener('click', () => openLb(w));
    grid.appendChild(d);
  });

  // filters
  $$('.chip').forEach(b => b.addEventListener('click', () => {
    $$('.chip').forEach(x => x.classList.toggle('active', x === b));
    $$('.item').forEach(i => i.classList.toggle('hide', b.dataset.f !== 'all' && i.dataset.c !== b.dataset.f));
  }));

  // lightbox
  const lb = $('#lb');
  function openLb(w) {
    const el = $('.lb-img', lb);
    el.style.setProperty('--r', w.r);
    el.style.backgroundImage = `url(${w.src})`;
    $('.lb-cap', lb).textContent = w.t;
    lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
  }
  const closeLb = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); };
  lb.addEventListener('click', e => { if (e.target !== $('.lb-img', lb)) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

  // ---- hero 3D ring ----
  const ring = $('#ring'), N = 8, R = 330;
  for (let i = 0; ring && i < N; i++) {
    const p = document.createElement('div'); p.className = 'pane';
    const w = works[i % works.length];
    p.style.transform = `rotateY(${i * 360 / N}deg) translateZ(${R}px)`;
    p.style.backgroundImage = `url(${w.src})`;
    ring.appendChild(p);
  }

  // ---- nav ----
  const nav = $('#nav');
  addEventListener('scroll', () => {
    nav.classList.toggle('solid', scrollY > 40);
    const bg = $('[data-parallax]');
    if (bg && scrollY < innerHeight) bg.style.transform = `translateY(${scrollY * .3}px)`;
  }, { passive: true });
  const burger = $('.burger');
  burger.addEventListener('click', () => {
    const o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o);
  });
  $$('#menu a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); }));

  // ---- reveal + counters ----
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    const b = $('b[data-count]', e.target);
    if (b) {
      const to = +b.dataset.count, t0 = performance.now();
      (function f(t) { const k = Math.min((t - t0) / 1400, 1); b.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); })(t0);
    }
  }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));

  // ---- 3D tilt + cursor ----
  const fine = matchMedia('(hover:hover)').matches;
  if (fine) {
    $$('.tilt').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(10px)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
    const cur = $('.cursor');
    addEventListener('mousemove', e => { cur.classList.add('on'); cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px'; });
    document.addEventListener('mouseover', e => cur.classList.toggle('big', !!e.target.closest('a,button,.item,.opts label,.slot')));
  }

  // ---- booking form ----
  const form = $('#bookForm'), steps = $$('.step', form), bars = $$('.steps i', form);
  let cur = 0;
  const show = n => { cur = n; steps.forEach((s, i) => s.classList.toggle('on', i === n)); bars.forEach((b, i) => b.classList.toggle('on', i <= n)); };
  const dateEl = $('#date'); dateEl.min = new Date().toISOString().slice(0, 10);
  $$('.next', form).forEach(b => b.addEventListener('click', () => {
    if (cur === 1 && (!dateEl.value || !form.city.value.trim())) { alert('Please choose a date and city.'); return; }
    show(cur + 1);
  }));
  $$('.prev', form).forEach(b => b.addEventListener('click', () => show(cur - 1)));
  $$('[data-pick]').forEach(a => a.addEventListener('click', () => {
    const v = a.dataset.pick; const r = $$('input[name=type]').find(i => i.value === v); if (r) r.checked = true;
  }));
  let via = 'wa';
  $$('button[type=submit]', form).forEach(b => b.addEventListener('click', () => via = b.dataset.via));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const err = $('#err'); err.textContent = '';
    const name = form.name.value.trim(), phone = form.phone.value.trim();
    if (!name || phone.replace(/\D/g, '').length < 10) { err.textContent = 'Please enter your name and a valid phone number.'; return; }
    const msg = `New booking request\nType: ${form.type.value}\nDate: ${form.date.value}\nCity: ${form.city.value}\nBudget: ${form.budget.value}\nName: ${name}\nPhone: ${phone}\nNotes: ${form.notes.value || '-'}`;
    if (via === 'wa') window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank');
    else location.href = `mailto:${MAIL}?subject=${encodeURIComponent('Booking request: ' + form.type.value)}&body=${encodeURIComponent(msg)}`;
  });

  // ---- call session ----
  const slots = $('#slots'), times = ['11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM', '9:00 PM'];
  let pick = null;
  for (let d = 1; d <= 3; d++) {
    const dt = new Date(); dt.setDate(dt.getDate() + d);
    const label = dt.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    times.forEach(t => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'slot';
      b.innerHTML = `${t}<small>${label}</small>`;
      b.addEventListener('click', () => { $$('.slot').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); pick = `${label} at ${t}`; });
      slots.appendChild(b);
    });
  }
  $('#callReq').addEventListener('click', () => {
    const n = $('#cName').value.trim(), p = $('#cPhone').value.trim(), er = $('#cErr');
    if (!pick) { er.textContent = 'Please pick a time slot.'; return; }
    if (!n || p.replace(/\D/g, '').length < 10) { er.textContent = 'Please enter your name and a valid phone number.'; return; }
    er.textContent = '';
    const msg = `Call request\nSlot: ${pick}\nName: ${n}\nPhone: ${p}`;
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank');
  });

  $('#yr').textContent = new Date().getFullYear();
})();
