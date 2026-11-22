(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Sticky nav shadow */
  const nav = document.querySelector('.nav');
  const onScroll = () => nav && nav.classList.toggle('is-stuck', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile drawer */
  const drawer = document.getElementById('drawer');
  const burger = document.querySelector('.burger');
  const closeBtn = document.querySelector('.drawer__close');
  const setOpen = (open) => {
    if (!drawer || !burger) return;
    drawer.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger && burger.addEventListener('click', () => setOpen(drawer.hidden));
  closeBtn && closeBtn.addEventListener('click', () => setOpen(false));
  drawer && drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

  /* Visas dropdown on click (needed for touch) */
  document.querySelectorAll('.menu__drop').forEach((drop) => {
    const btn = drop.querySelector('button');
    btn && btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = !drop.classList.contains('is-open');
      document.querySelectorAll('.menu__drop').forEach((d) => d.classList.remove('is-open'));
      drop.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.menu__drop').forEach((d) => {
      d.classList.remove('is-open');
      const b = d.querySelector('button');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  });

  /* Hero slider */
  const slides = Array.from(document.querySelectorAll('#slides figure'));
  const dotsWrap = document.getElementById('dots');
  let i = 0, timer;
  if (slides.length && dotsWrap) {
    const dots = slides.map((_, n) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Show photograph ' + (n + 1));
      b.addEventListener('click', () => go(n, true));
      dotsWrap.appendChild(b);
      return b;
    });
    const go = (n, stop) => {
      slides[i].classList.remove('is-on');
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('is-on');
      dots.forEach((d, k) => d.classList.toggle('is-on', k === i));
      if (stop) restart();
    };
    const restart = () => {
      clearInterval(timer);
      if (!reduce && slides.length > 1) timer = setInterval(() => go(i + 1), 6500);
    };
    go(0);
    restart();
  }

  /* Demo forms */
  const toast = document.querySelector('.toast');
  const flash = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-on');
    setTimeout(() => toast.classList.remove('is-on'), 4200);
  };
  document.querySelectorAll('#enquiry, #callback').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.reset();
      flash('Thank you. This is a design demo, so nothing was sent. On the live site the team will call you back.');
    });
  });
})();
