/**
 * 游戏核心逻辑类
 * 处理五子棋的规则验证、胜利判定等核心功能
 */
class GameLogic {
    constructor() {
        this.BOARD_SIZE = 15; // 棋盘大小 15x15
        this.WINNING_LENGTH = 5; // 连成五子获胜
    }

    /**
     * 验证移动是否有效
     * @param {Array<Array<string|null>>} board - 棋盘状态
     * @param {number} row - 行坐标
     * @param {number} col - 列坐标
     * @returns {boolean} 是否有效
     */
    isValidMove(board, row, col) {
        // 检查坐标是否在棋盘范围内
        if (row < 0 || row >= this.BOARD_SIZE || col < 0 || col >= this.BOARD_SIZE) {
            return false;
        }
        
        // 检查位置是否为空
        return board[row][col] === null;
    }

    /**
     * 检查是否获胜
     * @param {Array<Array<string|null>>} board - 棋盘状态
     * @param {number} row - 最后一步的行坐标
     * @param {number} col - 最后一步的列坐标
     * @param {string} player - 当前玩家 ('black' 或 'white')
     * @returns {boolean} 是否获胜
     */
    checkWinner(board, row, col, player) {
        // 四个方向：水平、垂直、对角线1、对角线2
        const directions = [
            [[0, 1], [0, -1]],   // 水平
            [[1, 0], [-1, 0]],   // 垂直
            [[1, 1], [-1, -1]],  // 对角线1
            [[1, -1], [-1, 1]]   // 对角线2
        ];

        for (const direction of directions) {
            let count = 1; // 包含当前落子

            // 检查两个相反方向
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

    /**
     * 检查游戏是否平局
     * @param {Array<Array<string|null>>} board - 棋盘状态
     * @returns {boolean} 是否平局
     */
    checkDraw(board) {
        for (let row = 0; row < this.BOARD_SIZE; row++) {
            for (let col = 0; col < this.BOARD_SIZE; col++) {
                if (board[row][col] === null) {
                    return false; // 还有空位，未平局
                }
            }
        }
        return true; // 棋盘已满，平局
    }

    /**
     * 获取所有有效的移动位置
     * @param {Array<Array<string|null>>} board - 棋盘状态
     * @returns {Array<{row: number, col: number}>} 有效移动位置列表
     */
    getValidMoves(board) {
        const validMoves = [];
        for (let row = 0; row < this.BOARD_SIZE; row++) {
            for (let col = 0; col < this.BOARD_SIZE; col++) {
                if (this.isValidMove(board, row, col)) {
                    validMoves.push({ row, col });
                }
            }
        }
        return validMoves;
    }

    /**
     * 评估当前位置的分数（用于AI）
     * @param {Array<Array<string|null>>} board - 棋盘状态
     * @param {number} row - 行坐标
     * @param {number} col - 列坐标
     * @param {string} player - 玩家
     * @returns {number} 位置分数
     */
    evaluatePosition(board, row, col, player) {
        // 简单的评估函数，可以根据需要扩展
        let score = 0;
        const opponent = player === 'black' ? 'white' : 'black';

        // 中心位置优先
        const centerDistance = Math.abs(row - 7) + Math.abs(col - 7);
        score += (14 - centerDistance) * 2;

        // 检查是否能形成连子
        score += this._countConsecutive(board, row, col, player) * 10;

        // 阻止对手连子
        score += this._countConsecutive(board, row, col, opponent) * 5;

        return score;
    }

    /**
     * 计算某个位置的连续棋子数
     * @private
     */
    _countConsecutive(board, row, col, player) {
        // 这里可以实现更复杂的连子计算逻辑
        // 暂时返回基础值
        return 1;
    }
}

// 导出到全局
window.GameLogic = GameLogic;