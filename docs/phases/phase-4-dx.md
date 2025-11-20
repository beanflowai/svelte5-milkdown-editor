# Phase 4: 开发体验优化

## 📋 阶段概述

**目标**: 提升开发者使用体验，包括完善 TypeScript 类型定义、编写全面的 API 文档、创建使用示例、性能优化和最佳实践指南。

**预计时间**: 3-4 天
**负责人**: LLM Code Agent
**前置条件**: Phase 3 高级功能实现完成

## 🎯 主要任务

### 4.1 TypeScript 类型完善
- [ ] 完善 TypeScript 类型定义
- [ ] 添加泛型支持
- [ ] 实现严格的类型检查
- [ ] 优化类型推导
- [ ] 添加类型测试

### 4.2 API 文档编写
- [ ] 编写组件 API 文档
- [ ] 编写 Composables API 文档
- [ ] 编写工具函数文档
- [ ] 创建类型定义文档
- [ ] 生成 API 参考文档

### 4.3 使用示例和教程
- [ ] 创建基础使用示例
- [ ] 创建高级配置示例
- [ ] 创建插件开发示例
- [ ] 创建主题自定义示例
- [ ] 编写集成教程

### 4.4 性能优化
- [ ] 组件性能优化
- [ ] 内存使用优化
- [ ] 构建产物优化
- [ ] 运行时性能监控
- [ ] 懒加载实现

### 4.5 开发工具支持
- [ ] VS Code 代码片段
- [ ] 开发者工具集成
- [ ] 调试工具创建
- [ ] 错误诊断优化
- [ ] 构建分析工具

## 📂 详细实施步骤

### 步骤 1: 完善 TypeScript 类型定义

**创建 src/lib/types/advanced.ts**:
```typescript
import type { Writable } from 'svelte/store';
import type { Editor, EditorState, Node, Mark } from '@milkdown/kit/core';
import type { CrepeFeature } from '@milkdown/crepe';

// Enhanced editor configuration
export interface EnhancedEditorConfig {
  // Basic configuration
  features?: CrepeFeature[];
  theme?: string;
  readonly?: boolean;
  placeholder?: string;

  // Advanced configuration
  autoSave?: boolean;
  autoSaveDelay?: number;
  maxLength?: number;
  allowedContent?: string[];
  disallowedContent?: string[];

  // Performance options
  lazyLoad?: boolean;
  debounceInput?: boolean;
  debounceDelay?: number;

  // Accessibility options
  ariaLabels?: Record<string, string>;
  keyboardShortcuts?: boolean;

  // Development options
  debug?: boolean;
  perfMonitor?: boolean;
}

// Plugin system types
export interface PluginMetadata {
  name: string;
  version: string;
  author?: string;
  description?: string;
  keywords?: string[];
  license?: string;
  repository?: {
    type: string;
    url: string;
  };
}

export interface PluginConfig<T = any> {
  enabled?: boolean;
  options?: T;
  dependencies?: string[];
  loadOrder?: number;
}

// Editor lifecycle events
export interface EditorEventMap {
  'ready': { editor: Editor };
  'change': { state: EditorState; content: string };
  'focus': { state: EditorState };
  'blur': { state: EditorState };
  'save': { content: string };
  'error': { error: Error };
  'plugin:loaded': { plugin: string };
  'plugin:unloaded': { plugin: string };
  'theme:changed': { theme: string };
}

export type EditorEventKey = keyof EditorEventMap;

export interface EditorEventHandler<T extends EditorEventKey> {
  (event: EditorEventMap[T]): void;
}

// Advanced component props
export interface AdvancedMilkdownProps {
  // Basic props
  config?: EnhancedEditorConfig;
  value?: string;
  onChange?: (value: string) => void;
  onReady?: (editor: Editor) => void;

  // Event handlers
  onFocus?: (state: EditorState) => void;
  onBlur?: (state: EditorState) => void;
  onSave?: (content: string) => void;
  onError?: (error: Error) => void;

  // Custom event handling
  onPluginLoad?: (plugin: string) => void;
  onPluginUnload?: (plugin: string) => void;
  onThemeChange?: (theme: string) => void;

  // UI configuration
  showToolbar?: boolean;
  showStatusBar?: boolean;
  showLineNumbers?: boolean;
  showWordCount?: boolean;

  // Toolbar configuration
  toolbarGroups?: ToolbarGroup[];
  toolbarPosition?: 'top' | 'bottom';
  toolbarSticky?: boolean;

  // Advanced features
  enableCollaboration?: boolean;
  enableRealTimeSync?: boolean;
  enableVersionHistory?: boolean;

  // Customization
  customCSS?: string;
  customClasses?: Record<string, string>;
  customPlugins?: PluginMetadata[];

  // Performance
  lazyLoadPlugins?: boolean;
  debounceInput?: boolean;
  debounceDelay?: number;
}

// Toolbar configuration
export interface ToolbarGroup {
  name: string;
  label?: string;
  items: ToolbarItem[];
  order?: number;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export interface ToolbarItem {
  id: string;
  type: 'button' | 'dropdown' | 'separator' | 'spacer';
  icon?: string;
  label?: string;
  tooltip?: string;
  action?: string | (() => void);
  options?: DropdownOption[];
  disabled?: boolean;
  active?: boolean;
  dropdown?: boolean;
}

export interface DropdownOption {
  label: string;
  value: string;
  icon?: string;
  disabled?: boolean;
}

// Status bar configuration
export interface StatusBarConfig {
  showWordCount?: boolean;
  showCharacterCount?: boolean;
  showLineCount?: boolean;
  showCursorPosition?: boolean;
  showSaveStatus?: boolean;
  showThemeSelector?: boolean;
  customItems?: StatusBarItem[];
}

export interface StatusBarItem {
  id: string;
  label: string;
  value: string | (() => string);
  position: 'left' | 'right';
  order?: number;
}

// Theme system
export interface ThemeDefinition {
  name: string;
  displayName: string;
  description?: string;
  variables: ThemeVariables;
  customCSS?: string;
  dark?: boolean;
}

export interface ThemeVariables {
  primary?: string;
  secondary?: string;
  background?: string;
  surface?: string;
  text?: string;
  border?: string;
  accent?: string;
  success?: string;
  warning?: string;
  error?: string;
  info?: string;
  [key: string]: string | undefined;
}

// Plugin development types
export interface PluginDefinition<T = any> extends PluginMetadata {
  install: (ctx: PluginContext) => void;
  uninstall?: (ctx: PluginContext) => void;
  config?: PluginConfig<T>;
  toolbar?: ToolbarPlugin;
  menu?: MenuPlugin;
  shortcuts?: KeyboardShortcut[];
  theme?: Partial<ThemeDefinition>;
}

export interface PluginContext {
  editor: Editor;
  state: EditorState;
  config: PluginConfig;
  update: (updater: (state: EditorState) => EditorState) => void;
  getPlugin: (name: string) => PluginDefinition | undefined;
  registerCommand: (name: string, command: Command) => void;
  registerTheme: (theme: ThemeDefinition) => void;
}

export interface Command {
  (state: EditorState, dispatch?: (tr: any) => void): boolean;
}

// Performance monitoring
export interface PerformanceMetrics {
  initTime: number;
  renderTime: number;
  updateTime: number;
  memoryUsage: number;
  bundleSize: number;
  loadTime: number;
}

export interface PerformanceConfig {
  enabled: boolean;
  sampleRate: number;
  maxSamples: number;
  reportInterval: number;
  reportCallback?: (metrics: PerformanceMetrics) => void;
}

// Collaboration types (if implementing collaboration features)
export interface CollaborationConfig {
  enabled: boolean;
  provider: CollaborationProvider;
  userId: string;
  userName: string;
  userColor?: string;
  awareness?: boolean;
}

export interface CollaborationProvider {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendOperation: (operation: any) => void;
  receiveOperations: (callback: (operation: any) => void) => void;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type EventPayload<T extends EditorEventKey> = EditorEventMap[T];

// Type guards
export function isToolbarItem(item: any): item is ToolbarItem {
  return item && typeof item === 'object' && 'id' in item && 'type' in item;
}

export function isThemeDefinition(theme: any): theme is ThemeDefinition {
  return theme && typeof theme === 'object' && 'name' in theme && 'variables' in theme;
}

export function isPluginDefinition(plugin: any): plugin is PluginDefinition {
  return plugin && typeof plugin === 'object' && 'name' in plugin && 'install' in plugin;
}
```

