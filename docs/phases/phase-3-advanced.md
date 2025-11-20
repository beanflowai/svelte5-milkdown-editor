# Phase 3: 高级功能实现

## 📋 阶段概述

**目标**: 添加高级功能和插件支持，包括工具栏、菜单、图片支持、表格、主题系统等，提供完整的编辑器体验。

**预计时间**: 4-5 天
**负责人**: LLM Code Agent
**前置条件**: Phase 2 核心功能实现完成

## 🎯 主要任务

### 3.1 插件系统设计
- [ ] 设计插件架构接口
- [ ] 实现插件注册和管理机制
- [ ] 创建常用插件集合
- [ ] 实现插件配置和懒加载

### 3.2 工具栏和菜单组件
- [ ] 实现可配置的工具栏
- [ ] 创建右键菜单组件
- [ ] 添加格式化工具按钮
- [ ] 实现快捷键支持

### 3.3 富媒体内容支持
- [ ] 图片上传和插入功能
- [ ] 链接预览和编辑
- [ ] 表格编辑功能
- [ ] 代码块语法高亮
- [ ] 数学公式支持 (LaTeX)

### 3.4 主题系统完善
- [ ] 实现主题切换机制
- [ ] 创建多套内置主题
- [ ] 支持自定义主题
- [ ] 实现主题预览功能

### 3.5 响应式设计
- [ ] 适配移动设备
- [ ] 实现工具栏自适应
- [ ] 优化触摸设备体验
- [ ] 添加可访问性支持

## 📂 详细实施步骤

### 步骤 1: 设计插件系统架构

**创建 src/lib/types/plugins.ts**:
```typescript
import type { Editor, EditorState } from '@milkdown/kit/core';

export interface MilkdownPlugin {
  name: string;
  version: string;
  description?: string;
  dependencies?: string[];

  // Plugin lifecycle hooks
  install?: (ctx: EditorContext) => void;
  uninstall?: (ctx: EditorContext) => void;

  // Plugin configuration
  config?: Record<string, any>;

  // Optional features
  toolbar?: ToolbarPlugin;
  menu?: MenuPlugin;
  shortcuts?: KeyboardShortcut[];
}

export interface EditorContext {
  editor: Editor;
  state: EditorState;
  update: (updater: (state: EditorState) => EditorState) => void;
}

export interface ToolbarPlugin {
  group: string;
  order: number;
  icon: string;
  title: string;
  action: (ctx: EditorContext) => void;
  isActive?: (ctx: EditorContext) => boolean;
  disabled?: (ctx: EditorContext) => boolean;
}

export interface MenuPlugin {
  id: string;
  label: string;
  submenu?: MenuPlugin[];
  action?: (ctx: EditorContext) => void;
  separator?: boolean;
}

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  action: (ctx: EditorContext) => void;
  description: string;
}

export interface PluginRegistry {
  register(plugin: MilkdownPlugin): void;
  unregister(name: string): void;
  get(name: string): MilkdownPlugin | undefined;
  list(): MilkdownPlugin[];
  install(name: string, config?: Record<string, any>): void;
  uninstall(name: string): void;
}
```

**创建 src/lib/utils/plugin-registry.ts**:
```typescript
import type { MilkdownPlugin, PluginRegistry, EditorContext } from '../types/plugins';

class MilkdownPluginRegistry implements PluginRegistry {
  private plugins = new Map<string, MilkdownPlugin>();
  private installed = new Set<string>();

  register(plugin: MilkdownPlugin): void {
    this.plugins.set(plugin.name, plugin);
  }

  unregister(name: string): void {
    this.plugins.delete(name);
    if (this.installed.has(name)) {
      this.uninstall(name);
    }
  }

  get(name: string): MilkdownPlugin | undefined {
    return this.plugins.get(name);
  }

  list(): MilkdownPlugin[] {
    return Array.from(this.plugins.values());
  }

  install(name: string, config?: Record<string, any>): void {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin "${name}" not found`);
    }

    if (this.installed.has(name)) {
      return; // Already installed
    }

    // Check dependencies
    if (plugin.dependencies) {
      for (const dep of plugin.dependencies) {
        if (!this.installed.has(dep)) {
          this.install(dep);
        }
      }
    }

    // Apply configuration
    if (config) {
      plugin.config = { ...plugin.config, ...config };
    }

    // Install plugin
    this.installed.add(name);

    // Note: Actual installation will happen during editor creation
    console.log(`Plugin "${name}" registered for installation`);
  }

  uninstall(name: string): void {
    const plugin = this.plugins.get(name);
    if (plugin && plugin.uninstall) {
      // Note: Actual uninstallation will happen during editor destruction
      console.log(`Plugin "${name}" marked for uninstallation`);
    }
    this.installed.delete(name);
  }

  getInstalled(): string[] {
    return Array.from(this.installed);
  }

  clear(): void {
    this.plugins.clear();
    this.installed.clear();
  }
}

