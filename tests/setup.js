// Jest 测试环境设置
global.console = {
    ...console,
    // 在测试中静默某些日志
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
};

// 模拟DOM环境
Object.defineProperty(window, 'location', {
    value: {
        href: 'http://localhost:8000',
        origin: 'http://localhost:8000'
    },
    writable: true
});

// 模拟localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};
global.localStorage = localStorageMock;

// 模拟requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 0));
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));