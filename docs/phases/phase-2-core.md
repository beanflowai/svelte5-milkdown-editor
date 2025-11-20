# Phase 2: 核心功能实现

## 📋 阶段概述

**目标**: 实现基本的 Milkdown 编辑器功能，包括组件逻辑、状态管理和编辑器生命周期。

**预计时间**: 3-4 天
**负责人**: LLM Code Agent
**前置条件**: Phase 1 基础架构搭建完成

## 🎯 主要任务

### 2.1 MilkdownProvider 组件开发
- [ ] 实现编辑器上下文提供逻辑
- [ ] 添加编辑器创建和销毁功能
- [ ] 实现配置更新机制
- [ ] 添加加载和错误状态管理

### 2.2 useEditor Composable 实现
- [ ] 创建编辑器实例管理逻辑
- [ ] 实现编辑器生命周期钩子
- [ ] 添加事件监听和处理
- [ ] 实现编辑器状态响应式更新

### 2.3 MilkdownEditor 主组件开发
- [ ] 实现编辑器 DOM 渲染
- [ ] 添加属性绑定和事件处理
- [ ] 实现内容双向绑定
- [ ] 添加编辑器主题支持

### 2.4 状态管理系统
- [ ] 设计编辑器状态结构
- [ ] 实现状态持久化
- [ ] 添加状态变更通知
- [ ] 优化性能响应式更新

### 2.5 错误处理和加载状态
- [ ] 实现全面的错误捕获
- [ ] 添加加载状态指示器
- [ ] 创建错误边界处理
- [ ] 实现重试机制

## 📂 详细实施步骤

### 步骤 1: 完善 MilkdownProvider 组件

**更新 src/lib/components/MilkdownProvider.svelte**:
```svelte
<script lang="ts">
  import { setContext, onMount, onDestroy } from 'svelte';
  import type { Editor, EditorState } from '@milkdown/kit/core';
  import { Crepe } from '@milkdown/crepe';
  import type { EditorContext, ProviderProps } from '../types';
  import type { EditorConfig } from '../types/editor';

  let { children, config = {} }: ProviderProps = $props();

  // Svelte 5 runes for reactive state
  let editor = $state<Editor | null>(null);
  let loading = $state(true);
  let error = $state<Error | null>(null);

  // 编辑器配置
  let editorConfig: EditorConfig = $state(config);

  const createEditor = async (): Promise<void> => {
    if (editor) return;

    try {
      loading = true;
      error = null;

      const crepe = Crepe.make(editorConfig.features || [])
        .use((ctx) => {
          // Apply theme and other configurations
          if (editorConfig.theme) {
            // Apply theme logic
          }
        });

      editor = crepe.create();

      // Set loading to false when editor is ready
      loading = false;

    } catch (err) {
      error = err instanceof Error ? err : new Error('Failed to create editor');
      loading = false;
    }
  };

  const destroyEditor = async (): Promise<void> => {
    if (editor) {
      try {
        editor.destroy();
        editor = null;
        loading = true;
        error = null;
      } catch (err) {
        console.error('Failed to destroy editor:', err);
      }
    }
  };

  const updateConfig = async (newConfig: Partial<EditorConfig>): Promise<void> => {
    const previousConfig = { ...editorConfig };
    editorConfig = { ...editorConfig, ...newConfig };

    // If editor exists and significant config changed, recreate
    if (editor && (previousConfig.theme !== newConfig.theme ||
                   JSON.stringify(previousConfig.features) !== JSON.stringify(newConfig.features))) {
      await destroyEditor();
      await createEditor();
    }
  };

  // Context value
  const context: EditorContext = {
    instance: {
      editor,
      loading,
      error
    },
    create: createEditor,
    destroy: destroyEditor,
    update: updateConfig
  };

  setContext('milkdown', context);

  // Lifecycle
  onMount(() => {
    createEditor();
  });

  onDestroy(() => {
    destroyEditor();
  });

  // Watch for config changes
  $effect(() => {
    if (JSON.stringify(config) !== JSON.stringify(editorConfig)) {
      updateConfig(config);
    }
  });
</script>

<div data-milkdown-provider>
  {#if loading}
    <div class="milkdown-loading">
      <slot name="loading">
        <div>Loading editor...</div>
      </slot>
    </div>
  {:else if error}
    <div class="milkdown-error">
      <slot name="error" {error}>
        <div>Error: {error.message}</div>
        <button on:click={() => createEditor()}>Retry</button>
      </slot>
    </div>
  {:else}
    {@render children?.()}
  {/if}
</div>

<style>
  .milkdown-loading,
  .milkdown-error {
    padding: 1rem;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .milkdown-error {
    color: #d32f2f;
    border-color: #ffcdd2;
    background-color: #ffebee;
  }
</style>
```

