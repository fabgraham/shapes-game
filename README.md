# Feed the Monster - Shape Recognition Game

An educational HTML5 Canvas game designed for children ages 4-5 to learn shape recognition through interactive gameplay.

## 🎮 Game Overview

Feed the Monster is a single-file browser game where children drag colorful shapes to feed a hungry monster. The monster's body is shaped like the shape it wants to eat, providing clear visual communication without requiring reading skills.

### Key Features

- **Visual Learning**: Monster's body matches the shape it wants - no text required
- **Dynamic Physics**: Shapes fall from the top of the screen and bounce when they hit the ground
- **Interactive Gameplay**: Drag and drop shapes with mouse or touch input
- **Engaging Feedback**: Confetti particles and happy animations on success
- **Child-Friendly Design**: Large touch targets (44px minimum), bright colors, simple interactions
- **Responsive**: Works on desktop, tablet, and mobile devices

## 🎯 Target Audience

Children ages 4-5 years old learning basic shape recognition (circle, square, triangle, star, rectangle).

## 🛠️ Technology Stack

- **HTML5 Canvas** - All rendering
- **Vanilla JavaScript (ES6+)** - Game logic
- **CSS3** - Layout and styling
- **Google Fonts** - Fredoka One font for numerals
- **No dependencies** - Single HTML file, runs in any modern browser

## 📋 Project Structure

This project follows a **spec-driven development** workflow:

```
.kiro/specs/shapes-game/
├── requirements.md    # 15 formal requirements with 73 acceptance criteria
├── design.md          # Architecture with 38 testable correctness properties
└── tasks.md           # 27 implementation tasks with optional tests
```

### Development Approach

1. **Requirements** - EARS-compliant acceptance criteria defining what the game must do
2. **Design** - Complete architecture with testable correctness properties
3. **Tasks** - Sequential implementation plan with property-based testing

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor or IDE
- Basic understanding of HTML5 Canvas and JavaScript

### Implementation

The game is designed to be implemented as a single `index.html` file containing all HTML, CSS, and JavaScript.

To start implementing:

1. Review the spec documents in `.kiro/specs/shapes-game/`
2. Open `tasks.md` and follow the implementation tasks sequentially
3. Each task references specific requirements and includes optional property-based tests

### Running the Game

Once implemented, simply open `index.html` in a web browser. No build process or server required.

## 🎨 Game Mechanics

### Core Gameplay Loop

1. **Shapes Fall** - 6-8 colorful shapes fall from the top of the screen
2. **Monster Appears** - A monster with a body shaped like a specific shape appears
3. **Player Drags** - Child drags a shape toward the monster
4. **Physics Active** - Shapes bounce when they hit the floor
5. **Success** - Feeding the correct shape triggers confetti and happy animation
6. **New Round** - After 1.5 seconds, a new round begins with a new monster

### Physics System

- **Gravity**: 0.5 pixels per frame acceleration
- **Bounce**: 0.6 damping factor on floor impact
- **Squash**: Visual squash effect (0.8x) on bounce
- **Drag Pause**: Physics pause while dragging, resume on drop

### Visual Design

- **Shapes**: Soft pastel colors (pink, blue, yellow, green, lavender)
- **Background**: Radial gradient (light blue to darker blue)
- **Floor**: Warm brown (bottom 200px)
- **Monster**: Body shaped like target shape with tracking eyes
- **Score**: Large numerals in upper right corner

## 🧪 Testing Strategy

The project includes a comprehensive testing approach:

### Property-Based Testing

- **38 correctness properties** defined in design.md
- Uses **fast-check** library for JavaScript
- Tests universal properties across all inputs (100+ iterations per test)
- Validates physics, collision detection, state management, and more

### Unit Testing

- Specific examples and edge cases
- Integration points between components
- Error handling scenarios

### Optional Tests

Test tasks are marked as optional (*) in tasks.md to allow for faster MVP development while maintaining the option for comprehensive testing.

## 📊 Requirements Coverage

- ✅ Canvas initialization and responsive layout
- ✅ Shape rendering and physics simulation
- ✅ Monster display with visual shape matching
- ✅ Eye tracking animation
- ✅ Drag and drop interaction (mouse + touch)
- ✅ Collision detection and success handling
- ✅ Particle effects system
- ✅ Round progression and game state management
- ✅ Score tracking and display
- ✅ Performance optimization (60fps target)
- ✅ Child-friendly accessibility
- ✅ Error handling and robustness

## 🎓 Educational Value

- **Shape Recognition**: Visual matching of geometric shapes
- **Hand-Eye Coordination**: Drag and drop mechanics
- **Cause and Effect**: Immediate feedback on actions
- **Problem Solving**: Finding the correct shape among options
- **Positive Reinforcement**: Celebratory animations on success

## 🌟 Design Principles

1. **No Text Instructions** - Visual communication only (ages 4-5 can't read)
2. **Clear Visual Cues** - Monster body = target shape
3. **Immediate Feedback** - Instant response to all interactions
4. **Forgiving Gameplay** - Large touch targets, no penalties for mistakes
5. **Engaging Physics** - Bouncing shapes keep the game dynamic and fun

## 📝 Implementation Status

- [x] Requirements defined (15 requirements, 73 acceptance criteria)
- [x] Design completed (38 correctness properties)
- [x] Tasks planned (27 implementation tasks)
- [ ] Implementation (ready to start)
- [ ] Testing (optional property-based tests available)
- [ ] Deployment (single HTML file)

## 🤝 Contributing

This project follows a formal specification process. To contribute:

1. Review the requirements and design documents
2. Ensure changes align with acceptance criteria
3. Update correctness properties if behavior changes
4. Add corresponding tasks for new features

## 📄 License

[Add your license here]

## 👥 Authors

[Add your name/team here]

## 🙏 Acknowledgments

- Designed for early childhood education
- Inspired by shape recognition learning activities
- Built with accessibility and child development in mind

---

**Ready to implement?** Open `.kiro/specs/shapes-game/tasks.md` and start with Task 1!
