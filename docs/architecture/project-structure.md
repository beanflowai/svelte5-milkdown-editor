# 项目架构说明

## 📁 整体目录结构

```
svelte5-milkdown-editor/
├── docs/                           # 项目文档
│   ├── README.md                   # 总体开发计划
│   ├── phases/                     # 分阶段开发文档
│   │   ├── phase-1-setup.md        # Phase 1: 基础架构搭建
│   │   ├── phase-2-core.md         # Phase 2: 核心功能实现
│   │   ├── phase-3-advanced.md     # Phase 3: 高级功能
│   │   ├── phase-4-dx.md           # Phase 4: 开发体验优化
│   │   └── phase-5-testing.md      # Phase 5: 测试和发布
│   ├── architecture/               # 架构设计文档
│   │   ├── project-structure.md    # 项目结构说明（本文件）
│   │   ├── component-design.md     # 组件设计文档
│   │   └── state-management.md     # 状态管理设计
│   └── api/                        # API 设计文档
│       ├── components.md           # 组件 API
│       ├── composables.md          # Composables API
│       ├── types.md                # 类型定义
│       └── examples.md             # 使用示例
├── src/
│   ├── lib/                        # 库源代码
│   │   ├── components/             # Svelte 组件
│   │   │   ├── MilkdownProvider.svelte
│   │   │   ├── MilkdownEditor.svelte
│   │   │   ├── Toolbar.svelte
│   │   │   ├── ContextMenu.svelte
│   │   │   ├── ThemeSelector.svelte
│   │   │   ├── StatusBar.svelte
│   │   │   └── index.ts
│   │   ├── composables/            # 组合式函数
│   │   │   ├── useEditor.ts
│   │   │   ├── useEditorInstance.ts
│   │   │   ├── useEnhancedEditor.ts
│   │   │   └── index.ts
│   │   ├── types/                  # TypeScript 类型定义
│   │   │   ├── editor.ts
│   │   │   ├── provider.ts
│   │   │   ├── plugins.ts
│   │   │   ├── advanced.ts
│   │   │   └── index.ts
│   │   ├── utils/                  # 工具函数
│   │   │   ├── builder.ts
│   │   │   ├── plugin-registry.ts
│   │   │   └── index.ts
│   │   ├── themes/                 # 主题系统
│   │   │   ├── theme-manager.ts
│   │   │   ├── index.ts
│   │   │   └── styles/
│   │   │       ├── default.css
│   │   │       ├── nord.css
│   │   │       └── nord-light.css
│   │   ├── plugins/                # 内置插件
│   │   │   ├── common-plugins.ts
│   │   │   ├── index.ts
│   │   │   └── __tests__/
│   │   ├── dev-tools.ts            # 开发工具
│   │   └── index.ts                # 主导出文件
│   ├── test/                       # 测试配置和工具
│   │   ├── setup.ts
│   │   ├── __mocks__/
│   │   └── test-utils.ts
│   ├── examples/                   # 示例代码
│   │   ├── basic-example.svelte
│   │   ├── advanced-example.svelte
│   │   └── plugin-example.svelte
│   ├── routes/                     # SvelteKit 路由（开发用）
│   │   └── +page.svelte
│   └── app.html                    # HTML 模板
├── tests/                          # 测试文件
│   ├── unit/                       # 单元测试
│   ├── integration/                # 集成测试
│   └── e2e/                        # E2E 测试
├── .vscode/                        # VS Code 配置
│   ├── milkdown.code-snippets      # 代码片段
│   └── settings.json
├── .github/                        # GitHub 配置
│   └── workflows/                  # CI/CD 流水线
│       └── ci.yml
├── package.json                    # 项目配置
├── tsconfig.json                   # TypeScript 配置
├── vite.config.ts                  # Vite 配置
├── svelte.config.js                # Svelte 配置
├── vitest.config.ts                # 测试配置
├── playwright.config.ts            # E2E 测试配置
├── .gitignore                      # Git 忽略文件
├── .eslintrc.js                    # ESLint 配置
├── .prettierrc                     # Prettier 配置
├── LICENSE                         # 许可证
└── README.md                       # 项目说明
```

## 🏗️ 核心架构设计

### 分层架构

```
┌─────────────────────────────────────────────────────────┐
│                    用户应用层                              │
├─────────────────────────────────────────────────────────┤
│                    组件层 (Components)                      │
│  MilkdownProvider | MilkdownEditor | Toolbar | StatusBar   │
├─────────────────────────────────────────────────────────┤
│                  组合式函数层 (Composables)                  │
│        useEditor | useEditorInstance | useEnhancedEditor  │
├─────────────────────────────────────────────────────────┤
│                   工具函数层 (Utils)                        │
│        Builder | PluginRegistry | ThemeManager           │
├─────────────────────────────────────────────────────────┤
│                  类型定义层 (Types)                         │
│        Editor | Provider | Plugin | Advanced             │
├─────────────────────────────────────────────────────────┤
│                   Milkdown 核心层                           │
│        @milkdown/crepe | @milkdown/kit                   │
└─────────────────────────────────────────────────────────┘
```

### 模块依赖关系

```
components/
    ↓
composables/
    ↓
utils/
    ↓
types/
    ↓
milkdown packages
```

## 📦 模块详细说明

### 1. components/ - 组件模块

**职责**: 提供 Svelte 5 组件实现

**核心组件**:
- `MilkdownProvider.svelte`: 上下文提供者组件
- `MilkdownEditor.svelte`: 主编辑器组件
- `Toolbar.svelte`: 工具栏组件
- `ContextMenu.svelte`: 右键菜单组件
- `ThemeSelector.svelte`: 主题选择器组件
- `StatusBar.svelte`: 状态栏组件

