/**
 * 游戏棋盘类
 * 管理棋盘状态、落子记录等功能
 */
class GameBoard {
    constructor() {
        this.boardSize = 15;
        this.board = this._createEmptyBoard();
        this.moveHistory = []; // 移动历史记录
        this.currentPlayer = 'black'; // 当前玩家，黑子先行
        this.gameStatus = 'playing'; // 游戏状态：playing, won, draw
        this.winner = null;
        this.gameLogic = new GameLogic();
    }

    /**
     * 创建空棋盘
     * @private
     * @returns {Array<Array<string|null>>} 空棋盘
     */
    _createEmptyBoard() {
        const board = [];
        for (let i = 0; i < this.boardSize; i++) {
            board[i] = new Array(this.boardSize).fill(null);
        }
        return board;
    }

    /**
     * 重置游戏
     */
    reset() {
        this.board = this._createEmptyBoard();
        this.moveHistory = [];
        this.currentPlayer = 'black';
        this.gameStatus = 'playing';
        this.winner = null;
    }

    /**
     * 下棋
     * @param {number} row - 行坐标
     * @param {number} col - 列坐标
     * @returns {boolean} 是否成功下棋
     */
    makeMove(row, col) {
        // 检查游戏状态
        if (this.gameStatus !== 'playing') {
            throw new Error('游戏已结束，无法继续下棋');
        }

        // 验证移动是否有效
        if (!this.gameLogic.isValidMove(this.board, row, col)) {
            throw new Error('无效的移动位置');
        }

        // 落子
        this.board[row][col] = this.currentPlayer;

        // 记录移动
        const move = {
            row,
            col,
            player: this.currentPlayer,
            moveNumber: this.moveHistory.length + 1,
            timestamp: Date.now()
        };
        this.moveHistory.push(move);

        // 检查是否获胜
        if (this.gameLogic.checkWinner(this.board, row, col, this.currentPlayer)) {
            this.gameStatus = 'won';
            this.winner = this.currentPlayer;
        } else if (this.gameLogic.checkDraw(this.board)) {
            this.gameStatus = 'draw';
        } else {
            // 切换玩家
            this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        }

        return true;
    }

    /**
     * 悔棋
     * @returns {boolean} 是否成功悔棋
     */
    undo() {
        if (this.moveHistory.length === 0) {
            return false; // 没有可悔的棋
        }

        if (this.gameStatus !== 'playing') {
            return false; // 游戏已结束，无法悔棋
        }

        const lastMove = this.moveHistory.pop();
        this.board[lastMove.row][lastMove.col] = null;
        this.currentPlayer = lastMove.player;

        return true;
    }

    /**
     * 获取棋盘状态的副本
     * @returns {Array<Array<string|null>>} 棋盘状态副本
     */
    getBoardCopy() {
        return this.board.map(row => [...row]);
    }

    /**
     * 获取指定位置的棋子
     * @param {number} row - 行坐标
     * @param {number} col - 列坐标
     * @returns {string|null} 棋子类型或null
     */
    getPiece(row, col) {
        if (row < 0 || row >= this.boardSize || col < 0 || col >= this.boardSize) {
            return null;
        }
        return this.board[row][col];
    }

    /**
     * 获取当前玩家
     * @returns {string} 当前玩家
     */
    getCurrentPlayer() {
        return this.currentPlayer;
    }

    /**
     * 获取游戏状态
     * @returns {string} 游戏状态
     */
    getGameStatus() {
        return this.gameStatus;
    }

    /**
     * 获取获胜者
     * @returns {string|null} 获胜者或null
     */
    getWinner() {
        return this.winner;
    }

    /**
     * 获取移动历史
     * @returns {Array<Object>} 移动历史记录
     */
    getMoveHistory() {
        return [...this.moveHistory];
    }

    /**
     * 获取最后一步移动
     * @returns {Object|null} 最后一步移动或null
     */
    getLastMove() {
        return this.moveHistory.length > 0 ? 
               this.moveHistory[this.moveHistory.length - 1] : null;
    }

    /**
     * 检查指定位置是否为空
     * @param {number} row - 行坐标
     * @param {number} col - 列坐标
     * @returns {boolean} 是否为空
     */
    isEmpty(row, col) {
        return this.getPiece(row, col) === null;
    }

    /**
     * 获取棋盘大小
     * @returns {number} 棋盘大小
     */
    getBoardSize() {
        return this.boardSize;
    }
}

// 导出到全局
window.GameBoard = GameBoard;