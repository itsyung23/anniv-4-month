// Satu tubuh tetap + dua sayap bersendi. Tidak memakai pergantian frame sprite.
class DoveFlight {
  constructor(canvas) {
    this.canvas = canvas;
    this.courier = canvas.closest('.courier');
    this.envelope = this.courier.querySelector('.envelope');
    this.sideDistance = Math.min(185, Math.max(90, this.courier.parentElement.clientWidth / 2 - 38));
    this.ctx = canvas.getContext('2d');
    this.texture = new Image();
    this.texture.src = 'assets/dove-rig.png';
    this.profileTexture = new Image();
    this.profileTexture.src = 'assets/dove-profile.png';
    this.ready = Promise.all([this.texture.decode(), this.profileTexture.decode()]);
    this.frame = null;
    this.flight = null;
    this.nodStartedAt = null;
    this.departureStartedAt = null;
    this.departureResolve = null;
    this.carrier = this.courier.querySelector('.courier-hover');
    window.addEventListener('resize', () => {
      this.sideDistance = Math.min(185, Math.max(90, this.courier.parentElement.clientWidth / 2 - 38));
    });
    this.ready.then(() => this.draw(0)).catch(() => {
      canvas.setAttribute('aria-label', 'Merpati pembawa surat');
    });
  }

  start(flight) {
    this.stop();
    this.flight = flight;
    this.courier.style.visibility = '';
    this.carrier.style.opacity = '1';
    this.sideDistance = Math.min(185, Math.max(90, this.courier.parentElement.clientWidth / 2 - 38));
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    const startedAt = performance.now() - Number(flight.currentTime || 0);
    const tick = () => {
      // Ikuti jam animasi penerbangan supaya tombol Ulangi mereset semua gerak.
      if (this.texture.complete && this.texture.naturalWidth) {
        this.draw(
          Math.max(0, (performance.now() - startedAt - 6000) / 1000),
          Math.max(0, (Number(this.flight.currentTime) - 6000) / 1000)
        );
      }
      if (this.departureStartedAt !== null && performance.now() - this.departureStartedAt >= 3400) {
        this.courier.style.visibility = 'hidden';
        const resolve = this.departureResolve;
        this.departureResolve = null;
        this.departureStartedAt = null;
        this.frame = null;
        if (resolve) resolve(true);
        return;
      }
      this.frame = requestAnimationFrame(tick);
    };
    tick();
  }

  stop() {
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    this.frame = null;
    this.nodStartedAt = null;
    this.departureStartedAt = null;
    if (this.departureResolve) this.departureResolve(false);
    this.departureResolve = null;
  }

  nod() { this.nodStartedAt = performance.now(); }

  depart() {
    this.departureStartedAt = performance.now();
    return new Promise(resolve => { this.departureResolve = resolve; });
  }

  departureAt(seconds) {
    const turn = Math.min(1, Math.max(0, seconds / .4));
    const profile = turn * turn * (3 - 2 * turn);
    const travel = Math.min(1, Math.max(0, (seconds - .45) / 2.95));
    const distance = this.courier.parentElement.clientWidth / 2 + 250;
    return {
      // Menghadap ke kanan dulu, lalu keluar layar ke arah paruh. Tidak mundur/mengecil.
      depth: 0, x: distance * travel ** 1.25,
      y: -170 * travel ** 1.2, pitch: 0,
      yaw: 24 * Math.sin(Math.PI * profile), bank: -14 * Math.sin(Math.PI * travel / 2),
      bodyHeight: 1, behindFlowers: false, envelopeAngle: -4,
      opacity: 1, profile
    };
  }

  approachAt(seconds, wingSeconds = seconds) {
    const smoothstep = t => t * t * t * (t * (t * 6 - 15) + 10);
    const sideDistance = this.sideDistance || 185;
    // Dua detik pertama: keluar dari balik buket ke sisi kanan.
    const exit = Math.min(1, Math.max(0, seconds / 2));
    const sideProgress = smoothstep(exit);
    // Empat detik berikutnya: belok dari samping, kemudian mendekat.
    const u = Math.min(1, Math.max(0, (seconds - 2) / 4));
    // Kecepatan maju sedikit bertambah tiap dorongan sayap, tanpa mundur lagi.
    const stroke = Math.sin(wingSeconds * 2.6 * Math.PI * 2);
    const progress = u - .014 * stroke * Math.sin(Math.PI * u) ** 2;
    const eased = smoothstep(progress);
    const depth = -1800 * (1 - eased);
    const perspectiveScale = 850 / (850 - depth);
    const screenX = sideDistance * sideProgress * (1 - eased) + 12 * Math.sin(Math.PI * u);
    const screenY = -35 * sideProgress * (1 - eased) - 12 * Math.sin(Math.PI * u);
    const braking = Math.sin(Math.PI * Math.min(1, Math.max(0, (u - .68) / .32)));
    return {
      depth,
      x: screenX / perspectiveScale,
      y: screenY / perspectiveScale - stroke * 1.5 * Math.sin(Math.PI * u),
      pitch: 18 * (1 - u) - 10 * braking,
      bank: -12 * Math.sin(Math.PI * exit) + 8 * Math.sin(Math.PI * u),
      yaw: -24 * sideProgress * (1 - eased),
      behindFlowers: seconds < 2,
      bodyHeight: .87 + .13 * eased,
      envelopeAngle: -4 + stroke * 2.5 * Math.sin(Math.PI * u)
    };
  }

