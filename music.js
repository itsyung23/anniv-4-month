// Unggah lagu ke assets/music.mp3. Musik dimulai melalui klik hati, bukan saat halaman dimuat.
(() => {
  const audio = document.querySelector('#background-music');
  const buttons = [...document.querySelectorAll('.music-toggle')];
  const letterControls = document.querySelector('.letter-music');
  let available = false;
  let pending = false;
  let request = 0;
  let fadeFrame = 0;
  let reading = document.body.classList.contains('reading-letter');
  const NORMAL_VOLUME = .2;
  const READING_VOLUME = .08;
  const targetVolume = () => reading ? READING_VOLUME : NORMAL_VOLUME;
  audio.volume = 0;

  function cancelFade() {
    cancelAnimationFrame(fadeFrame);
    fadeFrame = 0;
  }

  function fadeTo(target, duration) {
    cancelFade();
    if (audio.paused) return;
    if (document.hidden) { audio.volume = target; return; }
    const from = audio.volume;
    const started = performance.now();
    function step(now) {
      if (audio.paused) { fadeFrame = 0; return; }
      const progress = Math.min(1, (now - started) / duration);
      const eased = progress * progress * (3 - 2 * progress);
      audio.volume = from + (target - from) * eased;
      fadeFrame = progress < 1 ? requestAnimationFrame(step) : 0;
    }
    fadeFrame = requestAnimationFrame(step);
  }

  new MutationObserver(() => {
    const next = document.body.classList.contains('reading-letter');
    if (next === reading) return;
    reading = next;
    // Membuka surat hanya menurunkan volume; pilihan Jeda tetap dihormati.
    if (!pending && !audio.paused) fadeTo(targetVolume(), reading ? 700 : 1300);
  }).observe(document.body, {attributes:true,attributeFilter:['class']});

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelFade();
      if (!audio.paused) audio.volume = targetVolume();
    }
  });

  function render() {
    const active = pending || !audio.paused;
    for (const button of buttons) {
      button.hidden = !available;
      button.textContent = active ? '♫ Jeda musik' : '♪ Nyalakan musik';
      button.setAttribute('aria-label', active ? 'Jeda musik latar' : 'Nyalakan musik latar');
      button.setAttribute('aria-pressed', String(active));
    }
    letterControls.hidden = !available;
  }

  function pause() {
    request++;
    pending = false;
    cancelFade();
    audio.pause();
    render();
  }

  async function play() {
    const id = ++request;
    pending = true;
    cancelFade();
    audio.volume = 0;
    if (!audio.getAttribute('src')) audio.src = audio.dataset.src;
    render();
    try {
      // Harus dipanggil langsung dari interaksi pembaca, sebelum menunggu animasi.
      await audio.play();
      if (id !== request) return;
      pending = false;
      available = true;
      fadeTo(targetVolume(), 1600);
    } catch (error) {
      if (id !== request) return;
      pending = false;
      // File belum ada/rusak: tetap lanjutkan hadiah tanpa kontrol musik.
      // Izin putar ditolak browser: tampilkan tombol agar bisa dicoba melalui klik lagi.
      available = !audio.error && error.name !== 'NotSupportedError';
    }
    render();
  }

  audio.addEventListener('loadedmetadata', () => { available = true; render(); });
  audio.addEventListener('error', () => {
    available = false;
    pause();
  });
  for (const event of ['play', 'playing']) audio.addEventListener(event, render);
  audio.addEventListener('pause', () => { cancelFade(); render(); });
  for (const button of buttons) {
    button.addEventListener('click', () => {
      if (pending || !audio.paused) pause();
      else play();
    });
  }
  document.querySelector('.open-gift').addEventListener('click', play, { once: true });
  // Ulangi adegan tidak mengubah pilihan musik pembaca.
  window.addEventListener('pagehide', pause);
  render();
})();
