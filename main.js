'use strict';

// Source of truth for clickable predictions. The desktop layout follows the Figma canvas (1920 px).
const predictions = [
  { title: 'Глаз', image: 'prediction-eye.png', x: 66, y: 4070, text: 'В новом году все взгляды будут прикованы к вам. Ваши идеи окажутся в центре внимания, проекты будут обсуждать, а конкуренты — внимательно изучать. Надеемся, хотя бы не сглазят.' },
  { title: 'Звезда', image: 'prediction-star.png', x: 1009, y: 4070, text: 'Пока одни будут искать свет в конце тоннеля, вы сами станете источником света. Вас ждут яркие идеи, громкие проекты и, возможно, несколько красивых статуэток. Давайте только обойдемся без падений.' },
  { title: 'Молния', image: 'prediction-lightning.png', x: 66, y: 5013, text: 'В следующем году вас ждут неожиданные озарения. Гениальные идеи будут приходить посреди ночи, в душе и на самых скучных встречах. Главное — не забывайте их записывать.' },
  { title: 'Рука', image: 'prediction-hand.png', x: 1009, y: 5013, text: 'Что бы ни происходило вокруг, вам всегда будет на кого опереться. В нужный момент появится рука помощи. Или не рука. Или не помощи. Но что-нибудь — обязательно появится.' },
  { title: 'Стрела', image: 'prediction-arrow.png', x: 66, y: 5956, text: 'В мире, где всё постоянно меняется, ваши идеи будут попадать точно в цель. Кстати, коллеги, цели поменялись.' },
  { title: 'Замок', image: 'prediction-lock.png', x: 1009, y: 5956, text: 'В новом году перед вами откроются двери, о существовании которых вы даже не подозревали. За ними будут новые возможности, интересные проекты – ну, или возможно, еще несколько дверей.' },
  { title: 'Коза', image: 'prediction-goat.png', x: 66, y: 6899, text: 'Кажется, следующий год потребует немного упрямства. Не отступайте от своих самых смелых идей, даже если окружающие будут смотреть на вас как на козу. В хорошем смысле.' },
  { title: 'Рыба', image: 'prediction-fish.png', x: 1009, y: 6899, text: 'В мутной воде перемен вы сумеете поймать свою золотую рыбку. Главное — правильно загадать желания. И не тратить все три на согласование бюджета.' },
  { title: 'Гриб', image: 'prediction-mushroom.png', x: 66, y: 7842, text: 'В новом году ваши идеи будут расти как грибы после дождя. Некоторые окажутся совершенно безумными, другие — неожиданно гениальными. Остальные — окажутся, и уже хорошо.' },
  { title: 'Корона', image: 'prediction-crown.png', x: 1009, y: 7842, text: 'В 2027-м вы почувствуете себя королём положения. Даже если вокруг будет полный хаос, вы сумеете сохранить лицо, достоинство и контроль над бюджетом. Ну, или хотя бы лицо.' },
];

const grid = document.getElementById('prediction-grid');
const dialog = document.getElementById('prediction-dialog');
const dialogTitle = document.getElementById('dialog-title');
const dialogBody = document.getElementById('dialog-body');
const dialogImage = document.getElementById('dialog-image');
const closeButton = document.getElementById('dialog-close');
let currentIndex = -1;
let trigger = null;

for (let i = 0; i < predictions.length; i++) {
  const item = predictions[i];
  const article = document.createElement('article');
  article.className = 'prediction';
  article.style.left = `${item.x}px`;
  article.style.top = `${item.y}px`;
  article.innerHTML = `
    <button class="prediction__trigger" type="button" aria-label="Открыть предсказание «${item.title}»">
      <img class="asset prediction__image" src="./assets/${item.image}" alt="Символ ${item.title.toLowerCase()}" loading="lazy">
      <span class="prediction__hint" aria-hidden="true">Открыть предсказание ↗</span>
    </button>
  `;
  const button = article.querySelector('button');
  button.addEventListener('click', () => openPrediction(i, button));
  grid.appendChild(article);
}

