# Components API Reference

## MilkdownProvider

### 概述
`MilkdownProvider` 是编辑器的根组件，提供编辑器实例管理和上下文服务。

### Props

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `config` | `EditorConfig` | `{}` | 编辑器配置对象 |
| `children` | `Snippable` | - | 子组件内容 |

### Slots

| 插槽名 | 参数 | 描述 |
|--------|------|------|
| `default` | - | 默认内容插槽 |
| `loading` | - | 加载状态自定义内容 |
| `error` | `{ error: Error }` | 错误状态自定义内容 |

### 事件

| 事件名 | 参数 | 描述 |
|--------|------|------|
| `ready` | `{ editor: Editor }` | 编辑器准备就绪时触发 |
| `error` | `{ error: Error }` | 编辑器发生错误时触发 |

### 示例

```svelte
<script lang="ts">
  import { MilkdownProvider, MilkdownEditor } from '$lib';
  import { commonmark } from '@milkdown/preset-commonmark';

  const config = {
    features: [commonmark],
    theme: 'nord',
    placeholder: '开始输入...'
  };
</script>

<MilkdownProvider {config}>
  {#snippet loading()}
    <div>自定义加载提示...</div>
  {/snippet}

  {#snippet error({ error })}
    <div>错误: {error.message}</div>
  {/snippet}

  <MilkdownEditor />
</MilkdownProvider>
```

## MilkdownEditor

### 概述
`MilkdownEditor` 是主要的编辑器组件，提供丰富的编辑功能和交互体验。

### Props

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `value` | `string` | `''` | 编辑器内容（双向绑定） |
| `config` | `Partial<EditorConfig>` | `{}` | 编辑器配置 |
| `onChange` | `(value: string) => void` | - | 内容变化回调 |
| `onReady` | `(editor: Editor) => void` | - | 编辑器准备就绪回调 |
| `onFocus` | `(state: EditorState) => void` | - | 获得焦点回调 |
| `onBlur` | `(state: EditorState) => void` | - | 失去焦点回调 |
| `onSave` | `(content: string) => void` | - | 保存回调 |
| `onError` | `(error: Error) => void` | - | 错误回调 |
| `placeholder` | `string` | - | 占位符文本 |
| `readonly` | `boolean` | `false` | 是否只读 |
| `theme` | `string` | `'default'` | 主题名称 |
| `showToolbar` | `boolean` | `true` | 是否显示工具栏 |
| `showStatusBar` | `boolean` | `true` | 是否显示状态栏 |
| `showLineNumbers` | `boolean` | `false` | 是否显示行号 |
| `showWordCount` | `boolean` | `true` | 是否显示字数统计 |
| `toolbarGroups` | `ToolbarGroup[]` | - | 工具栏组配置 |
| `toolbarPosition` | `'top' \| 'bottom'` | `'top'` | 工具栏位置 |
| `toolbarSticky` | `boolean` | `true` | 工具栏是否粘性定位 |
| `autoSave` | `boolean` | `false` | 是否自动保存 |
| `autoSaveDelay` | `number` | `2000` | 自动保存延迟（毫秒） |
| `debounceInput` | `boolean` | `true` | 是否输入防抖 |
| `debounceDelay` | `number` | `300` | 防抖延迟（毫秒） |
| `customCSS` | `string` | - | 自定义 CSS |
| `customClasses` | `Record<string, string>` | - | 自定义 CSS 类名 |

### 事件

| 事件名 | 参数 | 描述 |
|--------|------|------|
| `change` | `{ value: string }` | 内容变化时触发 |
| `ready` | `{ editor: Editor }` | 编辑器准备就绪时触发 |
| `focus` | `{ state: EditorState }` | 获得焦点时触发 |
| `blur` | `{ state: EditorState }` | 失去焦点时触发 |
| `save` | `{ content: string }` | 保存时触发 |
| `error` | `{ error: Error }` | 发生错误时触发 |

### 方法（通过 ref 访问）

| 方法名 | 参数 | 返回值 | 描述 |
|--------|------|--------|------|
| `focus` | - | `void` | 获得焦点 |
| `blur` | - | `void` | 失去焦点 |
| `setContent` | `(content: string)` | `void` | 设置内容 |
| `getContent` | - | `string` | 获取内容 |
| `insertContent` | `(content: string, position?: number)` | `void` | 插入内容 |
| `insertImage` | `(src: string, alt?: string)` | `void` | 插入图片 |
| `insertLink` | `(text: string, href: string)` | `void` | 插入链接 |
| `insertTable` | `(rows: number, cols: number)` | `void` | 插入表格 |

