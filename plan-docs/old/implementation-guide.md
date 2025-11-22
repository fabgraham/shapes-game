# Feed the Monster: Complete Implementation Guide

## Project Overview
A single-file HTML5 Canvas game where children (ages 4-5) learn shape recognition by feeding shapes to a hungry monster.

## Technical Specifications
- **Platform**: Web browser (HTML5)
- **Technology Stack**: HTML5 Canvas, Vanilla JavaScript (ES6+), CSS3
- **Architecture**: Single HTML file containing all code
- **Input**: Mouse and touch support
- **Target Audience**: Children ages 4-5

---

## Configuration Constants

```javascript
const CONFIG = {
  // Physics
  gravity: 0.5,
  bounceDamping: 0.6,
  minBounceVelocity: 0.5,
  
  // Interactions
  dragScale: 1.2,
  hitPadding: 25, // Extra padding for child-friendly touch targets
  
  // Layout
  floorHeight: 200,
  monsterYPosition: 0.2, // Percentage of canvas height
  
  // Collision
  collisionThreshold: 50,
  
  // Effects
  particleCount: 30,
  particlePoolSize: 100,
  transitionDelay: 1500,
  
  // Difficulty Progression
  difficulty: {
    easy: { rounds: [1, 2, 3], shapeCount: 6, shapeTypes: 3 },
    medium: { rounds: [4, 5, 6], shapeCount: 7, shapeTypes: 4 },
    hard: { rounds: [7, 8, 9, 10], shapeCount: 8, shapeTypes: 5 }
  }
};
```

---

## Core Architecture

### File Structure
- `index.html` - Single file containing all HTML, CSS, and JavaScript

### Class Structure

#### 1. Game Class (Main Controller)
Manages game state, rounds, and scoring. Coordinates between all other classes.

**Properties:**
- `canvas: HTMLCanvasElement`
- `ctx: CanvasRenderingContext2D`
- `monster: Monster`
- `shapes: Shape[]`
- `particles: Particle[]`
- `particlePool: Particle[]` - Pre-created particles for reuse
- `draggedShape: Shape`
- `score: number`
- `round: number`
- `gameState: string` - 'playing', 'transitioning', 'paused'
- `isLoading: boolean`

**Methods:**
- `init()` - Initialize canvas, event listeners, particle pool, and first round
- `startNewRound()` - Create new monster with entry animation and generate shapes
- `generateShapes()` - Create shapes with non-overlapping positions
- `update()` - Main game loop update
- `render()` - Main render loop
- `handleMouseDown/touchStart()` - Input handling with multi-touch prevention
- `handleMouseMove/touchMove()` - Input handling
- `handleMouseUp/touchEnd()` - Input handling
- `pause()` - Pause game
- `reset()` - Reset to round 1
- `calculateLayout()` - Responsive layout calculations

#### 2. Monster Class
Represents the target shape that needs to be fed. Handles drawing, animations, and eye tracking.

**Properties:**
- `x, y` - Position on canvas
- `width, height` - Dimensions
- `targetShape` - The shape it wants to eat
- `color` - Monster body color
- `eyeOffsetX, eyeOffsetY` - For eye tracking
- `isHappy` - Animation state
- `animationTimer` - For happy animation
- `scale` - For enter/exit animations
- `state` - 'entering', 'idle', 'happy', 'leaving'

**Methods:**
- `draw(ctx)` - Render the monster with procedural drawing
- `drawEyes(ctx)` - Draw eyes with tracking
- `drawMouth(ctx)` - Draw mouth area
- `drawHappyEffect(ctx)` - Visual effect