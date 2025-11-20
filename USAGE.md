# 如何在第三方项目中使用 svelte5-milkdown-editor

## 方法一：本地测试安装（推荐用于开发测试）

### 1. 在本项目中打包

```bash
cd /Users/woohelps/CascadeProjects/svelte5-milkdown-editor
npm run package
npm pack
```

这将生成 `svelte5-milkdown-editor-0.0.1.tgz` 文件。

### 2. 在你的 BeanFlow-LLM 项目中安装

```bash
cd /Users/woohelps/CascadeProjects/BeanFlow-LLM/frontend
npm install /Users/woohelps/CascadeProjects/svelte5-milkdown-editor/svelte5-milkdown-editor-0.0.1.tgz
```

### 3. 在你的项目中使用

```svelte
<!-- 在 BeanFlow-LLM/frontend/src/SomeComponent.svelte -->
<script>
  import { MilkdownEditor } from 'svelte5-milkdown-editor';
  import 'svelte5-milkdown-editor/styles';

  let content = $state('# Hello from BeanFlow!');

  function handleChange(newContent) {
    content = newContent;
    console.log('Content:', newContent);
  }
</script>

<MilkdownEditor
  defaultValue={content}
  onChange={handleChange}
  theme="nord"
  height="500px"
/>
```

### 4. 配置 CSS（如果需要）

如果你的项目使用 Vite，CSS 应该自动加载。如果遇到样式问题，可以在主 JS/TS 文件中导入：

```javascript
// 在 main.ts 或 main.js
import 'svelte5-milkdown-editor/styles';
```

---

## 方法二：发布到 npm（推荐用于生产）

### 1. 准备发布

在发布前，请确保：

```bash
# 1. 更新 package.json 中的 repository 和 author
# 2. 登录 npm
npm login

# 3. 检查包内容
npm publish --dry-run
```

### 2. 发布到 npm

```bash
npm publish
```

### 3. 在第三方项目中安装

```bash
cd /Users/woohelps/CascadeProjects/BeanFlow-LLM/frontend
npm install svelte5-milkdown-editor
```

### 4. 使用方法同上

---

## 完整使用示例

### 基础编辑器

```svelte
<script lang="ts">
  import { MilkdownEditor } from 'svelte5-milkdown-editor';
  import type { EditorInstance } from 'svelte5-milkdown-editor';
  import 'svelte5-milkdown-editor/styles';

  let content = $state(`# BeanFlow LLM 项目文档

## 功能清单

- [ ] 用户认证
- [ ] API 集成
- [x] Markdown 编辑器

## 代码示例

\`\`\`typescript
function greet(name: string) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`
`);

  let editorInstance: EditorInstance | null = $state(null);

  function handleReady(instance: EditorInstance) {
    editorInstance = instance;
    console.log('Editor ready!', instance);
  }

  function handleChange(newContent: string) {
    content = newContent;
    // 自动保存到后端或 localStorage
    localStorage.setItem('draft', newContent);
  }

  function handleError(error: Error) {
    console.error('Editor error:', error);
  }
</script>

<div class="editor-container">
  <h2>文档编辑器</h2>
  
  <MilkdownEditor
    defaultValue={content}
    onChange={handleChange}
    onReady={handleReady}
    onError={handleError}
    theme="nord"
    height="600px"
    placeholder="开始编写你的文档..."
  />
  
  <div class="actions">
    <button onclick={() => editorInstance?.focus()}>
      聚焦编辑器
    </button>
    <button onclick={() => console.log(content)}>
      获取内容
    </button>
  </div>
</div>

<style>
  .editor-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
</style>
```

### 分屏编辑器（带自动保存）

