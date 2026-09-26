const products = [
  {id: 'chair', name: 'The Sunday Chair', category: 'Furniture', note: 'An invitation to slow down', price: 18900, image: 'assets/chair.jpg', label: 'THE EVERYDAY FAVORITE', material: 'Soft upholstery · Natural oak', description: 'A generous seat for a favorite book, an unhurried coffee, and everything in between. The Sunday brings a softer rhythm to your living space.', color: '#9f825f'},
  {id: 'lamp', name: 'The Arc Table Light', category: 'Lighting', note: 'A softer kind of glow', price: 6400, image: 'assets/lamp.jpg', label: 'A BRIGHT IDEA', material: 'Powder-coated metal · Warm light', description: 'A simple silhouette that makes a quiet statement. A warm pool of light for your desk, your bedside, or your evening wind-down.', color: '#d9d8d0'},
  {id: 'vase', name: 'The Studio Vessels', category: 'Objects', note: 'Beautiful with or without blooms', price: 2800, image: 'assets/vase.jpg', label: 'SMALL OBJECT, BIG FEELING', material: 'Ceramic · Chalk finish', description: 'Sculptural forms with a beautifully understated finish. A considered accent for shelves, tables, and the spaces that make a home yours.', color: '#e2ded2'}
];

const slides = [
  {kicker: 'The living collection', title: 'Room to unwind.', label: 'SLOW MORNINGS. GOOD COMPANY.'},
  {kicker: 'The lighting edit', title: 'A softer glow.', label: 'EVENINGS, WARMLY LIT.'},
  {kicker: 'The objects edit', title: 'Small, but mighty.', label: 'QUIET FORMS. BIG FEELING.'}
];

const $ = id => document.getElementById(id);
const money = n => '₹' + n.toLocaleString('en-IN');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const hasGsap = !reducedMotion && !!(window.gsap && window.ScrollTrigger);
if (hasGsap) document.documentElement.classList.add('has-gsap');
let lenis;
let cart = {};
let toastTimer;

/* ---------- Shop ---------- */

function notify(message) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function renderProducts(category = 'All') {
  const selected = products.filter(p => category === 'All' || p.category === category);
  $('products').innerHTML = selected.map((p, i) => `
    <article style="--i:${i}">
      <div class="product-media">
        <button class="product-view" data-view="${p.id}" aria-label="View ${p.name}"><img src="${p.image}" alt="${p.name}" loading="lazy"></button>
        <span class="tag">${p.label}</span>
        <button class="add" data-add="${p.id}" aria-label="Add ${p.name} to bag"><b aria-hidden="true">+</b><span class="add-label" aria-hidden="true">Add to bag</span></button>
      </div>
      <div class="product-info">
        <div><h3>${p.name}</h3><p>${p.note}</p><span class="swatch" style="background:${p.color}" aria-hidden="true"></span></div>
        <span class="price">${money(p.price)}</span>
      </div>
    </article>`).join('');
  $('result-count').textContent = `${selected.length} considered ${selected.length === 1 ? 'piece' : 'pieces'}`;
  bindTilt();
}

function renderLookbook() {
  $('lookbook-track').insertAdjacentHTML('beforeend', products.map((p, i) => `
    <article class="look">
      <div class="look-media"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
      <div class="look-info">
        <span class="look-num" aria-hidden="true">0${i + 1}</span>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <p class="material">${p.material}</p>
        <div class="look-buy">
          <span class="price">${money(p.price)}</span>
          <button class="button light" data-add="${p.id}"><span class="button-text">Add to bag</span><span class="button-icon">+</span></button>
          <button class="text-link" data-view="${p.id}">Details</button>
        </div>
      </div>
    </article>`).join(''));
}

function add(id, source) {
  if (!products.some(p => p.id === id)) throw Error('Unknown product');
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  flyToBag(source);
  notify('A good choice. Added to your bag.');
  return {productId: id, quantity: cart[id]};
}