### 示例

```svelte
<script lang="ts">
  import { MilkdownProvider, MilkdownEditor } from '$lib';
  import type { MilkdownEditor as MilkdownEditorType } from '$lib';

  let content = $state('# Hello World\n\n开始编辑内容...');
  let editorRef: MilkdownEditorType;

  const handleSave = (savedContent: string) => {
    console.log('保存内容:', savedContent);
  };

  const handleInsertImage = () => {
    if (editorRef) {
      editorRef.insertImage('https://example.com/image.jpg', '示例图片');
    }
  };

  const toolbarGroups = [
    {
      name: 'format',
      label: '格式',
      items: [
        { id: 'bold', type: 'button', icon: 'B', title: '加粗' },
        { id: 'italic', type: 'button', icon: 'I', title: '斜体' }
      ]
    }
  ];
</script>

<MilkdownProvider>
  <MilkdownEditor
    bind:this={editorRef}
    bind:value={content}
    onChange={content => console.log('内容变化:', content)}
    onSave={handleSave}
    placeholder="在这里输入 Markdown 内容..."
    theme="nord"
    showToolbar={true}
    toolbarGroups={toolbarGroups}
    autoSave={true}
    autoSaveDelay={3000}
    customCSS="
      .milkdown-editor {
        min-height: 400px;
      }
    "
  />

  <button on:click={handleInsertImage}>插入图片</button>
</MilkdownProvider>
```

## Toolbar

### 概述
`Toolbar` 是可配置的工具栏组件，提供格式化和编辑功能按钮。

### Props

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `groups` | `string[]` | `['format', 'insert']` | 要显示的工具栏组 |
| `compact` | `boolean` | `false` | 是否紧凑模式 |
| `vertical` | `boolean` | `false` | 是否垂直布局 |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | 工具栏位置 |
| `sticky` | `boolean` | `true` | 是否粘性定位 |
| `collapsible` | `boolean` | `true` | 是否可折叠 |
| `customItems` | `ToolbarItem[]` | - | 自定义工具栏项目 |

### 示例

```svelte
<script lang="ts">
  import { Toolbar } from '$lib';

  const customToolbarItems = [
    {
      id: 'custom-button',
      type: 'button',
      icon: '⚡',
      title: '自定义操作',
      action: () => console.log('自定义操作被点击')
    }
  ];
</script>

<Toolbar
  groups={['format', 'insert', 'table']}
  compact={true}
  customItems={customToolbarItems}
/>
```

## ContextMenu

### 概述
`ContextMenu` 是右键菜单组件，提供上下文相关的操作选项。

### Props

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `x` | `number` | - | 菜单 X 坐标 |
| `y` | `number` | - | 菜单 Y 坐标 |
| `open` | `boolean` | - | 是否显示菜单 |
| `onClose` | `() => void` | - | 关闭回调 |
| `items` | `MenuItem[]` | - | 自定义菜单项 |

### 示例

```svelte
<script lang="ts">
  import { ContextMenu } from '$lib';

  let contextMenu = $state({
    x: 0,
    y: 0,
    open: false
  });

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    contextMenu = {
      x: event.clientX,
      y: event.clientY,
      open: true
    };
  };

  const closeContextMenu = () => {
    contextMenu.open = false;
  };
</script>

<div on:contextmenu={handleContextMenu}>
  右键点击显示菜单
</div>

{#if contextMenu.open}
  <ContextMenu
    x={contextMenu.x}
    y={contextMenu.y}
    open={contextMenu.open}
    onClose={closeContextMenu}
  />
{/if}
```

## ThemeSelector

### 概述
`ThemeSelector` 是主题选择器组件，允许用户切换编辑器主题。

### Props

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `value` | `string` | - | 当前主题 |
| `onChange` | `(theme: string) => void` | - | 主题变化回调 |
| `showPreview` | `boolean` | `true` | 是否显示预览 |
| `compact` | `boolean` | `false` | 是否紧凑模式 |

### 示例