**设计原则**:
- 使用 Svelte 5 的 runes 进行状态管理
- 组件职责单一，高内聚低耦合
- 支持插槽 (slots) 自定义内容
- 完善的 TypeScript 类型支持

### 2. composables/ - 组合式函数模块

**职责**: 提供可复用的编辑器逻辑

**核心函数**:
- `useEditor`: 基础编辑器管理
- `useEditorInstance`: 编辑器实例访问
- `useEnhancedEditor`: 增强编辑器功能

**设计原则**:
- 函数式编程思想
- 返回响应式状态和方法
- 支持自定义配置和回调
- 错误处理和边界情况

### 3. types/ - 类型定义模块

**职责**: 提供完整的 TypeScript 类型定义

**核心类型**:
- `editor.ts`: 编辑器相关类型
- `provider.ts`: 上下文提供者类型
- `plugins.ts`: 插件系统类型
- `advanced.ts`: 高级功能类型

**设计原则**:
- 严格的类型检查
- 完整的 API 类型覆盖
- 支持泛型和类型推导
- 类型守卫和验证函数

### 4. utils/ - 工具函数模块

**职责**: 提供通用工具和功能

**核心功能**:
- `builder.ts`: 编辑器构建器
- `plugin-registry.ts`: 插件注册管理
- 主题管理和样式处理

**设计原则**:
- 纯函数设计
- 可测试性
- 配置驱动
- 插件化架构

### 5. themes/ - 主题系统模块

**职责**: 提供主题管理功能

**核心功能**:
- 主题定义和管理
- 样式文件处理
- 动态主题切换
- 自定义主题支持

### 6. plugins/ - 插件模块

**职责**: 提供内置插件

**核心插件**:
- 常用格式化插件 (bold, italic, etc.)
- 内容插入插件 (image, link, table)
- 扩展功能插件

## 🔧 技术栈和依赖

### 核心依赖

```json
{
  "dependencies": {
    "@milkdown/crepe": "^7.17.1",      // Milkdown 核心编辑器
    "@milkdown/kit": "^7.17.1",        // Milkdown 工具包
    "@milkdown/theme-nord": "^7.17.1"  // Nord 主题
  },
  "peerDependencies": {
    "svelte": "^5.0.0"                 // Svelte 5
  }
}
```

### 开发依赖

- **构建工具**: Vite, SvelteKit
- **类型检查**: TypeScript, svelte-check
- **测试工具**: Vitest, Playwright
- **代码质量**: ESLint, Prettier
- **文档生成**: TypeDoc

## 🎯 设计原则

### 1. Svelte 5 原生支持

充分利用 Svelte 5 的新特性：
- **Runes**: 使用 `$state`, `$derived`, `$effect` 进行状态管理
- **Snippets**: 提供灵活的内容渲染
- **事件处理**: 新的事件处理器语法
- **性能优化**: 利用 Svelte 5 的性能改进

### 2. 类型安全

- 完整的 TypeScript 类型定义
- 严格的类型检查
- 类型守卫和验证
- JSDoc 注释完善

### 3. 模块化设计

- 清晰的模块边界
- 最小化依赖耦合
- 插件化架构
- 可扩展性设计

### 4. 性能优化

- 懒加载支持
- 防抖和节流
- 内存管理
- 包大小优化

### 5. 开发体验

- 丰富的 API 接口
- 详细的文档和示例
- 开发工具支持
- 错误诊断友好

## 🔄 数据流和状态管理

### 状态流程

```
用户输入 → 组件事件 → Composable 处理 → Milkdown 更新 → UI 重渲染
```

### 上下文传递

```
MilkdownProvider (创建上下文)
    ↓
setContext('milkdown', context)
    ↓
子组件 (getContext('milkdown'))
    ↓
useEditor, useEditorInstance
```

### 事件流

```
编辑器事件 → 事件监听 → 回调函数 → 用户代码
```

## 🧪 测试架构

### 测试分层

```
单元测试 (Unit Tests)
    ↓
集成测试 (Integration Tests)
    ↓
E2E 测试 (End-to-End Tests)
    ↓
性能测试 (Performance Tests)
```

### 测试覆盖率目标

- 代码覆盖率 > 90%
- 分支覆盖率 > 90%
- 函数覆盖率 > 90%
- 语句覆盖率 > 90%

## 📦 构建和发布

### 构建输出

```
dist/
├── index.js          # 主入口 (ESM)
├── index.d.ts        # 类型定义
├── components/       # 组件导出
├── composables/      # Composables 导出
├── utils/           # 工具函数导出
├── types/           # 类型导出
└── styles/          # 样式文件
```

### 发布流程

1. 代码质量检查
2. 测试执行
3. 类型检查
4. 构建验证
5. 包大小检查
6. 版本发布
7. 文档更新

## 🔮 扩展性设计

### 插件系统

- 标准化插件接口
- 插件生命周期管理
- 依赖注入机制
- 配置和状态管理

### 主题系统

- 主题定义标准
- CSS 变量系统
- 动态主题切换
- 自定义主题支持

### 国际化支持

- 多语言文本支持
- 日期时间格式化
- 文本方向支持
- 可访问性优化

## 📊 性能考虑

### 包大小优化

- Tree-shaking 支持
- 按需加载
- 代码分割
- 压缩和优化

### 运行时性能

- 虚拟滚动支持
- 懒加载机制
- 防抖和节流
- 内存管理

### 加载性能

- 并行加载
- 预加载策略
- 缓存优化
- CDN 支持

这个架构设计确保了项目的可维护性、可扩展性和高性能，为 Svelte 5 Milkdown 编辑器提供了坚实的技术基础。