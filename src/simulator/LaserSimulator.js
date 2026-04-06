export class LaserSimulator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.photons = [];
    this.animationId = null;
    this.running = false;
    
    // Bounds
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    // Parameters
    this.params = {
      wavelength: 632,
      pumpPower: 50,
      medium: 'gas',
      mirrorAlignment: 100 // 0-100, 100 is perfect
    };

    // Stats
    this.stats = {
      photonCount: 0,
      inversion: 0,
      output: 0
    };
    
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    if(!this.running) this.drawStatic();
  }

  updateParams(newParams) {
    this.params = { ...this.params, ...newParams };
  }

  getColor() {
    // Rough estimation of wavelength to rgb
    const wl = this.params.wavelength;
    if(wl < 450) return [138, 43, 226]; // violet/blue
    if(wl < 500) return [0, 210, 255]; // blue
    if(wl < 550) return [0, 255, 0]; // green
    if(wl < 600) return [255, 255, 0]; // yellow
    return [255, 51, 102]; // red
  }

  toggle() {
    if(this.running) {
      this.running = false;
      cancelAnimationFrame(this.animationId);
      this.photons = [];
      this.drawStatic();
    } else {
      this.running = true;
      this.loop();
    }
    return this.running;
  }

  spawnPhoton() {
    const y = this.height / 2 + (Math.random() - 0.5) * 40;
    const speedX = (Math.random() > 0.5 ? 1 : -1) * (10 + configSpeedMultiplier(this.params.medium));
    // Misalignment causes vertical drift
    const alignDrift = (100 - this.params.mirrorAlignment) * 0.05;
    const speedY = (Math.random() - 0.5) * alignDrift;

    this.photons.push({
      x: this.width / 2,
      y: y,
      vx: speedX,
      vy: speedY,
      active: true
    });
  }

  loop() {
    if(!this.running) return;

    this.update();
    this.draw();

    this.animationId = requestAnimationFrame(() => this.loop());
  }

  update() {
    // Pumping mechanism (spawn particles based on power)
    const inversionRate = (this.params.pumpPower / 100);
    this.stats.inversion = inversionRate;
    
    if(Math.random() < inversionRate * 0.5 && this.photons.length < 500) {
      this.spawnPhoton();
    }

    // Update photons
    for (let i = 0; i < this.photons.length; i++) {
        let p = this.photons[i];
        p.x += p.vx;
        p.y += p.vy;

        // Bounce horizontally (mirrors)
        if (p.x <= 20) {
            // Left mirror is fully reflecting (100%)
            p.x = 20;
            p.vx *= -1;
            // Simulated Emission Amplification
            if (Math.random() < inversionRate && this.photons.length < 500) {
                this.photons.push({ x: p.x, y: p.y, vx: Math.abs(p.vx), vy: p.vy, active: true });
            }
        } else if (p.x >= this.width - 20) {
            // Right mirror is partially reflecting
            // If it escapes, it contributes to output
            if (Math.random() < 0.2) { 
                p.active = false; 
                this.stats.output += this.params.pumpPower * 0.1;
                // draw beam escaping
            } else {
                p.x = this.width - 20;
                p.vx *= -1;
            }
        }

        // Remove if it drifts out of tube
        if(p.y < 0 || p.y > this.height) {
            p.active = false;
        }
    }

    this.photons = this.photons.filter(p => p.active);
    this.stats.photonCount = this.photons.length;
    this.stats.output *= 0.95; // Decay output meter
  }

  drawStatic() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawMirrors();
    // Draw empty tube
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    this.ctx.fillRect(20, this.height/2 - 30, this.width - 40, 60);
  }

  drawMirrors() {
    this.ctx.shadowBlur = 0;
    // Left mirror (100%)
    this.ctx.fillStyle = '#C0C0C0';
    this.ctx.fillRect(10, this.height/2 - 40, 10, 80);
    // Right mirror (Partial)
    this.ctx.fillStyle = 'rgba(192, 192, 192, 0.4)';
    this.ctx.fillRect(this.width - 20, this.height/2 - 40, 10, 80);
  }

  draw() {
    // Clear with trailing effect
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    this.drawMirrors();

    const color = this.getColor();
    const rgbStr = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

    this.ctx.fillStyle = rgbStr;
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = rgbStr;

    // Draw internal tube
    this.ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${0.02 * this.params.pumpPower/100})`;
    this.ctx.fillRect(20, this.height/2 - 30, this.width - 40, 60);

    // Draw Photons
    this.ctx.fillStyle = rgbStr;
    for(let p of this.photons) {
       this.ctx.beginPath();
       this.ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
       this.ctx.fill();
    }

    // Draw Output Beam (Right side)
    if(this.stats.output > 0) {
      this.ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${Math.min(1, this.stats.output / 100)})`;
      this.ctx.shadowBlur = 15;
      this.ctx.fillRect(this.width - 10, this.height/2 - (5 + this.stats.output/20), this.width, 10 + this.stats.output/10);
    }
  }
}

function configSpeedMultiplier(medium) {
    if(medium === 'gas') return 0;
    if(medium === 'solid') return 5;
    if(medium === 'semi') return 10;
    return 0;
}
