# Phase 1: 基础架构搭建

## 📋 阶段概述

**目标**: 建立项目基础设施和核心框架，为后续开发奠定坚实基础。

**预计时间**: 2-3 天
**负责人**: LLM Code Agent
**前置条件**: 完成总体开发计划文档

## 🎯 主要任务

### 1.1 项目配置优化
- [x] 基础 Svelte 5 项目已创建
- [ ] 优化 package.json 配置
- [ ] 配置 TypeScript 编译选项
- [ ] 设置 ESLint 和 Prettier 规则

### 1.2 Milkdown 依赖配置
- [ ] 安装 Milkdown 核心依赖
- [ ] 配置 peer dependencies
- [ ] 验证依赖兼容性

### 1.3 构建系统配置
- [ ] 配置 Vite 构建工具
- [ ] 设置库模式构建
- [ ] 配置多格式输出 (ESM/CJS/TypeScript)

### 1.4 测试环境设置
- [ ] 配置 Vitest 测试框架
- [ ] 设置 Testing Library for Svelte
- [ ] 创建基础测试结构

### 1.5 基础组件框架
- [ ] 创建组件目录结构
- [ ] 实现基础组件框架
- [ ] 设置类型定义基础

## 📂 详细实施步骤

### 步骤 1: 优化 package.json

**当前状态分析**:
- ✅ 基础 Svelte 5 项目已创建
- ✅ 基础依赖已安装
- ❌ 缺少 Milkdown 相关依赖
- ❌ 包配置需要针对库开发优化

**需要执行的操作**:

1. **更新包名和描述**:
```json
{
  "name": "@milkdown/svelte5",
  "description": "Svelte 5 components for Milkdown editor",
  "private": false,
  "version": "0.1.0"
}
```

2. **添加 Milkdown 依赖**:
```json
{
  "dependencies": {
    "@milkdown/crepe": "^7.17.1",
    "@milkdown/kit": "^7.17.1"
  },
  "peerDependencies": {
    "svelte": "^5.0.0"
  }
}
```

3. **添加库构建相关脚本**:
```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build && npm run build:types",
    "build:types": "svelte-kit sync && svelte-package",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "lint": "prettier --check . && eslint .",
    "format": "prettier --write .",
    "prepublishOnly": "npm run build"
  }
}
```

4. **添加开发依赖**:
```json
{
  "devDependencies": {
    "@milkdown/crepe": "workspace:*",
    "@types/node": "^22",
    "@vitest/ui": "^2.0.0",
    "@testing-library/svelte": "^5.0.0",
    "jsdom": "^27.0.0",
    "svelte-package": "^2.0.0",
    "typescript": "^5.9.3",
    "vitest": "^2.0.0"
  }
}
```

### 步骤 2: 配置 TypeScript

**创建 tsconfig.lib.json**:
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src/lib",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/lib/**/*"],
  "exclude": ["src/**/*.test.*", "src/**/*.spec.*"]
}
```

**优化 tsconfig.json**:
```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "moduleResolution": "bundler"
  },
  "include": ["src/**/*.ts", "src/**/*.js", "src/**/*.svelte"],
  "exclude": ["node_modules/**"]
}
```

### 步骤 3: 配置 Vite 构建系统

**更新 vite.config.ts**:
```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  build: {
    lib: {
      entry: 'src/lib/index.ts',
      name: 'Svelte5Milkdown',
      fileName: (format) => `svelte5-milkdown.${format}.js`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['svelte', '@milkdown/crepe', '@milkdown/kit'],
      output: {
        globals: {
          svelte: 'Svelte',
          '@milkdown/crepe': 'MilkdownCrepe',
          '@milkdown/kit': 'MilkdownKit'
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['@milkdown/crepe', '@milkdown/kit']
  }
});
```

### 步骤 4: 配置测试环境

**创建 vitest.config.ts**:
```typescript
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true
  }
});
```

**创建测试配置文件** - `src/test/setup.ts`:
```typescript
import { beforeAll, vi } from 'vitest';

// Mock DOM APIs that might be needed
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Setup ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

### 步骤 5: 创建项目结构

