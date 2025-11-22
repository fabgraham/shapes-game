import { Game } from './game.js';

// Initialize game when DOM is ready
function initGame() {
  const game = new Game();
  game.init();

  // Make game globally accessible for debugging
  window.game = game;
}

// Start when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}

// Add encouragement animation to page
const style = document.createElement('style');
style.textContent = `
  @keyframes encouragementPop {
    0% {
      transform: translate(-50%, -50%) scale(0.5);
      opacity: 0;
    }
    20% {
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 1;
    }
    80% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1.5);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