```svelte
<script lang="ts">
  import { SplitViewEditor } from 'svelte5-milkdown-editor';
  import 'svelte5-milkdown-editor/styles';

  let content = $state('');
  let saving = $state(false);

  // 从后端加载初始内容
  async function loadContent() {
    const response = await fetch('/api/documents/123');
    const data = await response.json();
    content = data.content;
  }

  // 自动保存到后端
  async function saveToBackend(newContent: string) {
    saving = true;
    try {
      await fetch('/api/documents/123', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent })
      });
      console.log('保存成功');
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      saving = false;
    }
  }

  // 组件挂载时加载内容
  $effect(() => {
    loadContent();
  });
</script>

<div class="split-editor-container">
  {#if saving}
    <div class="save-indicator">保存中...</div>
  {/if}

  <SplitViewEditor
    defaultValue={content}
    theme="nord-dark"
    height="calc(100vh - 100px)"
    autosave={{
      enabled: true,
      delay: 3000,
      onSave: saveToBackend
    }}
  />
</div>

<style>
  .split-editor-container {
    position: relative;
    height: 100vh;
  }

  .save-indicator {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 0.5rem 1rem;
    background: #4c566a;
    color: white;
    border-radius: 4px;
    z-index: 1000;
  }
</style>
```

---

## 主题切换示例

```svelte
<script>
  import { MilkdownEditor } from 'svelte5-milkdown-editor';
  import 'svelte5-milkdown-editor/styles';

  let currentTheme = $state('nord');
  let editor;

  const themes = [
    { value: 'nord', label: 'Nord Light' },
    { value: 'nord-dark', label: 'Nord Dark' },
    { value: 'frame', label: 'Frame Light' },
    { value: 'frame-dark', label: 'Frame Dark' }
  ];

  function handleThemeChange(theme) {
    currentTheme = theme;
    editor?.setTheme(theme);
  }
</script>

<div class="theme-switcher">
  {#each themes as theme}
    <button
      class:active={currentTheme === theme.value}
      onclick={() => handleThemeChange(theme.value)}
    >
      {theme.label}
    </button>
  {/each}
</div>

<MilkdownEditor
  bind:this={editor}
  theme={currentTheme}
  defaultValue="# 主题切换示例"
  height="500px"
/>

<style>
  .theme-switcher {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    background: white;
    cursor: pointer;
  }

  button.active {
    background: #5e81ac;
    color: white;
    border-color: #5e81ac;
  }
</style>
```

---

## TypeScript 类型支持

包含完整的 TypeScript 类型定义：

```typescript
import type {
  EditorOptions,
  EditorInstance,
  AutosaveConfig,
  EditorTheme
} from 'svelte5-milkdown-editor';

interface MyDocumentProps {
  initialContent: string;
  onSave: (content: string) => Promise<void>;
}

// 类型安全的编辑器配置
const editorConfig: EditorOptions = {
  theme: 'nord',
  placeholder: '输入内容...',
  readonly: false,
  autosave: {
    enabled: true,
    delay: 2000,
    onSave: async (content) => {
      await saveToServer(content);
    }
  }
};
```

---

## 故障排除

### 样式不显示

确保导入了样式文件：

```javascript
import 'svelte5-milkdown-editor/styles';
```

### TypeScript 错误

确保你的 `tsconfig.json` 包含：

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "types": ["svelte"]
  }
}
```

### Vite 配置（如果需要）

```javascript
// vite.config.ts
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  optimizeDeps: {
    include: ['svelte5-milkdown-editor']
  }
});
```

---

## 更新包

### 本地测试包

```bash
# 在编辑器项目中
cd /Users/woohelps/CascadeProjects/svelte5-milkdown-editor
npm run package
npm pack

# 在 BeanFlow 项目中
cd /Users/woohelps/CascadeProjects/BeanFlow-LLM/frontend
npm uninstall svelte5-milkdown-editor
npm install /Users/woohelps/CascadeProjects/svelte5-milkdown-editor/svelte5-milkdown-editor-0.0.1.tgz
```

### npm 包

```bash
npm update svelte5-milkdown-editor
```

---

## 下一步

1. 在 BeanFlow-LLM 项目中测试安装
2. 根据需要调整样式和配置
3. 如果需要发布到 npm，记得更新 package.json 中的作者和仓库信息
4. 创建 GitHub 仓库并推送代码
5. 发布到 npm: `npm publish`

---

## 支持的功能

- ✅ Svelte 5 Runes
- ✅ TypeScript
- ✅ 4 种主题
- ✅ 分屏编辑
- ✅ 自动保存
- ✅ 任务列表
- ✅ 代码高亮
- ✅ 表格
- ✅ 响应式设计
