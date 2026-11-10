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


// Final gift: a one-time, accessible paper-tear reveal for this page visit.
const unwrapButton = document.getElementById('final-unwrap');
const finalSection = document.querySelector('.final');
const surpriseContent = document.getElementById('final-surprise-content');
if (unwrapButton && finalSection && surpriseContent) {
  unwrapButton.addEventListener('click', () => {
    if (finalSection.classList.contains('is-revealed')) return;
    surpriseContent.removeAttribute('inert');
    surpriseContent.setAttribute('aria-hidden', 'false');
    unwrapButton.setAttribute('aria-expanded', 'true');
    finalSection.classList.add('is-revealed');
    unwrapButton.blur();
  });
}
