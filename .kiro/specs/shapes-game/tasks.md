# Implementation Plan

- [ ] 1. Set up HTML structure and canvas initialization
  - Create index.html with proper DOCTYPE and meta tags
  - Add Google Fonts link for Fredoka One
  - Create canvas element with ID "gameCanvas"
  - Add CSS for full-viewport canvas (100vw x 100vh, no margin/padding)
  - Add CSS for Fredoka One font with fallback chain
  - Implement canvas context initialization with error handling
  - _Requirements: 1.1, 14.1, 15.1_

- [ ]* 1.1 Write unit test for canvas initialization
  - Test canvas element creation
  - Test context retrieval
  - Test error handling when context fails
  - _Requirements: 1.1, 14.1_

- [ ] 2. Implement configuration constants and data structures
  - Create CONFIG object with all constants (physics, layout, colors, etc.)
  - Define SHAPE_TYPES array
  - Define SHAPE_COLORS mapping object
  - Define GameState enumeration
  - _Requirements: 2.2, 7.2, 7.4, 8.1, 12.3_

- [ ] 3. Implement Particle class
  - Create Particle class with constructor
  - Add properties: x, y, velocityX, velocityY, color, size, life, maxLife, active
  - Implement init() method for particle reuse
  - Implement update() method with gravity and life decrease
  - Implement draw() method with opacity based on life
  - Implement isAlive() and reset() methods
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ]* 3.1 Write property test for particle life decrease
  - **Feature: shapes-game, Property 26: Particle life decreases**
  - Generate random particles with various initial life values
  - Verify life decreases and gravity is applied on update
  - **Validates: Requirements 8.4**

- [ ]* 3.2 Write property test for dead particle removal
  - **Feature: shapes-game, Property 27: Dead particles removed**
  - Generate particles with life <= 0
  - Verify they are marked for removal
  - **Validates: Requirements 8.5**

- [ ] 4. Implement Shape class foundation
  - Create Shape class with constructor accepting type, x, y, floorY
  - Add all properties: type, x, y, floorY, size, color, isDragging, isFalling, velocityY, scale, squash, originalSize
  - Implement color assignment based on type using CONFIG.SHAPE_COLORS
  - Set initial size to ensure minimum 44px touch target
  - _Requirements: 2.2, 13.1_

- [ ]* 4.1 Write property test for shape color mapping
  - **Feature: shapes-game, Property 4: Shape color mapping consistency**
  - Generate shapes of all types
  - Verify each shape's color matches CONFIG.SHAPE_COLORS for its type
  - **Validates: Requirements 2.2**

- [ ]* 4.2 Write property test for minimum touch target size
  - **Feature: shapes-game, Property 34: Minimum touch target size**
  - Generate shapes with various sizes
  - Verify effective touch target (size + HIT_PADDING * 2) >= 44px
  - **Validates: Requirements 13.1**

- [ ] 5. Implement Shape class drawing methods
  - Implement draw() method that calls specific shape drawing method
  - Implement drawCircle() using arc()
  - Implement drawSquare() using fillRect()
  - Implement drawTriangle() using path with three points
  - Implement drawStar() using five-pointed star algorithm
  - Implement drawRectangle() using fillRect() with different aspect ratio
  - Apply scale and squash transformations in draw()
  - _Requirements: 2.4, 2.5_

- [ ] 6. Implement Shape class interaction methods
  - Implement checkPointInside(x, y) with HIT_PADDING for child-friendly targets
  - Implement startDrag() to set isDragging=true, scale=1.2, isFalling=false
  - Implement drag(x, y) to update position
  - Implement drop() to set isDragging=false, scale=1.0, start falling if not at floor
  - Implement checkOverlap(other) for non-overlapping position validation
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 2.3_

- [ ]* 6.1 Write property test for drag scale transformation
  - **Feature: shapes-game, Property 11: Drag scale transformation**
  - Generate random shapes
  - Call startDrag() and verify scale equals 1.2
  - **Validates: Requirements 5.2**

