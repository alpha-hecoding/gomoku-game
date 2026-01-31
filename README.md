# 五子棋游戏 (Gomoku Game)

一个使用纯JavaScript开发的经典五子棋游戏，支持人机对战和双人对战模式。

## 🎮 游戏特性

- 🎯 经典五子棋规则
- 👥 支持双人对战模式
- 🤖 支持人机对战（AI）
- 📱 响应式设计，支持移动端
- 🎨 现代化UI界面
- ⚡ 实时游戏状态更新

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm start
```
游戏将在 http://localhost:8000 启动

### 运行测试
```bash
npm test
```

## 🎯 游戏规则

1. 黑棋先行，白棋后行
2. 双方轮流在棋盘上下棋
3. 先连成五子（横、竖、斜）的一方获胜
4. 棋盘为15×15规格

## 📁 项目结构

```
gomoku-game/
├── src/
│   ├── game/               # 游戏核心逻辑
│   │   ├── GameBoard.js    # 棋盘管理
│   │   ├── GameController.js # 游戏控制器
│   │   └── GameLogic.js    # 游戏规则逻辑
│   ├── ui/                 # 用户界面
│   │   ├── EventManager.js # 事件管理
│   │   └── UIRenderer.js   # UI渲染
│   ├── utils/              # 工具函数
│   │   └── helpers.js      # 辅助函数
│   └── main.js             # 应用入口
├── tests/                  # 测试文件
├── public/                 # 静态资源
├── styles.css              # 样式文件
└── index.html              # 主页面
```

## 🛠️ 开发指南

### 可用脚本

```bash
# 启动开发服务器
npm start

# 运行测试
npm test

# 监听模式运行测试
npm run test:watch

# 生成测试覆盖率报告
npm run test:coverage

# 代码检查
npm run lint

# 自动修复代码格式问题
npm run lint:fix

# 类型检查
npm run type-check
```

### 代码规范

- 使用ES6+语法
- 遵循驼峰命名规范
- 函数名使用动词开头
- 组件名使用大驼峰命名
- 编写单元测试覆盖核心逻辑

## 🎮 游戏操作

- **鼠标点击**：在棋盘上下棋
- **重新开始**：点击重新开始按钮
- **悔棋**：点击悔棋按钮（开发中）
- **切换模式**：选择人机对战或双人对战

## 🧪 测试

项目使用Jest进行单元测试，测试文件位于`tests/`目录：

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test tests/game.test.js

# 生成覆盖率报告
npm run test:coverage
```

## 📱 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🎯 未来计划

- [ ] 添加AI难度级别
- [ ] 实现在线对战功能
- [ ] 添加游戏回放功能
- [ ] 支持自定义棋盘大小
- [ ] 添加音效和动画
- [ ] 实现游戏统计分析

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](https://github.com/alpha-hecoding/gomoku-game/issues)
- 发送邮件到：[你的邮箱]

---

⭐ 如果这个项目对你有帮助，请给它一个星标！