  draw(seconds, approachSeconds = seconds) {
    const ctx = this.ctx;
    const image = this.texture;
    if (!image.naturalWidth) return;
    const leaving = this.departureStartedAt !== null;
    const approach = leaving
      ? this.departureAt((performance.now() - this.departureStartedAt) / 1000)
      : this.approachAt(approachSeconds, seconds);
    const sideMix = leaving && this.profileTexture.naturalWidth ? approach.profile : 0;
    if (leaving) this.carrier.style.opacity = String(Math.max(0, approach.opacity));
    // Gerak ke arah kamera memakai kedalaman perspektif, bukan lintasan geser layar.
    this.courier.style.transform = `translateX(-50%) perspective(850px) translate3d(${approach.x}px,${approach.y}px,${approach.depth}px) rotateX(${approach.pitch}deg) rotateY(${approach.yaw}deg) rotateZ(${approach.bank}deg)`;
    this.courier.style.zIndex = approach.behindFlowers ? '0' : '4';
    this.envelope.style.transform = `translateX(-50%) rotate(${approach.envelopeAngle}deg)`;
    const cell = image.naturalWidth / 2;
    const height = image.naturalHeight;
    // Pukulan turun lebih cepat, gerak pemulihan lebih lambat dan sayap melipat.
    const phase = (seconds * 2.6) % 1;
    const downstroke = phase < .42;
    const progress = downstroke ? phase / .42 : (phase - .42) / .58;
    const smooth = (1 - Math.cos(progress * Math.PI)) / 2;
    const angle = downstroke ? -1.12 + smooth * 2.02 : .90 - smooth * 2.02;
    const fold = downstroke ? 1 : 1 - .26 * Math.sin(progress * Math.PI);
    const flex = downstroke ? -8 * Math.sin(progress * Math.PI) : 19 * Math.sin(progress * Math.PI);
    const bob = Math.sin(phase * 2 * Math.PI - .4) * 1.8;
    ctx.setTransform(this.canvas.width / 300, 0, 0, this.canvas.height / 300, 0, 0);
    ctx.clearRect(0, 0, 300, 300);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.save();
    ctx.translate(150, 150 + bob);
    ctx.scale(1, approach.bodyHeight);
    // Roll kecil saat mengoreksi arah, tanpa membuat kepala meloncat antarpose.
    ctx.rotate(Math.sin(seconds * 1.4) * .012);
    const drawWing = side => {
      ctx.save();
      // Tampak samping: bentang sayap diproyeksikan naik–turun dari bahu.
      const shoulderX = side === 1 ? 20 : 44;
      const shoulderY = side === 1 ? 10 : -10;
      ctx.translate(side * 13 * (1 - sideMix) + shoulderX * sideMix, shoulderY * sideMix);
      const direction = side * (1 - sideMix) - (side === 1 ? .82 : .78) * sideMix;
      ctx.scale(Math.sign(direction || 1) * Math.max(.35, Math.abs(direction)), 1);
      ctx.globalAlpha = side === -1 ? 1 - .06 * sideMix : 1;
      const wingAngle = angle - (side === -1 ? .10 * sideMix : 0);
      const verticalLift = -Math.sin(wingAngle);
      ctx.rotate(wingAngle * (1 - sideMix) - Math.PI / 2 * sideMix);
      ctx.scale(fold * ((1 - sideMix) + sideMix * verticalLift), 1);
      // Irisan tekstur mengikuti lengkungan siku, sambungannya saling tumpang tipis.
      const slices = 48;
      const wingWidth = 150;
      const wingHeight = 112;
      const cropX = cell + cell * .025;
      const cropWidth = cell * .95;
      for (let i = 0; i < slices; i++) {
        const u = (i + .5) / slices;
        const bend = Math.max(0, (u - .38) / .62);
        const curveY = flex * bend * bend;
        const slope = u > .38 ? 2 * flex * bend / (.62 * wingWidth) : 0;
        ctx.save();
        ctx.translate((u - .09) * wingWidth, curveY);
        ctx.rotate(Math.atan(slope));
        ctx.drawImage(image,
          cropX + i * cropWidth / slices, height * .025,
          cropWidth / slices, height * .95,
          -wingWidth / slices / 2 - .3, -wingHeight * .44,
          wingWidth / slices + .6, wingHeight);
        ctx.restore();
      }
      ctx.restore();
    };
    const inProfile = sideMix >= .5;
    drawWing(-1);
    if (!inProfile) drawWing(1);
    // Dari samping, sayap dekat berada di depan badan; sayap jauh tetap di belakang.
    const nodTime = this.nodStartedAt === null ? 1 : Math.min(1, (performance.now() - this.nodStartedAt) / 850);
    const nod = Math.sin(Math.PI * nodTime);
    ctx.save();
    // Hanya satu tubuh terlihat; jaga volumenya selama pergantian arah.
    ctx.scale(.82 + .18 * Math.abs(Math.cos(Math.PI * sideMix)), 1);
    ctx.globalAlpha = 1;
    if (inProfile) {
      ctx.drawImage(this.profileTexture, -110, -90 + 35 * sideMix, 210, 140);
    } else if (nod > .001) {
      ctx.drawImage(image, cell * .015, height * .27, cell * .97, height * .73,
        -67.5, -75 + 190 * .27, 135, 190 * .73);
      ctx.drawImage(image, cell * .015, 0, cell * .97, height * .30,
        -67.5, -75 + nod * 3, 135, 190 * .30 * (1 - nod * .10));
    } else {
      ctx.drawImage(image, cell * .015, 0, cell * .97, height,
        -67.5, -75, 135, 190);
    }
    ctx.restore();
    if (inProfile) drawWing(1);
    ctx.restore();
  }
}