- [ ]* 6.2 Write property test for drag end restores scale
  - **Feature: shapes-game, Property 13: Drag end restores scale**
  - Generate random shapes in drag state
  - Call drop() and verify isDragging=false and scale=1.0
  - **Validates: Requirements 5.4**

- [ ]* 6.3 Write property test for shapes starting at top
  - **Feature: shapes-game, Property 5: Shapes start at top of canvas**
  - Generate random shapes
  - Verify y position equals 0 and x is within canvas bounds
  - **Validates: Requirements 2.3**

- [ ] 7. Implement Shape class physics methods
  - Implement update(deltaTime) method
  - Set isFalling=true by default when shape is created
  - Add gravity application: velocityY += CONFIG.GRAVITY when isFalling
  - Add position update: y += velocityY when isFalling
  - Add floor collision detection: if y >= floorY, apply bounce
  - Add bounce logic: if |velocityY| > MIN_BOUNCE_VELOCITY, velocityY *= -BOUNCE_DAMPING
  - Add squash effect: set squash = 0.8 on bounce
  - Add squash recovery: if squash < 1, squash += 0.05
  - Stop falling when velocity too low: isFalling = false
  - Pause physics (isFalling=false) when drag starts
  - Resume physics (isFalling=true) when drag ends without success
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [ ]* 7.1 Write property test for shapes start falling
  - **Feature: shapes-game, Property 18: Shapes start falling immediately**
  - Generate newly created shapes
  - Verify isFalling is true upon creation
  - **Validates: Requirements 7.1**

- [ ]* 7.2 Write property test for drag pauses physics
  - **Feature: shapes-game, Property 19: Drag pauses physics**
  - Generate falling shapes
  - Call startDrag() and verify isFalling becomes false
  - **Validates: Requirements 7.6**

- [ ]* 7.3 Write property test for failed drop resumes physics
  - **Feature: shapes-game, Property 20: Failed drop resumes physics**
  - Generate dragged shapes
  - Call drop() without collision and verify isFalling becomes true
  - **Validates: Requirements 7.7**

- [ ]* 7.4 Write property test for gravity acceleration
  - **Feature: shapes-game, Property 21: Gravity acceleration**
  - Generate falling shapes with various velocities
  - Call update() and verify velocityY increases by CONFIG.GRAVITY
  - **Validates: Requirements 7.2**

- [ ]* 7.5 Write property test for bounce triggers on floor
  - **Feature: shapes-game, Property 22: Bounce triggers on floor impact**
  - Generate shapes reaching floor
  - Verify bounce effect is applied
  - **Validates: Requirements 7.3**

- [ ]* 7.6 Write property test for bounce damping
  - **Feature: shapes-game, Property 23: Bounce damping calculation**
  - Generate shapes impacting floor with velocity > MIN_BOUNCE_VELOCITY
  - Verify new velocityY = old velocityY * -BOUNCE_DAMPING
  - **Validates: Requirements 7.4**

- [ ]* 7.7 Write property test for squash effect
  - **Feature: shapes-game, Property 24: Squash effect on bounce**
  - Generate shapes that bounce
  - Verify squash property is set to 0.8
  - **Validates: Requirements 7.5**

- [ ] 8. Implement Monster class foundation
  - Create Monster class with constructor accepting x, y, targetShape
  - Add properties: x, y, width, height, targetShape, color, eyeOffsetX, eyeOffsetY, isHappy, animationTimer, scale
  - Set dimensions based on canvas size
  - Assign random color for monster body
  - Initialize eye offsets to 0
  - _Requirements: 3.1, 3.2_

- [ ]* 8.1 Write property test for valid target shape
  - **Feature: shapes-game, Property 6: Monster has valid target shape**
  - Generate monsters with random target shapes
  - Verify target shape is in CONFIG.SHAPE_TYPES
  - **Validates: Requirements 3.1**

