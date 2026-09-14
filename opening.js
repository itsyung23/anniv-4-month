/* Atlas 3 × 2: sayap kiri dan kanan dilipat dari sumbu tubuh, tanpa ganti pose. */
class ButterflyOpening {
  constructor(canvas, intro) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.intro = intro;
    this.image = new Image();
    this.image.src = 'assets/butterfly-atlas.png';
    this.ready = this.image.decode().then(() => true, () => false);
    this.frame = 0;
    this.running = false;
    this.revealed = false;
    this.resize = this.resize.bind(this);
    this.tick = this.tick.bind(this);
    window.addEventListener('resize', this.resize);
    // Kembali dari tab lain/BFCache tidak boleh terjebak di pembuka yang terkunci.
    window.addEventListener('pagehide', () => { if (this.running) this.finish(); });
    const hearts = intro.querySelector('.floating-hearts');
    for (let i = 0; i < 18; i++) {
      const heart = document.createElement('i');
      heart.className = 'floating-heart';
      heart.style.cssText = `--left:${4 + (i * 31) % 91}%;--size:${17 + i % 5 * 8}px;--duration:${10 + i % 6 * 1.4}s;--delay:${-i * 1.63}s;--drift:${(i % 2 ? 1 : -1) * (18 + i % 4 * 12)}px;--hue:${[0,22,295,340][i % 4]}deg;--rest-top:${9 + (i * 17) % 78}%`;
      hearts.append(heart);
    }
  }
  resize() {
    this.width = innerWidth;
    this.height = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);
    this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  async play(onReveal) {
    if (this.running) return;
    this.running = true;
    this.onReveal = onReveal;
    const rect = this.intro.querySelector('.heart-stage').getBoundingClientRect();
    this.origin = { x: (rect.left + rect.width / 2) / innerWidth, y: (rect.top + rect.height / 2) / innerHeight };
    // Koneksi lambat tidak boleh membuat pembuka menunggu aset selamanya.
    let timeout;
    const loaded = await Promise.race([this.ready, new Promise(resolve => { timeout = setTimeout(() => resolve(false), 1200); })]);
    clearTimeout(timeout);
    if (!this.running) return;
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.hasAtlas = loaded && !!this.ctx;
    this.duration = this.reduced || !this.hasAtlas ? 1250 : 5900;
    this.revealAt = this.duration === 1250 ? 520 : 3050;
    const count = this.reduced ? 9 : innerWidth < 600 ? 42 : 62;
    this.butterflies = Array.from({length: count}, (_, i) => {
      const random = n => { const x = Math.sin(i * 127.1 + n * 311.7 + 31) * 43758.5453; return x - Math.floor(x); };
      const columns = innerWidth < 600 ? 5 : 9;
      const rows = Math.ceil(count / columns);
      return {
        variant: i % 6, x: (i % columns + .1 + random(1) * .8) / columns * 1.2 - .1,
        y: (Math.floor(i / columns) + random(2)) / rows * 1.25 - .1,
        delay: random(3) * .42, size: .25 + random(4) * .29, depth: random(4),
        phase: random(5) * Math.PI * 2, frequency: 2.4 + random(6) * 2.2,
        bank: (random(7) - .5) * 1.25, drift: 16 + random(8) * 30,
        exitAt: 3.05 + random(9) * .5
      };
    }).sort((a, b) => a.depth - b.depth);
    this.resize();
    this.canvas.hidden = !this.hasAtlas;
    this.intro.classList.add('departing');
    this.start = performance.now();
    this.frame = requestAnimationFrame(this.tick);
  }
  reveal() {
    if (this.revealed) return;
    this.revealed = true;
    this.onReveal?.();
  }
  finish() {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.running = false;
    this.reveal();
    this.ctx?.clearRect(0, 0, this.width, this.height);
    this.canvas.hidden = true;
    this.butterflies = [];
  }
  tick(now) {
    if (!this.running) return;
    const ms = now - this.start;
    if (ms >= this.revealAt) this.reveal();
    if (ms >= this.duration) { this.finish(); return; }
    if (this.hasAtlas) this.draw(ms / 1000);
    this.frame = requestAnimationFrame(this.tick);
  }
  draw(time) {
    const ctx = this.ctx, w = this.width, h = this.height;
    const clamp = value => Math.max(0, Math.min(1, value));
    ctx.clearRect(0, 0, w, h);
    if (this.reduced) {
      // Sembilan kupu-kupu diam dengan fade pendek, tanpa gerakan mendekati layar.
      for (const p of this.butterflies) {
        const alpha = Math.sin(clamp(time / 1.25) * Math.PI) * .8;
        this.drawButterfly(p, p.x * w, p.y * h, Math.min(w, h) * .25, p.bank, .9, .9, alpha);
      }
      return;
    }
    const mist = clamp(time / .9) * (1 - clamp((time - 2.7) / 1.8));
    ctx.fillStyle = `rgba(255,250,239,${mist * .68})`;
    ctx.fillRect(0, 0, w, h);
    for (const p of this.butterflies) {
      const local = Math.max(0, time - p.delay);
      const approach = clamp(local / 1.45);
      const spread = 1 - (1 - approach) ** 3;
      const exit = clamp((time - p.exitAt) / 2.12);
      const escape = exit * exit;
      const cx = this.origin.x * w, cy = this.origin.y * h;
      const tx = p.x * w, ty = p.y * h;
      const direction = Math.atan2(ty - h * .68, tx - w / 2);
      const distance = Math.max(w, h) * 1.5;
      const ex = w / 2 + Math.cos(direction) * distance;
      const ey = h / 2 + Math.sin(direction) * distance;
      const flutter = Math.sin(local * 2.4 + p.phase);
      const x = cx + (tx - cx) * spread + (ex - tx) * escape + flutter * p.drift * spread;
      const y = cy + (ty - cy) * spread + (ey - ty) * escape + Math.cos(local * 2.05 + p.phase) * p.drift * .6 * spread;
      const size = Math.min(w, h) * p.size * (w < 600 ? 1.85 : 1.15) * (.035 + .965 * spread) * (1 - escape * .18);
      const beat = local * p.frequency * Math.PI * 2 + p.phase;
      const left = .2 + .8 * Math.pow((Math.sin(beat) + 1) / 2, .6);
      const right = .2 + .8 * Math.pow((Math.sin(beat + .16) + 1) / 2, .6);
      const bank = p.bank + Math.sin(local * 1.65 + p.phase) * .16 + Math.cos(direction) * escape * .75;
      const opacity = clamp(local / .22) * (1 - clamp((exit - .8) / .2));
      this.drawButterfly(p, x, y, size, bank, left, right, opacity);
    }
  }
  drawButterfly(p, x, y, size, bank, left, right, opacity) {
    drawButterflySprite(this.ctx, this.image, p, x, y, size, bank, left, right, opacity);
  }
}