**目录结构**:
```
src/
├── lib/
│   ├── components/
│   │   ├── MilkdownEditor.svelte
│   │   ├── MilkdownProvider.svelte
│   │   └── index.ts
│   ├── composables/
│   │   ├── useEditor.ts
│   │   ├── useEditorInstance.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── editor.ts
│   │   └── provider.ts
│   ├── utils/
│   │   ├── builder.ts
│   │   └── index.ts
│   ├── styles/
│   │   ├── index.css
│   │   └── themes/
│   └── index.ts
├── test/
│   ├── setup.ts
│   └── __mocks__/
└── routes/
    └── +page.svelte  # 开发测试页面
```

### 步骤 6: 创建基础类型定义

**src/lib/types/editor.ts**:
```typescript
import type { Editor } from '@milkdown/kit/core';

export interface EditorInstance {
  editor: Editor | null;
  loading: boolean;
  error: Error | null;
}

export interface EditorConfig {
  features?: any[];
  theme?: string;
  readonly?: boolean;
  placeholder?: string;
}

export interface MilkdownProps {
  config?: EditorConfig;
  value?: string;
  onChange?: (value: string) => void;
  onReady?: (editor: Editor) => void;
}
```

**src/lib/types/provider.ts**:
```typescript
import type { EditorInstance } from './editor';

export interface EditorContext {
  instance: EditorInstance;
  create: () => Promise<void>;
  destroy: () => Promise<void>;
  update: (config: any) => Promise<void>;
}

export interface ProviderProps {
  children: any;
  config?: any;
}
```

**src/lib/types/index.ts**:
```typescript
export * from './editor';
export * from './provider';

// Re-export Milkdown types
export type { Editor, EditorState } from '@milkdown/kit/core';
export type { Crepe } from '@milkdown/crepe';
```

### 步骤 7: 创建基础组件框架

**src/lib/components/MilkdownProvider.svelte**:
```svelte
<script lang="ts">
  import { setContext } from 'svelte';
  import type { EditorContext, ProviderProps } from '../types';

  let { children, config }: ProviderProps = $props();

  // 基础上下文实现，将在 Phase 2 完善
  const context: EditorContext = {
    instance: {
      editor: null,
      loading: true,
      error: null
    },
    create: async () => {},
    destroy: async () => {},
    update: async () => {}
  };

  setContext('milkdown', context);
</script>

<div data-milkdown-provider>
  {@render children?.()}
</div>
```

**src/lib/components/MilkdownEditor.svelte**:
```svelte
<script lang="ts">
  import { getContext } from 'svelte';
  import type { MilkdownProps } from '../types';

  let { config, value, onChange, onReady }: MilkdownProps = $props();

  // 基础编辑器实现，将在 Phase 2 完善
  const context = getContext('milkdown');

  let editorElement: HTMLElement;
</script>

<div data-milkdown-editor bind:this={editorElement}>
  <!-- Editor content will be rendered here -->
</div>
```

## ✅ 完成标准

### 必须完成项
- [ ] package.json 配置完整且正确
- [ ] TypeScript 配置优化完成
- [ ] Vite 构建系统可用
- [ ] 测试环境配置完成
- [ ] 基础目录结构创建
- [ ] 基础类型定义完成
- [ ] 基础组件框架创建

### 验证测试
```bash
# 验证依赖安装
npm install

# 验证 TypeScript 编译
npm run check

# 验证构建
npm run build

# 验证测试环境
npm run test
```

## 📝 注意事项

1. **版本兼容性**: 确保 Svelte 5 和 Milkdown 7.x 版本兼容
2. **构建输出**: 确保支持 ESM 和 CJS 两种格式
3. **类型导出**: 确保 TypeScript 类型定义正确导出
4. **测试隔离**: 测试配置不应影响生产构建

## 🚀 下一阶段

完成本阶段后，进入 [Phase 2: 核心功能实现](./phase-2-core.md)，开始实现编辑器的核心功能。

## 🔍 故障排除

**常见问题**:

1. **依赖冲突**: 如果遇到依赖版本冲突，检查 peer dependencies 配置
2. **构建失败**: 检查 TypeScript 配置和 Vite 配置是否正确
3. **测试错误**: 确保测试环境配置正确，特别是 jsdom 模拟

**调试命令**:
```bash
# 详细构建日志
npm run build -- --mode development

# 类型检查详情
npm run check -- --verbose

# 测试详情
npm run test -- --reporter=verbose
```