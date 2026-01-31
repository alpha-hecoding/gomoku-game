/**
 * 主程序入口
 * 初始化游戏并启动
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    console.log('五子棋游戏启动中...');
    
    // 创建游戏组件
    const uiRenderer = new UIRenderer();
    const eventManager = new EventManager();
    const gameController = new GameController();
    
    try {
        // 初始化游戏控制器
        gameController.initialize(uiRenderer, eventManager);
        
        // 初始化事件管理器
        eventManager.initialize(uiRenderer, gameController.gameBoard);
        
        // 如果是移动设备，启用触摸支持
        if (Helpers.isMobileDevice()) {
            eventManager.enableTouchSupport();
            console.log('已启用触摸支持');
        }
        
        // 加载保存的游戏（如果存在）
        const savedGame = Helpers.getLocalStorage('gomoku_save_game');
        if (savedGame) {
            const shouldLoad = confirm('检测到未完成的游戏，是否继续？');
            if (shouldLoad) {
                gameController.loadGame(savedGame);
            }
        }
        
        // 定期保存游戏状态
        setInterval(() => {
            const gameState = gameController.saveGame();
            Helpers.setLocalStorage('gomoku_save_game', gameState);
        }, 5000); // 每5秒保存一次
        
        // 添加窗口关闭前的保存
        window.addEventListener('beforeunload', () => {
            const gameState = gameController.saveGame();
            Helpers.setLocalStorage('gomoku_save_game', gameState);
        });
        
        console.log('游戏初始化完成');
        
        // 显示欢迎消息
        setTimeout(() => {
            uiRenderer.showInfoMessage('欢迎来到五子棋游戏！');
        }, 500);
        
    } catch (error) {
        console.error('游戏初始化失败:', error);
        uiRenderer.showErrorMessage('游戏初始化失败，请刷新页面重试');
    }
});

// 全局错误处理
window.addEventListener('error', (event) => {
    console.error('全局错误:', event.error);
});

// 全局未处理的Promise错误
window.addEventListener('unhandledrejection', (event) => {
    console.error('未处理的Promise错误:', event.reason);
});

// 导出全局游戏实例（用于调试）
window.GameInstance = {
    getGameState: () => {
        const gameController = window.gameController;
        return gameController ? gameController.getGameState() : null;
    },
    
    resetGame: () => {
        const gameController = window.gameController;
        if (gameController) {
            gameController._handleNewGame();
        }
    },
    
    saveGame: () => {
        const gameController = window.gameController;
        return gameController ? gameController.saveGame() : null;
    },
    
    loadGame: (gameState) => {
        const gameController = window.gameController;
        return gameController ? gameController.loadGame(gameState) : false;
    }
};