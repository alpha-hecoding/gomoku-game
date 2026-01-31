/**
 * 事件管理器类
 * 处理用户交互事件和系统事件
 */
class EventManager {
    constructor() {
        this.eventListeners = new Map();
        this.canvas = document.getElementById('game-board');
        this.uiRenderer = null;
        this.gameBoard = null;
        
        // 鼠标状态
        this.mousePosition = { x: 0, y: 0 };
        this.isHovering = false;
        this.hoveredCell = null;
    }

    /**
     * 初始化事件管理器
     * @param {UIRenderer} uiRenderer - UI渲染器
     * @param {GameBoard} gameBoard - 游戏棋盘
     */
    initialize(uiRenderer, gameBoard) {
        this.uiRenderer = uiRenderer;
        this.gameBoard = gameBoard;
        
        // 绑定DOM事件
        this._bindDOMEvents();
        
        // 绑定按钮事件
        this._bindButtonEvents();
        
        // 绑定键盘事件
        this._bindKeyboardEvents();
    }

    /**
     * 绑定DOM事件
     * @private
     */
    _bindDOMEvents() {
        // 画布点击事件
        this.canvas.addEventListener('click', (event) => {
            this._handleCanvasClick(event);
        });

        // 画布鼠标移动事件
        this.canvas.addEventListener('mousemove', (event) => {
            this._handleCanvasMouseMove(event);
        });

        // 画布鼠标进入事件
        this.canvas.addEventListener('mouseenter', () => {
            this._handleCanvasMouseEnter();
        });

        // 画布鼠标离开事件
        this.canvas.addEventListener('mouseleave', () => {
            this._handleCanvasMouseLeave();
        });

        // 阻止右键菜单
        this.canvas.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });
    }

    /**
     * 绑定按钮事件
     * @private
     */
    _bindButtonEvents() {
        // 新游戏按钮
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.emit('newGame');
        });

        // 悔棋按钮
        document.getElementById('undo-btn').addEventListener('click', () => {
            this.emit('undo');
        });

        // 重新开始按钮
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.emit('restart');
        });
    }

    /**
     * 绑定键盘事件
     * @private
     */
    _bindKeyboardEvents() {
        document.addEventListener('keydown', (event) => {
            this._handleKeyDown(event);
        });
    }

    /**
     * 处理画布点击事件
     * @private
     * @param {MouseEvent} event - 鼠标事件
     */
    _handleCanvasClick(event) {
        const boardCoords = this.uiRenderer.pixelToBoard(
            event.clientX, 
            event.clientY
        );
        
        if (boardCoords) {
            this.emit('boardClick', boardCoords.row, boardCoords.col);
        }
    }

    /**
     * 处理画布鼠标移动事件
     * @private
     * @param {MouseEvent} event - 鼠标事件
     */
    _handleCanvasMouseMove(event) {
        const boardCoords = this.uiRenderer.pixelToBoard(
            event.clientX, 
            event.clientY
        );
        
        this.mousePosition = { x: event.clientX, y: event.clientY };
        
        if (boardCoords) {
            // 检查是否是新的悬停位置
            if (!this.hoveredCell || 
                this.hoveredCell.row !== boardCoords.row || 
                this.hoveredCell.col !== boardCoords.col) {
                
                this.hoveredCell = boardCoords;
                this.isHovering = true;
                
                // 更新光标样式
                this._updateCursor(boardCoords);
                
                // 触发悬停事件
                this.emit('boardHover', boardCoords.row, boardCoords.col);
            }
        } else {
            this._handleCanvasMouseLeave();
        }
    }

    /**
     * 处理画布鼠标进入事件
     * @private
     */
    _handleCanvasMouseEnter() {
        this.canvas.style.cursor = 'pointer';
    }

    /**
     * 处理画布鼠标离开事件
     * @private
     */
    _handleCanvasMouseLeave() {
        this.isHovering = false;
        this.hoveredCell = null;
        this.canvas.style.cursor = 'default';
        this.emit('boardHoverLeave');
    }

    /**
     * 更新光标样式
     * @private
     * @param {Object} boardCoords - 棋盘坐标
     */
    _updateCursor(boardCoords) {
        if (this.gameBoard.isEmpty(boardCoords.row, boardCoords.col)) {
            this.canvas.style.cursor = 'pointer';
        } else {
            this.canvas.style.cursor = 'not-allowed';
        }
    }

    /**
     * 处理键盘事件
     * @private
     * @param {KeyboardEvent} event - 键盘事件
     */
    _handleKeyDown(event) {
        // 阻止在输入框外的默认按键行为
        if (!['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
            switch (event.key.toLowerCase()) {
                case 'z':
                    if (event.ctrlKey || event.metaKey) {
                        // Ctrl+Z 悔棋
                        event.preventDefault();
                        this.emit('undo');
                    }
                    break;
                case 'n':
                    if (event.ctrlKey || event.metaKey) {
                        // Ctrl+N 新游戏
                        event.preventDefault();
                        this.emit('newGame');
                    }
                    break;
                case 'r':
                    if (event.ctrlKey || event.metaKey) {
                        // Ctrl+R 重新开始
                        event.preventDefault();
                        this.emit('restart');
                    }
                    break;
                case 'escape':
                    // ESC 清除消息
                    this.uiRenderer.clearMessages();
                    break;
            }
        }
    }

    /**
     * 添加事件监听器
     * @param {string} eventName - 事件名称
     * @param {Function} callback - 回调函数
     */
    on(eventName, callback) {
        if (!this.eventListeners.has(eventName)) {
            this.eventListeners.set(eventName, []);
        }
        this.eventListeners.get(eventName).push(callback);
    }

    /**
     * 移除事件监听器
     * @param {string} eventName - 事件名称
     * @param {Function} callback - 回调函数
     */
    off(eventName, callback) {
        if (this.eventListeners.has(eventName)) {
            const listeners = this.eventListeners.get(eventName);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    /**
     * 触发事件
     * @param {string} eventName - 事件名称
     * @param {...any} args - 事件参数
     */
    emit(eventName, ...args) {
        if (this.eventListeners.has(eventName)) {
            this.eventListeners.get(eventName).forEach(callback => {
                try {
                    callback(...args);
                } catch (error) {
                    console.error(`事件处理错误 (${eventName}):`, error);
                }
            });
        }
    }

    /**
     * 获取当前鼠标位置
     * @returns {Object} 鼠标位置 {x, y}
     */
    getMousePosition() {
        return { ...this.mousePosition };
    }

    /**
     * 获取当前悬停的棋盘格子
     * @returns {Object|null} 悬停格子坐标 {row, col} 或 null
     */
    getHoveredCell() {
        return this.hoveredCell ? { ...this.hoveredCell } : null;
    }

    /**
     * 检查是否正在悬停
     * @returns {boolean} 是否悬停
     */
    isCurrentlyHovering() {
        return this.isHovering;
    }

    /**
     * 启用触摸支持
     */
    enableTouchSupport() {
        // 触摸开始事件
        this.canvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            const touch = event.touches[0];
            const boardCoords = this.uiRenderer.pixelToBoard(
                touch.clientX, 
                touch.clientY
            );
            
            if (boardCoords) {
                this.emit('boardClick', boardCoords.row, boardCoords.col);
            }
        });

        // 触摸移动事件
        this.canvas.addEventListener('touchmove', (event) => {
            event.preventDefault();
        });
    }

    /**
     * 销毁事件管理器
     */
    destroy() {
        // 清理事件监听器
        this.eventListeners.clear();
        
        // 清理DOM事件监听器
        // 注意：实际应用中可能需要保存对事件处理函数的引用以便移除
        this.canvas.removeEventListener('click', this._handleCanvasClick);
        this.canvas.removeEventListener('mousemove', this._handleCanvasMouseMove);
        this.canvas.removeEventListener('mouseenter', this._handleCanvasMouseEnter);
        this.canvas.removeEventListener('mouseleave', this._handleCanvasMouseLeave);
        
        // 清理按钮事件
        document.getElementById('new-game-btn').removeEventListener('click', () => {});
        document.getElementById('undo-btn').removeEventListener('click', () => {});
        document.getElementById('restart-btn').removeEventListener('click', () => {});
        
        // 清理键盘事件
        document.removeEventListener('keydown', this._handleKeyDown);
    }
}

// 导出到全局
window.EventManager = EventManager;