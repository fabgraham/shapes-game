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

// Shape Class with Enhanced Visuals
export class Shape {
  constructor(type, x, y, floorY) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.floorY = floorY;

    // Assign vibrant color based on type
    this.color = CONFIG.SHAPE_COLORS[type];

    // Size calculation to ensure minimum 44px touch target
    this.size = 60;
    this.originalSize = 60;

    // Interaction state
    this.isDragging = false;
    this.isFalling = true;

    // Physics
    this.velocityY = 0;
    this.scale = 1.0;
    this.squash = 1.0;
    this.rotation = 0;

    // Visual effects
    this.isCorrectShape = false;
    this.hintPulse = 0;
    this.trail = [];
  }

  draw(ctx) {
    ctx.save();

    // Apply transformations
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale, this.scale * this.squash);

    // Draw shadow first
    this.drawShadow(ctx);

    // Draw main shape with neon glow effect
    if (this.isDragging || this.hintPulse > 0) {
      this.drawNeonGlow(ctx);
    }

    // Draw main shape
    this.drawShape(ctx);

    // Add highlight effect when dragging
    if (this.isDragging) {
      this.drawDragEffect(ctx);
    }

    ctx.restore();
  }

  drawShape(ctx) {
    // Create gradient for 3D effect
    const gradient = this.createGradient(ctx);

    ctx.fillStyle = gradient;
    ctx.strokeStyle = darkenColor(this.color, 30);
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';

    switch (this.type) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        this.drawHighlight(ctx, 'circle');
        break;

      case 'square':
        const half = this.size / 2;
        ctx.fillRect(-half, -half, this.size, this.size);
        ctx.strokeRect(-half, -half, this.size, this.size);
        this.drawHighlight(ctx, 'square');
        break;

      case 'triangle':
        const triHalf = this.size / 2;
        ctx.beginPath();
        ctx.moveTo(0, -triHalf);
        ctx.lineTo(-triHalf, triHalf);
        ctx.lineTo(triHalf, triHalf);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        this.drawHighlight(ctx, 'triangle');
        break;

      case 'star':
        this.drawStarShape(ctx);
        this.drawHighlight(ctx, 'star');
        break;

      case 'rectangle':
        const width = this.size;
        const height = this.size * 0.6;
        ctx.fillRect(-width / 2, -height / 2, width, height);
        ctx.strokeRect(-width / 2, -height / 2, width, height);
        this.drawHighlight(ctx, 'rectangle');
        break;
    }
  }

  createGradient(ctx) {
    let gradient;

    switch (this.type) {
      case 'circle':
      case 'star':
        gradient = ctx.createRadialGradient(-this.size * 0.15, -this.size * 0.15, 0, 0, 0, this.size / 2);
        gradient.addColorStop(0, lightenColor(this.color, 40));
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, darkenColor(this.color, 10));
        break;

      case 'square':
      case 'rectangle':
        gradient = ctx.createLinearGradient(-this.size / 2, -this.size / 2, this.size / 2, this.size / 2);
        gradient.addColorStop(0, lightenColor(this.color, 35));
        gradient.addColorStop(1, this.color);
        break;

      case 'triangle':
        gradient = ctx.createLinearGradient(0, -this.size / 2, 0, this.size / 2);
        gradient.addColorStop(0, lightenColor(this.color, 45));
        gradient.addColorStop(1, this.color);
        break;

      default:
        gradient = this.color;
    }

    return gradient;
  }

  drawStarShape(ctx) {
    const spikes = 5;
    const outerRadius = this.size / 2;
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

  drawHighlight(ctx, type) {
    // Add shine/highlight for depth
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';

    switch (type) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(-this.size * 0.2, -this.size * 0.2, this.size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'square':
        const half = this.size / 2;
        ctx.fillRect(-half + 5, -half + 5, this.size * 0.3, this.size * 0.3);
        break;

      case 'triangle':
        const triHalf = this.size / 2;
        ctx.beginPath();
        ctx.moveTo(0, -triHalf + 10);
        ctx.lineTo(-triHalf * 0.3, triHalf * 0.3);
        ctx.lineTo(triHalf * 0.3, triHalf * 0.3);
        ctx.closePath();
        ctx.fill();
        break;

      case 'star':
        ctx.beginPath();
        ctx.arc(-this.size * 0.15, -this.size * 0.25, this.size * 0.1, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'rectangle':
        const width = this.size;
        const height = this.size * 0.6;
        ctx.fillRect(-width / 2 + 5, -height / 2 + 5, width * 0.4, height * 0.3);
        break;
    }
  }

  drawShadow(ctx) {
    // Soft shadow under shape
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(2, this.size * 0.4, this.size * 0.35, this.size * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawNeonGlow(ctx) {
    // Neon glow effect for dragging or hint
    const glowIntensity = this.isDragging ? 1.0 : Math.sin(this.hintPulse) * 0.5 + 0.5;

    ctx.shadowColor = lightenColor(this.color, 60);
    ctx.shadowBlur = 30 * glowIntensity;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw outer glow
    ctx.globalAlpha = 0.4 * glowIntensity;
    ctx.fillStyle = lightenColor(this.color, 50);

    switch (this.type) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2 + 8, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'square':
        const half = this.size / 2 + 8;
        ctx.fillRect(-half, -half, this.size + 16, this.size + 16);
        break;

      case 'triangle':
        const triHalf = this.size / 2 + 8;
        ctx.beginPath();
        ctx.moveTo(0, -triHalf);
        ctx.lineTo(-triHalf, triHalf);
        ctx.lineTo(triHalf, triHalf);
        ctx.closePath();
        ctx.fill();
        break;

      case 'star':
        // Simplified star glow
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2 + 8, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'rectangle':
        const width = this.size + 16;
        const height = this.size * 0.6 + 16;
        ctx.fillRect(-width / 2, -height / 2, width, height);
        break;
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  drawDragEffect(ctx) {
    // Additional sparkle effect when dragging
    const time = Date.now() / 100;
    ctx.fillStyle = '#FFFFFF';

    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + time;
      const distance = this.size * 0.6;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const size = 3 + Math.sin(time + i) * 2;

      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  checkPointInside(x, y) {
    // Check if point is within shape bounds with HIT_PADDING
    const effectiveSize = this.size + (CONFIG.HIT_PADDING * 2);
    const half = effectiveSize / 2;

    return x >= this.x - half &&
           x <= this.x + half &&
           y >= this.y - half &&
           y <= this.y + half;
  }

  startDrag() {
    this.isDragging = true;
    this.scale = CONFIG.DRAG_SCALE;
    this.isFalling = false;
  }

  drag(x, y) {
    this.x = x;
    this.y = y;
  }

  drop() {
    this.isDragging = false;
    this.scale = 1.0;

    // Resume falling if not at floor
    if (this.y < this.floorY) {
      this.isFalling = true;
    }
  }

  setAsCorrect() {
    this.isCorrectShape = true;
  }

  update(deltaTime) {
    // Update hint pulse
    if (this.isCorrectShape) {
      this.hintPulse += 0.1;
    }

    if (!this.isFalling) return;

    // Apply gravity
    this.velocityY += CONFIG.GRAVITY;

    // Update position
    this.y += this.velocityY;

    // Gentle rotation while falling
    this.rotation += 0.02;

    // Check floor collision
    if (this.y >= this.floorY) {
      this.y = this.floorY;

      // Bounce with damping
      if (Math.abs(this.velocityY) > CONFIG.MIN_BOUNCE_VELOCITY) {
        this.velocityY *= -CONFIG.BOUNCE_DAMPING;
        this.squash = 0.8; // Squash effect
      } else {
        // Stop bouncing
        this.isFalling = false;
        this.velocityY = 0;
        this.rotation = 0; // Reset rotation when settled
      }
    }

    // Recover from squash
    if (this.squash < 1) {
      this.squash += 0.05;
      if (this.squash > 1) {
        this.squash = 1;
      }
    }
  }
}