### 步骤 2: 实现 useEditor Composable

**创建 src/lib/composables/useEditor.ts**:
```typescript
import { getContext } from 'svelte';
import { onMount, onDestroy } from 'svelte';
import type { Editor, EditorState } from '@milkdown/kit/core';
import type { EditorContext, EditorConfig } from '../types';

export interface UseEditorOptions {
  onReady?: (editor: Editor) => void;
  onChange?: (state: EditorState) => void;
  onDestroy?: () => void;
}

export interface UseEditorReturn {
  editor: Editor | null;
  loading: boolean;
  error: Error | null;
  create: () => Promise<void>;
  destroy: () => Promise<void>;
  update: (config: Partial<EditorConfig>) => Promise<void>;
}

export function useEditor(options: UseEditorOptions = {}): UseEditorReturn {
  const context = getContext<EditorContext>('milkdown');

  if (!context) {
    throw new Error('useEditor must be used within a MilkdownProvider');
  }

  const { instance, create, destroy: destroyEditor, update } = context;

  // Set up event listeners
  onMount(() => {
    if (instance.editor && options.onReady) {
      options.onReady(instance.editor);
    }

    if (instance.editor && options.onChange) {
      // Subscribe to editor state changes
      const unsubscribe = instance.editor.stateUpdate.subscribe(() => {
        if (instance.editor) {
          options.onChange!(instance.editor.state);
        }
      });

      return () => {
        unsubscribe();
      };
    }
  });

  onDestroy(() => {
    if (options.onDestroy) {
      options.onDestroy();
    }
  });

  return {
    get editor() { return instance.editor; },
    get loading() { return instance.loading; },
    get error() { return instance.error; },
    create,
    destroy: destroyEditor,
    update
  };
}
```

**创建 src/lib/composables/useEditorInstance.ts**:
```typescript
import { getContext } from 'svelte';
import type { Editor } from '@milkdown/kit/core';
import type { EditorContext } from '../types';

export function useEditorInstance(): Editor {
  const context = getContext<EditorContext>('milkdown');

  if (!context || !context.instance.editor) {
    throw new Error('useEditorInstance must be used within a MilkdownProvider with a valid editor');
  }

  return context.instance.editor;
}
```

**创建 src/lib/composables/index.ts**:
```typescript
export * from './useEditor';
export * from './useEditorInstance';
```

### 步骤 3: 完善 MilkdownEditor 组件

**更新 src/lib/components/MilkdownEditor.svelte**:
```svelte
<script lang="ts">
  import { getContext, onMount, onDestroy, tick } from 'svelte';
  import { useEditor } from '../composables';
  import type { MilkdownProps, EditorConfig } from '../types';
  import type { Editor, EditorState } from '@milkdown/kit/core';

  let {
    config = {},
    value = '',
    onChange,
    onReady,
    placeholder = 'Start typing...'
  }: MilkdownProps = $props();

  let editorElement: HTMLElement;
  let currentValue = $state(value);

  const {
    editor,
    loading,
    error,
    create,
    destroy
  } = useEditor({
    onReady: (ed: Editor) => {
      if (onReady) {
        onReady(ed);
      }
    },
    onChange: (state: EditorState) => {
      const markdown = getMarkdownFromState(state);
      if (markdown !== currentValue) {
        currentValue = markdown;
        if (onChange) {
          onChange(markdown);
        }
      }
    },
    onDestroy: () => {
      // Cleanup logic
    }
  });

  // Helper function to extract markdown from editor state
  const getMarkdownFromState = (state: EditorState): string => {
    try {
      return state.doc.textContent || '';
    } catch (err) {
      console.error('Failed to extract markdown:', err);
      return '';
    }
  };

  // Set editor content when value changes externally
  $effect(() => {
    if (value !== currentValue && editor && !loading) {
      // Update editor content
      try {
        const state = editor.state;
        const transaction = state.tr.replaceWith(
          0,
          state.doc.content.size,
          editor.schema.text(value)
        );
        editor.view.dispatch(transaction);
      } catch (err) {
        console.error('Failed to update editor content:', err);
      }
    }
  });

  // Handle DOM mounting
  onMount(async () => {
    if (editorElement && editor) {
      try {
        await tick();
        // Milkdown will automatically render into the element
        editorElement.appendChild(editor.view.dom);

        // Set initial value
        if (value) {
          const state = editor.state;
          const transaction = state.tr.replaceWith(
            0,
            state.doc.content.size,
            editor.schema.text(value)
          );
          editor.view.dispatch(transaction);
        }
      } catch (err) {
        console.error('Failed to mount editor:', err);
      }
    }
  });

  // Cleanup on unmount
  onDestroy(() => {
    if (editorElement && editor?.view.dom) {
      try {
        editorElement.removeChild(editor.view.dom);
      } catch (err) {
        console.error('Failed to unmount editor:', err);
      }
    }
  });
</script>

<div
  data-milkdown-editor
  bind:this={editorElement}
  class="milkdown-editor"
  class:loading
  class:error
>
  {#if loading}
    <div class="editor-loading">
      Initializing editor...
    </div>
  {:else if error}
    <div class="editor-error">
      Failed to load editor: {error.message}
    </div>
  {/if}
</div>

<style>
  .milkdown-editor {
    position: relative;
    min-height: 200px;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
  }

  .milkdown-editor.loading,
  .milkdown-editor.error {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
  }

  .editor-loading,
  .editor-error {
    padding: 2rem;
    text-align: center;
    color: #666;
  }

  .editor-error {
    color: #d32f2f;
    background-color: #ffebee;
  }

  /* Milkdown editor styles will be injected here */
  :global(.milkdown-editor .ProseMirror) {
    outline: none;
    padding: 1rem;
    min-height: 200px;
  }

  :global(.milkdown-editor .ProseMirror:focus) {
    outline: none;
  }

  :global(.milkdown-editor .ProseMirror p.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    float: left;
    color: #adb5bd;
    pointer-events: none;
    height: 0;
  }
</style>
```