function openPrediction(index, clickedButton) {
  currentIndex = index;
  if (clickedButton) trigger = clickedButton;
  const item = predictions[index];
  dialogTitle.textContent = item.title;
  dialogBody.textContent = item.text;
  dialogImage.src = `./assets/${item.image}`;
  dialogImage.alt = `Символ «${item.title}»`;
  dialog.setAttribute('aria-hidden', 'false');
  dialog.classList.add('is-open');
  document.body.classList.add('modal-open');
  closeButton.focus();
}

function closePrediction() {
  if (!dialog.classList.contains('is-open')) return;
  dialog.classList.remove('is-open');
  dialog.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (trigger) trigger.focus();
}

closeButton.addEventListener('click', closePrediction);
dialog.querySelector('[data-close-dialog]').addEventListener('click', closePrediction);
document.getElementById('dialog-next').addEventListener('click', () => openPrediction((currentIndex + 1) % predictions.length));
document.addEventListener('keydown', (event) => {
  if (!dialog.classList.contains('is-open')) return;
  if (event.key === 'Escape') closePrediction();
  if (event.key === 'ArrowRight') openPrediction((currentIndex + 1) % predictions.length);
  if (event.key === 'ArrowLeft') openPrediction((currentIndex + predictions.length - 1) % predictions.length);
  if (event.key === 'Tab') {
    const controls = dialog.querySelectorAll('button');
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

// Copy stays local. The page can be deployed on GitHub Pages without a backend.
const toast = document.getElementById('toast');
let toastTimer;
document.getElementById('copy-promo').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('ТБНГ27');
    toast.textContent = 'Промокод ТБНГ27 скопирован';
  } catch (error) {
    toast.textContent = 'Промокод: ТБНГ27';
  }
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2300);
});


// Final gift: five continuous photo frames controlled by dragging, then a subtle snowfall of foil.
const unwrapButton = document.getElementById('final-unwrap');
const finalSection = document.querySelector('.final');
const surpriseContent = document.getElementById('final-surprise-content');
const wrapFrame = document.getElementById('final-wrap-frame');
const confettiCanvas = document.getElementById('final-confetti');

