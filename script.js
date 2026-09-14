// Ubah bagian ini untuk mengganti isi surat.
const CONFIG = {
  title: 'Happy 4 Months, Sayang ♡',
  message: 'Selamat empat bulan buat kita, sayang!\n\nWalaupun sekarang kita dipisahkan jarak, aku senang bisa menjalani empat bulan ini bareng kamu. Pesan darimu, kabar sederhana tentang harimu, dan waktu yang kita luangkan buat ngobrol selalu aku tunggu. Lewat hal-hal kecil itu, kamu tetap terasa dekat.',
  closing: 'Aku kangen kamu. Ada banyak hal sederhana yang ingin aku lakukan bareng kamu: ngobrol sambil duduk bersebelahan, melihat senyummu langsung, dan memelukmu tanpa dibatasi layar. Semoga nanti kita punya waktu untuk melakukan semua itu.\n\nSambil menunggu waktu ketemu, aku ingin kita terus saling percaya, jujur tentang perasaan, dan memahami kesibukan masing-masing. Kalau ada yang bikin sedih atau kepikiran, cerita ya. Kita cari jalan keluarnya bareng.\n\nTerima kasih sudah menjalani hubungan jarak jauh ini bersamaku. Happy 4 months, sayang. Aku sayang kamu, dari sini sampai nanti kita bisa saling peluk. I love you. ♡',
  signature: 'Dari aku yang kangen kamu ♡'
};

// Angka lebih besar membuat ucapan lebih pelan dan memberi waktu membaca lebih lama.
const SPEECH_TIMING = {
  characterDelay: 65,
  punctuationPause: 220,
  minimumReadTime: 5000,
  millisecondsPerWord: 350,
  maximumReadTime: 20000,
  fadeDuration: 450
};

const stars = document.querySelector('.stars');
for (let i = 0; i < 64; i++) {
  const star = document.createElement('i');
  star.className = 'star';
  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;
  const size = .8 + Math.random() * 1.8;
  star.style.width = star.style.height = `${size}px`;
  star.style.setProperty('--duration', `${2 + Math.random() * 4}s`);
  star.style.animationDelay = `${-Math.random() * 6}s`;
  stars.append(star);
}

// Jenis, tinggi, sudut, dan jeda tumbuh tiap tangkai bunga.
const stems = [
  ['daisy', 228, -34, .3], ['tulip', 290, -16, .1],
  ['rose', 316, 10, .4], ['daisy', 240, 32, .6],
  ['rose', 225, -8, .7], ['tulip', 270, 22, .25],
  ['tulip', 185, -25, .5]
];
const flowers = document.querySelector('.flowers');
function makePetals(type) {
  if (type === 'tulip') {
    return [-48, -25, 0, 25, 48].map((angle, i) =>
      `<i class="petal" style="--open-angle:${angle}deg;--petal-delay:${i * .09}s"></i>`
    ).join('');
  }
  const rings = type === 'rose' ? [[9, 22, 36], [7, 12, 28], [5, 3, 20]] : [[13, 23, 35]];
  return rings.map(([count, radius, size], ring) => Array.from({length: count}, (_, i) =>
    `<i class="petal ring-${ring}" style="--open-angle:${i * 360 / count + ring * 23}deg;--radius:${radius}px;--size:${size}px;--petal-delay:${ring * .3 + i * .035}s"></i>`
  ).join('')).join('') + '<i class="flower-center"></i>';
}
stems.forEach(([type, height, angle, delay]) => {
  const flower = document.createElement('div');
  flower.className = `flower ${type}`;
  flower.style.cssText = `--height:${height}px;--angle:${angle}deg;--delay:${delay}s`;
  flower.innerHTML = '<div class="stem"></div><i class="leaf"></i><i class="leaf right"></i><div class="bloom">' + makePetals(type) + '</div>';
  flowers.append(flower);
});
gardenAtmosphere.attachPerch(flowers.querySelectorAll('.daisy')[1].querySelector('.bloom'));

document.querySelector('#letter-title').textContent = CONFIG.title;
document.querySelector('#message-top').textContent = CONFIG.message;
document.querySelector('#message-bottom').textContent = CONFIG.closing;
document.querySelector('#signature').textContent = CONFIG.signature;