- [ ] 9. Implement Monster class drawing methods
  - Implement draw(ctx) main method
  - Implement drawBody(ctx) with switch statement for each shape type
  - Draw circle body using arc() when targetShape is 'circle'
  - Draw square body using fillRect() when targetShape is 'square'
  - Draw triangle body using path when targetShape is 'triangle'
  - Draw star body using star algorithm when targetShape is 'star'
  - Draw rectangle body using fillRect() when targetShape is 'rectangle'
  - Implement drawEyes(ctx) with white sclera and black pupils
  - Implement drawMouth(ctx) for collision area
  - DO NOT draw any text instructions (children cannot read)
  - _Requirements: 3.2, 3.3, 3.4_

- [ ] 10. Implement Monster class eye tracking
  - Implement updateEyes(targetX, targetY) method
  - Calculate dx = targetX - (monster center x)
  - Calculate dy = targetY - (monster center y)
  - Calculate distance = sqrt(dx² + dy²)
  - Normalize and limit: eyeOffsetX = (dx/distance) * min(5, distance/10)
  - Normalize and limit: eyeOffsetY = (dy/distance) * min(5, distance/10)
  - Apply offsets in drawEyes() when rendering pupils
  - _Requirements: 4.1, 4.2_

- [ ]* 10.1 Write property test for eye offset maximum
  - **Feature: shapes-game, Property 9: Eye offset maximum constraint**
  - Generate random target positions
  - Call updateEyes() and verify |eyeOffsetX| <= 5 and |eyeOffsetY| <= 5
  - **Validates: Requirements 4.2**

- [ ]* 10.2 Write unit test for centered eyes when not dragging
  - Test that eyeOffsetX and eyeOffsetY are 0 when no shape is dragged
  - **Validates: Requirements 4.3**

- [ ] 11. Implement Monster class animations
  - Implement playHappyAnimation() to set isHappy=true, animationTimer=1500
  - Implement update(deltaTime) to decrease animationTimer
  - When animationTimer reaches 0, set isHappy=false
  - Implement drawHappyEffect(ctx) for visual celebration (optional sparkles/stars)
  - Implement getMouthPosition() returning {x, y} of mouth center
  - _Requirements: 3.5_

- [ ]* 11.1 Write property test for happy animation duration
  - **Feature: shapes-game, Property 7: Happy animation duration**
  - Trigger happy animation
  - Verify isHappy remains true for 1500ms then becomes false
  - **Validates: Requirements 3.5**

- [ ] 12. Implement Game class initialization
  - Create Game class with constructor
  - Add properties: canvas, ctx, monster, shapes, particles, particlePool, draggedShape, score, round, gameState, floorY, lastFrameTime
  - Implement init() method
  - Get canvas element and 2D context with error handling
  - Call calculateLayout() to set initial dimensions
  - Create particle pool of 100 particles
  - Call setupEventListeners()
  - Wait for fonts to load using document.fonts.ready
  - Call startNewRound()
  - Call gameLoop()
  - _Requirements: 15.1, 15.2, 15.3, 15.5, 12.3_

- [ ]* 12.1 Write unit test for initial score
  - Test that score is 0 after initialization
  - **Validates: Requirements 11.1**

- [ ]* 12.2 Write unit test for canvas initialization
  - Test that canvas dimensions are set correctly
  - Test that context is retrieved successfully
  - **Validates: Requirements 15.1**

- [ ] 13. Implement Game class layout calculations
  - Implement calculateLayout() method
  - Set canvas.width = window.innerWidth
  - Set canvas.height = window.innerHeight
  - Calculate floorY = canvas.height - CONFIG.FLOOR_HEIGHT (200px)
  - Calculate monster position at canvas.width/2, canvas.height * 0.2
  - Calculate shape distribution bounds within floor area
  - _Requirements: 1.1, 1.4, 1.5_

- [ ]* 13.1 Write property test for canvas dimensions match viewport
  - **Feature: shapes-game, Property 1: Canvas dimensions match viewport**
  - Simulate various viewport sizes
  - Call calculateLayout() and verify canvas matches viewport
  - **Validates: Requirements 1.1, 1.4**