if (unwrapButton && finalSection && surpriseContent && wrapFrame) {
  const frameUrls = Array.from({length:5},(_,i)=>`./assets/final-wrap/wrap-${i}.webp`);
  let framesAvailable = false;
  let currentStep = 0;
  let isDragging = false;
  let dragPointer = null;
  let dragStartX = 0;
  let progressAtDragStart = 0;
  let dragProgress = 0;
  let isRevealed = false;
  const pixelsPerStep = window.matchMedia('(max-width: 767px)').matches ? 46 : 145;
  const totalDragDistance = pixelsPerStep * 5;

  // Activate the photographic interaction only after all five frames are ready.
  // This prevents broken images or sudden frame jumps while dragging.
  Promise.all(frameUrls.map(url => new Promise((resolve,reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load '+url));
    image.src = url;
  }))).then(() => {
    framesAvailable = true;
    wrapFrame.src = frameUrls[0];
    finalSection.classList.add('has-frame-assets');
  }).catch(error => {
    console.error('Gift reveal frames unavailable:',error);
    // The existing visual remains available; no random click-to-open behavior.
  });

  function showStep(step) {
    const next = Math.max(0, Math.min(4,step));
    if (next === currentStep) return;
    currentStep = next;
    wrapFrame.src = frameUrls[next];
  }

  function revealGift() {
    if (isRevealed) return;
    isRevealed = true;
    isDragging = false;
    unwrapButton.classList.remove('is-dragging');
    surpriseContent.removeAttribute('inert');
    surpriseContent.setAttribute('aria-hidden','false');
    unwrapButton.setAttribute('aria-expanded','true');
    finalSection.classList.add('is-revealed');
    startSilverConfetti();
  }

  // Each 145px of travel to the LEFT reveals one more stage. Movement
  // right/up/down and individual mouse clicks cannot change the frame.
  // Progress is retained when the pointer is released, so users can pull again.
  function updateDrag(event) {
    if (!framesAvailable || isRevealed || !isDragging || event.pointerId !== dragPointer) return;
    const pulledLeft = Math.max(0, dragStartX - event.clientX);
    const distance = Math.min(totalDragDistance, progressAtDragStart + pulledLeft);
    dragProgress = Math.max(dragProgress,distance);
    if (dragProgress >= totalDragDistance) {
      revealGift();
      return;
    }
    showStep(Math.floor(dragProgress/pixelsPerStep));
    event.preventDefault();
  }

  unwrapButton.addEventListener('pointerdown',event => {
    if (!framesAvailable || isRevealed) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    isDragging = true;
    dragPointer = event.pointerId;
    dragStartX = event.clientX;
    progressAtDragStart = dragProgress;
    unwrapButton.classList.add('is-dragging');
    // Capture survives moving outside the corner hotspot during the pull.
    try { unwrapButton.setPointerCapture(event.pointerId); } catch (_) {}
    event.preventDefault();
  });

  unwrapButton.addEventListener('pointermove',updateDrag);
  window.addEventListener('pointermove',event => {
    // Fallback for browsers that lose capture during a long drag.
    if (event.target !== unwrapButton) updateDrag(event);
  },{passive:false});

  function stopDrag(event) {
    if (!isDragging || (event && event.pointerId !== dragPointer)) return;
    isDragging = false;
    dragPointer = null;
    unwrapButton.classList.remove('is-dragging');
  }
  unwrapButton.addEventListener('pointerup',stopDrag);
  unwrapButton.addEventListener('pointercancel',stopDrag);
  unwrapButton.addEventListener('lostpointercapture',() => stopDrag());
  window.addEventListener('pointerup',stopDrag);
  window.addEventListener('blur',() => stopDrag());

  // No mouse click progression. Keyboard users can advance with Left / Enter / Space.
  unwrapButton.addEventListener('click',event => event.preventDefault());
  unwrapButton.addEventListener('keydown',event => {
    if (isRevealed || !framesAvailable) return;
    if (!['ArrowLeft','Enter',' '].includes(event.key)) return;
    event.preventDefault();
    dragProgress = Math.min(totalDragDistance,dragProgress+pixelsPerStep);
    if (dragProgress >= totalDragDistance) revealGift();
    else showStep(Math.floor(dragProgress/pixelsPerStep));
  });


  function startSilverConfetti() {
    if (!confettiCanvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const context = confettiCanvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    let previous = performance.now();
    let particles = [];

    function makeParticle(startAnywhere = false) {
      return {
        x: Math.random() * width,
        y: startAnywhere ? Math.random() * height : -12 - Math.random() * height * .55,
        w: 2.5 + Math.random() * 3.7,
        h: 2 + Math.random() * 4.4,
        vy: .38 + Math.random() * .85,
        sway: .22 + Math.random() * .45,
        phase: Math.random() * Math.PI * 2,
        alpha: .38 + Math.random() * .4,
        rotation: Math.random() * Math.PI,
        turn: .008 + Math.random() * .022
      };
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      confettiCanvas.width = Math.round(width * ratio);
      confettiCanvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.max(26, Math.min(72, Math.round(width * height / 26000)));
      particles = Array.from({ length: count }, () => makeParticle(true));
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    function render(now) {
      const dt = Math.min((now - previous) / 16.67, 2.5);
      previous = now;
      if (document.hidden) {
        requestAnimationFrame(render);
        return;
      }
      context.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y += p.vy * dt;
        p.phase += p.turn * dt;
        p.x += Math.sin(p.phase) * p.sway * dt;
        if (p.y > height + 12) Object.assign(p, makeParticle());
        if (p.x < -12) p.x = width + 10;
        else if (p.x > width + 12) p.x = -10;
        const shimmer = .46 + .54 * Math.abs(Math.sin(p.phase * 2.3));
        context.save();
        context.translate(p.x, p.y);
        context.rotate(p.rotation + Math.sin(p.phase) * .6);
        context.globalAlpha = p.alpha * shimmer;
        context.fillStyle = shimmer > .76 ? '#f8f9fc' : '#b4bac5';
        context.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        if (shimmer > .92 && p.w > 4) {
          context.fillRect(-.45, -p.h * 1.2, .9, p.h * 2.4);
        }
        context.restore();
      }
      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }
}
