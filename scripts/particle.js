import { CONFIG } from './config.js';

// Particle Class for Confetti Effects
export class Particle {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.color = '#FFFFFF';
    this.size = 5;
    this.life = 0;
    this.maxLife = 100;
    this.active = false;
    this.rotation = 0;
    this.rotationSpeed = 0;
  }

  init(x, y, velocityX, velocityY, color, size) {
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.color = color;
    this.size = size;
    this.life = 100;
    this.maxLife = 100;
    this.active = true;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.2;
  }

  update(deltaTime) {
    if (!this.active) return;

    // Apply gravity
    this.velocityY += CONFIG.GRAVITY * 0.5; // Lighter gravity for confetti

    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Update rotation
    this.rotation += this.rotationSpeed;

    // Add air resistance
    this.velocityX *= 0.98;

    // Decrease life
    this.life -= 1.5;

    if (this.life <= 0) {
      this.active = false;
    }
  }

  draw(ctx) {
    if (!this.active) return;

    // Calculate opacity based on remaining life
    const opacity = this.life / this.maxLife;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Draw confetti as rectangles or circles
    if (Math.random() > 0.5) {
      // Rectangle confetti
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.5);
    } else {
      // Circle confetti
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  isAlive() {
    return this.active && this.life > 0;
  }

  reset() {
    this.active = false;
    this.life = 0;
  }
}