// Dipakai transisi pembuka dan pasangan kupu-kupu pada penutup.
function drawButterflySprite(ctx, image, p, x, y, size, bank, left, right, opacity) {
    const cw = image.naturalWidth / 3, ch = image.naturalHeight / 2;
    const col = p.variant % 3, row = Math.floor(p.variant / 3);
    // Sumbu tubuh nyata dalam tiap sel atlas, supaya sendi sayap tidak bergeser.
    const pivot = [269 / 512, 255 / 512, 245 / 512][col] * cw;
    const sx = col * cw, sy = row * ch, ratio = size / cw;
    const yOffset = -(row ? .45 : .51) * ch * ratio;
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(x, y);
    ctx.rotate(bank);
    ctx.save();
    ctx.transform(left, -.055 * (1 - left), 0, 1, 0, 0);
    ctx.drawImage(image, sx, sy, pivot, ch, -pivot * ratio, yOffset, pivot * ratio, ch * ratio);
    ctx.restore();
    ctx.save();
    ctx.transform(right, .055 * (1 - right), 0, 1, 0, 0);
    ctx.drawImage(image, sx + pivot, sy, cw - pivot, ch, 0, yOffset, (cw - pivot) * ratio, ch * ratio);
    ctx.restore();
    // Tubuh tetap berukuran sama ketika sayap menutup.
    const body = cw * .022;
    ctx.drawImage(image, sx + pivot - body / 2, sy + ch * .36, body, ch * .4,
      -body * ratio / 2, yOffset + ch * .36 * ratio, body * ratio, ch * .4 * ratio);
    ctx.restore();
}
