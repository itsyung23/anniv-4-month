/* Burung di kejauhan dan dua kupu-kupu penutup, satu loop dengan jeda saat membaca. */
class GardenAtmosphere {
  constructor() {
    this.canvas = document.querySelector('.sky-birds');
    this.ctx = this.canvas.getContext('2d');
    this.scene = document.querySelector('.scene');
    this.gift = document.querySelector('.gift');
    this.sun = document.querySelector('.sun');
    this.clouds = [...document.querySelectorAll('.cloud')];
    this.touchCanvas = document.querySelector('.touch-petals');
    this.touchCtx = this.touchCanvas.getContext('2d');
    this.touchPetals = [];
    this.lastTouch = -10;
    this.lastLight = -1;
    this.keepsake = document.querySelector('.ending-keepsake');
    this.butterflyCanvas = document.querySelector('.keepsake-butterflies');
    this.butterflyCtx = this.butterflyCanvas.getContext('2d');
    this.image = new Image();
    this.image.src = 'assets/butterfly-atlas.png';
    this.image.decode().then(() => { this.loaded = true; this.render(); }).catch(() => {});
    this.motion = matchMedia('(prefers-reduced-motion: reduce)');
    this.frame = 0;
    this.elapsed = 0;
    this.last = 0;
    this.tick = this.tick.bind(this);
    this.sync = this.sync.bind(this);
    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
    window.addEventListener('pagehide', () => { this.clearTouchPetals(); this.stop(); });
    window.addEventListener('pageshow', this.sync);
    document.addEventListener('visibilitychange', this.sync);
    this.motion.addEventListener('change', this.sync);
    new MutationObserver(this.sync).observe(document.body, {attributes:true,attributeFilter:['class']});
    new MutationObserver(() => this.render()).observe(this.keepsake, {attributes:true,attributeFilter:['hidden']});
    this.scene.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.button !== 0 || !this.canScatter(event.target)) return;
      this.press = {id:event.pointerId,x:event.clientX,y:event.clientY,time:performance.now()};
    }, {passive:true});
    this.scene.addEventListener('pointerup', event => {
      const press = this.press;
      this.press = null;
      if (!press || press.id !== event.pointerId || performance.now() - press.time > 650 ||
          Math.hypot(event.clientX - press.x,event.clientY - press.y) > 8 || !this.canScatter(event.target)) return;
      this.scatterPetals(event.clientX,event.clientY);
    }, {passive:true});
    this.scene.addEventListener('pointercancel', () => { this.press = null; }, {passive:true});
    this.resize();
    this.sync();
  }
  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    this.width = innerWidth; this.height = innerHeight;
    this.canvas.width = Math.round(innerWidth * dpr);
    this.canvas.height = Math.round(innerHeight * dpr);
    this.touchCanvas.width = this.canvas.width;
    this.touchCanvas.height = this.canvas.height;
    this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.touchCtx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.butterflyCtx?.setTransform(2, 0, 0, 2, 0, 0);
    this.sunRect = this.sun.getBoundingClientRect();
    this.lastLight = -1;
    this.render();
  }
  stop() { cancelAnimationFrame(this.frame); this.frame = 0; this.last = 0; }
  sync() {
    this.stop();
    if (document.hidden || document.body.classList.contains('reading-letter')) { this.clearTouchPetals(); return; }
    if (this.motion.matches) this.clearTouchPetals();
    this.render();
    if (!this.motion.matches) this.frame = requestAnimationFrame(this.tick);
  }
  tick(now) {
    // Batasi ke 30 fps; dekorasi jauh tidak perlu menggambar secepat merpati utama.
    if (!this.last || now - this.last >= 32) {
      if (this.last) this.elapsed += Math.min(now - this.last, 100) / 1000;
      this.last = now;
      this.render();
    }
    this.frame = requestAnimationFrame(this.tick);
  }
  render() {
    this.updateSunlight();
    this.drawBirds();
    if (this.touchPetals.length) this.drawTouchPetals();
    if (this.loaded && !this.keepsake.hidden) this.drawKeepsake();
    if (this.loaded && this.perchCanvas && !this.perchCanvas.hidden) this.drawPerch();
  }
  updateSunlight() {
    if (this.elapsed - this.lastLight < .25) return;
    this.lastLight = this.elapsed;
    let cover = 0;
    if (!this.motion.matches && this.sunRect) {
      const sun = this.sunRect;
      for (const cloud of this.clouds) {
        const box = cloud.getBoundingClientRect();
        const dx = (sun.left + sun.width / 2 - box.left - box.width / 2) / (box.width * .6);
        const dy = (sun.top + sun.height / 2 - box.top - box.height / 2) / (box.height * .75);
        cover = Math.max(cover,Math.max(0,1-dx*dx) * Math.max(0,1-dy*dy));
      }
    }
    // Perubahan kecil mengikuti posisi awan, tanpa kilatan atau perubahan warna mendadak.
    const strength = (1 - cover * .2).toFixed(3);
    if (strength !== this.sunStrength) {
      this.sunStrength = strength;
      this.scene.style.setProperty('--sun-strength',strength);
    }
  }
  canScatter(target) {
    return !this.motion.matches && !this.gift.hidden &&
      document.querySelector('.butterfly-transition').hidden &&
      !document.body.classList.contains('reading-letter') &&
      !target.closest('button,a,input,select,textarea,dialog,.bouquet,h1,p,.gift-actions');
  }
  scatterPetals(x,y) {
    if (!this.touchCtx || this.elapsed - this.lastTouch < .35) return;
    this.lastTouch = this.elapsed;
    const colors = ['#eaa0b9','#bf9bd8','#f3d18d','#94bcaa'];
    for (let i = 0; i < 7; i++) {
      this.touchPetals.push({x,y,start:this.elapsed,duration:2.4 + Math.random() * .5,
        vx:(Math.random()-.5)*68,vy:-25-Math.random()*35,phase:Math.random()*Math.PI*2,
        size:5+Math.random()*3,color:colors[i%colors.length]});
    }
    this.touchPetals = this.touchPetals.slice(-28);
  }
  clearTouchPetals() {
    this.press = null;
    this.touchPetals = [];
    this.touchCtx?.clearRect(0,0,this.width,this.height);
  }
  drawTouchPetals() {
    const ctx = this.touchCtx;
    ctx.clearRect(0,0,this.width,this.height);
    this.touchPetals = this.touchPetals.filter(p=>this.elapsed-p.start<p.duration);
    for (const p of this.touchPetals) {
      const age = this.elapsed-p.start, progress = age/p.duration;
      const x = p.x+p.vx*age+Math.sin(age*2+p.phase)*age*4;
      const y = p.y+p.vy*age+30*age*age;
      ctx.save();ctx.translate(x,y);ctx.rotate(p.phase+age*1.8);
      ctx.scale(.75+.25*Math.sin(p.phase+age*3),1);
      ctx.globalAlpha = Math.min(1,age/.15)*Math.min(1,(1-progress)/.35)*.8;
      ctx.fillStyle = p.color;
      ctx.beginPath();ctx.moveTo(0,-p.size);
      ctx.bezierCurveTo(p.size*1.2,-p.size*.7,p.size*.75,p.size*.55,0,p.size);
      ctx.bezierCurveTo(-p.size*.8,p.size*.4,-p.size*.75,-p.size*.65,0,-p.size);
      ctx.fill();ctx.restore();
    }
  }
  attachPerch(bloom) {
    this.perchCanvas = document.createElement('canvas');
    this.perchCanvas.className = 'perched-butterfly';
    this.perchCanvas.width = 480;
    this.perchCanvas.height = 500;
    this.perchCanvas.hidden = true;
    this.perchCtx = this.perchCanvas.getContext('2d');
    this.perchCtx?.setTransform(2,0,0,2,0,0);
    bloom.append(this.perchCanvas);
  }
  startPerch() {
    this.perchStart = this.elapsed;
    this.perchCanvas.hidden = false;
    this.render();
  }
  resetPerch() {
    this.clearTouchPetals();
    if (!this.perchCanvas) return;
    this.perchCanvas.hidden = true;
    delete this.perchCanvas.dataset.phase;
    this.perchCtx?.clearRect(0,0,240,250);
  }
  drawPerch() {
    const ctx = this.perchCtx;
    if (!ctx) return;
    const time = Math.max(0,this.elapsed - this.perchStart);
    const progress = this.motion.matches ? 1 : Math.min(1,time / 4.6);
    const p = 1 - (1 - progress) ** 2, q = 1 - p;
    // Jalur melengkung melambat tepat di kelopak, lalu seluruh canvas ikut tangkai.
    const x = q*q*q*200 + 3*q*q*p*67 + 3*q*p*p*154 + p*p*p*120;
    const y = q*q*q*25 + 3*q*q*p*38 + 3*q*p*p*112 + p*p*p*175;
    const pulse = Math.max(0,Math.sin((time - 4.6) * Math.PI * 2 / 7.8)) ** 3;
    const restingFold = this.motion.matches ? .65 : .28 + .58 * pulse;
    const flyingFold = .25 + .75 * (Math.sin(time * Math.PI * 2 * 4.3) + 1) / 2;
    const settle = Math.max(0,Math.min(1,(progress - .82) / .18));
    const fold = progress === 1 ? restingFold : flyingFold * (1 - settle) + .28 * settle;
    const phase = progress === 1 ? 'landed' : 'approaching';
    if (this.perchCanvas.dataset.phase !== phase) this.perchCanvas.dataset.phase = phase;
    ctx.clearRect(0,0,240,250);
    drawButterflySprite(ctx,this.image,{variant:3},x,y,44 + p * 8,-.55 + p * .2,
      fold,Math.min(1,fold + .025),this.motion.matches ? 1 : Math.min(1,time / .5));
  }
  drawBirds() {
    const ctx = this.ctx;
    if (!ctx) return;
    const w = this.width, h = this.height, t = this.elapsed;
    ctx.clearRect(0, 0, w, h);
    for (let group = 0; group < 3; group++) {
      const direction = group === 1 ? -1 : 1;
      const progress = ((t / (32 + group * 7)) + [.16,.62,.88][group]) % 1;
      const cx = (direction === 1 ? progress : 1 - progress) * (w + 240) - 120;
      const cy = h * [.17,.33,.47][group] - Math.sin(progress * Math.PI) * h * .045;
      const count = w < 600 ? 3 : 5;
      for (let i = 0; i < count; i++) {
        const flank = i % 2 ? 1 : -1;
        const rank = Math.ceil(i / 2);
        const x = cx - direction * rank * 24;
        const y = cy + flank * rank * 9 + Math.sin(t * 1.5 + i) * 2;
        const size = (w < 600 ? 8 : 10) - group * 1.1 + i % 2;
        const beat = t * (3.5 + group * .25) * Math.PI * 2 + i * .6;
        const glide = Math.sin(t * .6 + group + i * .15) > .45;
        const flap = this.motion.matches || glide ? -.12 : Math.sin(beat);
        this.drawBird(ctx, x, y, size, flap, direction, .48 - group * .07);
      }
    }
  }
  drawBird(ctx, x, y, size, flap, direction, opacity) {
    ctx.save();ctx.translate(x,y);ctx.scale(direction,1);ctx.rotate(-.08);
    ctx.globalAlpha = opacity;ctx.fillStyle = '#426f83';ctx.strokeStyle = '#426f83';
    ctx.lineWidth = Math.max(.65,size * .12);ctx.lineCap = 'round';
    // Kedua sayap tetap menempel di bahu; lengkungnya mengikuti kepakan.
    const tip = flap * size * .64;
    ctx.beginPath();ctx.moveTo(0,0);
    ctx.quadraticCurveTo(-size * .55, tip - size * .16,-size,tip);
    ctx.quadraticCurveTo(-size * .56,tip + size * .12,0,size * .1);
    ctx.quadraticCurveTo(size * .56,tip + size * .12,size,tip);
    ctx.quadraticCurveTo(size * .55,tip - size * .16,0,0);
    ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.ellipse(0,size*.08,size*.14,size*.32,0,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
  drawKeepsake() {
    const ctx = this.butterflyCtx;
    if (!ctx) return;
    ctx.clearRect(0,0,270,72);
    for (let i = 0; i < 2; i++) {
      const t = this.elapsed, beat = t * 3.2 * Math.PI * 2 + i * 1.1;
      const fold = this.motion.matches ? .9 : .32 + .68 * (Math.sin(beat) + 1) / 2;
      const drift = this.motion.matches ? 0 : Math.sin(t * 1.7 + i) * 3;
      drawButterflySprite(ctx,this.image,{variant:i ? 0 : 1},i ? 239 : 31,35 + drift,58,i ? .22 : -.22,fold,Math.min(1,fold+.035),.94);
    }
  }
}
const gardenAtmosphere = new GardenAtmosphere();