export const pluginRegistry = new MilkdownPluginRegistry();
```

### 步骤 2: 创建常用插件

**创建 src/lib/plugins/common-plugins.ts**:
```typescript
import type { MilkdownPlugin, ToolbarPlugin, KeyboardShortcut } from '../types/plugins';
import {
  bold,
  italic,
  strikethrough,
  underline
} from '@milkdown/preset-commonmark';
import {
  toggleEmphasisCommand,
  toggleStrongCommand
} from '@milkdown/preset-commonmark';
import {
  insertTableCommand,
  moveToNextTableCellCommand,
  moveToPrevTableCellCommand
} from '@milkdown/preset-gfm';

// Bold plugin
export const boldPlugin: MilkdownPlugin = {
  name: 'bold',
  version: '1.0.0',
  description: 'Bold text formatting',

  toolbar: {
    group: 'format',
    order: 1,
    icon: 'bold',
    title: 'Bold',
    action: (ctx) => {
      toggleStrongCommand()(ctx.editor.state, ctx.editor.view.dispatch);
    },
    isActive: (ctx) => {
      return toggleStrongCommand()(ctx.editor.state);
    }
  },

  shortcuts: [
    {
      key: 'b',
      ctrl: true,
      action: (ctx) => {
        toggleStrongCommand()(ctx.editor.state, ctx.editor.view.dispatch);
      },
      description: 'Toggle bold'
    }
  ]
};

// Italic plugin
export const italicPlugin: MilkdownPlugin = {
  name: 'italic',
  version: '1.0.0',
  description: 'Italic text formatting',

  toolbar: {
    group: 'format',
    order: 2,
    icon: 'italic',
    title: 'Italic',
    action: (ctx) => {
      toggleEmphasisCommand()(ctx.editor.state, ctx.editor.view.dispatch);
    },
    isActive: (ctx) => {
      return toggleEmphasisCommand()(ctx.editor.state);
    }
  },

  shortcuts: [
    {
      key: 'i',
      ctrl: true,
      action: (ctx) => {
        toggleEmphasisCommand()(ctx.editor.state, ctx.editor.view.dispatch);
      },
      description: 'Toggle italic'
    }
  ]
};

// Header plugin
export const headerPlugin: MilkdownPlugin = {
  name: 'header',
  version: '1.0.0',
  description: 'Header formatting',

  toolbar: {
    group: 'format',
    order: 3,
    icon: 'heading',
    title: 'Header',
    action: (ctx) => {
      // Toggle header logic
      const { state, dispatch } = ctx.editor;
      const { $from } = state.selection;
      const node = $from.parent;

      if (node.type.name === 'heading') {
        // Convert to paragraph
        ctx.editor.state.tr.setNodeMarkup($from.before(), undefined).dispatch();
      } else {
        // Convert to heading
        ctx.editor.state.tr.setNodeMarkup($from.before(), undefined, { level: 1 }).dispatch();
      }
    }
  }
};