**更新 src/lib/types/index.ts**:
```typescript
// Export all types
export * from './editor';
export * from './provider';
export * from './plugins';
export * from './advanced';

// Re-export Milkdown types with better naming
export type {
  Editor as MilkdownEditor,
  EditorState as MilkdownEditorState,
  Node as MilkdownNode,
  Mark as MilkdownMark,
} from '@milkdown/kit/core';

export type { Crepe as MilkdownCrepe } from '@milkdown/crepe';

// Common utility types
export type { DeepPartial, RequiredFields, OptionalFields } from './advanced';
```

### 步骤 2: 创建增强的 useEditor Hook

**更新 src/lib/composables/useEditor.ts**:
```typescript
import { getContext, onDestroy } from 'svelte';
import { writable, derived } from 'svelte/store';
import type { Editor, EditorState } from '@milkdown/kit/core';
import type {
  EditorContext,
  EditorEventMap,
  EditorEventKey,
  EnhancedEditorConfig,
  PerformanceMetrics,
  AdvancedMilkdownProps
} from '../types';

export interface EnhancedUseEditorOptions extends AdvancedMilkdownProps {
  // Event handling
  onEvent?: <T extends EditorEventKey>(event: T, handler: (payload: EditorEventMap[T]) => void) => void;

  // Performance monitoring
  enablePerfMonitoring?: boolean;
  onPerfUpdate?: (metrics: PerformanceMetrics) => void;

  // Error handling
  onError?: (error: Error, context: string) => void;

  // State persistence
  persistKey?: string;
  persistConfig?: {
    storage?: 'localStorage' | 'sessionStorage' | 'custom';
    serializer?: (content: string) => string;
    deserializer?: (content: string) => string;
  };
}

export interface EnhancedUseEditorReturn {
  // Core editor
  editor: Editor | null;
  state: EditorState | null;
  loading: boolean;
  error: Error | null;

  // Stores for reactive programming
  editorStore: Writable<Editor | null>;
  stateStore: Writable<EditorState | null>;
  loadingStore: Writable<boolean>;
  errorStore: Writable<Error | null>;

  // Content stores
  contentStore: Writable<string>;
  wordCountStore: Writable<number>;
  characterCountStore: Writable<number>;

  // Performance metrics
  performanceStore: Writable<PerformanceMetrics | null>;

  // Actions
  create: () => Promise<void>;
  destroy: () => Promise<void>;
  update: (config: Partial<EnhancedEditorConfig>) => Promise<void>;

  // Content actions
  setContent: (content: string) => void;
  getContent: () => string;
  insertContent: (content: string, position?: number) => void;

  // Event handling
  addEventListener: <T extends EditorEventKey>(
    event: T,
    handler: (payload: EditorEventMap[T]) => void
  ) => () => void;

  // Utility methods
  focus: () => void;
  blur: () => void;
  isReady: () => boolean;

  // Plugin management
  enablePlugin: (name: string, config?: any) => void;
  disablePlugin: (name: string) => void;
  isPluginEnabled: (name: string) => boolean;
}

export function useEnhancedEditor(options: EnhancedUseEditorOptions = {}): EnhancedUseEditorReturn {
  const context = getContext<EditorContext>('milkdown');

  if (!context) {
    throw new Error('useEnhancedEditor must be used within a MilkdownProvider');
  }

  const { instance, create, destroy: destroyEditor, update } = context;

  // Create writable stores
  const editorStore = writable<Editor | null>(instance.editor);
  const stateStore = writable<EditorState | null>(null);
  const loadingStore = writable(instance.loading);
  const errorStore = writable<Error | null>(instance.error);
  const contentStore = writable<string>('');
  const wordCountStore = writable<number>(0);
  const characterCountStore = writable<number>(0);
  const performanceStore = writable<PerformanceMetrics | null>(null);

  // Event listeners management
  const eventListeners = new Map<EditorEventKey, Set<(payload: any) => void>>();

  // Performance monitoring
  let performanceMetrics: PerformanceMetrics | null = null;
  let perfStartTime = 0;

  function startPerformanceMonitoring() {
    if (!options.enablePerfMonitoring) return;

    perfStartTime = performance.now();
    performanceMetrics = {
      initTime: 0,
      renderTime: 0,
      updateTime: 0,
      memoryUsage: 0,
      bundleSize: 0,
      loadTime: 0
    };
  }

  function updatePerformanceMetrics() {
    if (!performanceMetrics || !options.enablePerfMonitoring) return;

    const currentTime = performance.now();
    performanceMetrics.updateTime = currentTime - perfStartTime;

    if (typeof performance !== 'undefined' && (performance as any).memory) {
      performanceMetrics.memoryUsage = (performance as any).memory.usedJSHeapSize;
    }

    performanceStore.set(performanceMetrics);
    options.onPerfUpdate?.(performanceMetrics);
  }

  // Content tracking
  function updateContentMetrics(state: EditorState) {
    const content = state.doc.textContent;
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    const characterCount = content.length;

    contentStore.set(content);
    wordCountStore.set(wordCount);
    characterCountStore.set(characterCount);
  }

  // Event handling
  function addEventListener<T extends EditorEventKey>(
    event: T,
    handler: (payload: EditorEventMap[T]) => void
  ): () => void {
    if (!eventListeners.has(event)) {
      eventListeners.set(event, new Set());
    }

    eventListeners.get(event)!.add(handler);

    // Return unsubscribe function
    return () => {
      const listeners = eventListeners.get(event);
      if (listeners) {
        listeners.delete(handler);
        if (listeners.size === 0) {
          eventListeners.delete(event);
        }
      }
    };
  }

  function emitEvent<T extends EditorEventKey>(event: T, payload: EditorEventMap[T]) {
    const listeners = eventListeners.get(event);
    if (listeners) {
      listeners.forEach(handler => {
        try {
          handler(payload);
        } catch (err) {
          console.error(`Error in event handler for ${event}:`, err);
          options.onError?.(err as Error, `event:${event}`);
        }
      });
    }
  }

  // Content actions
  function setContent(content: string) {
    if (!instance.editor) return;

    try {
      const state = instance.editor.state;
      const transaction = state.tr.replaceWith(
        0,
        state.doc.content.size,
        instance.editor.schema.text(content)
      );
      instance.editor.view.dispatch(transaction);
    } catch (err) {
      console.error('Failed to set content:', err);
      options.onError?.(err as Error, 'setContent');
    }
  }

  function getContent(): string {
    if (!instance.editor) return '';
    return instance.editor.state.doc.textContent;
  }

  function insertContent(content: string, position?: number) {
    if (!instance.editor) return;

    try {
      const state = instance.editor.state;
      const pos = position ?? state.selection.from;
      const transaction = state.tr.insert(
        pos,
        instance.editor.schema.text(content)
      );
      instance.editor.view.dispatch(transaction);
    } catch (err) {
      console.error('Failed to insert content:', err);
      options.onError?.(err as Error, 'insertContent');
    }
  }

  // Utility methods
  function focus() {
    if (instance.editor?.view) {
      instance.editor.view.focus();
    }
  }

  function blur() {
    if (instance.editor?.view) {
      instance.editor.view.blur();
    }
  }

  function isReady(): boolean {
    return !!instance.editor && !instance.loading && !instance.error;
  }

  // Plugin management (placeholder implementations)
  function enablePlugin(name: string, config?: any) {
    // Implementation would depend on the plugin system
    console.log(`Enabling plugin: ${name}`, config);
  }

  function disablePlugin(name: string) {
    // Implementation would depend on the plugin system
    console.log(`Disabling plugin: ${name}`);
  }

  function isPluginEnabled(name: string): boolean {
    // Implementation would depend on the plugin system
    return true;
  }

  // Setup reactive updates
  onDestroy(() => {
    eventListeners.clear();
  });

  // Return enhanced interface
  return {
    // Core properties (reactive)
    get editor() { return instance.editor; },
    get state() { return instance.editor?.state ?? null; },
    get loading() { return instance.loading; },
    get error() { return instance.error; },

    // Stores
    editorStore,
    stateStore,
    loadingStore,
    errorStore,
    contentStore,
    wordCountStore,
    characterCountStore,
    performanceStore,

    // Actions
    create,
    destroy: destroyEditor,
    update,

    // Content actions
    setContent,
    getContent,
    insertContent,

    // Event handling
    addEventListener,

    // Utility methods
    focus,
    blur,
    isReady,

    // Plugin management
    enablePlugin,
    disablePlugin,
    isPluginEnabled
  };
}
```

