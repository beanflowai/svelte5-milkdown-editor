<script lang="ts">
	import { onMount } from 'svelte';
	import MilkdownEditor from '$lib/components/MilkdownEditor.svelte';
	import { initializeThemes } from '$lib/themes';

	// 响应式状态
	let currentTheme: 'nord' | 'nord-dark' | 'frame' | 'frame-dark' = 'nord';
	let externalStylesEnabled = false;
	let editorInstance: any = null;

	// 测试用的 Markdown 内容
	const testMarkdown = `# Milkdown 编辑器样式隔离测试

## 这是一个测试页面

本文档用于测试 **样式隔离** 和 **主题切换** 功能。

### 测试内容包括：

1. **样式隔离测试** - 验证外部样式不会影响编辑器
2. **主题切换测试** - 测试 4 种主题的切换效果
3. **编辑功能测试** - 验证基础编辑功能正常

### 代码块测试

\`\`\`javascript
function testStyleIsolation() {
    console.log('测试样式隔离功能');
    return '外部样式不应该影响这里';
}
\`\`\`

### 列表和格式测试

- **粗体文本** 测试
- *斜体文本* 测试
- \`行内代码\` 测试

| 功能 | 状态 | 说明 |
|------|------|------|
| 样式隔离 | ✅ | 外部样式不影响编辑器 |
| 主题切换 | ✅ | 支持四种主题 |
| 编辑功能 | ✅ | 基础功能正常 |

> 💡 **提示**: 尝试切换不同的主题，并启用/禁用外部样式来观察隔离效果。

---

🧪 **样式隔离和主题切换测试页面**`;

	// 主题选项
	const themes = [
		{ value: 'nord', label: 'Nord', description: '明亮的 Nord 主题' },
		{ value: 'nord-dark', label: 'Nord Dark', description: '暗色 Nord 主题' },
		{ value: 'frame', label: 'Frame', description: '明亮的 Frame 主题' },
		{ value: 'frame-dark', label: 'Frame Dark', description: '暗色 Frame 主题' }
	];

	// 初始化主题系统
	onMount(() => {
		initializeThemes();
	});

	// 主题切换处理
	function handleThemeChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		currentTheme = select.value as 'nord' | 'nord-dark' | 'frame' | 'frame-dark';
	}

	// 外部样式切换
	function toggleExternalStyles() {
		externalStylesEnabled = !externalStylesEnabled;
	}

	// 编辑器事件处理
	function handleReady(instance: any) {
		editorInstance = instance;
		console.log('测试编辑器已准备就绪:', instance);
	}

	function handleError(error: Error) {
		console.error('编辑器错误:', error);
	}

	function handleChange(content: string) {
		console.log('内容变化:', content.substring(0, 50) + '...');
	}
</script>

<svelte:head>
	<title>Milkdown 编辑器测试页面</title>
</svelte:head>