const intro = document.querySelector('.intro');
const gift = document.querySelector('.gift');
const envelope = document.querySelector('.envelope');
const letter = document.querySelector('.letter');
const replay = document.querySelector('.replay');
const readAgain = document.querySelector('.read-again');
const courier = document.querySelector('.courier');
const speech = document.querySelector('.dove-speech');
const doveMotion = new DoveFlight(document.querySelector('.dove'));
const hint = document.querySelector('.hint');
const speechVisual = document.querySelector('.speech-visual');
const speechSize = document.querySelector('.speech-size');
const speechCopy = document.querySelector('.speech-copy');
const announcement = document.querySelector('.speech-announcement');
const flowerRain = document.querySelector('.flower-rain');
const scene = document.querySelector('.scene');
const endingKeepsake = document.querySelector('.ending-keepsake');
const endingMessage = document.querySelector('.ending-message');
const sendHug = document.querySelector('.send-hug');
const hugGlow = document.querySelector('.hug-glow');
const hugMessage = document.querySelector('.hug-message');
let hugRun = 0;
let rainRun = 0;
let finishRain = null;
function clearFlowerRain() {
  rainRun++;
  if (finishRain) finishRain(false);
  finishRain = null;
  flowerRain.replaceChildren();
}
function startFlowerRain(burst) {
  clearFlowerRain();
  const run = rainRun;
  const completed = new Promise(resolve => { finishRain = resolve; });
  flowerRain.dataset.burst = burst;
  flowerRain.style.setProperty('--fall-height', `${Math.max(gift.clientHeight, innerHeight) + 80}px`);
  const count = burst === 'farewell' ? 28 : 18;
  const initialDelay = burst === 'bloom' ? 5.8 : 0;
  for (let i = 0; i < count; i++) {
    const flower = document.createElement('span');
    flower.className = `rain-flower shade-${i % 3}`;
    flower.style.cssText = `left:${4 + (i * 37) % 91}%;--rain-delay:${initialDelay + i * .16}s;--rain-speed:${5 + (i % 5) * .35}s;--rain-drift:${(i % 2 ? 1 : -1) * (18 + i % 4 * 7)}px;--rain-scale:${.7 + (i % 4) * .12}`;
    flower.innerHTML = '<span class="rain-bloom">' + Array.from({length:7}, (_, p) => `<i style="--petal-angle:${p * 360 / 7}deg"></i>`).join('') + '<b></b></span>';
    flower.addEventListener('animationend', event => {
      if (event.target !== flower || run !== rainRun) return;
      flower.remove();
      if (!flowerRain.childElementCount && finishRain) {
        finishRain(true);
        finishRain = null;
      }
    });
    flowerRain.append(flower);
  }
  return completed;
}
const pending = new Set();
let sceneState = 'intro';
let deliveryRun = 0;
let speechRun = 0;
function setState(value) {
  sceneState = value;
  gift.dataset.state = value;
  readAgain.hidden = value !== 'complete' && value !== 'rereading';
}
function pauseFor(ms, { visibleOnly = false } = {}) {
  return new Promise(resolve => {
    let timer = null;
    let remaining = ms;
    let startedAt = 0;
    let finished = false;
    const finish = value => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', visibilityChanged);
      pending.delete(cancel);
      resolve(value);
    };
    const cancel = () => finish(false);
    const resume = () => {
      startedAt = performance.now();
      timer = setTimeout(() => finish(true), Math.max(0, remaining));
    };
    const visibilityChanged = () => {
      if (document.hidden && timer !== null) {
        clearTimeout(timer);
        timer = null;
        remaining -= performance.now() - startedAt;
      } else if (!document.hidden && timer === null) resume();
    };
    pending.add(cancel);
    if (visibleOnly) document.addEventListener('visibilitychange', visibilityChanged);
    if (!visibleOnly || !document.hidden) resume();
  });
}
function cancelPending() {
  for (const cancel of [...pending]) cancel();
  speechRun++;
}
function speechReadTime(text) {
  const words = text.trim().split(/\s+/u).filter(Boolean).length;
  return Math.min(SPEECH_TIMING.maximumReadTime,
    Math.max(SPEECH_TIMING.minimumReadTime, 1200 + words * SPEECH_TIMING.millisecondsPerWord));
}
async function finishScene() {
  const run = deliveryRun;
  setState('complete');
  gift.dataset.ending = 'rain';
  gardenAtmosphere.startPerch();
  hint.textContent = 'Bunganya tetap di sini untukmu ♡';
  scene.classList.add('ending-calm');
  if (!(await startFlowerRain('farewell')) || run !== deliveryRun) return;
  gift.dataset.ending = 'gathering';
  endingKeepsake.hidden = false;
  // Dua kupu-kupu muncul bersama; tulisan menyusul setelah transisi selesai.
  if (!(await animationsFinished(endingKeepsake)) || run !== deliveryRun) return;
  gift.dataset.ending = 'complete';
  hint.hidden = true;
  endingMessage.hidden = false;
  endingMessage.textContent = 'Beda tempat, tetap kita. Happy 4 months, sayang ♡';
  sendHug.hidden = false;
  hugMessage.hidden = false;
}
async function animationsFinished(element) {
  try {
    await Promise.all(element.getAnimations({ subtree: true }).map(animation => animation.finished));
    return true;
  } catch { return false; }
}
function resetHug() {
  hugRun++;
  gift.classList.remove('sending-hug');
  sendHug.removeAttribute('aria-disabled');
  hugMessage.textContent = '';
}
sendHug.addEventListener('click', async () => {
  if (sceneState !== 'complete' || gift.dataset.ending !== 'complete' || gift.classList.contains('sending-hug')) return;
  const run = ++hugRun;
  sendHug.setAttribute('aria-disabled', 'true');
  hugMessage.textContent = 'Titip peluk sampai kita ketemu.';
  gift.classList.add('sending-hug');
  const completed = await Promise.all([animationsFinished(hugGlow), animationsFinished(hugMessage)]);
  if (completed.every(Boolean) && run === hugRun) resetHug();
});
function resetEnding() {
  gardenAtmosphere.resetPerch();
  clearFlowerRain();
  resetHug();
  delete gift.dataset.ending;
  scene.classList.remove('ending-calm', 'ending-still');
  endingKeepsake.hidden = true;
  endingMessage.hidden = true;
  endingMessage.textContent = '';
  sendHug.hidden = true;
  hugMessage.hidden = true;
  hint.hidden = false;
}
async function say(text) {
  const id = ++speechRun;
  speech.classList.remove('speech-leaving');
  speech.style.setProperty('--speech-fade', `${SPEECH_TIMING.fadeDuration}ms`);
  // Ukur seluruh kalimat dari awal agar balon tidak meloncat saat kata bertambah.
  speechSize.textContent = text;
  speechVisual.textContent = '';
  speech.hidden = false;
  speechCopy.scrollTop = 0;
  announcement.textContent = text;
  const characters = typeof Intl.Segmenter === 'function'
    ? [...new Intl.Segmenter('id', { granularity: 'grapheme' }).segment(text)].map(part => part.segment)
    : Array.from(text);
  for (let i = 0; i < characters.length; i++) {
    if (id !== speechRun) return false;
    const character = characters[i];
    speechVisual.textContent += character;
    if (i === characters.length - 1) break;
    const delay = SPEECH_TIMING.characterDelay + (/[,.!?;:\n]/u.test(character) ? SPEECH_TIMING.punctuationPause : 0);
    if (!(await pauseFor(delay, { visibleOnly: true })) || id !== speechRun) return false;
  }
  return true;
}
window.addEventListener('pagehide', () => doveMotion.stop());
window.addEventListener('pageshow', event => {
  if (event.persisted && !gift.hidden && sceneState !== 'complete' && sceneState !== 'rereading') {
    if (sceneState === 'departing') {
      courier.style.visibility = 'hidden';
      finishScene();
      return;
    }
    const flight = courier.getAnimations().find(a => a.animationName === 'dove-arrives');
    if (flight) doveMotion.start(flight);
  }
});
function watchDelivery() {
  const run = ++deliveryRun;
  const flight = courier.getAnimations().find(animation => animation.animationName === 'dove-arrives');
  if (!flight) return;
  doveMotion.start(flight);
  startFlowerRain('bloom');
  flight.finished.then(() => {
    if (run !== deliveryRun) return;
    setState('delivered');
    envelope.disabled = false;
    say('Ini ada surat buat kamu ♡');
  }).catch(() => {});
}
replay.addEventListener('click', () => {
  setState('flying');
  deliveryRun++;
  cancelPending();
  resetEnding();
  doveMotion.stop();
  if (letter.open) letter.close();
  letter.classList.remove('is-closing');
  document.body.classList.remove('reading-letter');
  speech.hidden = true;
  speech.classList.remove('speech-leaving');
  speechSize.textContent = '';
  speechVisual.textContent = '';
  announcement.textContent = '';
  envelope.hidden = false;
  envelope.disabled = true;
  envelope.classList.remove('is-opening', 'is-delivered');
  hint.textContent = 'Klik amplop yang dibawa merpatinya ♡';
  // Ulangi gerakan bunga dan kemunculan amplop tanpa refresh halaman.
  for (const animation of gift.getAnimations({ subtree: true })) {
    if (animation.effect.target === replay || animation.effect.target === gift) continue;
    animation.currentTime = 0;
    animation.play();
  }
  watchDelivery();
});
const openingFlight = new ButterflyOpening(document.querySelector('.butterfly-transition'), intro);
document.querySelector('.open-gift').addEventListener('click', event => {
  event.currentTarget.disabled = true;
  openingFlight.play(() => {
    intro.hidden = true;
    gift.hidden = false;
    setState('flying');
    watchDelivery();
    gift.focus({ preventScroll: true });
  });
}, { once: true });
envelope.addEventListener('click', async () => {
  if (sceneState !== 'delivered') return;
  const run = deliveryRun;
  setState('opening');
  speechRun++;
  speech.hidden = true;
  envelope.disabled = true;
  envelope.classList.add('is-opening');
  doveMotion.nod();
  if (!(await pauseFor(1000)) || run !== deliveryRun || sceneState !== 'opening') return;
  envelope.classList.add('is-delivered');
  setState('reading');
  showLetter();
});
function showLetter() {
  letter.classList.remove('is-closing');
  document.body.classList.add('reading-letter');
  letter.showModal();
  letter.scrollTop = 0;
}
async function closeLetter() {
  if (!letter.open || letter.classList.contains('is-closing')) return;
  const run = deliveryRun;
  letter.classList.add('is-closing');
  if (!(await pauseFor(220)) || run !== deliveryRun) return;
  letter.close();
  letter.classList.remove('is-closing');
}
readAgain.addEventListener('click', () => {
  if (sceneState !== 'complete') return;
  setState('rereading');
  showLetter();
});
document.querySelector('.close').addEventListener('click', closeLetter);
letter.addEventListener('cancel', event => { event.preventDefault(); closeLetter(); });
letter.addEventListener('click', event => {
  const rect = letter.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeLetter();
});
letter.addEventListener('close', async () => {
  document.body.classList.remove('reading-letter');
  if (sceneState === 'rereading') {
    setState('complete');
    readAgain.focus({ preventScroll: true });
    return;
  }
  if (sceneState !== 'reading') return;
  const run = deliveryRun;
  setState('farewell');
  envelope.hidden = true;
  hint.textContent = '♡';
  replay.focus({ preventScroll: true });
  const farewellText = 'iyung titip pesan katanya "sama dia terus ya"♡';
  if (!(await say(farewellText)) || run !== deliveryRun) return;
  doveMotion.nod();
  if (!(await pauseFor(speechReadTime(farewellText), { visibleOnly: true })) || run !== deliveryRun) return;
  speech.classList.add('speech-leaving');
  if (!(await pauseFor(SPEECH_TIMING.fadeDuration, { visibleOnly: true })) || run !== deliveryRun) return;
  speech.hidden = true;
  speech.classList.remove('speech-leaving');
  setState('departing');
  if (!(await doveMotion.depart()) || run !== deliveryRun) return;
  finishScene();
});
