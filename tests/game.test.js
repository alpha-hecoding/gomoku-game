/**
 * 游戏逻辑测试
 */

// 模拟DOM环境用于测试
const mockDOM = {
    getElementById: (id) => ({
        width: 640,
        height: 640,
        getContext: () => ({
            clearRect: () => {},
            fillRect: () => {},
            beginPath: () => {},
            arc: () => {},
            stroke: () => {},
            fill: () => {},
            moveTo: () => {},
            lineTo: () => {},
            fillStyle: '',
            strokeStyle: '',
            lineWidth: 1,
            shadowColor: '',
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0
        })
    }),
    querySelectorAll: () => [],
    createElement: () => ({
        appendChild: () => {},
        remove: () => {},
        className: '',
        textContent: '',
        innerHTML: ''
    }),
    body: {
        appendChild: () => {},
        removeChild: () => {}
    },
    addEventListener: () => {}
};

// 模拟全局对象
global.document = mockDOM;
global.window = {
    GameLogic: class GameLogic {},
    GameBoard: class GameBoard {},
    Helpers: {
        deepClone: (obj) => JSON.parse(JSON.stringify(obj)),
        isMobileDevice: () => false
    }
};

// 引入要测试的类（在实际环境中这些会通过script标签加载）
class GameLogic {
    constructor() {
        this.BOARD_SIZE = 15;
        this.WINNING_LENGTH = 5;
    }

    isValidMove(board, row, col) {
        if (row < 0 || row >= this.BOARD_SIZE || col < 0 || col >= this.BOARD_SIZE) {
            return false;
        }
        return board[row][col] === null;
    }

    checkWinner(board, row, col, player) {
        const directions = [
            [[0, 1], [0, -1]],
            [[1, 0], [-1, 0]],
            [[1, 1], [-1, -1]],
            [[1, -1], [-1, 1]]
        ];

        for (const direction of directions) {
            let count = 1;

            for (const [dx, dy] of direction) {
                let r = row + dx;
                let c = col + dy;

                while (r >= 0 && r < this.BOARD_SIZE && 
                       c >= 0 && c < this.BOARD_SIZE && 
                       board[r][c] === player) {
                    count++;
                    r += dx;
                    c += dy;
                }
            }

            if (count >= this.WINNING_LENGTH) {
                return true;
            }
        }

        return false;
    }

    checkDraw(board) {
        for (let row = 0; row < this.BOARD_SIZE; row++) {
            for (let col = 0; col < this.BOARD_SIZE; col++) {
                if (board[row][col] === null) {
                    return false;
                }
            }
        }
        return true;
    }
}

class GameBoard {
    constructor() {
        this.boardSize = 15;
        this.board = this._createEmptyBoard();
        this.moveHistory = [];
        this.currentPlayer = 'black';
        this.gameStatus = 'playing';
        this.winner = null;
        this.gameLogic = new GameLogic();
    }

    _createEmptyBoard() {
        const board = [];
        for (let i = 0; i < this.boardSize; i++) {
            board[i] = new Array(this.boardSize).fill(null);
        }
        return board;
    }

    reset() {
        this.board = this._createEmptyBoard();
        this.moveHistory = [];
        this.currentPlayer = 'black';
        this.gameStatus = 'playing';
        this.winner = null;
    }

    makeMove(row, col) {
        if (this.gameStatus !== 'playing') {
            throw new Error('游戏已结束，无法继续下棋');
        }

        if (!this.gameLogic.isValidMove(this.board, row, col)) {
            throw new Error('无效的移动位置');
        }

        this.board[row][col] = this.currentPlayer;

        const move = {
            row,
            col,
            player: this.currentPlayer,
            moveNumber: this.moveHistory.length + 1,
            timestamp: Date.now()
        };
        this.moveHistory.push(move);

        if (this.gameLogic.checkWinner(this.board, row, col, this.currentPlayer)) {
            this.gameStatus = 'won';
            this.winner = this.currentPlayer;
        } else if (this.gameLogic.checkDraw(this.board)) {
            this.gameStatus = 'draw';
        } else {
            this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        }

        return true;
    }

    getBoardCopy() {
        return this.board.map(row => [...row]);
    }

    getCurrentPlayer() {
        return this.currentPlayer;
    }

    getGameStatus() {
        return this.gameStatus;
    }

    getWinner() {
        return this.winner;
    }

    getMoveHistory() {
        return [...this.moveHistory];
    }

    getLastMove() {
        return this.moveHistory.length > 0 ? 
               this.moveHistory[this.moveHistory.length - 1] : null;
    }
}

// 测试套件
class TestSuite {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, testFunc) {
        this.tests.push({ name, testFunc });
    }

    run() {
        console.log('开始运行测试...\n');
        
        for (const { name, testFunc } of this.tests) {
            try {
                testFunc();
                console.log(`✓ ${name}`);
                this.passed++;
            } catch (error) {
                console.log(`✗ ${name}`);
                console.log(`  错误: ${error.message}`);
                this.failed++;
            }
        }

        console.log(`\n测试完成: ${this.passed} 通过, ${this.failed} 失败`);
        return this.failed === 0;
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(`${message}. 期望: ${expected}, 实际: ${actual}`);
        }
    }
}

// 创建测试套件
const testSuite = new TestSuite();

// 游戏逻辑测试
testSuite.test('应该验证有效的移动位置', () => {
    const gameLogic = new GameLogic();
    const board = Array(15).fill(null).map(() => Array(15).fill(null));
    
    testSuite.assertTrue(gameLogic.isValidMove(board, 7, 7), '中心位置应该有效');
    testSuite.assertTrue(gameLogic.isValidMove(board, 0, 0), '边角位置应该有效');
    testSuite.assertTrue(gameLogic.isValidMove(board, 14, 14), '右下角应该有效');
});