### 步骤 3: 创建开发工具

**创建 src/lib/dev-tools.ts**:
```typescript
import type { Editor, EditorState } from '@milkdown/kit/core';
import type { PerformanceMetrics, PluginDefinition } from '../types';

export class MilkdownDevTools {
  private static instance: MilkdownDevTools;
  private editors = new Map<string, Editor>();
  private metrics = new Map<string, PerformanceMetrics>();
  private plugins = new Map<string, PluginDefinition[]>();
  private eventLog: Array<{ timestamp: number; type: string; data: any }> = [];

  private constructor() {
    this.setupGlobalListeners();
  }

  static getInstance(): MilkdownDevTools {
    if (!MilkdownDevTools.instance) {
      MilkdownDevTools.instance = new MilkdownDevTools();
    }
    return MilkdownDevTools.instance;
  }

  // Editor management
  registerEditor(id: string, editor: Editor): void {
    this.editors.set(id, editor);
    this.logEvent('editor:registered', { id });
  }

  unregisterEditor(id: string): void {
    this.editors.delete(id);
    this.metrics.delete(id);
    this.logEvent('editor:unregistered', { id });
  }

  getEditor(id: string): Editor | undefined {
    return this.editors.get(id);
  }

  listEditors(): string[] {
    return Array.from(this.editors.keys());
  }

  // Metrics tracking
  updateMetrics(id: string, metrics: PerformanceMetrics): void {
    this.metrics.set(id, { ...metrics });
    this.logEvent('metrics:updated', { id, metrics });
  }

  getMetrics(id: string): PerformanceMetrics | undefined {
    return this.metrics.get(id);
  }

  getAllMetrics(): Record<string, PerformanceMetrics> {
    return Object.fromEntries(this.metrics);
  }

  // Plugin tracking
  registerPlugins(id: string, plugins: PluginDefinition[]): void {
    this.plugins.set(id, plugins);
    this.logEvent('plugins:registered', { id, plugins });
  }

  getPlugins(id: string): PluginDefinition[] {
    return this.plugins.get(id) || [];
  }

  // Event logging
  private logEvent(type: string, data: any): void {
    this.eventLog.push({
      timestamp: Date.now(),
      type,
      data
    });

    // Keep only last 1000 events
    if (this.eventLog.length > 1000) {
      this.eventLog = this.eventLog.slice(-1000);
    }
  }

  getEventLog(): Array<{ timestamp: number; type: string; data: any }> {
    return [...this.eventLog];
  }

  clearEventLog(): void {
    this.eventLog = [];
  }

  // Editor introspection
  getEditorState(id: string): EditorState | null {
    const editor = this.editors.get(id);
    return editor?.state ?? null;
  }

  getEditorContent(id: string): string {
    const editor = this.editors.get(id);
    return editor?.state.doc.textContent ?? '';
  }

  getEditorSchema(id: string): any {
    const editor = this.editors.get(id);
    return editor?.schema;
  }

  // Performance analysis
  analyzePerformance(): PerformanceAnalysis {
    const metrics = Array.from(this.metrics.values());

    if (metrics.length === 0) {
      return {
        totalEditors: 0,
        averageInitTime: 0,
        averageRenderTime: 0,
        averageUpdateTime: 0,
        totalMemoryUsage: 0,
        slowestEditor: null,
        fastestEditor: null
      };
    }

    const totalInitTime = metrics.reduce((sum, m) => sum + m.initTime, 0);
    const totalRenderTime = metrics.reduce((sum, m) => sum + m.renderTime, 0);
    const totalUpdateTime = metrics.reduce((sum, m) => sum + m.updateTime, 0);
    const totalMemoryUsage = metrics.reduce((sum, m) => sum + m.memoryUsage, 0);

    const sortedByInitTime = Array.from(this.metrics.entries())
      .sort(([, a], [, b]) => b.initTime - a.initTime);

    return {
      totalEditors: metrics.length,
      averageInitTime: totalInitTime / metrics.length,
      averageRenderTime: totalRenderTime / metrics.length,
      averageUpdateTime: totalUpdateTime / metrics.length,
      totalMemoryUsage,
      slowestEditor: sortedByInitTime[0]?.[0] || null,
      fastestEditor: sortedByInitTime[sortedByInitTime.length - 1]?.[0] || null
    };
  }

  // Debug utilities
  dumpEditorInfo(id: string): EditorInfo | null {
    const editor = this.editors.get(id);
    if (!editor) return null;

    return {
      id,
      state: !!editor.state,
      view: !!editor.view,
      schema: !!editor.schema,
      contentLength: editor.state.doc.content.size,
      nodeCount: editor.state.doc.content.childCount,
      selection: {
        from: editor.state.selection.from,
        to: editor.state.selection.to,
        empty: editor.state.selection.empty
      },
      metrics: this.metrics.get(id),
      plugins: this.getPlugins(id).map(p => p.name)
    };
  }

  // Console utilities
  exposeToWindow(): void {
    (window as any).__MILKDOWN_DEVTOOLS__ = {
      getEditor: this.getEditor.bind(this),
      listEditors: this.listEditors.bind(this),
      getMetrics: this.getMetrics.bind(this),
      getEventLog: this.getEventLog.bind(this),
      analyzePerformance: this.analyzePerformance.bind(this),
      dumpEditorInfo: this.dumpEditorInfo.bind(this),
      getContent: this.getEditorContent.bind(this),
      setState: (id: string, content: string) => {
        const editor = this.editors.get(id);
        if (editor) {
          const transaction = editor.state.tr.replaceWith(
            0,
            editor.state.doc.content.size,
            editor.schema.text(content)
          );
          editor.view.dispatch(transaction);
        }
      }
    };

    console.log('🔧 Milkdown DevTools exposed to window.__MILKDOWN_DEVTOOLS__');
  }

  private setupGlobalListeners(): void {
    // Listen for unhandled errors
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.logEvent('global:error', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.logEvent('global:unhandledRejection', {
          reason: event.reason
        });
      });
    }
  }
}

// Type definitions
export interface PerformanceAnalysis {
  totalEditors: number;
  averageInitTime: number;
  averageRenderTime: number;
  averageUpdateTime: number;
  totalMemoryUsage: number;
  slowestEditor: string | null;
  fastestEditor: string | null;
}

export interface EditorInfo {
  id: string;
  state: boolean;
  view: boolean;
  schema: boolean;
  contentLength: number;
  nodeCount: number;
  selection: {
    from: number;
    to: number;
    empty: boolean;
  };
  metrics?: PerformanceMetrics;
  plugins: string[];
}

// Export singleton instance
export const devTools = MilkdownDevTools.getInstance();
```