- [ ]* 13.2 Write property test for floor position invariant
  - **Feature: shapes-game, Property 2: Floor position invariant**
  - Generate random canvas heights
  - Verify floorY always equals canvas.height - 200
  - **Validates: Requirements 1.5**

- [ ] 14. Implement Game class rendering methods
  - Implement render() method with try-catch for error recovery
  - Clear canvas: ctx.clearRect(0, 0, width, height)
  - Implement drawBackground() with radial gradient (light blue to darker blue)
  - Implement drawFloor() with solid brown color for bottom 200px
  - Render all shapes: shapes.forEach(shape => shape.draw(ctx))
  - Render monster: monster.draw(ctx)
  - Render active particles: particles.filter(p => p.isAlive()).forEach(p => p.draw(ctx))
  - Implement drawScore() in upper right corner with Fredoka One font
  - _Requirements: 1.2, 1.3, 11.2, 14.5_

- [ ] 15. Implement Game class shape generation
  - Implement generateShapes(targetType) method
  - Determine count: 6 + Math.floor(Math.random() * 3) for 6-8 shapes
  - Create array of shape types including at least one targetType
  - Fill remaining slots with random types from CONFIG.SHAPE_TYPES
  - For each shape, calculate random x position with horizontal spacing
  - Create Shape objects at y=0 (top of canvas) with calculated x positions
  - Ensure horizontal spacing prevents visual overlap during initial fall
  - Return shapes array
  - _Requirements: 2.1, 2.3, 9.4, 14.3_

- [ ]* 15.1 Write property test for shape count constraint
  - **Feature: shapes-game, Property 3: Shape count constraint**
  - Generate shapes multiple times
  - Verify count is always between 6 and 8 inclusive
  - **Validates: Requirements 2.1**

- [ ]* 15.2 Write property test for target shape guaranteed
  - **Feature: shapes-game, Property 30: Target shape guaranteed in round**
  - Generate shapes with various target types
  - Verify at least one shape matches target type
  - **Validates: Requirements 9.4**

- [ ]* 15.3 Write property test for horizontal spacing
  - **Feature: shapes-game, Property 38: Horizontal spacing for falling shapes**
  - Generate shapes in same round
  - Verify horizontal distance prevents visual overlap
  - **Validates: Requirements 14.3**

- [ ] 16. Implement Game class round management
  - Implement startNewRound() method
  - Increment round counter
  - Clear shapes array
  - Select random target shape type
  - Create new Monster with target shape
  - Call generateShapes(targetType) and store result
  - Set gameState to 'playing'
  - Reset draggedShape to null
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ]* 16.1 Write property test for round start clears shapes
  - **Feature: shapes-game, Property 28: Round start clears shapes**
  - Create game with existing shapes
  - Call startNewRound() and verify shapes array is empty before generation
  - **Validates: Requirements 9.2**

- [ ]* 16.2 Write property test for new monster on round start
  - **Feature: shapes-game, Property 29: New monster on round start**
  - Call startNewRound() multiple times
  - Verify new monster object created with valid target shape
  - **Validates: Requirements 9.3**

- [ ] 17. Implement Game class input coordinate conversion
  - Implement convertCoordinates(clientX, clientY) method
  - Get canvas bounding rectangle: canvas.getBoundingClientRect()
  - Calculate canvasX = clientX - rect.left
  - Calculate canvasY = clientY - rect.top
  - Return {x: canvasX, y: canvasY}
  - _Requirements: 10.3_

- [ ]* 17.1 Write property test for coordinate conversion accuracy
  - **Feature: shapes-game, Property 32: Coordinate conversion accuracy**
  - Generate random client coordinates and canvas offsets
  - Verify converted coordinates account for bounding rectangle
  - **Validates: Requirements 10.3**

