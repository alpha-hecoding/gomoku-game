/**
 * UI渲染器类
 * 负责渲染游戏界面、更新显示状态
 */
class UIRenderer {
    constructor() {
        this.canvas = document.getElementById('game-board');
        this.ctx = this.canvas.getContext('2d');
        this.boardSize = 15;
        this.cellSize = 40;
        this.padding = 20;
        this.boardPixelSize = this.cellSize * (this.boardSize - 1);
        this.canvasSize = this.boardPixelSize + this.padding * 2;
        
        // 设置画布大小
        this.canvas.width = this.canvasSize;
        this.canvas.height = this.canvasSize;
        
        // 颜色配置
        this.colors = {
            board: '#DEB887',        // 棋盘颜色
            grid: '#8B4513',         // 网格线颜色
            black: '#000000',        // 黑子颜色
            white: '#FFFFFF',        // 白子颜色
            lastMove: '#FF0000',     // 最后一步标记颜色
            hover: 'rgba(255, 0, 0, 0.3)'  // 悬停颜色
        };

        // UI元素
        this.elements = {
            currentPlayer: document.getElementById('current-player'),
            gameStatus: document.getElementById('game-status'),
            moveList: document.getElementById('move-list')
        };
    }

    /**
     * 渲染整个棋盘
     * @param {GameBoard} gameBoard - 游戏棋盘对象
     */
    renderBoard(gameBoard) {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        
        // 绘制棋盘背景
        this._drawBoard();
        
        // 绘制棋子
        this._drawPieces(gameBoard);
        
        // 标记最后一步
        this._markLastMove(gameBoard);
    }

    /**
     * 绘制棋盘背景和网格
     * @private
     */
    _drawBoard() {
        // 绘制棋盘背景
        this.ctx.fillStyle = this.colors.board;
        this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);

        // 绘制网格线
        this.ctx.strokeStyle = this.colors.grid;
        this.ctx.lineWidth = 1;

        for (let i = 0; i < this.boardSize; i++) {
            // 垂直线
            const x = this.padding + i * this.cellSize;
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.padding);
            this.ctx.lineTo(x, this.canvasSize - this.padding);
            this.ctx.stroke();

