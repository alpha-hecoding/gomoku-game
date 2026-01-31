/**
 * 游戏控制器类
 * 协调游戏逻辑、棋盘状态和用户界面
 */
class GameController {
    constructor() {
        this.gameBoard = new GameBoard();
        this.uiRenderer = null;
        this.eventManager = null;
        this.isInitialized = false;
    }

    /**
     * 初始化游戏控制器
     * @param {UIRenderer} uiRenderer - UI渲染器
     * @param {EventManager} eventManager - 事件管理器
     */
    initialize(uiRenderer, eventManager) {
        this.uiRenderer = uiRenderer;
        this.eventManager = eventManager;
        
        // 绑定事件处理器
        this._bindEventHandlers();
        
        // 初始化UI
        this.uiRenderer.renderBoard(this.gameBoard);
        this.uiRenderer.updateGameInfo(this.gameBoard);
        this.uiRenderer.renderMoveHistory(this.gameBoard.getMoveHistory());
        
        this.isInitialized = true;
    }

    /**
     * 绑定事件处理器
     * @private
     */
    _bindEventHandlers() {
        // 棋盘点击事件
        this.eventManager.on('boardClick', (row, col) => {
            this._handleBoardClick(row, col);
        });

        // 新游戏按钮事件
        this.eventManager.on('newGame', () => {
            this._handleNewGame();
        });

        // 悔棋按钮事件
        this.eventManager.on('undo', () => {
            this._handleUndo();
        });

        // 重新开始按钮事件
        this.eventManager.on('restart', () => {
            this._handleRestart();
        });
    }

    /**
     * 处理棋盘点击
     * @private
     * @param {number} row - 行坐标
     * @param {number} col - 列坐标
     */
    _handleBoardClick(row, col) {
        try {
            // 尝试下棋
            const success = this.gameBoard.makeMove(row, col);
            
            if (success) {
                // 更新UI
                this.uiRenderer.renderBoard(this.gameBoard);
                this.uiRenderer.updateGameInfo(this.gameBoard);
                this.uiRenderer.renderMoveHistory(this.gameBoard.getMoveHistory());

                // 检查游戏是否结束
                const gameStatus = this.gameBoard.getGameStatus();
                if (gameStatus === 'won') {
                    this._handleGameWon();
                } else if (gameStatus === 'draw') {
                    this._handleGameDraw();
                }
            }
        } catch (error) {
            // 显示错误信息
            this.uiRenderer.showErrorMessage(error.message);
        }
    }

    /**
     * 处理新游戏
     * @private
     */
    _handleNewGame() {
        this.gameBoard.reset();
        this.uiRenderer.renderBoard(this.gameBoard);
        this.uiRenderer.updateGameInfo(this.gameBoard);
        this.uiRenderer.renderMoveHistory(this.gameBoard.getMoveHistory());
        this.uiRenderer.clearMessages();
    }

    /**
     * 处理悔棋
     * @private
     */
    _handleUndo() {
        const success = this.gameBoard.undo();
        if (success) {
            this.uiRenderer.renderBoard(this.gameBoard);
            this.uiRenderer.updateGameInfo(this.gameBoard);
            this.uiRenderer.renderMoveHistory(this.gameBoard.getMoveHistory());
        } else {
            this.uiRenderer.showErrorMessage('无法悔棋');
        }
    }

    /**
     * 处理重新开始
     * @private
     */
    _handleRestart() {
        if (confirm('确定要重新开始游戏吗？')) {
            this._handleNewGame();
        }
    }

    /**
     * 处理游戏获胜
     * @private
     */
    _handleGameWon() {
        const winner = this.gameBoard.getWinner();
        const winnerName = winner === 'black' ? '黑子' : '白子';
        this.uiRenderer.showWinMessage(winnerName);
    }

    /**
     * 处理游戏平局
     * @private
     */
    _handleGameDraw() {
        this.uiRenderer.showDrawMessage();
    }

    /**
     * 获取游戏状态信息
     * @returns {Object} 游戏状态信息
     */
    getGameState() {
        return {
            currentPlayer: this.gameBoard.getCurrentPlayer(),
            gameStatus: this.gameBoard.getGameStatus(),
            winner: this.gameBoard.getWinner(),
            moveCount: this.gameBoard.getMoveHistory().length,
            lastMove: this.gameBoard.getLastMove()
        };
    }

    /**
     * 暂停游戏
     */
    pause() {
        // 可以实现游戏暂停逻辑
        this.uiRenderer.showInfoMessage('游戏已暂停');
    }

    /**
     * 恢复游戏
     */
    resume() {
        // 可以实现游戏恢复逻辑
        this.uiRenderer.clearMessages();
    }

    /**
     * 保存游戏状态
     * @returns {string} 游戏状态的JSON字符串
     */
    saveGame() {
        const gameState = {
            board: this.gameBoard.getBoardCopy(),
            moveHistory: this.gameBoard.getMoveHistory(),
            currentPlayer: this.gameBoard.getCurrentPlayer(),
            gameStatus: this.gameBoard.getGameStatus(),
            winner: this.gameBoard.getWinner(),
            timestamp: Date.now()
        };
        return JSON.stringify(gameState);
    }

    /**
     * 加载游戏状态
     * @param {string} gameStateJson - 游戏状态的JSON字符串
     * @returns {boolean} 是否成功加载
     */
    loadGame(gameStateJson) {
        try {
            const gameState = JSON.parse(gameStateJson);
            
            // 恢复棋盘状态
            this.gameBoard.board = gameState.board;
            this.gameBoard.moveHistory = gameState.moveHistory;
            this.gameBoard.currentPlayer = gameState.currentPlayer;
            this.gameBoard.gameStatus = gameState.gameStatus;
            this.gameBoard.winner = gameState.winner;

            // 更新UI
            this.uiRenderer.renderBoard(this.gameBoard);
            this.uiRenderer.updateGameInfo(this.gameBoard);
            this.uiRenderer.renderMoveHistory(this.gameBoard.getMoveHistory());

            return true;
        } catch (error) {
            this.uiRenderer.showErrorMessage('加载游戏失败');
            return false;
        }
    }
}

// 导出到全局
window.GameController = GameController;