function renderCart() {
  const selected = products.filter(p => cart[p.id]);
  $('cart-count').textContent = Object.values(cart).reduce((a, b) => a + b, 0);
  $('cart-items').innerHTML = selected.length
    ? selected.map((p, i) => `
      <article class="cart-row" style="--i:${i}">
        <img src="${p.image}" alt="${p.name}">
        <div>
          <h3>${p.name}</h3>
          <p>${money(p.price)}</p>
          <div class="quantity">
            <button data-qty="${p.id}" data-change="-1" aria-label="Decrease ${p.name} quantity">−</button>
            <span aria-label="Quantity">${cart[p.id]}</span>
            <button data-qty="${p.id}" data-change="1" aria-label="Increase ${p.name} quantity">+</button>
            <button class="remove" data-remove="${p.id}" aria-label="Remove ${p.name}">Remove</button>
          </div>
        </div>
      </article>`).join('')
    : '<div class="empty"><h3>Room for something good.</h3><p>Your bag is empty. Find your everyday favorite.</p><button class="button dark" data-close="cart-dialog"><span class="button-text">Explore the collection</span><span class="button-icon">↗</span></button></div>';

  const subtotal = selected.reduce((s, p) => s + p.price * cart[p.id], 0);
  $('cart-summary').innerHTML = selected.length
    ? `<div class="total"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
       <small>${subtotal >= 10000 ? 'Complimentary delivery included.' : 'Delivery calculated at checkout.'}</small>
       <button class="button dark" id="checkout"><span class="button-text">Try demo checkout</span><span class="button-icon">↗</span></button>
       <small>Concept store. No payment or real order will be placed.</small>`
    : '';
}

function showProduct(id) {
  const p = products.find(p => p.id === id);
  if (!p) return;
  $('detail').innerHTML = `
    <img src="${p.image}" alt="${p.name}">
    <div>
      <p class="eyebrow">${p.category.toUpperCase()}</p>
      <h2 id="detail-title">${p.name}</h2>
      <p>${p.description}</p>
      <p>${p.material}</p>
      <strong>${money(p.price)}</strong>
      <button class="button dark" data-add="${p.id}"><span class="button-text">Add to bag</span><span class="button-icon">+</span></button>
    </div>`;
  openDialog($('product-dialog'));
}

function checkout() {
  $('cart-items').innerHTML = '<div class="empty"><div class="check" aria-hidden="true">✓</div><p class="eyebrow">LOOKS GOOD ON YOU</p><h3>Your demo order is complete.</h3><p>Thanks for exploring FORMA. No payment was taken and no real order was placed.</p><button class="button dark" data-close="cart-dialog"><span class="button-text">Keep exploring</span><span class="button-icon">↗</span></button></div>';
  $('cart-summary').innerHTML = '';
  cart = {};
  $('cart-count').textContent = '0';
}

/* ---------- Dialogs ---------- */

function openDialog(dialog) {
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('locked');
  lenis?.stop();
}

function closeDialog(dialog) {
  if (!dialog.open || dialog.classList.contains('closing')) return;
  if (reducedMotion) return dialog.close();
  dialog.classList.add('closing');
  const finish = () => {
    clearTimeout(fallback);
    dialog.removeEventListener('animationend', onEnd);
    dialog.classList.remove('closing');
    dialog.close();
  };
  const onEnd = e => { if (e.target === dialog && !e.pseudoElement) finish(); };
  const fallback = setTimeout(finish, 600);
  dialog.addEventListener('animationend', onEnd);
}

document.querySelectorAll('dialog').forEach(d => {
  d.addEventListener('click', e => {
    if (e.target !== d) return;
    const r = d.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDialog(d);
  });
  d.addEventListener('cancel', e => { e.preventDefault(); closeDialog(d); });
  d.addEventListener('close', () => {
    if (document.querySelector('dialog[open]')) return;
    document.body.classList.remove('locked');
    lenis?.start();
  });
});

/* ---------- Click handling ---------- */

document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.category) selectCategory(b);
  if (b.dataset.view) showProduct(b.dataset.view);
  if (b.dataset.add) add(b.dataset.add, b.closest('article, #detail')?.querySelector('img'));
  if (b.dataset.close) closeDialog($(b.dataset.close));
  if (b.id === 'open-cart') { renderCart(); openDialog($('cart-dialog')); }
  if (b.dataset.qty) {
    cart[b.dataset.qty] += Number(b.dataset.change);
    if (cart[b.dataset.qty] <= 0) delete cart[b.dataset.qty];
    renderCart();
  }
  if (b.dataset.remove) { delete cart[b.dataset.remove]; renderCart(); }
  if (b.id === 'checkout') checkout();
});

function selectCategory(button) {
  document.querySelectorAll('[data-category]').forEach(x => {
    x.classList.toggle('active', x === button);
    x.setAttribute('aria-pressed', String(x === button));
  });
  movePill();
  renderProducts(button.dataset.category);
  if (hasGsap) ScrollTrigger.refresh();
}

function movePill() {
  const pill = $('filter-pill');
  const active = document.querySelector('[data-category].active');
  if (!pill || !active) return;
  pill.style.width = active.offsetWidth + 'px';
  pill.style.height = active.offsetHeight + 'px';
  pill.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
}