### 步骤 4: 创建 VS Code 代码片段

**创建 .vscode/milkdown.code-snippets**:
```json
{
  "Milkdown Basic Setup": {
    "prefix": "milkdown-basic",
    "body": [
      "<script lang=\"ts\">",
      "  import { MilkdownProvider, MilkdownEditor } from '$lib';",
      "  import { commonmark, gfm } from '@milkdown/preset-commonmark';",
      "",
      "  let content = $state('# Hello Milkdown\\n\\nStart typing...');",
      "",
      "  const editorConfig = {",
      "    features: [commonmark, gfm],",
      "    theme: 'nord',",
      "    placeholder: 'Start typing here...'",
      "  };",
      "</script>",
      "",
      "<MilkdownProvider config={editorConfig}>",
      "  <MilkdownEditor bind:value={content} />",
      "</MilkdownProvider>"
    ],
    "description": "Basic Milkdown editor setup"
  },
  "Milkdown Advanced Setup": {
    "prefix": "milkdown-advanced",
    "body": [
      "<script lang=\"ts\">",
      "  import { MilkdownProvider, MilkdownEditor } from '$lib';",
      "  import { useEnhancedEditor } from '$lib';",
      "  import { commonmark, gfm } from '@milkdown/preset-commonmark';",
      "",
      "  let content = $state('# Advanced Editor\\n\\nThis is an advanced setup...');",
      "",
      "  const {",
      "    editor,",
      "    loading,",
      "    error,",
      "    contentStore,",
      "    wordCountStore,",
      "    addEventListener",
      "  } = useEnhancedEditor({",
      "    onReady: (editor) => {",
      "      console.log('Editor ready:', editor);",
      "    },",
      "    onChange: (content) => {",
      "      console.log('Content changed:', content);",
      "    },",
      "    onError: (error) => {",
      "      console.error('Editor error:', error);",
      "    }",
      "  });",
      "",
      "  const editorConfig = {",
      "    features: [commonmark, gfm],",
      "    theme: 'nord',",
      "    placeholder: 'Start typing here...',",
      "    showToolbar: true,",
      "    showStatusBar: true,",
      "    autoSave: true,",
      "    autoSaveDelay: 1000",
      "  };",
      "</script>",
      "",
      "<MilkdownProvider config={editorConfig}>",
      "  <MilkdownEditor",
      "    bind:value={content}",
      "    showToolbar={true}",
      "    showStatusBar={true}",
      "  />",
      "  ",
      "  <div class=\"editor-stats\">",
      "    {#if $loading}",
      "      <p>Loading...</p>",
      "    {:else if $error}",
      "      <p>Error: {$error.message}</p>",
      "    {:else}",
      "      <p>Words: {$wordCountStore}</p>",
      "    {/if}",
      "  </div>",
      "</MilkdownProvider>"
    ],
    "description": "Advanced Milkdown editor setup with enhanced features"
  },
  "Custom Plugin": {
    "prefix": "milkdown-plugin",
    "body": [
      "import type { PluginDefinition, PluginContext } from '$lib/types';",
      "",
      "export const ${1:pluginName}Plugin: PluginDefinition = {",
      "  name: '${1:pluginName}',",
      "  version: '1.0.0',",
      "  description: '${2:Plugin description}',",
      "",
      "  install: (ctx: PluginContext) => {",
      "    ${3:// Plugin installation logic}",
      "  },",
      "",
      "  uninstall: (ctx: PluginContext) => {",
      "    ${4:// Plugin cleanup logic}",
      "  },",
      "",
      "  toolbar: {",
      "    group: 'custom',",
      "    order: 100,",
      "    icon: '${5:icon}',",
      "    title: '${6:Action Title}',",
      "    action: (ctx) => {",
      "      ${7:// Toolbar action logic}",
      "    }",
      "  },",
      "",
      "  shortcuts: [",
      "    {",
      "      key: '${8:k}',",
      "      ctrl: true,",
      "      action: (ctx) => {",
      "        ${9:// Shortcut action logic}",
      "      },",
      "      description: '${10:Shortcut description}'",
      "    }",
      "  ]",
      "};"
    ],
    "description": "Custom Milkdown plugin template"
  },
  "Custom Theme": {
    "prefix": "milkdown-theme",
    "body": [
      "import type { ThemeDefinition } from '$lib/types';",
      "",
      "export const ${1:themeName}Theme: ThemeDefinition = {",
      "  name: '${1:themeName}',",
      "  displayName: '${2:Display Name}',",
      "  description: '${3:Theme description}',",
      "  dark: ${4:false},",
      "",
      "  variables: {",
      "    primary: '${5:#007bff}',",
      "    secondary: '${6:#6c757d}',",
      "    background: '${7:#ffffff}',",
      "    surface: '${8:#f8f9fa}',",
      "    text: '${9:#333333}',",
      "    border: '${10:#dee2e6}',",
      "    accent: '${11:#28a745}'",
      "  },",
      "",
      "  customCSS: `",
      "    ${12/* Custom CSS rules */}",
      "  `",
      "};"
    ],
    "description": "Custom Milkdown theme template"
  },
  "Editor Event Handler": {
    "prefix": "milkdown-events",
    "body": [
      "const { addEventListener } = useEnhancedEditor();",
      "",
      "// Add event listeners",
      "const unsubscribeReady = addEventListener('ready', ({ editor }) => {",
      "  console.log('Editor ready:', editor);",
      "});",
      "",
      "const unsubscribeChange = addEventListener('change', ({ state, content }) => {",
      "  console.log('Content changed:', content);",
      "});",
      "",
      "const unsubscribeFocus = addEventListener('focus', ({ state }) => {",
      "  console.log('Editor focused');",
      "});",
      "",
      "const unsubscribeBlur = addEventListener('blur', ({ state }) => {",
      "  console.log('Editor blurred');",
      "});",
      "",
      "// Cleanup on component destroy",
      "$effect(() => {",
      "  return () => {",
      "    unsubscribeReady();",
      "    unsubscribeChange();",
      "    unsubscribeFocus();",
      "    unsubscribeBlur();",
      "  };",
      "});"
    ],
    "description": "Milkdown editor event handling setup"
  }
}
```

### 步骤 5: 创建使用示例

**创建 src/lib/examples/basic-example.svelte**:
```svelte
<script lang="ts">
  import { MilkdownProvider, MilkdownEditor } from '$lib';
  import { commonmark, gfm } from '@milkdown/preset-commonmark';
  import { nord, nordLight } from '@milkdown/theme-nord';

  let content = $state(`# Welcome to Milkdown Svelte 5

This is a **basic example** of the Milkdown editor integrated with Svelte 5.

## Features

- Svelte 5 support with runes
- Milkdown integration
- TypeScript support
- Theme switching

## Try it out

You can edit this content directly. The editor supports:

- **Bold text**
- *Italic text*
- [Links](https://example.com)
- Lists
  - Item 1
  - Item 2
- And more!

\`\`\`javascript
// Code blocks are also supported
const greeting = "Hello, Milkdown!";
console.log(greeting);
\`\`\`

> Blockquotes are supported too!

Enjoy editing!`);

  let currentTheme = $state('nord');

  const editorConfig = {
    features: [commonmark, gfm],
    theme: currentTheme,
    placeholder: 'Start typing your markdown here...',
    showToolbar: true,
    showStatusBar: true
  };

  function handleThemeChange(theme: string) {
    currentTheme = theme;
    editorConfig.theme = theme;
  }

  function handleContentChange(newContent: string) {
    content = newContent;
  }

  function handleSave(content: string) {
    console.log('Saving content:', content);
    // Implement save logic here
  }

  function getStats() {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    const characters = content.length;
    const lines = content.split('\n').length;

    return { words, characters, lines };
  }

  $: stats = getStats();
