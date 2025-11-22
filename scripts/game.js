import { CONFIG, GameState } from './config.js';
import { Monster } from './monster.js';
import { Shape } from './shape.js';
import { Particle } from './particle.js';
import { SoundManager } from './audio.js';

// Main Game Class
export class Game {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.monster = null;
    this.shapes = [];
    this.particles = [];
    this.particlePool = [];
    this.draggedShape = null;
    this.score = 0;
    this.roundsCompleted = 0;
    this.streak = 0;
    this.gameState = GameState.LOADING;
    this.floorY = 0;
    this.lastFrameTime = 0;
    this.successFlash = 0;
    this.scoreAnimation = 0;
    this.hintTimer = 0;

    // Background animation
    this.backgroundHue = 0;
    this.floatingShapes = [];

    // Sound manager
    this.soundManager = new SoundManager();

    // UI elements
    this.ui = {
      scoreboard: null,
      startScreen: null,
      pauseMenu: null,
      loadingScreen: null
    };
  }

  async init() {
    try {
      // Get canvas and context
      this.canvas = document.getElementById('gameCanvas');
      this.ctx = this.canvas.getContext('2d');

      if (!this.ctx) {
        throw new Error('Failed to get 2D context');
      }

      // Calculate initial layout
      this.calculateLayout();

      // Create particle pool
      for (let i = 0; i < CONFIG.PARTICLE_POOL_SIZE; i++) {
        this.particlePool.push(new Particle());
      }

      // Initialize floating background shapes
      this.initFloatingShapes();

      // Get UI elements
      this.ui.scoreboard = document.getElementById('scoreboard');
      this.ui.startScreen = document.getElementById('startScreen');
      this.ui.pauseMenu = document.getElementById('pauseMenu');
      this.ui.loadingScreen = document.getElementById('loadingScreen');

      // Setup event listeners
      this.setupEventListeners();

      // Initialize sound system
      await this.soundManager.init();

      // Wait for fonts to load
      await document.fonts.ready;

      console.log('Game initialized successfully');

      // Hide loading screen and show start screen
      setTimeout(() => {
        this.ui.loadingScreen.classList.add('hidden');
        this.gameState = GameState.START_SCREEN;
        this.gameLoop(performance.now());
      }, 500);

    } catch (error) {
      console.error('Game initialization failed:', error);
      document.getElementById('errorMessage').style.display = 'block';
      this.canvas.style.display = 'none';
    }
  }

  calculateLayout() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.floorY = this.canvas.height - CONFIG.FLOOR_HEIGHT;
  }

  initFloatingShapes() {
    // Create floating decorative shapes in background
    for (let i = 0; i < 8; i++) {
      this.floatingShapes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 30 + 20,
        speed: Math.random() * 0.5 + 0.2,
        type: CONFIG.SHAPE_TYPES[Math.floor(Math.random() * CONFIG.SHAPE_TYPES.length)],
        opacity: Math.random() * 0.1 + 0.05
      });
    }
  }

  render() {
    try {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.drawBackground();
      this.drawFloor();

      // Only draw game elements when playing or transitioning
      if (this.gameState === GameState.PLAYING || this.gameState === GameState.TRANSITIONING) {
        if (this.monster) {
          this.monster.draw(this.ctx);
        }

        this.shapes.forEach(shape => {
          if (shape !== this.draggedShape) {
            shape.draw(this.ctx);
          }
        });

        if (this.draggedShape) {
          this.draggedShape.draw(this.ctx);
        }

        this.particles.forEach(particle => {
          if (particle.isAlive()) {
            particle.draw(this.ctx);
          }
        });
      }

      if (this.successFlash > 0) {
        this.drawSuccessFlash();
      }

    } catch (error) {
      console.error('Rendering error:', error);
    }
  }

  drawBackground() {
    // Animated gradient background
    this.backgroundHue += 0.1;

    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2,
      this.canvas.height / 2,
      0,
      this.canvas.width / 2,
      this.canvas.height / 2,
      Math.max(this.canvas.width, this.canvas.height)
    );

    gradient.addColorStop(0, CONFIG.WALL_GRADIENT_START);
    gradient.addColorStop(0.5, CONFIG.WALL_GRADIENT_MID);
    gradient.addColorStop(1, CONFIG.WALL_GRADIENT_END);

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw floating shapes
    this.floatingShapes.forEach(shape => {
      this.ctx.save();
      this.ctx.globalAlpha = shape.opacity;
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.translate(shape.x, shape.y);

      switch (shape.type) {
        case 'circle':
          this.ctx.beginPath();
          this.ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
          this.ctx.fill();
          break;
        case 'square':
          this.ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
          break;
        case 'triangle':
          this.ctx.beginPath();
          this.ctx.moveTo(0, -shape.size / 2);
          this.ctx.lineTo(-shape.size / 2, shape.size / 2);
          this.ctx.lineTo(shape.size / 2, shape.size / 2);
          this.ctx.closePath();
          this.ctx.fill();
          break;
      }

      this.ctx.restore();

      // Move shape
      shape.y -= shape.speed;
      if (shape.y < -shape.size) {
        shape.y = this.canvas.height + shape.size;
        shape.x = Math.random() * this.canvas.width;
      }
    });
  }

  drawFloor() {
    // Gradient floor (grass-like)
    const gradient = this.ctx.createLinearGradient(0, this.floorY, 0, this.canvas.height);
    gradient.addColorStop(0, CONFIG.FLOOR_COLOR_START);
    gradient.addColorStop(1, CONFIG.FLOOR_COLOR_END);

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, this.floorY, this.canvas.width, CONFIG.FLOOR_HEIGHT);

    // Floor line with shadow
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.floorY);
    this.ctx.lineTo(this.canvas.width, this.floorY);
    this.ctx.stroke();
  }

  drawSuccessFlash() {
    this.ctx.fillStyle = `rgba(255, 255, 255, ${this.successFlash * 0.4})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.successFlash *= 0.92;
    if (this.successFlash < 0.01) {
      this.successFlash = 0;
    }
  }

  generateShapes(targetType) {
    const shapes = [];
    const count = 6 + Math.floor(Math.random() * 3);

    const shapeTypes = [targetType];
    for (let i = 1; i < count; i++) {
      const randomType = CONFIG.SHAPE_TYPES[Math.floor(Math.random() * CONFIG.SHAPE_TYPES.length)];
      shapeTypes.push(randomType);
    }

    // Shuffle
    for (let i = shapeTypes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shapeTypes[i], shapeTypes[j]] = [shapeTypes[j], shapeTypes[i]];
    }

    // Create shapes with spacing
    const shapeSize = 60;
    const spacing = shapeSize + 40;
    const totalWidth = count * spacing;
    const startX = (this.canvas.width - totalWidth) / 2 + spacing / 2;

    for (let i = 0; i < count; i++) {
      const x = startX + (i * spacing);
      const y = 0;
      const shape = new Shape(shapeTypes[i], x, y, this.floorY);

      // Mark correct shape for hints
      if (shapeTypes[i] === targetType) {
        shape.setAsCorrect();
      }

      shapes.push(shape);
    }

    return shapes;
  }

  startNewRound() {
    this.roundsCompleted++;
    this.shapes = [];
    this.hintTimer = 0;

    const targetType = CONFIG.SHAPE_TYPES[Math.floor(Math.random() * CONFIG.SHAPE_TYPES.length)];

    const monsterX = (this.canvas.width - 200) / 2;
    const monsterY = this.canvas.height * CONFIG.MONSTER_Y_POSITION;
    this.monster = new Monster(monsterX, monsterY, targetType);

    this.shapes = this.generateShapes(targetType);
    this.gameState = GameState.PLAYING;
    this.draggedShape = null;

    console.log(`Round ${this.roundsCompleted} - Target: ${targetType}`);
  }

  startGame() {
    this.score = 0;
    this.roundsCompleted = 0;
    this.streak = 0;
    this.updateUI();
    this.ui.startScreen.classList.add('hidden');
    this.startNewRound();
  }

  pauseGame() {
    if (this.gameState === GameState.PLAYING) {
      this.gameState = GameState.PAUSED;
      this.ui.pauseMenu.classList.remove('hidden');
      this.soundManager.playButtonClick();
    }
  }

  resumeGame() {
    if (this.gameState === GameState.PAUSED) {
      this.gameState = GameState.PLAYING;
      this.ui.pauseMenu.classList.add('hidden');
      this.soundManager.playButtonClick();
    }
  }

  restartGame() {
    this.ui.pauseMenu.classList.add('hidden');
    this.soundManager.playButtonClick();
    this.startGame();
  }

  toggleMute() {
    const isMuted = this.soundManager.toggleMute();
    const muteButton = document.getElementById('muteButton');
    muteButton.textContent = isMuted ? '🔇' : '🔊';
    this.soundManager.playButtonClick();
  }

  updateUI() {
    // Update score
    const scoreValue = document.getElementById('scoreValue');
    if (scoreValue) {
      scoreValue.textContent = this.score;
      if (this.scoreAnimation > 0) {
        scoreValue.parentElement.classList.add('pulse');
        setTimeout(() => {
          scoreValue.parentElement.classList.remove('pulse');
        }, 400);
      }
    }

    // Update rounds
    const roundsValue = document.getElementById('roundsValue');
    if (roundsValue) {
      roundsValue.textContent = this.roundsCompleted;
    }

    // Update streak
    const streakValue = document.getElementById('streakValue');
    const streakItem = document.getElementById('streakItem');
    if (streakValue) {
      streakValue.textContent = this.streak > 1 ? `${this.streak}x` : '';
      if (this.streak >= 3 && streakItem) {
        streakItem.classList.add('active');
      } else if (streakItem) {
        streakItem.classList.remove('active');
      }
    }
  }

  convertCoordinates(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  handleMouseDown(event) {
    if (this.gameState !== GameState.PLAYING) return;

    const coords = this.convertCoordinates(event.clientX, event.clientY);

    for (let i = this.shapes.length - 1; i >= 0; i--) {
      const shape = this.shapes[i];
      if (shape.checkPointInside(coords.x, coords.y)) {
        this.draggedShape = shape;
        shape.startDrag();
        this.soundManager.playPickup();
        this.hintTimer = 0; // Reset hint timer
        break;
      }
    }
  }

  handleMouseMove(event) {
    if (!this.draggedShape) return;

    const coords = this.convertCoordinates(event.clientX, event.clientY);
    this.draggedShape.drag(coords.x, coords.y);

    if (this.monster) {
      this.monster.updateEyes(coords.x, coords.y);
    }
  }

  handleMouseUp(event) {
    if (!this.draggedShape) return;

    const success = this.checkCollision(this.draggedShape);

    if (success) {
      this.handleSuccess();
    } else {
      this.draggedShape.drop();
      this.soundManager.playDrop();
    }

    this.draggedShape = null;

    if (this.monster) {
      this.monster.eyeOffsetX = 0;
      this.monster.eyeOffsetY = 0;
    }
  }

  handleTouchStart(event) {
    event.preventDefault();

    if (this.gameState !== GameState.PLAYING) return;
    if (event.touches.length === 0) return;

    const touch = event.touches[0];
    const coords = this.convertCoordinates(touch.clientX, touch.clientY);

    for (let i = this.shapes.length - 1; i >= 0; i--) {
      const shape = this.shapes[i];
      if (shape.checkPointInside(coords.x, coords.y)) {
        this.draggedShape = shape;
        shape.startDrag();
        this.soundManager.playPickup();
        this.hintTimer = 0;
        break;
      }
    }
  }

  handleTouchMove(event) {
    event.preventDefault();

    if (!this.draggedShape) return;
    if (event.touches.length === 0) return;

    const touch = event.touches[0];
    const coords = this.convertCoordinates(touch.clientX, touch.clientY);
    this.draggedShape.drag(coords.x, coords.y);

    if (this.monster) {
      this.monster.updateEyes(coords.x, coords.y);
    }
  }

  handleTouchEnd(event) {
    event.preventDefault();

    if (!this.draggedShape) return;

    const success = this.checkCollision(this.draggedShape);

    if (success) {
      this.handleSuccess();
    } else {
      this.draggedShape.drop();
      this.soundManager.playDrop();
    }

    this.draggedShape = null;

    if (this.monster) {
      this.monster.eyeOffsetX = 0;
      this.monster.eyeOffsetY = 0;
    }
  }

  checkCollision(shape) {
    if (!shape || !this.monster) return false;

    if (shape.type !== this.monster.targetShape) {
      return false;
    }

    const mouth = this.monster.getMouthPosition();
    const dx = shape.x - mouth.x;
    const dy = shape.y - mouth.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < CONFIG.COLLISION_THRESHOLD;
  }

  handleSuccess() {
    // Remove shape
    const index = this.shapes.indexOf(this.draggedShape);
    if (index > -1) {
      this.shapes.splice(index, 1);
    }

    // Update score and streak
    this.score += 10;
    this.streak++;
    this.scoreAnimation = 30;

    // Visual effects
    this.successFlash = 1.0;

    // Create confetti
    const centerX = this.monster.x + this.monster.width / 2;
    const centerY = this.monster.y + this.monster.height / 2;

    const particleCount = CONFIG.PARTICLE_COUNT * 2;
    for (let i = 0; i < particleCount; i++) {
      let particle = this.particlePool.find(p => !p.active);

      if (particle) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 3 + Math.random() * 7;
        const velocityX = Math.cos(angle) * velocity;
        const velocityY = Math.sin(angle) * velocity - 4;

        const color = CONFIG.CONFETTI_COLORS[Math.floor(Math.random() * CONFIG.CONFETTI_COLORS.length)];
        const size = Math.random() * 10 + 4;

        particle.init(centerX, centerY, velocityX, velocityY, color, size);
        this.particles.push(particle);
      }
    }

    // Trigger monster animations and sounds
    this.monster.playEatingAnimation();
    this.soundManager.playChomp();

    setTimeout(() => {
      this.monster.playHappyAnimation();
      this.soundManager.playSuccess();
    }, 300);

    // Update UI
    this.updateUI();

    // Set game state
    this.gameState = GameState.TRANSITIONING;

    // Schedule next round
    setTimeout(() => {
      if (this.gameState === GameState.TRANSITIONING) {
        this.startNewRound();
      }
    }, CONFIG.TRANSITION_DELAY);

    console.log(`Success! Score: ${this.score}, Streak: ${this.streak}`);
  }

  update(deltaTime) {
    // Update shapes
    this.shapes.forEach(shape => shape.update(deltaTime));

    // Update particles
    this.particles.forEach(particle => particle.update(deltaTime));

    // Remove dead particles
    this.particles = this.particles.filter(particle => {
      if (!particle.isAlive()) {
        particle.reset();
        return false;
      }
      return true;
    });

    // Update monster
    if (this.monster) {
      this.monster.update(deltaTime);
    }

    // Update score animation
    if (this.scoreAnimation > 0) {
      this.scoreAnimation--;
    }

    // Hint system - show hint after 8 seconds of inactivity
    if (this.gameState === GameState.PLAYING && !this.draggedShape) {
      this.hintTimer += deltaTime;
    }
  }

  gameLoop(timestamp) {
    const deltaTime = this.lastFrameTime ? timestamp - this.lastFrameTime : 0;
    this.lastFrameTime = timestamp;

    if (this.gameState !== GameState.START_SCREEN && this.gameState !== GameState.LOADING) {
      this.update(deltaTime);
    }

    this.render();

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  setupEventListeners() {
    // Mouse events
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));

    // Touch events
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });

    // Window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.calculateLayout();
      }, 150);
    });

    // UI button events
    document.getElementById('startButton').addEventListener('click', () => {
      this.soundManager.playButtonClick();
      this.startGame();
    });

    document.getElementById('pauseButton').addEventListener('click', () => {
      this.pauseGame();
    });

    document.getElementById('muteButton').addEventListener('click', () => {
      this.toggleMute();
    });

    document.getElementById('resumeButton').addEventListener('click', () => {
      this.resumeGame();
    });

    document.getElementById('restartButton').addEventListener('click', () => {
      this.restartGame();
    });

    // Listen for encouragement events
    window.addEventListener('showEncouragement', (e) => {
      this.showEncouragementText(e.detail.message);
    });
  }

  showEncouragementText(message) {
    // Create and animate encouragement text
    const text = document.createElement('div');
    text.textContent = message;
    text.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 4em;
      font-weight: 700;
      color: white;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      pointer-events: none;
      z-index: 150;
      animation: encouragementPop 1.5s ease forwards;
    `;

    document.body.appendChild(text);

    setTimeout(() => {
      text.remove();
    }, 1500);
  }
}
