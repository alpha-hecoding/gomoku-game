/**
 * 工具函数集合
 * 提供各种辅助功能
 */

/**
 * 深拷贝对象
 * @param {*} obj - 要拷贝的对象
 * @returns {*} 拷贝后的对象
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
        return obj.map(item => deepClone(item));
    }
    
    if (typeof obj === 'object') {
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = deepClone(obj[key]);
            }
        }
        return cloned;
    }
    
    return obj;
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            return func.apply(this, args);
        }
    };
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * 格式化时间
 * @param {number} timestamp - 时间戳
 * @param {string} format - 格式字符串
 * @returns {string} 格式化后的时间
 */
function formatTime(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}

/**
 * 生成唯一ID
 * @param {string} prefix - ID前缀
 * @returns {string} 唯一ID
 */
function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 检查是否为移动设备
 * @returns {boolean} 是否为移动设备
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * 获取本地存储数据
 * @param {string} key - 存储键
 * @param {*} defaultValue - 默认值
 * @returns {*} 存储的数据
 */
function getLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('读取本地存储失败:', error);
        return defaultValue;
    }
}

/**
 * 设置本地存储数据
 * @param {string} key - 存储键
 * @param {*} value - 要存储的数据
 * @returns {boolean} 是否成功
 */
function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('写入本地存储失败:', error);
        return false;
    }
}

/**
 * 移除本地存储数据
 * @param {string} key - 存储键
 * @returns {boolean} 是否成功
 */
function removeLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('删除本地存储失败:', error);
        return false;
    }
}

/**
 * 将棋盘坐标转换为显示坐标
 * @param {number} row - 行坐标 (0-14)
 * @param {number} col - 列坐标 (0-14)
 * @returns {string} 显示坐标 (如 "A1", "H8")
 */
function boardToDisplayCoords(row, col) {
    const letters = 'ABCDEFGHIJKLMNO';
    const letter = letters[col];
    const number = 15 - row; // 棋盘从下往上编号
    return `${letter}${number}`;
}

/**
 * 将显示坐标转换为棋盘坐标
 * @param {string} displayCoords - 显示坐标 (如 "A1", "H8")
 * @returns {Object|null} 棋盘坐标 {row, col} 或 null
 */
function displayToBoardCoords(displayCoords) {
    const match = displayCoords.match(/^([A-O])([1-9]|1[0-5])$/i);
    if (!match) return null;

    const letter = match[1].toUpperCase();
    const number = parseInt(match[2]);

    const col = 'ABCDEFGHIJKLMNO'.indexOf(letter);
    const row = 15 - number;

    if (col === -1 || row < 0 || row >= 15) return null;

    return { row, col };
}

/**
 * 计算两点之间的距离
 * @param {number} x1 - 第一个点的x坐标
 * @param {number} y1 - 第一个点的y坐标
 * @param {number} x2 - 第二个点的x坐标
 * @param {number} y2 - 第二个点的y坐标
 * @returns {number} 距离
 */
function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * 限制数值在指定范围内
 * @param {number} value - 要限制的值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 限制后的值
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * 随机获取数组中的元素
 * @param {Array} array - 数组
 * @returns {*} 随机元素
 */
function getRandomElement(array) {
    if (!array || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * 打乱数组
 * @param {Array} array - 要打乱的数组
 * @returns {Array} 打乱后的数组
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * 检查颜色是否为浅色
 * @param {string} color - 颜色值（十六进制）
 * @returns {boolean} 是否为浅色
 */
function isLightColor(color) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
}

/**
 * 导出工具函数到全局
 */
window.Helpers = {
    deepClone,
    throttle,
    debounce,
    formatTime,
    generateId,
    isMobileDevice,
    getLocalStorage,
    setLocalStorage,
    removeLocalStorage,
    boardToDisplayCoords,
    displayToBoardCoords,
    calculateDistance,
    clamp,
    getRandomElement,
    shuffleArray,
    isLightColor
};