### 步骤 4: 创建编辑器构建器

**创建 src/lib/utils/builder.ts**:
```typescript
import type { Editor } from '@milkdown/kit/core';
import { Crepe } from '@milkdown/crepe';
import {
  commonmark,
  gfm,
} from '@milkdown/preset-commonmark';
import {
  nord,
  nordLight,
} from '@milkdown/theme-nord';
import type { EditorConfig } from '../types/editor';

export interface EditorBuilderOptions {
  features?: any[];
  theme?: string;
  readonly?: boolean;
  placeholder?: string;
}

export class MilkdownBuilder {
  private features: any[] = [];
  private theme: string = 'nord';
  private readonly: boolean = false;
  private placeholder: string = '';

  constructor(options: EditorBuilderOptions = {}) {
    this.features = options.features || [];
    this.theme = options.theme || 'nord';
    this.readonly = options.readonly || false;
    this.placeholder = options.placeholder || '';
  }

  addFeatures(...features: any[]): this {
    this.features.push(...features);
    return this;
  }

  setTheme(themeName: string): this {
    this.theme = themeName;
    return this;
  }

  setReadonly(readonly: boolean): this {
    this.readonly = readonly;
    return this;
  }

  setPlaceholder(placeholder: string): this {
    this.placeholder = placeholder;
    return this;
  }

  build(): Editor {
    // Create Milkdown editor with configured features
    const crepe = Crepe.make(this.features);

    // Apply theme based on theme name
    switch (this.theme) {
      case 'nord':
        crepe.use(nord);
        break;
      case 'nordLight':
        crepe.use(nordLight);
        break;
      default:
        crepe.use(nord);
    }

    // Create editor instance
    return crepe.create();
  }
}

// Factory function for easier usage
export function createEditorBuilder(options: EditorBuilderOptions = {}): MilkdownBuilder {
  return new MilkdownBuilder(options);
}
```

### 步骤 5: 完善类型定义

**更新 src/lib/types/editor.ts**:
```typescript
import type { Editor } from '@milkdown/kit/core';
import type { CrepeFeature } from '@milkdown/crepe';

export interface EditorInstance {
  editor: Editor | null;
  loading: boolean;
  error: Error | null;
}

export interface EditorConfig {
  features?: CrepeFeature[];
  theme?: string;
  readonly?: boolean;
  placeholder?: string;
}

export interface MilkdownProps {
  config?: EditorConfig;
  value?: string;
  onChange?: (value: string) => void;
  onReady?: (editor: Editor) => void;
  placeholder?: string;
  readonly?: boolean;
  theme?: string;
}

export interface EditorEvents {
  ready: (editor: Editor) => void;
  change: (value: string) => void;
  error: (error: Error) => void;
  destroy: () => void;
}

export type EditorTheme = 'nord' | 'nordLight' | 'default';
```