// Table plugin
export const tablePlugin: MilkdownPlugin = {
  name: 'table',
  version: '1.0.0',
  description: 'Table support',

  toolbar: {
    group: 'insert',
    order: 1,
    icon: 'table',
    title: 'Insert Table',
    action: (ctx) => {
      insertTableCommand()(ctx.editor.state, ctx.editor.view.dispatch);
    }
  },

  shortcuts: [
    {
      key: 'Tab',
      action: (ctx) => {
        moveToNextTableCellCommand()(ctx.editor.state, ctx.editor.view.dispatch);
      },
      description: 'Next table cell'
    },
    {
      key: 'Tab',
      shift: true,
      action: (ctx) => {
        moveToPrevTableCellCommand()(ctx.editor.state, ctx.editor.view.dispatch);
      },
      description: 'Previous table cell'
    }
  ]
};

// Link plugin
export const linkPlugin: MilkdownPlugin = {
  name: 'link',
  version: '1.0.0',
  description: 'Link support',

  toolbar: {
    group: 'insert',
    order: 2,
    icon: 'link',
    title: 'Insert Link',
    action: (ctx) => {
      const url = prompt('Enter URL:');
      if (url) {
        // Insert link logic
        const { state, dispatch } = ctx.editor;
        const link = ctx.editor.schema.mark('link', { href: url });
        ctx.editor.state.tr.addMark(
          state.selection.from,
          state.selection.to,
          link
        ).dispatch();
      }
    }
  }
};

// Image plugin
export const imagePlugin: MilkdownPlugin = {
  name: 'image',
  version: '1.0.0',
  description: 'Image support',

  toolbar: {
    group: 'insert',
    order: 3,
    icon: 'image',
    title: 'Insert Image',
    action: (ctx) => {
      const url = prompt('Enter image URL:');
      if (url) {
        // Insert image logic
        const { state, dispatch } = ctx.editor;
        const node = ctx.editor.schema.nodes.image.create({ src: url });
        ctx.editor.state.tr.replaceSelectionWith(node).dispatch();
      }
    }
  }
};

// Export all common plugins
export const commonPlugins = [
  boldPlugin,
  italicPlugin,
  headerPlugin,
  tablePlugin,
  linkPlugin,
  imagePlugin
];
```

### 步骤 3: 实现工具栏组件

**创建 src/lib/components/Toolbar.svelte**:
```svelte
<script lang="ts">
  import { useEditor } from '../composables';
  import type { ToolbarPlugin } from '../types/plugins';
  import { pluginRegistry } from '../utils/plugin-registry';

  interface ToolbarProps {
    groups?: string[];
    compact?: boolean;
    vertical?: boolean;
  }

  let { groups = ['format', 'insert'], compact = false, vertical = false }: ToolbarProps = $props();

  const { editor } = useEditor();

  // Get toolbar items from installed plugins
  $: toolbarItems = getToolbarItems();

  function getToolbarItems(): ToolbarPlugin[] {
    if (!editor) return [];

    const plugins = pluginRegistry.getInstalled();
    const items: ToolbarPlugin[] = [];

    for (const pluginName of plugins) {
      const plugin = pluginRegistry.get(pluginName);
      if (plugin?.toolbar && (!groups || groups.includes(plugin.toolbar.group))) {
        items.push(plugin.toolbar);
      }
    }

    // Sort by order
    return items.sort((a, b) => a.order - b.order);
  }

  function handleToolbarAction(item: ToolbarPlugin) {
    if (!editor) return;

    try {
      const context = {
        editor,
        state: editor.state,
        update: (updater) => {
          const newState = updater(editor.state);
          editor.view.dispatch(editor.state.tr.replaceWith(0, editor.state.doc.content.size));
        }
      };
      item.action(context);
    } catch (err) {
      console.error('Toolbar action failed:', err);
    }
  }

  function isItemActive(item: ToolbarPlugin): boolean {
    if (!editor || !item.isActive) return false;

    try {
      const context = {
        editor,
        state: editor.state,
        update: () => {}
      };
      return item.isActive(context);
    } catch {
      return false;
    }
  }

  function isItemDisabled(item: ToolbarPlugin): boolean {
    if (!editor || !item.disabled) return false;

    try {
      const context = {
        editor,
        state: editor.state,
        update: () => {}
      };
      return item.disabled(context);
    } catch {
      return false;
    }
  }
</script>

<div
  class="milkdown-toolbar"
  class:compact
  class:vertical
  role="toolbar"
  aria-label="Editor toolbar"
