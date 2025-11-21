# Feed the Monster: Game Flow and Interaction Diagrams

## User Interaction Flow

```mermaid
graph TD
    A[Game Start] --> B[Display Monster]
    B --> C[Monster Says: Find the SHAPE!]
    C --> D[6-8 Shapes on Floor]
    D --> E{User Touches/Clicks Shape}
    E --> F[Shape Scales Up 1.2x]
    F --> G{User Drags Shape}
    G --> H[Monster Eyes Follow Shape]
    H --> I{User Drops Shape}
    I --> J{Correct Shape at Monster Mouth?}
    J -->|Yes| K[Success!]
    J -->|No| L[Shape Falls with Gravity]
    K --> M[Confetti Burst Effect]
    M --> N[Monster Happy Animation]
    N --> O[Score +10]
    O --> P[1.5 Second Delay]
    P --> Q[New Monster Appears]
    Q --> B
    L --> R[Bounce Animation]
    R --> D
```

## Class Interaction Diagram

```mermaid
classDiagram
    class Game {
        -canvas: HTMLCanvasElement
        -ctx: CanvasRenderingContext2D
        -monster: Monster
        -shapes: Shape[]
        -particles: Particle[]
        -draggedShape: Shape
        -score: number
        -round: number
        +init()
        +startNewRound()
        +gameLoop()
        +handleInput()
        +render()
    }
    
    class Monster {
        -x: number
        -y: number
        -width: number
        -height: number
        -targetShape: string
        -eyeOffsetX: number
        -eyeOffsetY: number
        -isHappy: boolean
        +draw(ctx)
        +updateEyes(targetX, targetY)
        +checkCollision(shape)
        +playHappyAnimation()
    }
    
    class Shape {
        -type: string
        -x: number
        -y: number
        -size: number
        -color: string
        -isDragging: boolean
        -isFalling: boolean
        -velocityY: number
        -scale: number
        +draw(ctx)
        +startDrag()
        +drag(x, y)
        +drop()
        +update()
        +checkPointInside(x, y)
    }
    
    class Particle {
        -x: number
        -y: number
        -velocityX: number
        -velocityY: number
        -color: string
        -life: number
        +update()
        +draw(ctx)
    }
    
    Game --> Monster
    Game --> Shape
    Game --> Particle
    Monster --> Shape : checks collision
```

## Screen Layout Diagram

```mermaid
graph TD
    A[Screen - 100vw x 100vh] --> B[Wall Area - Top Portion]
    A --> C[Floor Area - Bottom 200px]
    
    B --> D[Monster - Upper Center]
    B --> E[Instruction Text]
    
    C --> F[6-8 Shapes Scattered]
    
    D --> G[Eyes Track Dragged Shape]
    D --> H[Mouth Area for Collision]
    
    F --> I[Interactive Shapes]
    I --> J[Draggable]
    I --> K[Physics When Dropped]
```

## Animation State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle: Game Start
    Idle --> Dragging: Shape Selected
    Dragging --> Falling: Shape Released
    Dragging --> Success: Correct Shape at Monster
    Falling --> Idle: Shape Lands
    Success --> HappyAnimation: Shape Eaten
    HappyAnimation --> Transition: Animation Complete
    Transition --> Idle: New Round
```

## Input Handling Flow

```mermaid
graph TD
    A[Touch/Click Event] --> B[Convert to Canvas Coordinates]
    B --> C{Shape Hit Test}
    C -->|Hit| D[Set draggedShape]
    C -->|Miss| E[Ignore Event]
    D --> F[Set isDragging = true]
    F --> G[Scale Shape 1.2x]
    G --> H[Move/Drag Events]
    H --> I[Update Shape Position]
    I --> J[Update Monster Eyes]
    J --> K{Release Event}
    K --> L[Set isDragging = false]
    L --> M[Reset Scale to 1.0x]
    M --> N{Check Monster Collision}
    N -->|Success| O[Trigger Success Flow]
    N -->|Miss| P[Set isFalling = true]
    P --> Q[Apply Gravity Physics]
```

## Physics Simulation Flow

```mermaid
graph TD
    A[Shape Released] --> B[Set isFalling = true]
    B --> C[velocityY = 0]
    C --> D[Game Loop Update]
    D --> E[velocityY += GRAVITY]
    E --> F[y += velocityY]
    F --> G{y >= floorY?}
    G -->|No| D
    G -->|Yes| H[y = floorY]
    H --> I{|velocityY| > 0.5?}
    I -->|Yes| J[velocityY *= -BOUNCE_DAMPING]
    I -->|No| K[isFalling = false]
    J --> L[squash = 0.8]
    L --> M[squash += 0.05]
    M --> D
    K --> N[Settle on Floor]
```

## Visual Effects Timeline

```mermaid
gantt
    title Success Animation Timeline
    dateFormat X
    axisFormat %s
    
    section Shape Interaction
    Drag Scale Up     :0, 0.5s
    Hold Drag         :0.5, 2s
    
    section Success Sequence
    Collision Detect :2, 2.1s
    Confetti Burst    :2.1, 3s
    Monster Happy     :2.1, 3.5s
    Score Display     :2.5, 3s
    
    section Transition
    Delay             :3.5, 5s
    New Round         :5, 5.1s
```

## Color Palette Reference

| Element | Color | Hex Code |
|---------|-------|----------|
| Circle Shape | Soft Pink | #FFB3BA |
| Square Shape | Light Blue | #BAE1FF |
| Triangle Shape | Light Yellow | #FFFFBA |
| Star Shape | Light Green | #BAFFC9 |
| Rectangle Shape | Lavender | #E0BBE4 |
| Wall Gradient Start | Light Blue | #87CEEB |
| Wall Gradient End | Darker Blue | #4682B4 |
| Floor | Warm Brown | #8B4513 |
| Text | Dark Contrast | #333333 |

These diagrams provide a comprehensive visual representation of the game's mechanics, interactions, and implementation structure. They serve as a reference guide during development to ensure all components work together as intended.