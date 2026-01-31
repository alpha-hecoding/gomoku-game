# 五子棋游戏 - 代理开发指南

本文档为在五子棋游戏仓库中工作的编码代理提供必要信息。

## Project Structure

```
gomoku-game/
├── src/
│   ├── components/          # React components
│   ├── game/               # Game logic and rules
│   ├── utils/              # Helper functions
│   └── types/              # TypeScript type definitions
├── tests/                  # Test files
├── public/                 # Static assets
└── docs/                   # Documentation
```

## Build, Test, and Development Commands

### Essential Commands
- `npm install` - Install dependencies
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues
- `npm run type-check` - Run TypeScript type checking

### Running Single Tests
- `npm test -- --testNamePattern="specific test name"` - Run test by name
- `npm test path/to/test.test.js` - Run specific test file
- `npm test -- --grep="pattern"` - Run tests matching pattern

## Code Style Guidelines

### Import Style
- Use ES6 imports/exports consistently
- Group imports in this order:
  1. React and core libraries
  2. Third-party libraries
  3. Internal imports (from src/)
  4. Relative imports
- Use named exports for utilities, default exports for main components

```typescript
// 正确的导入方式
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { GameBoard } from '@/components/GameBoard';
import { validateMove } from '../utils/gameLogic';
```

### Component Guidelines
- Use functional components with hooks
- Name components using PascalCase
- Create separate files for components
- Export component interfaces/types

```typescript
interface GameBoardProps {
  boardSize: number;
  onMove: (row: number, col: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ boardSize, onMove }) => {
  // 组件逻辑
};
```

### Naming Conventions
- **Files**: kebab-case (game-board.component.tsx, game-logic.util.ts)
- **Variables**: camelCase (currentPlayer, gameBoard)
- **Constants**: UPPER_SNAKE_CASE (BOARD_SIZE, WINNING_LENGTH)
- **Types/Interfaces**: PascalCase (GameState, PlayerMove)
- **Functions**: camelCase with descriptive verbs (validateMove, checkWinner)

### TypeScript Guidelines
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use union types for enums
- Prefer type guards over type assertions
- Use `unknown` instead of `any` for uncertain types

```typescript
type Player = 'black' | 'white';
type GameState = 'playing' | 'won' | 'draw';

interface Move {
  row: number;
  col: number;
  player: Player;
  timestamp: number;
}
```

### Error Handling
- Use try-catch blocks for async operations
- Create custom error classes for game-specific errors
- Handle errors gracefully in UI components
- Log errors with context information

```typescript
class GameError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'GameError';
  }
}

// 使用示例
try {
  makeMove(row, col);
} catch (error) {
  if (error instanceof GameError) {
    handleGameError(error);
  } else {
    handleUnexpectedError(error);
  }
}
```

### Game Logic Patterns
- Separate pure game logic from UI concerns
- Use immutable state updates
- Validate moves before applying them
- Implement proper win detection algorithms

```typescript
const gameLogic = {
  isValidMove(board: Board, row: number, col: number): boolean {
    return board[row]?.[col] === null;
  },
  
  checkWinner(board: Board, lastMove: Move): Player | null {
    // 胜利检测逻辑
  },
  
  makeMove(board: Board, move: Move): Board {
    if (!this.isValidMove(board, move.row, move.col)) {
      throw new GameError('无效移动', 'INVALID_MOVE');
    }
    // 返回新的棋盘状态
  }
};
```

### Testing Guidelines
- Write unit tests for all game logic functions
- Test React components with React Testing Library
- Use descriptive test names
- Test edge cases and error conditions
- Mock external dependencies

```typescript
describe('Game Logic', () => {
  test('should detect horizontal win', () => {
    const board = createBoard(15);
    // 设置胜利条件
    expect(checkWinner(board, lastMove)).toBe('black');
  });
});
```

### Performance Considerations
- Use React.memo for expensive components
- Implement useMemo/useCallback for optimization
- Debounce user input when appropriate
- Use virtualization for large game boards if needed

### Git 提交信息
- 使用约定的提交格式
- 示例:
  - `feat: 添加对角线胜利检测`
  - `fix: 修复棋盘边界检查问题`
  - `test: 添加移动验证的单元测试`
  - `refactor: 将游戏逻辑提取到单独模块`

## 开发工作流程

1. 从主分支创建功能分支
2. 按照样式指南实现更改
3. 添加全面的测试
4. 运行代码检查和类型检查
5. 在开发环境中手动测试
6. 创建描述清晰的拉取请求

## 常见问题

- 访问棋盘位置时始终验证数组边界
- 处理棋盘大小可能动态变化的情况
- 确保正确清理事件监听器和计时器
- 测试不同的棋盘大小（15x15、19x19等）
- 考虑移动端触摸交互的响应式设计