>
  {#each toolbarItems as item (item.title)}
    <button
      class="toolbar-button"
      class:active={isItemActive(item)}
      class:disabled={isItemDisabled(item)}
      title={item.title}
      aria-label={item.title}
      disabled={isItemDisabled(item)}
      on:click={() => handleToolbarAction(item)}
    >
      <span class="icon">{item.icon}</span>
      {#if !compact}
        <span class="label">{item.title}</span>
      {/if}
    </button>
  {/each}
</div>

<style>
  .milkdown-toolbar {
    display: flex;
    gap: 0.25rem;
    padding: 0.5rem;
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
    align-items: center;
  }

  .milkdown-toolbar.vertical {
    flex-direction: column;
    border-bottom: none;
    border-right: 1px solid #dee2e6;
    padding: 0.5rem 0.25rem;
  }

  .toolbar-button {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid transparent;
    border-radius: 4px;
    background-color: transparent;
    color: #495057;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
  }

  .toolbar-button:hover:not(.disabled) {
    background-color: #e9ecef;
    border-color: #dee2e6;
  }

  .toolbar-button.active {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
  }

  .toolbar-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon {
    font-size: 1rem;
    line-height: 1;
  }

  .label {
    font-weight: 500;
  }

  .compact {
    gap: 0.125rem;
    padding: 0.25rem;
  }

  .compact .toolbar-button {
    padding: 0.375rem 0.5rem;
  }

  .compact .label {
    display: none;
  }
</style>
```

### 步骤 4: 实现右键菜单组件

**创建 src/lib/components/ContextMenu.svelte**:
```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { useEditor } from '../composables';
  import type { MenuPlugin } from '../types/plugins';
  import { pluginRegistry } from '../utils/plugin-registry';

  const dispatch = createEventDispatcher();

  interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
  }

  let { x, y, onClose }: ContextMenuProps = $props();

  const { editor } = useEditor();

  // Get menu items from installed plugins
  $: menuItems = getMenuItems();

  function getMenuItems(): MenuPlugin[] {
    if (!editor) return [];

    const plugins = pluginRegistry.getInstalled();
    const items: MenuPlugin[] = [];

    for (const pluginName of plugins) {
      const plugin = pluginRegistry.get(pluginName);
      if (plugin?.menu) {
        items.push(...(Array.isArray(plugin.menu) ? plugin.menu : [plugin.menu]));
      }
    }

    return items;
  }

  function handleMenuAction(item: MenuPlugin) {
    if (!editor || !item.action) return;

    try {
      const context = {
        editor,
        state: editor.state,
        update: (updater) => {
          const newState = updater(editor.state);
          editor.view.dispatch(editor.state.tr.replaceWith(0, editor.state.doc.content.size));
        }
      };
      item.action(context);
    } catch (err) {
      console.error('Menu action failed:', err);
    }

    onClose();
  }

  // Close menu when clicking outside
  function handleBackdropClick() {
    onClose();
  }

  // Handle keyboard navigation
  let selectedIndex = $state(0);

  function handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowDown':
        selectedIndex = Math.min(selectedIndex + 1, menuItems.length - 1);
        break;
      case 'ArrowUp':
        selectedIndex = Math.max(selectedIndex - 1, 0);
        break;
      case 'Enter':
        const item = menuItems[selectedIndex];
        if (item && item.action) {
          handleMenuAction(item);
        }
        break;
    }
  }
</script>

<svelte:window on:click={handleBackdropClick} on:keydown={handleKeyDown} />