/* ---------- Motion ---------- */

function flyToBag(source) {
  const bag = $('cart-count');
  const bump = () => { bag.classList.remove('bump'); void bag.offsetWidth; bag.classList.add('bump'); };
  if (reducedMotion || !source) return bump();
  const from = source.getBoundingClientRect();
  const to = bag.getBoundingClientRect();
  const size = Math.min(from.width, 160);
  const clone = document.createElement('img');
  clone.src = source.currentSrc || source.src;
  clone.alt = '';
  clone.className = 'fly';
  Object.assign(clone.style, {
    width: size + 'px', height: size + 'px',
    left: from.left + (from.width - size) / 2 + 'px',
    top: from.top + (from.height - size) / 2 + 'px'
  });
  document.body.append(clone);
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  clone.animate([
    {transform: 'translate(0,0) scale(1)', opacity: 1, borderRadius: '16px'},
    {transform: `translate(${dx * .5}px, ${dy - 80}px) scale(.55) rotate(-8deg)`, opacity: 1, offset: .55},
    {transform: `translate(${dx}px, ${dy}px) scale(.08)`, opacity: .4, borderRadius: '50%'}
  ], {duration: 850, easing: 'cubic-bezier(.6,0,.3,1)'}).onfinish = () => { clone.remove(); bump(); };
}

function splitWords(root, className, inner) {
  let i = 0;
  const walk = node => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.append(part);
          const word = document.createElement('span');
          word.className = className;
          if (inner) {
            const span = document.createElement('span');
            span.style.setProperty('--i', i);
            span.textContent = part;
            word.append(span);
          } else {
            word.textContent = part;
          }
          i++;
          frag.append(word);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1 && child.tagName !== 'BR') {
        walk(child);
      }
    });
  };
  walk(root);
}

function observeReveals() {
  const targets = document.querySelectorAll('.reveal, .split, .footer-word, .products');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('in'));
    return;
  }
  document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('in'));
  const io = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    io.unobserve(entry.target);
  }), {threshold: .08, rootMargin: '0px 0px -5% 0px'});
  targets.forEach(el => io.observe(el));
}

