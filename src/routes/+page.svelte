<script lang="ts">
	import { MilkdownProvider, MilkdownEditor } from '$lib';

	let markdownContent = $state(`# Welcome to Svelte 5 Milkdown Editor

This is a **demo** of the Svelte 5 + Milkdown integration.

## Features

- **Bold text**
- *Italic text*
- \`Inline code\`
- [Links](https://example.com)

## Lists

1. First item
2. Second item
3. Third item

- Unordered item 1
- Unordered item 2

## Code Block

\`\`\`javascript
function hello() {
    console.log("Hello, Svelte 5!");
}
\`\`\`

> This is a blockquote
>
> It can span multiple lines

---

Try editing this content!`);

	let currentTheme = $state<'nord' | 'nord-dark' | 'frame' | 'frame-dark'>('nord');

	function handleContentChange(content: string) {
		markdownContent = content;
		console.log('Content changed:', content.substring(0, 50) + (content.length > 50 ? '...' : ''));
	}

	function handleAutoSave(content: string) {
		console.log('Auto-saved:', content.substring(0, 50) + (content.length > 50 ? '...' : ''));
	}
</script>

<main>
	<h1>Svelte 5 Milkdown Editor Demo</h1>

	<div class="theme-controls">
		<label for="theme-select">Theme:</label>
		<select id="theme-select" bind:value={currentTheme}>
			<option value="nord">Nord (Default)</option>
			<option value="nord-dark">Nord Dark</option>
			<option value="frame">Frame Light</option>
			<option value="frame-dark">Frame Dark</option>
		</select>
	</div>

	<div class="editor-container">
		<MilkdownProvider>
			<MilkdownEditor
				defaultValue={markdownContent}
				height="400px"
				placeholder="Start typing your markdown here..."
				theme={currentTheme}
				autosave={{
					enabled: true,
					delay: 3000,
					onSave: handleAutoSave
				}}
				onChange={handleContentChange}
				onReady={(instance) => {
					console.log('Editor ready: Milkdown instance initialized');
				}}
				onError={(error) => {
					console.error('Editor error:', error.message);
				}}
			/>
		</MilkdownProvider>
	</div>

	<div class="info-panel">
		<h2>Current Markdown Content:</h2>
		<pre class="content-preview">{markdownContent}</pre>
	</div>
</main>

<style>
	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	h1 {
		color: #333;
		margin-bottom: 2rem;
		text-align: center;
	}

	.editor-container {
		margin-bottom: 2rem;
	}

	.info-panel {
		background: #f5f5f5;
		padding: 1.5rem;
		border-radius: 8px;
	}

	.info-panel h2 {
		margin-top: 0;
		color: #333;
	}

	.content-preview {
		background: #fff;
		padding: 1rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		white-space: pre-wrap;
		max-height: 300px;
		overflow-y: auto;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 14px;
		line-height: 1.5;
	}

	.theme-controls {
		margin-bottom: 1rem;
		padding: 1rem;
		background: #f8f9fa;
		border-radius: 8px;
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.theme-controls label {
		font-weight: 600;
		color: #333;
	}

	.theme-controls select {
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		background: #fff;
		font-size: 14px;
		cursor: pointer;
	}

	.theme-controls select:hover {
		border-color: #007bff;
	}

	.theme-controls select:focus {
		outline: none;
		border-color: #007bff;
		box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
	}
</style>
