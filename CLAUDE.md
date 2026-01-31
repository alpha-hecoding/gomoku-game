# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development Server
- `npm start` - Starts a Python HTTP server on port 8000 for development
- Open http://localhost:8000 in browser to test

### Testing
- `npm test` - Run all Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix linting issues

### Note
The `npm run build` and `npm run type-check` commands are placeholders (no actual build or type checking is configured).

## Architecture Overview

This is a pure JavaScript browser-based Gomoku (Five-in-a-Row) game using a classic module pattern with global exports. No build tools or bundlers are used—classes are exported to `window` for access.

### Layered Architecture

```
index.html (entry point)
    |
    +--> src/main.js (application initialization)
          |
          +--> GameController (orchestrates game flow)
                |
                +--> GameBoard (manages board state)
                |       |
                |       +--> GameLogic (rules, win detection)
                |
                +--> UIRenderer (Canvas drawing, DOM updates)
                +--> EventManager (input handling, event emission)
```

### Core Components

**GameLogic** (`src/game/GameLogic.js`)
- Pure functions for game rules
- `isValidMove(board, row, col)` - Validates board coordinates and vacancy
- `checkWinner(board, row, col, player)` - Checks 4 directions for 5-in-a-row
- `checkDraw(board)` - Detects full board
- `evaluatePosition(board, row, col, player)` - Simple AI scoring (can be extended)

**GameBoard** (`src/game/GameBoard.js`)
- Manages board state (15x15), move history, current player
- `makeMove(row, col)` - Places piece, switches player, checks win/draw
- `undo()` - Reverts last move
- `reset()` - Clears board
- Stores moves with timestamp for history

**GameController** (`src/game/GameController.js`)
- Coordinates between GameBoard, UIRenderer, and EventManager
- Handles user actions: `_handleBoardClick`, `_handleNewGame`, `_handleUndo`
- `saveGame()` / `loadGame()` - Serializes/deserializes game state to JSON
- Auto-saves to localStorage every 5 seconds (see main.js)

**UIRenderer** (`src/ui/UIRenderer.js`)
- Canvas-based rendering (not DOM grid)
- `cellSize = 40`, `padding = 20`, canvas size calculated dynamically
- `pixelToBoard(pixelX, pixelY)` - Converts mouse coords to grid coords
- Draws board with star points at positions: [3,3], [3,11], [11,3], [11,11], [7,7]
- Last move marked with red circle
- Displays move history in DOM (format: `1. 黑子 A8`)

**EventManager** (`src/ui/EventManager.js`)
- Pub/sub pattern: `on(eventName, callback)`, `emit(eventName, ...args)`
- Events: `boardClick`, `boardHover`, `boardHoverLeave`, `newGame`, `undo`, `restart`
- Touch support for mobile devices
- Keyboard shortcuts: Ctrl+Z (undo), Ctrl+N (new game), Ctrl+R (restart), ESC (clear messages)

**Helpers** (`src/utils/helpers.js`)
- `boardToDisplayCoords(row, col)` - Converts (0,0) to "A15", (14,14) to "O1"
- `displayToBoardCoords(displayCoords)` - Reverse conversion
- `isMobileDevice()` - User agent detection
- localStorage helpers with error handling

### Important Conventions

- **Board coordinates**: (0,0) is top-left, (14,14) is bottom-right
- **Display coordinates**: Column = A-O, Row = 15-1 (top to bottom)
- **Player colors**: `'black'` (first move), `'white'` (second move)
- **Game status**: `'playing'`, `'won'`, `'draw'`
- **All classes export to `window`**: e.g., `window.GameLogic`, `window.GameBoard`

### Module Loading

The game loads scripts sequentially in index.html:
1. GameLogic → GameBoard → GameController
2. UIRenderer → EventManager
3. Helpers
4. main.js (uses `DOMContentLoaded` to initialize)

### Testing

- Uses Jest with jsdom environment
- Tests in `tests/game.test.js` include mocked classes (not imports)
- `tests/setup.js` mocks localStorage, console, and requestAnimationFrame

### Known Issues / Limitations

- AI is stub-only (`_countConsecutive` returns constant 1)
- Undo not allowed after game ends
- No online multiplayer
- No configurable board size (hardcoded 15x15)

### Game State Persistence

Game state auto-saves to localStorage key `gomoku_save_game` every 5 seconds and on window unload. User is prompted to restore on load.