</script>

<div class="example-container">
  <header class="example-header">
    <h1>Basic Milkdown Editor Example</h1>
    <p>A simple demonstration of the Milkdown editor with Svelte 5</p>
  </header>

  <div class="editor-controls">
    <div class="theme-selector">
      <label for="theme-select">Theme:</label>
      <select
        id="theme-select"
        bind:value={currentTheme}
        on:change={() => handleThemeChange(currentTheme)}
      >
        <option value="nord">Nord (Dark)</option>
        <option value="nordLight">Nord Light</option>
        <option value="default">Default</option>
      </select>
    </div>

    <div class="editor-stats">
      <span>Words: {stats.words}</span>
      <span>Characters: {stats.characters}</span>
      <span>Lines: {stats.lines}</span>
    </div>
  </div>

  <div class="editor-wrapper">
    <MilkdownProvider config={editorConfig}>
      <MilkdownEditor
        bind:value={content}
        onChange={handleContentChange}
        onSave={handleSave}
        showToolbar={true}
        showStatusBar={true}
      />
    </MilkdownProvider>
  </div>

  <div class="preview-section">
    <h2>Live Preview</h2>
    <div class="markdown-preview">
      {content}
    </div>
  </div>
</div>

<style>
  .example-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .example-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .example-header h1 {
    color: #333;
    margin-bottom: 0.5rem;
  }

  .example-header p {
    color: #666;
    font-size: 1.1rem;
  }

  .editor-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .theme-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .theme-selector label {
    font-weight: 500;
  }

  .theme-selector select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
  }

  .editor-stats {
    display: flex;
    gap: 1rem;
    font-size: 0.9rem;
    color: #666;
  }

  .editor-wrapper {
    margin-bottom: 2rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
  }

  .preview-section {
    margin-top: 2rem;
  }

  .preview-section h2 {
    margin-bottom: 1rem;
    color: #333;
  }

  .markdown-preview {
    padding: 1.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #fafafa;
    white-space: pre-wrap;
    font-family: 'SF Mono', Monaco, monospace;
    font-size: 0.9rem;
    line-height: 1.6;
  }