- [ ] 18. Implement Game class mouse input handlers
  - Implement handleMouseDown(event) method
  - Convert coordinates using convertCoordinates()
  - Check if gameState is 'playing', return if not
  - Iterate through shapes and check checkPointInside()
  - If hit, set draggedShape and call shape.startDrag()
  - Implement handleMouseMove(event) method
  - If draggedShape exists, convert coordinates and call shape.drag()
  - Call monster.updateEyes() with dragged shape position
  - Implement handleMouseUp(event) method
  - If draggedShape exists, call shape.drop()
  - Call checkCollision(draggedShape)
  - Set draggedShape to null
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 10.1_

- [ ]* 18.1 Write property test for drag operation initiates on hit
  - **Feature: shapes-game, Property 10: Drag operation initiates on hit**
  - Generate random shapes and click positions
  - Verify drag starts when click is within bounds
  - **Validates: Requirements 5.1**

- [ ]* 18.2 Write property test for shape follows cursor
  - **Feature: shapes-game, Property 12: Shape follows cursor during drag**
  - Simulate drag with various positions
  - Verify shape position equals converted coordinates
  - **Validates: Requirements 5.3**

- [ ] 19. Implement Game class touch input handlers
  - Implement handleTouchStart(event) method
  - Call event.preventDefault() to prevent scrolling
  - Get first touch: event.touches[0]
  - Convert coordinates and check for shape hit (same as mouse)
  - Implement handleTouchMove(event) method
  - Call event.preventDefault()
  - Get first touch and update dragged shape (same as mouse)
  - Implement handleTouchEnd(event) method
  - Call event.preventDefault()
  - Handle drag end (same as mouse)
  - _Requirements: 5.5, 10.2, 10.4_

- [ ]* 19.1 Write unit test for multi-touch handling
  - Test that only first touch point is processed
  - **Validates: Requirements 10.4**

- [ ] 20. Implement Game class collision detection
  - Implement checkCollision(shape) method
  - Return false if shape is null
  - Check if shape.type === monster.targetShape
  - Get mouth position from monster.getMouthPosition()
  - Calculate distance: sqrt((shape.x - mouth.x)² + (shape.y - mouth.y)²)
  - Return true if distance < CONFIG.COLLISION_THRESHOLD (50) AND types match
  - Return false otherwise
  - _Requirements: 6.1, 6.2, 6.3_

- [ ]* 20.1 Write property test for collision requires type match
  - **Feature: shapes-game, Property 14: Collision requires type match**
  - Generate shapes with various types and distances
  - Verify success only when type matches AND distance < threshold
  - **Validates: Requirements 6.1, 6.3**

- [ ]* 20.2 Write property test for distance calculation
  - **Feature: shapes-game, Property 15: Distance calculation correctness**
  - Generate random positions
  - Verify distance equals sqrt((x1-x2)² + (y1-y2)²)
  - **Validates: Requirements 6.2**

- [ ] 21. Implement Game class success handling
  - Implement handleSuccess() method
  - Remove shape from shapes array
  - Increment score by 10
  - Get monster center position
  - Create 30 particles using particle pool
  - For each particle: calculate circular velocity distribution
  - Assign random color from confetti palette
  - Call monster.playHappyAnimation()
  - Set gameState to 'transitioning'
  - Set timeout for CONFIG.TRANSITION_DELAY (1500ms) to call startNewRound()
  - _Requirements: 6.4, 6.5, 8.1, 8.2, 8.3, 9.1_

- [ ]* 21.1 Write property test for success removes shape
  - **Feature: shapes-game, Property 16: Success removes shape**
  - Create game with shapes
  - Trigger success and verify shape removed from array
  - **Validates: Requirements 6.4**

- [ ]* 21.2 Write property test for score increment
  - **Feature: shapes-game, Property 17: Score increment on success**
  - Record initial score
  - Trigger success and verify score increased by exactly 10
  - **Validates: Requirements 6.5**

- [ ]* 21.3 Write property test for particle count on success
  - **Feature: shapes-game, Property 23: Particle count on success**
  - Trigger success event
  - Verify exactly 30 particles created
  - **Validates: Requirements 8.1**