testSuite.test('应该拒绝无效的移动位置', () => {
    const gameLogic = new GameLogic();
    const board = Array(15).fill(null).map(() => Array(15).fill(null));
    board[7][7] = 'black';
    
    testSuite.assertFalse(gameLogic.isValidMove(board, 7, 7), '已占用位置应该无效');
    testSuite.assertFalse(gameLogic.isValidMove(board, -1, 0), '负坐标应该无效');
    testSuite.assertFalse(gameLogic.isValidMove(board, 15, 0), '超出边界应该无效');
    testSuite.assertFalse(gameLogic.isValidMove(board, 0, 15), '超出边界应该无效');
});

testSuite.test('应该检测水平获胜', () => {
    const gameLogic = new GameLogic();
    const board = Array(15).fill(null).map(() => Array(15).fill(null));
    
    // 设置黑子水平连成五子
    for (let i = 0; i < 5; i++) {
        board[7][i + 5] = 'black';
    }
    
    testSuite.assertTrue(gameLogic.checkWinner(board, 7, 9, 'black'), '应该检测到水平获胜');
});

testSuite.test('应该检测垂直获胜', () => {
    const gameLogic = new GameLogic();
    const board = Array(15).fill(null).map(() => Array(15).fill(null));
    
    // 设置白子垂直连成五子
    for (let i = 0; i < 5; i++) {
        board[i + 5][7] = 'white';
    }
    
    testSuite.assertTrue(gameLogic.checkWinner(board, 9, 7, 'white'), '应该检测到垂直获胜');
});

testSuite.test('应该检测对角线获胜', () => {
    const gameLogic = new GameLogic();
    const board = Array(15).fill(null).map(() => Array(15).fill(null));
    
    // 设置黑子对角线连成五子
    for (let i = 0; i < 5; i++) {
        board[i + 5][i + 5] = 'black';
    }
    
    testSuite.assertTrue(gameLogic.checkWinner(board, 9, 9, 'black'), '应该检测到对角线获胜');
});

testSuite.test('应该检测平局', () => {
    const gameLogic = new GameLogic();
    const board = Array(15).fill(null).map(() => Array(15).fill(null));
    
    // 填满棋盘
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            board[i][j] = (i + j) % 2 === 0 ? 'black' : 'white';
        }
    }
    
    testSuite.assertTrue(gameLogic.checkDraw(board), '应该检测到平局');
});

// 游戏棋盘测试
testSuite.test('应该正确创建空棋盘', () => {
    const gameBoard = new GameBoard();
    const board = gameBoard.getBoardCopy();
    
    testSuite.assertEqual(board.length, 15, '棋盘应该有15行');
    testSuite.assertEqual(board[0].length, 15, '每行应该有15列');
    testSuite.assertEqual(board[7][7], null, '初始位置应该为空');
});

testSuite.test('应该正确下棋', () => {
    const gameBoard = new GameBoard();
    
    gameBoard.makeMove(7, 7);
    testSuite.assertEqual(gameBoard.getBoardCopy()[7][7], 'black', '第一步应该是黑子');
    testSuite.assertEqual(gameBoard.getCurrentPlayer(), 'white', '下棋后应该切换玩家');
    
    gameBoard.makeMove(7, 8);
    testSuite.assertEqual(gameBoard.getBoardCopy()[7][8], 'white', '第二步应该是白子');
    testSuite.assertEqual(gameBoard.getCurrentPlayer(), 'black', '下棋后应该切换玩家');
});

testSuite.test('应该正确记录移动历史', () => {
    const gameBoard = new GameBoard();
    
    gameBoard.makeMove(7, 7);
    gameBoard.makeMove(7, 8);
    
    const history = gameBoard.getMoveHistory();
    testSuite.assertEqual(history.length, 2, '应该记录两步移动');
    testSuite.assertEqual(history[0].player, 'black', '第一步应该是黑子');
    testSuite.assertEqual(history[1].player, 'white', '第二步应该是白子');
});

testSuite.test('应该正确重置游戏', () => {
    const gameBoard = new GameBoard();
    
    gameBoard.makeMove(7, 7);
    gameBoard.makeMove(7, 8);
    
    gameBoard.reset();
    
    testSuite.assertEqual(gameBoard.getCurrentPlayer(), 'black', '重置后当前玩家应该是黑子');
    testSuite.assertEqual(gameBoard.getGameStatus(), 'playing', '重置后游戏状态应该是进行中');
    testSuite.assertEqual(gameBoard.getMoveHistory().length, 0, '重置后移动历史应该为空');
    testSuite.assertEqual(gameBoard.getBoardCopy()[7][7], null, '重置后棋盘应该为空');
});

testSuite.test('应该检测游戏获胜', () => {
    const gameBoard = new GameBoard();
    
    // 设置黑子水平连成五子
    for (let i = 0; i < 4; i++) {
        gameBoard.makeMove(7, i + 5);
        gameBoard.makeMove(8, i + 5); // 白子在另一行
    }
    
    // 第五步黑子获胜
    gameBoard.makeMove(7, 9);
    
    testSuite.assertEqual(gameBoard.getGameStatus(), 'won', '游戏状态应该是获胜');
    testSuite.assertEqual(gameBoard.getWinner(), 'black', '获胜者应该是黑子');
});

// 辅助函数
testSuite.assertTrue = (condition, message) => {
    testSuite.assert(condition, message);
};

testSuite.assertFalse = (condition, message) => {
    testSuite.assert(!condition, message);
};

// 运行测试
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TestSuite, GameLogic, GameBoard };
} else {
    // 在浏览器环境中运行测试
    testSuite.run();
}