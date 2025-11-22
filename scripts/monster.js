import { CONFIG } from './config.js';

// Utility functions for color manipulation
function lightenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function darkenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
    (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
    (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
}

// Enhanced Monster Class with Personality
export class Monster {
  constructor(x, y, targetShape) {
    this.x = x;
    this.y = y;
    this.targetShape = targetShape;

    // Size
    this.width = 200;
    this.height = 200;

    // Vibrant gradient colors (not solid!)
    const monsterGradients = [
      { start: '#FF6B9D', end: '#FF1493' },  // Pink gradient
      { start: '#00D4FF', end: '#00BFFF' },  // Cyan gradient
      { start: '#FFD700', end: '#FFA500' },  // Gold gradient
      { start: '#00FF7F', end: '#00CED1' },  // Teal gradient
      { start: '#9370DB', end: '#8A2BE2' }   // Purple gradient
    ];
    this.colorGradient = monsterGradients[Math.floor(Math.random() * monsterGradients.length)];

    // Eye tracking
    this.eyeOffsetX = 0;
    this.eyeOffsetY = 0;

    // Blinking
    this.isBlinking = false;
    this.blinkTimer = Math.random() * 3000 + 2000; // Random initial blink time
    this.blinkDuration = 200;

    // Animation
    this.isHappy = false;
    this.isEating = false;
    this.animationTimer = 0;
    this.scale = 1.0;
    this.bounceOffset = 0;
    this.bounceSpeed = 0;
    this.breatheOffset = 0;

    // Arms
    this.leftArmAngle = -0.3;
    this.rightArmAngle = 0.3;
    this.armWaveSpeed = 0.05;

    // Entry animation
    this.entryProgress = 0;
    this.isEntering = true;

    // Rotation for celebration
    this.rotation = 0;
  }

  draw(ctx) {
    ctx.save();

    // Entry animation (bounce down from top)
    const entryY = this.isEntering ?
      -this.height - 100 + (this.entryProgress * (this.y + this.height + 100)) :
      this.y;

    const finalY = entryY + this.height / 2 + this.bounceOffset + this.breatheOffset;

    ctx.translate(this.x + this.width / 2, finalY);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale, this.scale);

    // Draw components
    this.drawShadow(ctx);
    this.drawArms(ctx); // Draw arms behind body
    this.drawBody(ctx);
    this.drawEyes(ctx);
    this.drawMouth(ctx);
    this.drawCheeks(ctx);

    if (this.isHappy) {
      this.drawHappyEffect(ctx);
    }

    ctx.restore();
  }

  drawShadow(ctx) {
    // Soft shadow under monster
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(0, this.height * 0.45, this.width * 0.45, this.height * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawArms(ctx) {
    // Stubby arms with gradient
    const armLength = this.width * 0.3;
    const armWidth = this.width * 0.15;
    const bodyRadius = this.width * 0.4;

    ctx.strokeStyle = darkenColor(this.colorGradient.end, 10);
    ctx.lineWidth = armWidth;
    ctx.lineCap = 'round';

    // Left arm
    ctx.save();
    ctx.rotate(this.leftArmAngle);
    const leftGradient = ctx.createLinearGradient(0, 0, bodyRadius, 0);
    leftGradient.addColorStop(0, this.colorGradient.start);
    leftGradient.addColorStop(1, this.colorGradient.end);
    ctx.strokeStyle = leftGradient;
    ctx.beginPath();
    ctx.moveTo(-bodyRadius * 0.7, 0);
    ctx.lineTo(-bodyRadius - armLength, 0);
    ctx.stroke();

    // Left hand (circle)
    ctx.fillStyle = this.colorGradient.end;
    ctx.beginPath();
    ctx.arc(-bodyRadius - armLength, 0, armWidth * 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Right arm
    ctx.save();
    ctx.rotate(this.rightArmAngle);
    const rightGradient = ctx.createLinearGradient(0, 0, bodyRadius, 0);
    rightGradient.addColorStop(0, this.colorGradient.start);
    rightGradient.addColorStop(1, this.colorGradient.end);
    ctx.strokeStyle = rightGradient;
    ctx.beginPath();
    ctx.moveTo(bodyRadius * 0.7, 0);
    ctx.lineTo(bodyRadius + armLength, 0);
    ctx.stroke();

    // Right hand (circle)
    ctx.fillStyle = this.colorGradient.end;
    ctx.beginPath();
    ctx.arc(bodyRadius + armLength, 0, armWidth * 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawBody(ctx) {
    // Gradient fill for body
    const gradient = ctx.createRadialGradient(0, -this.height * 0.15, 0, 0, 0, this.width * 0.5);
    gradient.addColorStop(0, lightenColor(this.colorGradient.start, 20));
    gradient.addColorStop(0.5, this.colorGradient.start);
    gradient.addColorStop(1, this.colorGradient.end);

    ctx.fillStyle = gradient;
    ctx.strokeStyle = darkenColor(this.colorGradient.end, 20);
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';

    const size = this.width * 0.8;

    // Draw body based on target shape
    switch (this.targetShape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;

      case 'square':
        const half = size / 2;
        ctx.fillRect(-half, -half, size, size);
        ctx.strokeRect(-half, -half, size, size);
        break;

      case 'triangle':
        const triHalf = size / 2;
        ctx.beginPath();
        ctx.moveTo(0, -triHalf);
        ctx.lineTo(-triHalf, triHalf);
        ctx.lineTo(triHalf, triHalf);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;

      case 'star':
        this.drawStarBody(ctx, size);
        break;

      case 'rectangle':
        const rectWidth = size;
        const rectHeight = size * 0.6;
        ctx.fillRect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight);
        ctx.strokeRect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight);
        break;
    }

    // Add cute antenna on top
    this.drawAntenna(ctx);
  }

  drawStarBody(ctx, size) {
    const spikes = 5;
    const outerRadius = size / 2;
    const innerRadius = outerRadius * 0.5;
    let rot = Math.PI / 2 * 3;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(0, -outerRadius);

    for (let i = 0; i < spikes; i++) {
      let x = Math.cos(rot) * outerRadius;
      let y = Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = Math.cos(rot) * innerRadius;
      y = Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }

    ctx.lineTo(0, -outerRadius);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  drawAntenna(ctx) {
    // Cute antenna sticking out of top
    ctx.strokeStyle = darkenColor(this.colorGradient.end, 30);
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    const antennaY = -this.height * 0.45;
    const wobble = Math.sin(Date.now() / 300) * 5;

    ctx.beginPath();
    ctx.moveTo(0, antennaY);
    ctx.lineTo(wobble, antennaY - 20);
    ctx.stroke();

    // Antenna ball
    ctx.fillStyle = lightenColor(this.colorGradient.start, 40);
    ctx.beginPath();
    ctx.arc(wobble, antennaY - 20, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = darkenColor(this.colorGradient.end, 30);
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawEyes(ctx) {
    const eyeY = -this.height * 0.15;
    const leftEyeX = -this.width * 0.15;
    const rightEyeX = this.width * 0.15;
    const eyeRadius = this.isBlinking ? 3 : 20;
    const pupilRadius = 11;

    if (this.isBlinking) {
      // Draw closed eyes (horizontal lines)
      ctx.strokeStyle = '#2C3E50';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(leftEyeX - 15, eyeY);
      ctx.lineTo(leftEyeX + 15, eyeY);
      ctx.moveTo(rightEyeX - 15, eyeY);
      ctx.lineTo(rightEyeX + 15, eyeY);
      ctx.stroke();
    } else {
      // Draw open eyes
      // Eye whites with highlight
      ctx.fillStyle = 'white';
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(leftEyeX, eyeY, eyeRadius, 0, Math.PI * 2);
      ctx.arc(rightEyeX, eyeY, eyeRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Pupils with tracking
      ctx.fillStyle = '#2C3E50';
      ctx.beginPath();
      ctx.arc(leftEyeX + this.eyeOffsetX, eyeY + this.eyeOffsetY, pupilRadius, 0, Math.PI * 2);
      ctx.arc(rightEyeX + this.eyeOffsetX, eyeY + this.eyeOffsetY, pupilRadius, 0, Math.PI * 2);
      ctx.fill();

      // Pupil highlights
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(leftEyeX + this.eyeOffsetX - 3, eyeY + this.eyeOffsetY - 3, 4, 0, Math.PI * 2);
      ctx.arc(rightEyeX + this.eyeOffsetX - 3, eyeY + this.eyeOffsetY - 3, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawMouth(ctx) {
    const mouthY = this.height * 0.2;
    const mouthWidth = this.width * 0.4;

    ctx.strokeStyle = darkenColor(this.colorGradient.end, 40);
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    ctx.beginPath();
    if (this.isHappy) {
      // Big happy smile with open mouth
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.ellipse(0, mouthY, mouthWidth / 2, mouthWidth / 3, 0, 0, Math.PI);
      ctx.fill();

      // Smile outline
      ctx.strokeStyle = darkenColor(this.colorGradient.end, 40);
      ctx.beginPath();
      ctx.arc(0, mouthY - 20, mouthWidth / 2, 0.1, Math.PI - 0.1);
      ctx.stroke();
    } else if (this.isEating) {
      // Wide open mouth (circle)
      ctx.fillStyle = '#5D4037';
      ctx.beginPath();
      ctx.arc(0, mouthY, mouthWidth / 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      // Curious/hungry mouth (slight smile)
      ctx.arc(0, mouthY, mouthWidth / 2.5, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }
  }

  drawCheeks(ctx) {
    // Cute blush cheeks
    const cheekY = this.height * 0.05;
    const leftCheekX = -this.width * 0.28;
    const rightCheekX = this.width * 0.28;
    const cheekRadius = this.width * 0.09;

    ctx.fillStyle = 'rgba(255, 182, 193, 0.7)';
    ctx.beginPath();
    ctx.arc(leftCheekX, cheekY, cheekRadius, 0, Math.PI * 2);
    ctx.arc(rightCheekX, cheekY, cheekRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  drawHappyEffect(ctx) {
    // Draw sparkles and hearts around monster when happy
    const time = Date.now() / 100;

    // Golden sparkles
    ctx.fillStyle = '#FFD700';

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + time;
      const distance = this.width * 0.7;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const size = 8 + Math.sin(time + i) * 4;

      this.drawStarParticle(ctx, x, y, size);
    }

    // Colorful hearts
    const heartColors = ['#FF6B6B', '#FF8E8E', '#FFA5A5'];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + time * 0.7;
      const distance = this.width * 0.5;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const size = 10 + Math.sin(time * 1.2 + i) * 4;

      ctx.fillStyle = heartColors[i % heartColors.length];
      this.drawHeartParticle(ctx, x, y, size);
    }
  }

  drawStarParticle(ctx, x, y, size) {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size * 0.4;
    let rot = Math.PI / 2 * 3;
    const step = Math.PI / spikes;

    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, -outerRadius);

    for (let i = 0; i < spikes; i++) {
      let px = Math.cos(rot) * outerRadius;
      let py = Math.sin(rot) * outerRadius;
      ctx.lineTo(px, py);
      rot += step;

      px = Math.cos(rot) * innerRadius;
      py = Math.sin(rot) * innerRadius;
      ctx.lineTo(px, py);
      rot += step;
    }

    ctx.lineTo(0, -outerRadius);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawHeartParticle(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();

    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);

    ctx.bezierCurveTo(-size / 2, topCurveHeight - size / 2, -size / 2, 0, 0, 0);
    ctx.bezierCurveTo(size / 2, 0, size / 2, topCurveHeight - size / 2, 0, topCurveHeight);

    ctx.lineTo(0, size);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  updateEyes(targetX, targetY) {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;

    const dx = targetX - centerX;
    const dy = targetY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      const maxOffset = 6;
      this.eyeOffsetX = (dx / distance) * Math.min(maxOffset, distance / 10);
      this.eyeOffsetY = (dy / distance) * Math.min(maxOffset, distance / 10);
    } else {
      this.eyeOffsetX = 0;
      this.eyeOffsetY = 0;
    }
  }

  getMouthPosition() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2 + this.height * 0.2
    };
  }

  playHappyAnimation() {
    this.isHappy = true;
    this.isEating = false;
    this.animationTimer = CONFIG.TRANSITION_DELAY;
    this.bounceSpeed = 0.3;
  }

  playEatingAnimation() {
    this.isEating = true;
    setTimeout(() => {
      this.isEating = false;
    }, 300);
  }

  update(deltaTime) {
    // Entry animation
    if (this.isEntering) {
      this.entryProgress += 0.04;
      if (this.entryProgress >= 1) {
        this.entryProgress = 1;
        this.isEntering = false;
      }
    }

    // Idle breathing animation
    if (!this.isHappy && !this.isEntering) {
      this.breatheOffset = Math.sin(Date.now() / 1000) * 5;
    }

    // Update animation timer
    if (this.isHappy && this.animationTimer > 0) {
      this.animationTimer -= deltaTime;

      if (this.animationTimer <= 0) {
        this.isHappy = false;
        this.animationTimer = 0;
        this.bounceSpeed = 0;
        this.bounceOffset = 0;
        this.rotation = 0;
      }
    }

    // Bounce animation when happy
    if (this.isHappy && this.bounceSpeed > 0) {
      this.bounceOffset = Math.sin(Date.now() / 100) * 15;
      this.scale = 1.0 + Math.sin(Date.now() / 150) * 0.08;
      this.rotation = Math.sin(Date.now() / 200) * 0.1; // Gentle wiggle
    } else {
      this.bounceOffset = 0;
      this.scale = 1.0;
      this.rotation = 0;
    }

    // Arm waving
    if (this.isHappy) {
      this.leftArmAngle = -0.3 + Math.sin(Date.now() / 100) * 0.5;
      this.rightArmAngle = 0.3 - Math.sin(Date.now() / 100) * 0.5;
    } else {
      this.leftArmAngle = -0.3;
      this.rightArmAngle = 0.3;
    }

    // Blinking
    this.blinkTimer -= deltaTime;
    if (this.blinkTimer <= 0) {
      this.isBlinking = true;
      setTimeout(() => {
        this.isBlinking = false;
        this.blinkTimer = Math.random() * 4000 + 2000; // Random next blink
      }, this.blinkDuration);
    }
  }
}