```svelte
<script lang="ts">
  import { ThemeSelector } from '$lib';

  let currentTheme = $state('nord');

  const handleThemeChange = (theme: string) => {
    currentTheme = theme;
    console.log('主题已切换为:', theme);
  };
</script>

<ThemeSelector
  bind:value={currentTheme}
  onChange={handleThemeChange}
  showPreview={true}
/>
```

## StatusBar

### 概述
`StatusBar` 是状态栏组件，显示编辑器状态信息和统计数据。

### Props

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `showWordCount` | `boolean` | `true` | 是否显示字数统计 |
| `showCharacterCount` | `boolean` | `true` | 是否显示字符统计 |
| `showLineCount` | `boolean` | `true` | 是否显示行数统计 |
| `showCursorPosition` | `boolean` | `true` | 是否显示光标位置 |
| `showSaveStatus` | `boolean` | `true` | 是否显示保存状态 |
| `showThemeSelector` | `boolean` | `false` | 是否显示主题选择器 |
| `customItems` | `StatusBarItem[]` | - | 自定义状态栏项目 |

### 示例

```svelte
<script lang="ts">
  import { StatusBar } from '$lib';

  const customStatusBarItems = [
    {
      id: 'custom-status',
      label: '自定义',
      value: () => new Date().toLocaleTimeString(),
      position: 'right'
    }
  ];
</script>

<StatusBar
  showWordCount={true}
  showCharacterCount={true}
  showLineCount={false}
  customItems={customStatusBarItems}
/>
```

## 组件组合示例

### 完整编辑器示例

```svelte
<script lang="ts">
  import {
    MilkdownProvider,
    MilkdownEditor,
    Toolbar,
    StatusBar,
    ThemeSelector
  } from '$lib';
  import { commonmark, gfm } from '@milkdown/preset-commonmark';

  let content = $state(`# 完整编辑器示例

这是一个功能完整的 Milkdown 编辑器。

## 特性

- 工具栏支持
- 状态栏
- 主题切换
- 自动保存
- 等等...

试试看！`);

  let currentTheme = $state('nord');
  let saveStatus = $state('saved');

  const handleSave = async (content: string) => {
    try {
      // 模拟保存操作
      await new Promise(resolve => setTimeout(resolve, 500));
      saveStatus = 'saved';
      setTimeout(() => saveStatus = 'idle', 2000);
    } catch (error) {
      saveStatus = 'error';
    }
  };

  const editorConfig = {
    features: [commonmark, gfm],
    theme: currentTheme,
    placeholder: '开始编写你的 Markdown 文档...',
    autoSave: true,
    autoSaveDelay: 3000
  };

  const toolbarGroups = [
    { name: 'format', label: '格式化' },
    { name: 'insert', label: '插入' },
    { name: 'table', label: '表格' }
  ];
</script>

<div class="editor-container">
  <MilkdownProvider config={editorConfig}>
    <!-- 工具栏 -->
    <Toolbar
      groups={toolbarGroups.map(g => g.name)}
      sticky={true}
      collapsible={true}
    />

    <!-- 编辑器主体 -->
    <MilkdownEditor
      bind:value={content}
      onChange={value => content = value}
      onSave={handleSave}
      showToolbar={false}
      showStatusBar={false}
      class="main-editor"
    />

    <!-- 主题选择器 -->
    <div class="theme-section">
      <h3>主题选择</h3>
      <ThemeSelector
        bind:value={currentTheme}
        onChange={theme => editorConfig.theme = theme}
      />
    </div>

    <!-- 状态栏 -->
    <StatusBar
      showWordCount={true}
      showCharacterCount={true}
      showSaveStatus={true}
      customItems={[
        {
          id: 'save-status',
          label: '保存状态',
          value: saveStatus,
          position: 'right'
        }
      ]}
    />
  </MilkdownProvider>
</div>

<style>
  .editor-container {
    max-width: 1000px;
    margin: 0 auto;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
  }

  .main-editor {
    min-height: 500px;
  }

  .theme-section {
    padding: 1rem;
    border-top: 1px solid #eee;
    background: #f9f9f9;
  }

  .theme-section h3 {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: #666;
  }
</style>
```

这个 API 参考提供了所有组件的详细使用方法，包括属性、事件、方法和示例代码，方便开发者快速上手和使用。