{#if menuItems.length > 0}
  <div
    class="context-menu"
    style="left: {x}px; top: {y}px;"
    role="menu"
    on:click|stopPropagation
  >
    {#each menuItems as item, index (item.id || item.label)}
      {#if item.separator}
        <div class="menu-separator" role="separator"></div>
      {:else}
        <div
          class="menu-item"
          class:selected={index === selectedIndex}
          role="menuitem"
          on:click={() => handleMenuAction(item)}
          on:mouseenter={() => selectedIndex = index}
        >
          {item.label}
        </div>
      {/if}
    {/each}
  </div>
{/if}

<style>
  .context-menu {
    position: fixed;
    z-index: 1000;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    padding: 0.25rem 0;
    min-width: 150px;
  }

  .menu-item {
    padding: 0.5rem 1rem;
    cursor: pointer;
    user-select: none;
  }

  .menu-item:hover,
  .menu-item.selected {
    background-color: #f0f0f0;
  }

  .menu-separator {
    height: 1px;
    background-color: #e0e0e0;
    margin: 0.25rem 0;
  }
</style>
```

### 步骤 5: 实现主题系统

**创建 src/lib/themes/theme-manager.ts**:
```typescript
import type { EditorTheme } from '../types/editor';

export interface Theme {
  name: string;
  displayName: string;
  description?: string;
  styles: string;
  dark?: boolean;
}

export const themes: Record<EditorTheme, Theme> = {
  default: {
    name: 'default',
    displayName: 'Default',
    description: 'Clean and minimal theme',
    styles: `
      .milkdown-editor .ProseMirror {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        line-height: 1.6;
        color: #333;
      }
    `,
    dark: false
  },

  nord: {
    name: 'nord',
    displayName: 'Nord',
    description: 'Nord color scheme',
    styles: `
      .milkdown-editor .ProseMirror {
        background-color: #2e3440;
        color: #d8dee9;
        font-family: 'Fira Code', monospace;
      }
    `,
    dark: true
  },

  nordLight: {
    name: 'nordLight',
    displayName: 'Nord Light',
    description: 'Nord light color scheme',
    styles: `
      .milkdown-editor .ProseMirror {
        background-color: #f8f9fa;
        color: #2e3440;
        font-family: 'Inter', sans-serif;
      }
    `,
    dark: false
  }
};

export class ThemeManager {
  private currentTheme: EditorTheme = 'default';
  private styleElement: HTMLStyleElement | null = null;

  setTheme(themeName: EditorTheme): void {
    const theme = themes[themeName];
    if (!theme) {
      throw new Error(`Theme "${themeName}" not found`);
    }

    this.currentTheme = themeName;
    this.applyTheme(theme);
  }

  getCurrentTheme(): EditorTheme {
    return this.currentTheme;
  }

  applyTheme(theme: Theme): void {
    // Remove existing theme styles
    if (this.styleElement) {
      this.styleElement.remove();
    }

    // Add new theme styles
    this.styleElement = document.createElement('style');
    this.styleElement.textContent = theme.styles;
    document.head.appendChild(this.styleElement);

    // Add theme class to body
    document.body.className = document.body.className
      .replace(/theme-\w+/g, '')
      .trim();
    document.body.classList.add(`theme-${theme.name}`);

    if (theme.dark) {
      document.body.classList.add('theme-dark');
    }
  }

  listThemes(): Theme[] {
    return Object.values(themes);
  }

  registerTheme(themeName: string, theme: Theme): void {
    (themes as any)[themeName] = theme;
  }
}

export const themeManager = new ThemeManager();
```

**创建 src/lib/components/ThemeSelector.svelte**:
```svelte
<script lang="ts">
  import { themeManager, type Theme } from '../themes/theme-manager';
  import type { EditorTheme } from '../types/editor';

  interface ThemeSelectorProps {
    value?: EditorTheme;
    onChange?: (theme: EditorTheme) => void;
    showPreview?: boolean;
  }

  let {
    value = 'default',
    onChange,
    showPreview = true
  }: ThemeSelectorProps = $props();

  let currentTheme = $state(value);
  let themes = $state<Theme[]>([]);

  $: {
    themes = themeManager.listThemes();
    currentTheme = themeManager.getCurrentTheme();
  }

  function handleThemeChange(themeName: string) {
    themeManager.setTheme(themeName as EditorTheme);
    currentTheme = themeName as EditorTheme;
    onChange?.(currentTheme as EditorTheme);
  }
</script>

<div class="theme-selector">
  <div class="theme-header">
    <h3>Themes</h3>
    {#if showPreview}
      <div class="current-theme">
        Current: {themes.find(t => t.name === currentTheme)?.displayName}
      </div>
    {/if}
  </div>

  <div class="theme-grid">
    {#each themes as theme (theme.name)}
      <button
        class="theme-card"
        class:active={theme.name === currentTheme}
        class:dark={theme.dark}
        on:click={() => handleThemeChange(theme.name)}
        title={theme.description}
      >
        <div class="theme-preview">
          <div class="preview-header"></div>
          <div class="preview-content">
            <div class="preview-line"></div>
            <div class="preview-line short"></div>
            <div class="preview-line"></div>
          </div>
        </div>
        <div class="theme-info">
          <div class="theme-name">{theme.displayName}</div>
          {#if theme.dark}
            <span class="theme-badge">Dark</span>
          {/if}
        </div>
      </button>
    {/each}
  </div>

  {#if showPreview}
    <div class="theme-description">
      {themes.find(t => t.name === currentTheme)?.description}
    </div>
  {/if}
</div>

<style>
  .theme-selector {
    padding: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #fafafa;
  }

  .theme-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .theme-header h3 {
    margin: 0;
    color: #333;
  }

  .current-theme {
    font-size: 0.875rem;
    color: #666;
  }

  .theme-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .theme-card {
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    padding: 0.5rem;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  }

  .theme-card:hover {
    border-color: #007bff;
    box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
  }

  .theme-card.active {
    border-color: #007bff;
    background: #f8f9ff;
  }

  .theme-preview {
    width: 100%;
    height: 60px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    margin-bottom: 0.5rem;
    background: white;
    position: relative;
    overflow: hidden;
  }

  .preview-header {
    height: 12px;
    background: #f0f0f0;
    border-bottom: 1px solid #e0e0e0;
  }

  .preview-content {
    padding: 0.25rem;
  }

  .preview-line {
    height: 4px;
    background: #ddd;
    border-radius: 2px;
    margin-bottom: 0.25rem;
  }

  .preview-line.short {
    width: 60%;
  }

  .theme-card.dark .theme-preview {
    background: #2e3440;
  }

  .theme-card.dark .preview-header {
    background: #3b4252;
    border-bottom-color: #434c5e;
  }

  .theme-card.dark .preview-line {
    background: #4c566a;
  }

  .theme-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .theme-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #333;
  }

  .theme-badge {
    font-size: 0.75rem;
    padding: 0.125rem 0.375rem;
    background: #6c757d;
    color: white;
    border-radius: 12px;
  }

  .theme-description {
    font-size: 0.875rem;
    color: #666;
    font-style: italic;
  }
</style>
```

### 步骤 6: 实现响应式设计

**创建 src/lib/styles/responsive.css**:
```css
/* Responsive design for Milkdown editor */

/* Mobile styles */
@media (max-width: 768px) {
  .milkdown-editor {
    font-size: 16px; /* Prevent zoom on iOS */
  }

  .milkdown-toolbar {
    flex-wrap: wrap;
    gap: 0.125rem;
    padding: 0.25rem;
  }

  .toolbar-button {
    padding: 0.5rem;
    min-width: 40px;
    justify-content: center;
  }

  .toolbar-button .label {
    display: none;
  }

  .milkdown-toolbar.vertical {
    width: auto;
    border-right: none;
    border-bottom: 1px solid #dee2e6;
    flex-direction: row;
  }

  .context-menu {
    min-width: 120px;
    font-size: 14px;
  }
}

/* Tablet styles */
@media (min-width: 769px) and (max-width: 1024px) {
  .milkdown-toolbar.compact .toolbar-button .label {
    display: none;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .toolbar-button {
    min-height: 44px; /* Apple's recommended minimum touch target */
  }

  .context-menu {
    padding: 0.5rem 0;
  }

  .menu-item {
    padding: 0.75rem 1rem;
    min-height: 44px;
    display: flex;
    align-items: center;
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .toolbar-button .icon {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .milkdown-toolbar {
    background-color: #2d3748;
    border-bottom-color: #4a5568;
  }

  .toolbar-button {
    color: #e2e8f0;
  }

  .toolbar-button:hover:not(.disabled) {
    background-color: #4a5568;
    border-color: #718096;
  }

  .context-menu {
    background: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;
  }

  .menu-item:hover,
  .menu-item.selected {
    background-color: #4a5568;
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .toolbar-button,
  .context-menu,
  .theme-card {
    transition: none;
  }
}

/* Print styles */
@media print {
  .milkdown-toolbar,
  .context-menu {
    display: none;
  }

  .milkdown-editor {
    border: none;
    box-shadow: none;
  }
}
```

### 步骤 7: 更新主组件集成

**更新 src/lib/components/MilkdownEditor.svelte** 以支持高级功能:
```svelte
<!-- Add these imports and props at the top of the script section -->
import { Toolbar } from './Toolbar.svelte';
import { ContextMenu } from './ContextMenu.svelte';
import { ThemeSelector } from './ThemeSelector.svelte';
import { pluginRegistry } from '../utils/plugin-registry';

// Add these props
let {
  showToolbar = true,
  showContextMenu = true,
  toolbarGroups = ['format', 'insert'],
  enableThemeSelector = false
} = $props();

// Add state for context menu
let contextMenu = $state<{ x: number; y: number; open: boolean }>({
  x: 0,
  y: 0,
  open: false
});

// Add context menu handling
function handleContextMenu(event: MouseEvent) {
  if (!showContextMenu) return;

  event.preventDefault();
  contextMenu = {
    x: event.clientX,
    y: event.clientY,
    open: true
  };
}

function closeContextMenu() {
  contextMenu.open = false;
}

<!-- Add these components to the template -->
<div class="milkdown-editor-wrapper">
  {#if showToolbar}
    <Toolbar groups={toolbarGroups} />
  {/if}

  <div
    data-milkdown-editor
    bind:this={editorElement}
    class="milkdown-editor"
    class:loading
    class:error
    on:contextmenu={handleContextMenu}
  >
    <!-- existing editor content -->
  </div>

  {#if contextMenu.open}
    <ContextMenu
      x={contextMenu.x}
      y={contextMenu.y}
      onClose={closeContextMenu}
    />
  {/if}

  {#if enableThemeSelector}
    <ThemeSelector
      value={theme}
      onChange={handleThemeChange}
    />
  {/if}
</div>
```

## ✅ 完成标准

### 必须完成项
- [ ] 插件系统架构完整
- [ ] 常用插件 (bold, italic, header, table, link, image) 实现完成
- [ ] 工具栏组件正常工作
- [ ] 右键菜单功能完整
- [ ] 主题系统可用
- [ ] 响应式设计实现
- [ ] 移动设备适配完成
- [ ] 可访问性支持添加

### 验证测试
```bash
# 启动开发服务器
npm run dev

# 测试工具栏功能
# 测试右键菜单
# 测试主题切换
# 测试响应式设计 (调整浏览器窗口大小)
# 测试移动设备 (使用开发者工具)
```

### 功能验证清单
- [ ] 工具栏按钮点击正常
- [ ] 快捷键工作正常
- [ ] 右键菜单显示和操作正常
- [ ] 主题切换功能正常
- [ ] 移动设备上编辑器可用
- [ ] 触摸操作响应正常
- [ ] 键盘导航支持

## 📝 注意事项

1. **性能优化**: 避免在工具栏渲染时重复计算
2. **内存管理**: 确保插件正确安装和卸载
3. **可访问性**: 提供键盘导航和屏幕阅读器支持
4. **移动适配**: 确保触摸操作体验良好
5. **主题切换**: 状态持久化需要考虑

## 🚀 下一阶段

完成本阶段后，进入 [Phase 4: 开发体验优化](./phase-4-dx.md)，开始完善 TypeScript 类型、文档和性能优化。

## 🔍 故障排除

**常见问题**:

1. **工具栏不显示**: 检查插件是否正确注册
2. **主题切换无效**: 确认样式是否正确加载
3. **移动设备问题**: 检查触摸事件处理
4. **插件冲突**: 验证插件依赖关系

**调试技巧**:
```javascript
// 检查已注册的插件
console.log('Registered plugins:', pluginRegistry.list());

// 检查当前主题
console.log('Current theme:', themeManager.getCurrentTheme());

// 监听工具栏状态
console.log('Toolbar items:', toolbarItems);
```