# Feed the Monster: Detailed Implementation Plan

## Key Algorithms and Implementation Details

### 1. Shape Drawing Algorithms

#### Star Shape Drawing
```javascript
drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}
```

#### Triangle Shape Drawing
```javascript
drawTriangle(ctx, x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y - size / 2);
  ctx.lineTo(x - size / 2, y + size / 2);
  ctx.lineTo(x + size / 2, y + size / 2);
  ctx.closePath();
  ctx.fill();
}
```

### 2. Eye Tracking Algorithm

```javascript
updateEyes(targetX, targetY) {
  // Calculate angle from monster center to target
  const dx = targetX - (this.x + this.width / 2);
  const dy = targetY - (this.y + this.height / 2);
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Normalize and limit eye movement
  const maxOffset = 5; // Maximum pupil offset
  this.eyeOffsetX = (dx / distance) * Math.min(maxOffset, distance / 10);
  this.eyeOffsetY = (dy / distance) * Math.min(maxOffset, distance / 10);
}
```

### 3. Physics System for Falling Shapes

```javascript
update() {
  if (this.isFalling) {
    // Apply gravity
    this.velocityY += GRAVITY;
    this.y += this.velocityY;
    
    // Check floor collision
    if (this.y >= this.floorY) {
      this.y = this.floorY;
      
      // Bounce with damping
      if (Math.abs(this.velocityY) > 0.5) {
        this.velocityY *= -BOUNCE_DAMPING;
        this.squash = 0.8; // Squash effect
      } else {
        this.isFalling = false;
        this.velocityY = 0;
      }
    }
    
    // Recover from squash
    if (this.squash < 1) {
      this.squash += 0.05;
    }
  }
}
```

### 4. Particle System for Confetti Effect

```javascript
createConfetti(x, y, count = 30) {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
  
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const velocity = 3 + Math.random() * 3;
    
    this.particles.push(new Particle(
      x, y,
      Math.cos(angle) * velocity,
      Math.sin(angle) * velocity - 2, // Upward bias
      colors[Math.floor(Math.random() * colors.length)],
      Math.random() * 6 + 4
    ));
  }
}
```

### 5. Collision Detection

```javascript
checkPointInside(x, y) {
  // Simple bounding box check
  return x >= this.x - this.size / 2 &&
         x <= this.x + this.size / 2 &&
         y >= this.y - this.size / 2 &&
         y <= this.y + this.size / 2;
}

checkMonsterCollision(monster) {
  // Check if shape center is near monster mouth area
  const mouthX = monster.x + monster.width / 2;
  const mouthY = monster.y + monster.height * 0.7; // Lower portion of monster
  const distance = Math.sqrt(
    Math.pow(this.x - mouthX, 2) + 
    Math.pow(this.y - mouthY, 2)
  );
  
  return distance < 50; // Collision threshold
}
```

### 6. Input Handling System

```javascript
handleStart(x, y) {
  // Convert coordinates to canvas space
  const canvasRect = this.canvas.getBoundingClientRect();
  const canvasX = x - canvasRect.left;
  const canvasY = y - canvasRect.top;
  
  // Check if any shape was clicked
  for (let shape of this.shapes) {
    if (shape.checkPointInside(canvasX, canvasY)) {
      this.draggedShape = shape;
      shape.startDrag();
      break;
    }
  }
}

handleMove(x, y) {
  if (this.draggedShape) {
    const canvasRect = this.canvas.getBoundingClientRect();
    const canvasX = x - canvasRect.left;
    const canvasY = y - canvasRect.top;
    
    this.draggedShape.drag(canvasX, canvasY);
    
    // Update monster eye tracking
    this.monster.updateEyes(canvasX, canvasY);
  }
}
```

### 7. Game State Management

```javascript
class GameState {
  constructor() {
    this.currentRound = 0;
    this.score = 0;
    this.isPlaying = false;
    this.isTransitioning = false;
  }
  
  startNewRound() {
    this.currentRound++;
    this.isTransitioning = false;
  }
  
  handleSuccess() {
    this.score += 10;
    this.isTransitioning = true;
    
    // Start transition timer
    setTimeout(() => {
      this.startNewRound();
    }, 1500);
  }
}
```

### 8. Responsive Design Calculations

```javascript
calculateLayout() {
  // Canvas dimensions
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;
  
  // Floor position (bottom 200px)
  this.floorY = this.canvas.height - 200;
  
  // Monster position (upper center)
  this.monsterX = this.canvas.width / 2 - 100;
  this.monsterY = this.canvas.height * 0.2;
  
  // Shape distribution area
  this.shapeArea = {
    minX: 50,
    maxX: this.canvas.width - 50,
    minY: this.floorY - 100,
    maxY: this.floorY - 20
  };
}
```

### 9. Monster Procedural Drawing

```javascript
draw(ctx) {
  // Body (based on target shape)
  ctx.fillStyle = this.color;
  
  switch (this.targetShape) {
    case 'circle':
      ctx.beginPath();
      ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'square':
      ctx.fillRect(this.x, this.y, this.width, this.height);
      break;
    // ... other shapes
  }
  
  // Eyes
  this.drawEyes(ctx);
  
  // Mouth
  this.drawMouth(ctx);
  
  // Happy animation effect
  if (this.isHappy) {
    this.drawHappyEffect(ctx);
  }
}

drawEyes(ctx) {
  const eyeY = this.y + this.height * 0.3;
  const leftEyeX = this.x + this.width * 0.3;
  const rightEyeX = this.x + this.width * 0.7;
  
  // Eye whites
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(leftEyeX, eyeY, 15, 0, Math.PI * 2);
  ctx.arc(rightEyeX, eyeY, 15, 0, Math.PI * 2);
  ctx.fill();
  
  // Pupils (with tracking)
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(leftEyeX + this.eyeOffsetX, eyeY + this.eyeOffsetY, 8, 0, Math.PI * 2);
  ctx.arc(rightEyeX + this.eyeOffsetX, eyeY + this.eyeOffsetY, 8, 0, Math.PI * 2);
  ctx.fill();
}
```

### 10. Initialization Sequence

```javascript
init() {
  // Setup canvas
  this.calculateLayout();
  
  // Load font
  document.fonts.ready.then(() => {
    // Start first round
    this.startNewRound();
    
    // Start game loop
    this.gameLoop();
  });
  
  // Setup event listeners
  this.setupEventListeners();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    this.calculateLayout();
  });
}
```

This detailed implementation plan provides the core algorithms and methods needed to build the complete game. Each component is designed to work together seamlessly while maintaining clean, modular code structure.