### 步骤 6: 更新主导出文件

**更新 src/lib/index.ts**:
```typescript
// Components
export { default as MilkdownProvider } from './components/MilkdownProvider.svelte';
export { default as MilkdownEditor } from './components/MilkdownEditor.svelte';

// Composables
export { useEditor, useEditorInstance } from './composables';

// Utils
export { MilkdownBuilder, createEditorBuilder } from './utils';

// Types
export * from './types';

// Re-export Milkdown types for convenience
export type { Editor, EditorState } from '@milkdown/kit/core';
export type { Crepe } from '@milkdown/crepe';
export {
  commonmark,
  gfm
} from '@milkdown/preset-commonmark';
export {
  nord,
  nordLight
} from '@milkdown/theme-nord';
```

### 步骤 7: 创建开发测试页面

**更新 src/routes/+page.svelte**:
```svelte
<script lang="ts">
  import { MilkdownProvider, MilkdownEditor } from '$lib';
  import { commonmark, gfm } from '@milkdown/preset-commonmark';

  let editorValue = $state('# Welcome to Svelte 5 Milkdown Editor\n\nThis is a **test** page.\n\n## Features\n\n- Svelte 5 support\n- Milkdown integration\n- TypeScript support\n\nTry editing this content!');

  const handleEditorChange = (value: string) => {
    editorValue = value;
  };

  const handleEditorReady = (editor: any) => {
    console.log('Editor ready:', editor);
  };

  const editorConfig = {
    features: [commonmark, gfm],
    theme: 'nord',
    placeholder: 'Start typing your markdown here...'
  };
</script>

<main>
  <h1>Svelte 5 Milkdown Editor Demo</h1>

  <div class="editor-container">
    <MilkdownProvider config={editorConfig}>
      <MilkdownEditor
        bind:value={editorValue}
        onChange={handleEditorChange}
        onReady={handleEditorReady}
      />
    </MilkdownProvider>
  </div>

  <div class="preview-container">
    <h2>Live Preview:</h2>
    <pre class="markdown-preview">{editorValue}</pre>
  </div>
</main>

<style>
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: sans-serif;
  }

  .editor-container {
    margin: 2rem 0;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
  }

  .preview-container {
    margin: 2rem 0;
  }

  .markdown-preview {
    background-color: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    white-space: pre-wrap;
  }

  h1 {
    color: #333;
    margin-bottom: 1rem;
  }

  h2 {
    color: #666;
    margin-bottom: 0.5rem;
  }
</style>
```

## ✅ 完成标准

### 必须完成项
- [ ] MilkdownProvider 组件完全实现
- [ ] useEditor composable 正常工作
- [ ] MilkdownEditor 组件功能完整
- [ ] 编辑器创建、更新、销毁功能正常
- [ ] 错误处理和加载状态完善
- [ ] 双向数据绑定工作正常
- [ ] 基础主题支持

### 验证测试
```bash
# 启动开发服务器
npm run dev

# 运行测试
npm run test

# 检查类型
npm run check

# 构建项目
npm run build
```

### 功能验证清单
- [ ] 编辑器能够正常加载和显示
- [ ] 输入内容能够实时同步
- [ ] 主题切换功能正常
- [ ] 错误状态能够正确处理
- [ ] 编辑器销毁和重建功能正常
- [ ] TypeScript 类型提示正确

## 📝 注意事项

1. **状态管理**: 使用 Svelte 5 的 runes 实现响应式状态
2. **生命周期**: 正确处理编辑器的创建和销毁
3. **内存泄漏**: 确保事件监听器正确清理
4. **错误边界**: 提供完善的错误处理机制
5. **性能优化**: 避免不必要的编辑器重建

## 🚀 下一阶段

完成本阶段后，进入 [Phase 3: 高级功能](./phase-3-advanced.md)，开始实现插件系统、工具栏等高级功能。

## 🔍 故障排除

**常见问题**:

1. **编辑器无法渲染**: 检查 DOM 元素是否正确绑定
2. **状态同步问题**: 确认双向绑定逻辑正确实现
3. **内存泄漏**: 检查事件监听器和定时器是否正确清理
4. **类型错误**: 验证 TypeScript 类型定义是否正确

**调试技巧**:
```javascript
// 在组件中添加调试信息
console.log('Editor instance:', editor);
console.log('Current value:', currentValue);
console.log('Loading state:', loading);
console.log('Error state:', error);
```