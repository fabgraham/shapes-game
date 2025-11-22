// Configuration Constants
export const CONFIG = {
  // Physics
  GRAVITY: 0.5,
  BOUNCE_DAMPING: 0.6,
  MIN_BOUNCE_VELOCITY: 0.5,

  // Interactions
  DRAG_SCALE: 1.2,
  HIT_PADDING: 25,

  // Layout
  FLOOR_HEIGHT: 200,
  MONSTER_Y_POSITION: 0.2,

  // Collision
  COLLISION_THRESHOLD: 50,

  // Effects
  PARTICLE_COUNT: 30,
  PARTICLE_POOL_SIZE: 100,
  TRANSITION_DELAY: 1500,

  // Shapes
  SHAPE_TYPES: ['circle', 'square', 'triangle', 'star', 'rectangle'],
  SHAPE_COLORS: {
    circle: '#FF1493',    // Hot Pink (vibrant!)
    square: '#00BFFF',    // Electric Blue
    triangle: '#FFD700',  // Sunshine Yellow
    star: '#00FF7F',      // Lime Green
    rectangle: '#9370DB'  // Vivid Purple
  },

  // Visual
  WALL_GRADIENT_START: '#00D4FF',
  WALL_GRADIENT_MID: '#FF6B9D',
  WALL_GRADIENT_END: '#9D4EDD',
  FLOOR_COLOR_START: '#4CAF50',
  FLOOR_COLOR_END: '#2E7D32',
  TEXT_COLOR: '#FFFFFF',

  // Confetti colors - vibrant mix
  CONFETTI_COLORS: ['#FF1493', '#00BFFF', '#FFD700', '#00FF7F', '#9370DB', '#FF6B9D']
};

// Game State Enumeration
export const GameState = {
  LOADING: 'loading',
  START_SCREEN: 'start_screen',
  PLAYING: 'playing',
  TRANSITIONING: 'transitioning',
  PAUSED: 'paused'
};