- [ ]* 21.4 Write property test for particle color validity
  - **Feature: shapes-game, Property 24: Particle color validity**
  - Create particles from success event
  - Verify all colors are in confetti palette
  - **Validates: Requirements 8.2**

- [ ]* 21.5 Write property test for particle velocity distribution
  - **Feature: shapes-game, Property 25: Particle velocity distribution**
  - Create particles from success event
  - Verify velocities have varied angles (circular pattern)
  - **Validates: Requirements 8.3**

- [ ]* 21.6 Write property test for particle pool reuse
  - **Feature: shapes-game, Property 35: Particle pool reuse**
  - Create particles when pool has inactive particles
  - Verify existing particles reused instead of new objects created
  - **Validates: Requirements 12.3**

- [ ] 22. Implement Game class update loop
  - Implement update(deltaTime) method
  - Update all shapes: shapes.forEach(shape => shape.update(deltaTime))
  - Update all active particles: particles.forEach(p => p.update(deltaTime))
  - Remove dead particles: particles = particles.filter(p => p.isAlive())
  - Update monster: monster.update(deltaTime)
  - _Requirements: 7.1, 7.2, 7.3, 8.4, 8.5_

- [ ]* 22.1 Write property test for monster minimum size
  - **Feature: shapes-game, Property 37: Monster minimum size**
  - Generate monsters with various canvas sizes
  - Verify width is at least 150 pixels
  - **Validates: Requirements 13.4**

- [ ] 23. Implement Game class main game loop
  - Implement gameLoop(timestamp) method
  - Calculate deltaTime from lastFrameTime
  - Store current timestamp as lastFrameTime
  - Call update(deltaTime)
  - Call render()
  - Call requestAnimationFrame(this.gameLoop.bind(this))
  - _Requirements: 12.1, 12.2, 15.5_

- [ ] 24. Implement Game class event listener setup
  - Implement setupEventListeners() method
  - Add mousedown listener calling handleMouseDown
  - Add mousemove listener calling handleMouseMove
  - Add mouseup listener calling handleMouseUp
  - Add touchstart listener calling handleTouchStart
  - Add touchmove listener calling handleTouchMove with {passive: false}
  - Add touchend listener calling handleTouchEnd
  - Add resize listener with debouncing calling calculateLayout
  - _Requirements: 10.1, 10.2, 14.4, 15.4_

- [ ]* 24.1 Write property test for drag blocked during transition
  - **Feature: shapes-game, Property 33: Drag blocked during transition**
  - Set gameState to 'transitioning'
  - Attempt to start drag operation
  - Verify no drag operation begins
  - **Validates: Requirements 9.5**

- [ ] 25. Implement game initialization and startup
  - Create script section at end of HTML body
  - Instantiate Game class: const game = new Game()
  - Call game.init() when DOM is ready
  - Add error handling for initialization failures
  - Display error message if canvas not supported
  - _Requirements: 15.1, 15.2, 15.3, 14.1_

- [ ]* 25.1 Write unit test for canvas initialization failure
  - Mock canvas context to return null
  - Verify error message is displayed
  - **Validates: Requirements 14.1**

- [ ] 26. Final integration and polish
  - Test complete game flow from start to multiple rounds
  - Verify all animations are smooth
  - Test on multiple screen sizes
  - Test with both mouse and touch input
  - Verify performance meets 60fps target
  - Add code comments for clarity
  - Ensure all error handling is in place
  - _Requirements: 12.1, 13.5_

- [ ]* 26.1 Write integration tests for complete game flow
  - Test initialization → round start → drag → success → new round
  - Test initialization → round start → drag → failed drop → physics
  - Verify state transitions are correct throughout

- [ ] 27. Checkpoint - Ensure all tests pass
  - Run all unit tests and verify they pass
  - Run all property-based tests and verify they pass
  - Fix any failing tests
  - Ensure all tests pass, ask the user if questions arise