<!-- 外部样式测试 - 这些样式应该被隔离 -->
{#if externalStylesEnabled}
	<div class="external-styles-test">
		<!-- 这些是可能冲突的外部样式 -->
		<style>
			:global(p) {
				color: red !important;
				border: 1px dashed orange;
				padding: 2px !important;
			}

			:global(div) {
				border: 2px solid blue;
			}

			:global(h1, h2, h3, h4, h5, h6) {
				color: purple !important;
				text-decoration: underline;
			}

			:global(code) {
				background: yellow !important;
				color: black !important;
			}

			:global(pre) {
				background: lime !important;
				border: 3px dotted red;
			}

			:global(strong) {
				color: green !important;
				font-weight: normal;
			}

			:global(em) {
				color: orange !important;
				font-style: normal;
			}

			:global(ul, ol) {
				color: brown !important;
				list-style-type: square;
			}

			:global(table) {
				border: 3px double pink;
				background: lightgray !important;
			}

			:global(blockquote) {
				border-color: red !important;
				background: yellow !important;
				color: black !important;
			}
		</style>
	</div>
{/if}

<div class="test-page">
	<!-- 测试控制面板 -->
	<div class="control-panel">
		<h1>🧪 Milkdown 编辑器测试页面</h1>
		<p class="subtitle">测试样式隔离和主题切换功能</p>

		<div class="controls">
			<!-- 主题选择 -->
			<div class="control-group">
				<label for="theme-select">主题选择:</label>
				<select id="theme-select" value={currentTheme} on:change={handleThemeChange}>
					{#each themes as theme}
						<option value={theme.value}>{theme.label} - {theme.description}</option>
					{/each}
				</select>
			</div>

			<!-- 外部样式控制 -->
			<div class="control-group">
				<label>
					<input
						type="checkbox"
						checked={externalStylesEnabled}
						on:change={toggleExternalStyles}
					/>
					启用外部样式污染测试
				</label>
				<small class="help-text">
					启用后会添加可能冲突的全局样式，用于测试样式隔离效果
				</small>
			</div>
		</div>

		<!-- 测试说明 -->
		<div class="test-info">
			<h3>测试指南:</h3>
			<ul>
				<li><strong>样式隔离测试</strong>: 启用外部样式后，编辑器内部样式不应该被影响</li>
				<li><strong>主题切换测试</strong>: 切换不同主题，观察编辑器样式实时变化</li>
				<li><strong>编辑功能测试</strong>: 测试输入、格式化等基础编辑功能</li>
			</ul>
		</div>
	</div>

	<!-- 编辑器测试区域 -->
	<div class="editor-section">
		<h2>编辑器测试区域</h2>
		<div class="editor-container" data-theme={currentTheme}>
			<MilkdownEditor
				id="test-editor"
				defaultValue={testMarkdown}
				theme={currentTheme}
				height="600px"
				placeholder="在这里输入测试内容..."
				onReady={handleReady}
				onError={handleError}
				onChange={handleChange}
			/>
		</div>
	</div>

	<!-- 外部样式影响展示区域 -->
	{#if externalStylesEnabled}
		<div class="external-test-area">
			<h3>外部样式影响展示</h3>
			<p>这是一个普通段落，应该被外部样式影响（红色文字、橙色虚线边框）</p>
			<div>这是一个普通的 div，应该有蓝色边框</div>
			<h1>这是一个标题，应该是紫色并带下划线</h1>
			<code>这是行内代码，应该是黄色背景黑色文字</code>
			<pre>这是代码块，应该是绿色背景红色虚线边框</pre>
			<strong>这是粗体，应该是绿色文字</strong>
			<em>这是斜体，应该是橙色文字</em>
			<ul>
				<li>列表项应该是棕色</li>
			</ul>
		</div>
	{/if}

	<!-- 测试结果 -->
	<div class="test-results">
		<h3>测试结果:</h3>
		<div class="result-item">
			<span class="label">当前主题:</span>
			<span class="value">{currentTheme}</span>
		</div>
		<div class="result-item">
			<span class="label">外部样式:</span>
			<span class="value">{externalStylesEnabled ? '已启用（应被隔离）' : '已禁用'}</span>
		</div>
		<div class="result-item">
			<span class="label">编辑器状态:</span>
			<span class="value">{editorInstance ? '已初始化' : '等待初始化'}</span>
		</div>
	</div>
</div>

<style>
	.test-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background: #fafafa;
		min-height: 100vh;
	}

	.control-panel {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
	}

	.control-panel h1 {
		margin: 0 0 0.5rem 0;
		color: #1a202c;
		font-size: 2rem;
	}

	.subtitle {
		margin: 0 0 2rem 0;
		color: #64748b;
		font-size: 1.1rem;
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.control-group label {
		font-weight: 600;
		color: #374151;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.control-group select {
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		font-size: 0.9rem;
		min-width: 200px;
	}

	.help-text {
		color: #6b7280;
		font-size: 0.8rem;
		line-height: 1.4;
	}

	.test-info {
		background: #f0f9ff;
		border: 1px solid #0ea5e9;
		border-radius: 6px;
		padding: 1rem;
	}

	.test-info h3 {
		margin: 0 0 0.5rem 0;
		color: #0c4a6e;
	}

	.test-info ul {
		margin: 0;
		padding-left: 1.5rem;
	}

	.test-info li {
		margin-bottom: 0.25rem;
		color: #0c4a6e;
	}

	.editor-section {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
	}

	.editor-section h2 {
		margin: 0 0 1rem 0;
		color: #1a202c;
	}

	.editor-container {
		border: 1px solid #e2e8f0;
		border-radius: 6px;
		overflow: hidden;
	}

	.external-test-area {
		background: #fffbeb;
		border: 1px solid #f59e0b;
		border-radius: 6px;
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	.external-test-area h3 {
		margin: 0 0 1rem 0;
		color: #92400e;
	}

	.test-results {
		background: white;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.test-results h3 {
		margin: 0 0 1rem 0;
		color: #1a202c;
	}

	.result-item {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem 0;
		border-bottom: 1px solid #f3f4f6;
	}

	.result-item:last-child {
		border-bottom: none;
	}

	.label {
		font-weight: 600;
		color: #374151;
	}

	.value {
		color: #6b7280;
		font-family: monospace;
	}

	/* 响应式设计 */
	@media (max-width: 768px) {
		.test-page {
			padding: 1rem;
		}

		.controls {
			flex-direction: column;
			gap: 1rem;
		}

		.control-panel,
		.editor-section,
		.external-test-area,
		.test-results {
			padding: 1rem;
		}

		.control-panel h1 {
			font-size: 1.5rem;
		}
	}

	/* 深色模式支持 */
	@media (prefers-color-scheme: dark) {
		.test-page {
			background: #0f172a;
		}

		.control-panel,
		.editor-section,
		.test-results {
			background: #1e293b;
		}

		.control-panel h1,
		.editor-section h2,
		.test-results h3 {
			color: #f1f5f9;
		}

		.subtitle,
		.value {
			color: #94a3b8;
		}

		.control-group label,
		.label {
			color: #e2e8f0;
		}

		.control-group select {
			background: #374151;
			border-color: #4b5563;
			color: #e5e7eb;
		}

		.result-item {
			border-color: #374151;
		}

		.external-test-area {
			background: #451a03;
			border-color: #d97706;
		}

		.external-test-area h3 {
			color: #fed7aa;
		}

		.test-info {
			background: #1e3a8a;
			border-color: #3b82f6;
		}

		.test-info h3,
		.test-info li {
			color: #dbeafe;
		}
	}
</style>