</style>
```

**创建 src/lib/examples/advanced-example.svelte**:
```svelte
<script lang="ts">
  import { MilkdownProvider, MilkdownEditor } from '$lib';
  import { useEnhancedEditor } from '$lib';
  import { commonmark, gfm } from '@milkdown/preset-commonmark';
  import { devTools } from '$lib/dev-tools';

  // Enhanced editor setup
  let content = $state('# Advanced Milkdown Example\n\nThis demonstrates advanced features...');
  let isAutoSaveEnabled = $state(true);
  let isDebugMode = $state(false);
  let lastSaved = $state<Date | null>(null);
  let saveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const {
    editor,
    loading,
    error,
    contentStore,
    wordCountStore,
    characterCountStore,
    performanceStore,
    addEventListener,
    enablePlugin,
    disablePlugin,
    focus,
    blur,
    setContent,
    getContent
  } = useEnhancedEditor({
    onReady: (editor) => {
      console.log('Advanced editor ready:', editor);
      if (isDebugMode) {
        devTools.registerEditor('advanced-example', editor);
      }
    },
    onChange: (content) => {
      if (isAutoSaveEnabled) {
        scheduleAutoSave(content);
      }
    },
    onSave: (content) => {
      lastSaved = new Date();
      saveStatus = 'saved';
      setTimeout(() => saveStatus = 'idle', 2000);
    },
    onError: (error) => {
      console.error('Editor error:', error);
      saveStatus = 'error';
    },
    enablePerfMonitoring: isDebugMode,
    onPerfUpdate: (metrics) => {
      if (isDebugMode) {
        console.log('Performance metrics:', metrics);
      }
    }
  });

  // Auto-save functionality
  let autoSaveTimeout: number;

  function scheduleAutoSave(content: string) {
    clearTimeout(autoSaveTimeout);
    saveStatus = 'idle';

    autoSaveTimeout = setTimeout(() => {
      saveContent(content);
    }, 2000) as unknown as number;
  }

  async function saveContent(content: string) {
    try {
      saveStatus = 'saving';

      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 500));

      // Save to localStorage or API
      localStorage.setItem('milkdown-content', content);

      saveStatus = 'saved';
      setTimeout(() => saveStatus = 'idle', 2000);
    } catch (error) {
      saveStatus = 'error';
      console.error('Save failed:', error);
    }
  }

  function loadContent() {
    const saved = localStorage.getItem('milkdown-content');
    if (saved) {
      setContent(saved);
      content = saved;
    }
  }

  function exportContent() {
    const blob = new Blob([getContent()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.md';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importContent(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setContent(content);
      };
      reader.readAsText(file);
    }
  }

  function toggleDebugMode() {
    isDebugMode = !isDebugMode;
    if (isDebugMode) {
      devTools.exposeToWindow();
      if (editor) {
        devTools.registerEditor('advanced-example', editor);
      }
    }
  }

  function getPerformanceInfo() {
    const metrics = $performanceStore;
    if (!metrics) return null;

    return {
      init: `${metrics.initTime.toFixed(2)}ms`,
      render: `${metrics.renderTime.toFixed(2)}ms`,
      update: `${metrics.updateTime.toFixed(2)}ms`,
      memory: `${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`
    };
  }

  $: perfInfo = getPerformanceInfo();

  // Load saved content on mount
  loadContent();

  const advancedConfig = {
    features: [commonmark, gfm],
    theme: 'nord',
    placeholder: 'Start your advanced editing session...',
    showToolbar: true,
    showStatusBar: true,
    autoSave: isAutoSaveEnabled,
    autoSaveDelay: 2000,
    enableCollaboration: false,
    enableRealTimeSync: false,
    debounceInput: true,
    debounceDelay: 300
  };