function bindTilt() {
  if (!finePointer || reducedMotion) return;
  document.querySelectorAll('.product-media').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.classList.add('tilting');
      card.style.setProperty('--ry', (x - .5) * 10 + 'deg');
      card.style.setProperty('--rx', (.5 - y) * 10 + 'deg');
      card.style.setProperty('--mx', x * 100 + '%');
      card.style.setProperty('--my', y * 100 + '%');
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('tilting');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

function initCursor() {
  if (!finePointer || reducedMotion) return;
  const cursor = document.querySelector('.cursor');
  const dot = cursor.querySelector('.cursor-dot');
  const ring = cursor.querySelector('.cursor-ring');
  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
  addEventListener('pointermove', e => {
    x = e.clientX; y = e.clientY;
    cursor.classList.add('active');
    dot.style.transform = `translate(${x}px, ${y}px)`;
    const target = e.target.closest?.('a, button');
    cursor.classList.toggle('view', !!e.target.closest?.('.product-view'));
    cursor.classList.toggle('hover', !!target);
  });
  document.addEventListener('pointerleave', () => cursor.classList.remove('active'));
  (function loop() {
    rx += (x - rx) * .18;
    ry += (y - ry) * .18;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  })();
}

function initMagnetic() {
  if (!finePointer || reducedMotion) return;
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transition = 'transform .2s linear';
      el.style.transform = `translate(${dx * .25}px, ${dy * .35}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transition = 'transform .7s cubic-bezier(.22,1,.36,1)';
      el.style.transform = '';
    });
  });
}

function initScroll() {
  const header = $('header');
  const progress = $('progress');
  const fill = $('statement');
  const words = fill ? [...fill.querySelectorAll('.w, .pill')] : [];
  let lastY = scrollY;
  if (reducedMotion) words.forEach(w => w.classList.add('on'));
  let ticking = false;

  const update = () => {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    header.classList.toggle('scrolled', y > 40);
    const dialogOpen = !!document.querySelector('dialog[open]');
    header.classList.toggle('hidden', !dialogOpen && y > 500 && y > lastY);
    lastY = y;

    if (!reducedMotion) {
      if (words.length) {
        const r = fill.getBoundingClientRect();
        const t = Math.min(Math.max((innerHeight * .85 - r.top) / (r.height + innerHeight * .2), 0), 1);
        const lit = Math.round(t * words.length);
        words.forEach((w, i) => w.classList.toggle('on', i < lit));
      }
    }
    ticking = false;
  };
  addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, {passive: true});
  update();
}

function initSlideshow() {
  const images = [...document.querySelectorAll('#hero-slides img')];
  const bar = $('slide-progress');
  const interval = 5500;
  let index = 0;
  let barAnim;

  const runBar = () => {
    if (reducedMotion) return bar.style.transform = `scaleX(${(index + 1) / images.length})`;
    barAnim?.cancel();
    barAnim = bar.animate([{transform: 'scaleX(0)'}, {transform: 'scaleX(1)'}], {duration: interval, easing: 'linear', fill: 'forwards'});
  };
  const show = next => {
    index = next;
    images.forEach((img, i) => {
      img.classList.toggle('active', i === index);
      img.setAttribute('aria-hidden', String(i !== index));
    });
    const s = slides[index];
    $('slide-num').textContent = String(index + 1).padStart(2, '0');
    [['slide-kicker', s.kicker], ['slide-title', s.title]].forEach(([id, text]) => {
      const el = $(id);
      el.textContent = text;
      el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap');
    });
    document.querySelector('.image-label').textContent = s.label;
    runBar();
  };
  show(0);
  if (!reducedMotion) setInterval(() => { if (!document.hidden) show((index + 1) % images.length); }, interval);
}

function initLoader() {
  const loader = $('loader');
  const start = () => {
    loader.classList.add('done');
    setTimeout(() => {
      document.documentElement.classList.add('ready');
      observeReveals();
      heroIntro();
      loader.remove();
    }, reducedMotion ? 0 : 250);
  };
  let seen = false;
  try { seen = sessionStorage.getItem('forma-intro') === '1'; sessionStorage.setItem('forma-intro', '1'); } catch {}
  if (reducedMotion || seen) {
    loader.style.display = 'none';
    return start();
  }
  const count = $('loader-count');
  const t0 = performance.now();
  (function tick(now) {
    const t = Math.min((now - t0) / 1300, 1);
    count.textContent = Math.round(100 * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(tick);
  })(t0);
  const minTime = new Promise(r => setTimeout(r, 1300));
  const loaded = new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r, {once: true}));
  Promise.race([Promise.all([minTime, loaded]), new Promise(r => setTimeout(r, 2500))]).then(start);
}


function splitChars(root) {
  const chars = [];
  const walk = node => [...node.childNodes].forEach(child => {
    if (child.nodeType === 1) return walk(child);
    if (child.nodeType !== 3) return;
    const frag = document.createDocumentFragment();
    [...child.textContent].forEach(ch => {
      if (ch === ' ') return frag.append(' ');
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch;
      chars.push(span);
      frag.append(span);
    });
    child.replaceWith(frag);
  });
  walk(root);
  return chars;
}

let heroChars = [];
function heroIntro() {
  if (!hasGsap || !heroChars.length) return;
  gsap.to(heroChars, {yPercent: 0, rotate: 0, opacity: 1, duration: 1.5, stagger: .028, ease: 'expo.out', delay: .25});
}

function initMotion() {
  if (!hasGsap) return;
  gsap.registerPlugin(ScrollTrigger);

  heroChars = [...document.querySelectorAll('.hero-title .line > span')].flatMap(splitChars);
  gsap.set(heroChars, {yPercent: 115, rotate: 7, opacity: 0, transformOrigin: '0% 100%'});

  if (window.Lenis) {
    lenis = new Lenis({lerp: .09});
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    document.addEventListener('click', e => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute('href');
      const target = hash === '#' ? 0 : document.querySelector(hash);
      if (target === null) return;
      e.preventDefault();
      lenis.scrollTo(target, {offset: hash === '#' ? 0 : -70, duration: 1.6});
    });
  }

  // Hero shrinks into a card as it scrolls away
  gsap.timeline({scrollTrigger: {trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true}})
    .to('#hero-media', {scale: .9, borderRadius: 40, ease: 'none'}, 0)
    .to('#hero-content', {yPercent: -25, opacity: 0, ease: 'none'}, 0);

  if (finePointer) {
    const xTo = gsap.quickTo('#hero-slides', 'x', {duration: 1.4, ease: 'power3'});
    const yTo = gsap.quickTo('#hero-slides', 'y', {duration: 1.4, ease: 'power3'});
    $('hero').addEventListener('pointermove', e => {
      xTo((e.clientX / innerWidth - .5) * -36);
      yTo((e.clientY / innerHeight - .5) * -24);
    });
  }

  // Marquee reacts to scroll speed and direction
  const marquee = gsap.to('#marquee-track', {xPercent: -50, repeat: -1, duration: 30, ease: 'none'});
  marquee.totalTime(marquee.duration() * 100);
  const skewTo = gsap.quickTo('#marquee-track', 'skewX', {duration: .5, ease: 'power3'});
  let direction = 1;
  ScrollTrigger.create({
    trigger: '.marquee', start: 'top bottom', end: 'bottom top',
    onUpdate: self => {
      const v = self.getVelocity();
      if (Math.abs(v) < 10) return;
      direction = v > 0 ? 1 : -1;
      gsap.fromTo(marquee, {timeScale: direction * Math.min(1 + Math.abs(v) / 250, 7)}, {timeScale: direction, duration: 1.4, ease: 'power2.out', overwrite: true});
      skewTo(gsap.utils.clamp(-12, 12, v / -220));
    }
  });
  ScrollTrigger.addEventListener('scrollEnd', () => skewTo(0));

  // Horizontal lookbook on wide screens
  gsap.matchMedia().add('(min-width: 901px)', () => {
    const track = $('lookbook-track');
    const distance = () => track.scrollWidth - innerWidth;
    const slide = gsap.to(track, {
      x: () => -distance(), ease: 'none',
      scrollTrigger: {
        trigger: '#lookbook-pin', pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
        end: () => '+=' + distance(),
        onUpdate: self => gsap.set('#lookbook-progress', {scaleX: self.progress})
      }
    });
    track.querySelectorAll('.look').forEach(look => {
      gsap.fromTo(look.querySelector('.look-media img'), {xPercent: -8}, {
        xPercent: 8, ease: 'none',
        scrollTrigger: {trigger: look, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true}
      });
      gsap.from(look.querySelectorAll('.look-info > *'), {
        y: 70, opacity: 0, stagger: .08, duration: 1.1, ease: 'expo.out',
        scrollTrigger: {trigger: look, containerAnimation: slide, start: 'left 65%'}
      });
    });
  });

  // Image grows from a small window to full screen while the title splits apart
  gsap.timeline({scrollTrigger: {trigger: '#zoom-pin', pin: true, start: 'top top', end: '+=170%', scrub: 1, anticipatePin: 1, invalidateOnRefresh: true}})
    .fromTo('#zoom-media', {clipPath: 'inset(28% 35% 28% 35% round 28px)'}, {clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut', duration: 1}, 0)
    .fromTo('#zoom-media img', {scale: 1.6}, {scale: 1, ease: 'power2.inOut', duration: 1}, 0)
    .to('.zoom-title .zl', {x: () => -innerWidth * .6, ease: 'power2.in', duration: .85}, 0)
    .to('.zoom-title .zr', {x: () => innerWidth * .6, ease: 'power2.in', duration: .85}, 0)
    .fromTo('#zoom-caption > *', {y: 50, autoAlpha: 0}, {y: 0, autoAlpha: 1, stagger: .06, duration: .25, ease: 'power2.out'}, .85);

  // Footer wordmark rises with the scroll
  gsap.fromTo('.footer-word span', {yPercent: 100}, {
    yPercent: 0, stagger: .06, ease: 'none',
    scrollTrigger: {trigger: 'footer', start: 'top 85%', end: 'bottom bottom', scrub: 1}
  });

  const refresh = () => ScrollTrigger.refresh();
  document.fonts?.ready.then(refresh);
  addEventListener('load', refresh);
}

/* ---------- Init ---------- */

document.querySelectorAll('.split').forEach(el => splitWords(el, 'word', true));
if ($('statement')) splitWords($('statement'), 'w', false);
document.querySelectorAll('.footer-word span').forEach((s, i) => s.style.setProperty('--i', i));

renderProducts();
renderLookbook();
renderCart();
movePill();
if (document.fonts) document.fonts.ready.then(movePill);
addEventListener('resize', movePill);

initMotion();
initLoader();
initSlideshow();
initScroll();
initCursor();
initMagnetic();

if (document.modelContext?.registerTool) {
  try {
    Promise.resolve(document.modelContext.registerTool({
      name: 'list_products',
      description: 'Read the FORMA concept store product catalog.',
      inputSchema: {type: 'object', properties: {}, additionalProperties: false},
      annotations: {readOnlyHint: true},
      execute: input => {
        if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length) throw Error('Expected an empty input object');
        return products.map(({id, name, category, price}) => ({id, name, category, price, currency: 'INR'}));
      }
    })).catch(() => {});
  } catch {}
}
