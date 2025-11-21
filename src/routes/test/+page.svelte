<script lang="ts">
	import { onMount } from 'svelte';
	import { MilkdownEditor } from 'svelte5-milkdown-editor';
	import { initializeThemes } from 'svelte5-milkdown-editor';
	import 'svelte5-milkdown-editor/styles';

	// 响应式状态
	let currentTheme: 'nord' | 'nord-dark' | 'frame' | 'frame-dark' = 'nord';
	let externalStylesEnabled = false;
	let editorInstance: any = null;

	// Test Markdown content
	const testMarkdown = `# Milkdown Editor Style Isolation Test

## This is a Test Page

This document is used to test **style isolation** and **theme switching** functionality.

### Test Content Includes:

1. **Style Isolation Test** - Verify that external styles do not affect the editor
2. **Theme Switching Test** - Test the switching effect of 4 themes
3. **Editing Functionality Test** - Verify that basic editing functions work properly

### Code Block Test

\`\`\`javascript
function testStyleIsolation() {
    console.log('Testing style isolation functionality');
    return 'External styles should not affect here';
}
\`\`\`

### List and Format Test

- **Bold text** test
- *Italic text* test
- \`Inline code\` test

| Feature | Status | Description |
|---------|--------|-------------|
| Style Isolation | ✅ | External styles do not affect the editor |
| Theme Switching | ✅ | Support for four themes |
| Editing Functions | ✅ | Basic functions work properly |

> 💡 **Tip**: Try switching different themes and enable/disable external styles to observe isolation effects.

---

🧪 **Style Isolation and Theme Switching Test Page**`;

	// Theme options
	const themes = [
		{ value: 'nord', label: 'Nord', description: 'Bright Nord theme' },
		{ value: 'nord-dark', label: 'Nord Dark', description: 'Dark Nord theme' },
		{ value: 'frame', label: 'Frame', description: 'Bright Frame theme' },
		{ value: 'frame-dark', label: 'Frame Dark', description: 'Dark Frame theme' }
	];

	// Initialize theme system
	onMount(() => {
		initializeThemes();
	});

	// Theme switching handler
	function handleThemeChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		currentTheme = select.value as 'nord' | 'nord-dark' | 'frame' | 'frame-dark';
	}

	// External styles toggle
	function toggleExternalStyles() {
		externalStylesEnabled = !externalStylesEnabled;
	}

	// Editor event handlers
	function handleReady(instance: any) {
		editorInstance = instance;
		console.log('Test editor ready:', instance);
	}

	function handleError(error: Error) {
		console.error('Editor error:', error);
	}

	function handleChange(content: string) {
		console.log('Content changed:', content.substring(0, 50) + '...');
	}
</script>

<svelte:head>
	<title>Milkdown Editor Test Page</title>
</svelte:head>

<!-- External styles test - these styles should be isolated -->
{#if externalStylesEnabled}
	<div class="external-styles-test">
		<!-- These are potentially conflicting external styles -->
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
	<!-- Test control panel -->
	<div class="control-panel">
		<h1>🧪 Milkdown Editor Test Page</h1>
		<p class="subtitle">Testing style isolation and theme switching functionality</p>

		<div class="controls">
			<!-- Theme selection -->
			<div class="control-group">
				<label for="theme-select">Theme Selection:</label>
				<select id="theme-select" value={currentTheme} on:change={handleThemeChange}>
					{#each themes as theme}
						<option value={theme.value}>{theme.label} - {theme.description}</option>
					{/each}
				</select>
			</div>

			<!-- External styles control -->
			<div class="control-group">
				<label>
					<input
						type="checkbox"
						checked={externalStylesEnabled}
						on:change={toggleExternalStyles}
					/>
					Enable external style pollution test
				</label>
				<small class="help-text">
					When enabled, adds potentially conflicting global styles to test style isolation effects
				</small>
			</div>
		</div>

		<!-- Test instructions -->
		<div class="test-info">
			<h3>Test Guide:</h3>
			<ul>
				<li><strong>Style Isolation Test</strong>: After enabling external styles, editor internal styles should not be affected</li>
				<li><strong>Theme Switching Test</strong>: Switch between different themes and observe real-time style changes in the editor</li>
				<li><strong>Editing Functionality Test</strong>: Test basic editing functions like typing and formatting</li>
			</ul>
		</div>
	</div>

	<!-- Editor test area -->
	<div class="editor-section">
		<h2>Editor Test Area</h2>
		<div class="editor-container" data-theme={currentTheme}>
			<MilkdownEditor
				id="test-editor"
				defaultValue={testMarkdown}
				theme={currentTheme}
				height="600px"
				placeholder="Enter test content here..."
				onReady={handleReady}
				onError={handleError}
				onChange={handleChange}
			/>
		</div>
	</div>

	<!-- External style influence display area -->
	{#if externalStylesEnabled}
		<div class="external-test-area">
			<h3>External Style Influence Display</h3>
			<p>This is a regular paragraph, should be affected by external styles (red text, orange dashed border)</p>
			<div>This is a regular div, should have blue border</div>
			<h1>This is a heading, should be purple with underline</h1>
			<code>This is inline code, should have yellow background with black text</code>
			<pre>This is a code block, should have green background with red dashed border</pre>
			<strong>This is bold text, should be green</strong>
			<em>This is italic text, should be orange</em>
			<ul>
				<li>List items should be brown</li>
			</ul>
		</div>
	{/if}

	<!-- Test results -->
	<div class="test-results">
		<h3>Test Results:</h3>
		<div class="result-item">
			<span class="label">Current Theme:</span>
			<span class="value">{currentTheme}</span>
		</div>
		<div class="result-item">
			<span class="label">External Styles:</span>
			<span class="value">{externalStylesEnabled ? 'Enabled (should be isolated)' : 'Disabled'}</span>
		</div>
		<div class="result-item">
			<span class="label">Editor Status:</span>
			<span class="value">{editorInstance ? 'Initialized' : 'Waiting for initialization'}</span>
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
		min-height: 600px;
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

	/* Responsive design */
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

	/* Dark mode support */
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