</script>

<div class="advanced-example">
  <header class="advanced-header">
    <h1>Advanced Milkdown Editor</h1>
    <p>Full-featured editor with advanced capabilities</p>
  </header>

  <div class="control-panel">
    <div class="control-group">
      <h3>Editor Controls</h3>
      <div class="control-buttons">
        <button on:click={() => focus()}>Focus</button>
        <button on:click={() => blur()}>Blur</button>
        <button on:click={exportContent}>Export</button>
        <label class="import-btn">
          Import
          <input type="file" accept=".md,.txt" on:change={importContent} />
        </label>
      </div>
    </div>

    <div class="control-group">
      <h3>Settings</h3>
      <label class="toggle">
        <input
          type="checkbox"
          bind:checked={isAutoSaveEnabled}
        />
        Auto-save
      </label>
      <label class="toggle">
        <input
          type="checkbox"
          bind:checked={isDebugMode}
          on:change={toggleDebugMode}
        />
        Debug Mode
      </label>
    </div>

    <div class="control-group">
      <h3>Status</h3>
      <div class="status-indicators">
        <span class="save-status status-{saveStatus}">
          {saveStatus === 'idle' && 'Ready'}
          {saveStatus === 'saving' && 'Saving...'}
          {saveStatus === 'saved' && 'Saved!'}
          {saveStatus === 'error' && 'Error'}
        </span>
        {#if lastSaved}
          <span class="last-saved">
            Last saved: {lastSaved.toLocaleTimeString()}
          </span>
        {/if}
      </div>
    </div>

    {#if perfInfo && isDebugMode}
      <div class="control-group">
        <h3>Performance</h3>
        <div class="perf-metrics">
          <span>Init: {perfInfo.init}</span>
          <span>Render: {perfInfo.render}</span>
          <span>Update: {perfInfo.update}</span>
          <span>Memory: {perfInfo.memory}</span>
        </div>
      </div>
    {/if}
  </div>

  <div class="editor-stats">
    <div class="stat">
      <span class="stat-label">Words</span>
      <span class="stat-value">{$wordCountStore}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Characters</span>
      <span class="stat-value">{$characterCountStore}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Loading</span>
      <span class="stat-value">{$loading ? 'Yes' : 'No'}</span>
    </div>
    {#if $error}
      <div class="stat error">
        <span class="stat-label">Error</span>
        <span class="stat-value">{$error.message}</span>
      </div>
    {/if}
  </div>

  <div class="editor-container">
    <MilkdownProvider config={advancedConfig}>
      <MilkdownEditor
        bind:value={content}
        showToolbar={true}
        showStatusBar={true}
        enableThemeSelector={true}
      />
    </MilkdownProvider>
  </div>

  {#if isDebugMode}
    <div class="debug-panel">
      <h3>Debug Information</h3>
      <div class="debug-info">
        <p>DevTools available at <code>window.__MILKDOWN_DEVTOOLS__</code></p>
        <p>Try running: <code>window.__MILKDOWN_DEVTOOLS__.dumpEditorInfo('advanced-example')</code></p>
      </div>
    </div>
  {/if}
</div>

<style>
  .advanced-example {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .advanced-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .advanced-header h1 {
    color: #333;
    margin-bottom: 0.5rem;
  }

  .advanced-header p {
    color: #666;
    font-size: 1.1rem;
  }

  .control-panel {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .control-group h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: #333;
    font-size: 1rem;
  }

  .control-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .control-buttons button,
  .import-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .import-btn {
    display: inline-block;
    text-decoration: none;
  }

  .import-btn input {
    display: none;
  }

  .toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .toggle input {
    cursor: pointer;
  }

  .status-indicators {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.9rem;
  }

  .save-status {
    font-weight: 500;
  }

  .save-status.status-saving {
    color: #007bff;
  }

  .save-status.status-saved {
    color: #28a745;
  }

  .save-status.status-error {
    color: #dc3545;
  }

  .last-saved {
    color: #666;
    font-size: 0.8rem;
  }

  .perf-metrics {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    font-size: 0.8rem;
    font-family: monospace;
  }

  .editor-stats {
    display: flex;
    gap: 2rem;
    margin-bottom: 1rem;
    padding: 1rem;
    background: #e9ecef;
    border-radius: 8px;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .stat-label {
    font-size: 0.8rem;
    color: #666;
    text-transform: uppercase;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
  }

  .stat.error .stat-value {
    color: #dc3545;
  }

  .editor-container {
    margin-bottom: 2rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
  }

  .debug-panel {
    margin-top: 2rem;
    padding: 1rem;
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 8px;
  }

  .debug-panel h3 {
    margin-top: 0;
    color: #856404;
  }

  .debug-info {
    font-family: monospace;
    font-size: 0.9rem;
  }

  .debug-info code {
    background: #f8f9fa;
    padding: 0.125rem 0.25rem;
    border-radius: 2px;
  }
</style>
```

## ✅ 完成标准

### 必须完成项
- [ ] TypeScript 类型定义完善
- [ ] 泛型支持和严格类型检查
- [ ] API 文档完整编写
- [ ] 使用示例和教程创建
- [ ] 性能优化实现
- [ ] 开发工具支持完善
- [ ] VS Code 代码片段创建

### 验证测试
```bash
# TypeScript 编译检查
npm run check

# 生成 API 文档
npm run build:docs

# 运行示例
npm run dev

# 性能测试
npm run test:perf

# 类型检查测试
npm run test:types
```

### 功能验证清单
- [ ] TypeScript 类型提示完整
- [ ] 泛型使用正确
- [ ] 文档示例可运行
- [ ] 性能监控可用
- [ ] 开发工具正常工作
- [ ] 代码片段可用
- [ ] 错误处理完善

## 📝 注意事项

1. **类型安全**: 确保所有 API 都有正确的类型定义
2. **向后兼容**: 新功能不应破坏现有 API
3. **文档维护**: 文档应与代码同步更新
4. **性能影响**: 开发工具不应影响生产性能
5. **可访问性**: 工具和文档应支持可访问性

## 🚀 下一阶段

完成本阶段后，进入 [Phase 5: 测试和发布](./phase-5-testing.md)，开始全面的测试和发布准备工作。

## 🔍 故障排除

**常见问题**:

1. **TypeScript 错误**: 检查类型定义是否正确
2. **文档生成失败**: 确认 JSDoc 注释格式正确
3. **性能监控错误**: 检查浏览器 API 兼容性
4. **开发工具问题**: 确认全局变量暴露正确

**调试技巧**:
```typescript
// 检查类型推导
console.log(typeof editor);

// 检查性能数据
console.log(devTools.analyzePerformance());

// 检查事件监听
console.log(devTools.getEventLog());
```