            // 水平线
            const y = this.padding + i * this.cellSize;
            this.ctx.beginPath();
            this.ctx.moveTo(this.padding, y);
            this.ctx.lineTo(this.canvasSize - this.padding, y);
            this.ctx.stroke();
        }

        // 绘制星位（天元和四个角的星位）
        this._drawStarPoints();
    }

    /**
     * 绘制星位
     * @private
     */
    _drawStarPoints() {
        const starPoints = [
            [3, 3], [3, 11], [11, 3], [11, 11], [7, 7] // 五个星位
        ];

        this.ctx.fillStyle = this.colors.grid;
        starPoints.forEach(([row, col]) => {
            const x = this.padding + col * this.cellSize;
            const y = this.padding + row * this.cellSize;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
            this.ctx.fill();
        });
    }

    /**
     * 绘制所有棋子
     * @private
     * @param {GameBoard} gameBoard - 游戏棋盘对象
     */
    _drawPieces(gameBoard) {
        const board = gameBoard.getBoardCopy();
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const piece = board[row][col];
                if (piece) {
                    this._drawPiece(row, col, piece);
                }
            }
        }
    }

    /**
     * 绘制单个棋子
     * @private
     * @param {number} row - 行坐标
     * @param {number} col - 列坐标
     * @param {string} color - 棋子颜色 ('black' 或 'white')
     */
    _drawPiece(row, col, color) {
        const x = this.padding + col * this.cellSize;
        const y = this.padding + row * this.cellSize;
        const radius = this.cellSize * 0.4;

        // 绘制棋子阴影
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 4;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;

        // 绘制棋子
        this.ctx.fillStyle = this.colors[color];
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();

        // 重置阴影
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;

        // 为白子添加边框
        if (color === 'white') {
            this.ctx.strokeStyle = '#333333';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }

        // 添加高光效果
        this._addPieceHighlight(x, y, radius, color);
    }

    /**
     * 添加棋子高光效果
     * @private
     */
    _addPieceHighlight(x, y, radius, color) {
        const gradient = this.ctx.createRadialGradient(
            x - radius/3, y - radius/3, 0,
            x, y, radius
        );
        
        if (color === 'black') {
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
        } else {
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            gradient.addColorStop(1, 'rgba(200, 200, 200, 0.8)');
        }

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * 0.8, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    /**
     * 标记最后一步
     * @private
     * @param {GameBoard} gameBoard - 游戏棋盘对象
     */
    _markLastMove(gameBoard) {
        const lastMove = gameBoard.getLastMove();
        if (!lastMove) return;

        const x = this.padding + lastMove.col * this.cellSize;
        const y = this.padding + lastMove.row * this.cellSize;

        this.ctx.strokeStyle = this.colors.lastMove;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.cellSize * 0.2, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    /**
     * 更新游戏信息显示
     * @param {GameBoard} gameBoard - 游戏棋盘对象
     */
    updateGameInfo(gameBoard) {
        const currentPlayer = gameBoard.getCurrentPlayer();
        const gameStatus = gameBoard.getGameStatus();
        const winner = gameBoard.getWinner();

        // 更新当前玩家
        this.elements.currentPlayer.textContent = 
            currentPlayer === 'black' ? '黑子' : '白子';

        // 更新游戏状态
        if (gameStatus === 'playing') {
            this.elements.gameStatus.textContent = '游戏进行中';
            this.elements.gameStatus.className = 'game-status playing';
        } else if (gameStatus === 'won') {
            const winnerName = winner === 'black' ? '黑子' : '白子';
            this.elements.gameStatus.textContent = `${winnerName}获胜！`;
            this.elements.gameStatus.className = 'game-status won';
        } else if (gameStatus === 'draw') {
            this.elements.gameStatus.textContent = '平局！';
            this.elements.gameStatus.className = 'game-status draw';
        }
    }

    /**
     * 渲染移动历史
     * @param {Array} moveHistory - 移动历史记录
     */
    renderMoveHistory(moveHistory) {
        this.elements.moveList.innerHTML = '';
        
        if (moveHistory.length === 0) {
            this.elements.moveList.innerHTML = '<p>暂无移动记录</p>';
            return;
        }

        moveHistory.forEach((move, index) => {
            const moveElement = document.createElement('div');
            moveElement.className = 'move-item';
            
            const playerName = move.player === 'black' ? '黑子' : '白子';
            const position = `${String.fromCharCode(65 + move.col)}${15 - move.row}`;
            
            moveElement.innerHTML = `
                <span class="move-number">${move.moveNumber}.</span>
                <span class="move-player">${playerName}</span>
                <span class="move-position">${position}</span>
            `;
            
            this.elements.moveList.appendChild(moveElement);
        });

        // 滚动到最新的移动
        this.elements.moveList.scrollTop = this.elements.moveList.scrollHeight;
    }

    /**
     * 显示获胜消息
     * @param {string} winner - 获胜者
     */
    showWinMessage(winner) {
        this.showMessage(`恭喜${winner}获胜！`, 'success');
    }

    /**
     * 显示平局消息
     */
    showDrawMessage() {
        this.showMessage('游戏平局！', 'info');
    }

    /**
     * 显示错误消息
     * @param {string} message - 错误消息
     */
    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    /**
     * 显示信息消息
     * @param {string} message - 信息消息
     */
    showInfoMessage(message) {
        this.showMessage(message, 'info');
    }

    /**
     * 显示消息
     * @private
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型
     */
    showMessage(message, type) {
        // 创建消息元素
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;

        // 添加到页面
        document.body.appendChild(messageElement);

        // 3秒后自动移除
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 3000);
    }

    /**
     * 清除所有消息
     */
    clearMessages() {
        const messages = document.querySelectorAll('.message');
        messages.forEach(msg => msg.remove());
    }

    /**
     * 将像素坐标转换为棋盘坐标
     * @param {number} pixelX - 像素X坐标
     * @param {number} pixelY - 像素Y坐标
     * @returns {Object} 棋盘坐标 {row, col} 或 null
     */
    pixelToBoard(pixelX, pixelY) {
        // 获取画布在页面中的位置
        const rect = this.canvas.getBoundingClientRect();
        const x = pixelX - rect.left;
        const y = pixelY - rect.top;

        // 计算棋盘坐标
        const col = Math.round((x - this.padding) / this.cellSize);
        const row = Math.round((y - this.padding) / this.cellSize);

        // 验证坐标是否有效
        if (row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize) {
            return { row, col };
        }

        return null;
    }
}

// 导出到全局
window.UIRenderer = UIRenderer;