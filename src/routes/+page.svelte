<script lang="ts">
	import { MilkdownProvider } from '$lib';
	import SplitViewEditor from '$lib/components/SplitViewEditor.svelte';

	const defaultMarkdown = `# Milkdown Split View Editor

👋 Welcome to the split view demo! Try typing in the visual editor on the left.

## What is Split View?

**Left side**: WYSIWYG visual editor (rich text editing)
**Right side**: Raw markdown text (live synced)

## Features

- **🔄 Live Sync**: Changes sync between both panes
- **📏 Resizable**: Drag the divider to resize panes
- **🎯 View Modes**: Toggle between editor, split, or raw text
- **🎨 Themes**: Nord, Nord Dark, Frame, Frame Dark
- **📋 Copy**: Copy raw markdown to clipboard
- **💾 Auto-save**: Optional auto-save functionality

## Try It Out!

1. Type in the visual editor (left) → see raw markdown update (right)
2. Edit raw markdown (right) → see visual editor update (left)
3. Resize the panes by dragging the divider
4. Switch between different view modes using the toolbar
5. Try different themes

## Code Example

\`\`\`javascript
// This is a code block
function hello() {
    console.log("Hello, Split View!");
}
\`\`\`

> **Tip**: This is a blockquote. Notice how it appears in both the visual editor and raw markdown!

## Lists and Tables

### Task List

- [x] ✅ Visual editor on the left
- [x] ✅ Raw markdown on the right
- [x] ✅ Live synchronization
- [ ] 🔄 Try editing this item!

| Feature | Status | Description |
|---------|--------|-------------|
| Split View | ✅ | Left-right layout |
| Themes | ✅ | Multiple theme support |
| Responsive | ✅ | Works on mobile |

---

🥞 **Built with Svelte 5 + Milkdown Crepe**`;

	function handleReady(instance: any) {
		console.log('SplitViewEditor ready: Milkdown instance initialized');
	}

	function handleError(error: Error) {
		console.error('SplitViewEditor error:', error.message);
	}

	function handleAutoSave(content: string) {
		console.log('Auto-saved:', content.substring(0, 100) + (content.length > 100 ? '...' : ''));
		// Here you could save to localStorage, server, etc.
		localStorage.setItem('milkdown-content', content);
	}
</script>

<main>
	<div class="header">
		<h1>🎨 Svelte 5 Milkdown Split View Editor</h1>
		<p class="subtitle">
			WYSIWYG visual editor ↔ Raw markdown text • Live synchronization • Resizable panes
		</p>
	</div>

	<div class="editor-wrapper">
		<MilkdownProvider>
			<SplitViewEditor
				defaultValue={defaultMarkdown}
				height="calc(100vh - 120px)"
				theme="nord"
				autosave={{
					enabled: true,
					delay: 3000,
					onSave: handleAutoSave
				}}
				placeholder="Start typing your markdown here..."
				onReady={handleReady}
				onError={handleError}
			/>
		</MilkdownProvider>
	</div>

	<div class="footer">
		<p>
			💡 <strong>Tip:</strong> The visual editor (left) provides rich editing, while raw markdown (right) shows the actual markdown text. Both stay in sync!
		</p>
	</div>
</main>

<style>
	main {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background: #f8f9fa;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.header {
		background: white;
		padding: 1.5rem 2rem;
		border-bottom: 1px solid #e2e8f0;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	.header h1 {
		margin: 0 0 0.5rem 0;
		color: #1a202c;
		font-size: 1.875rem;
		font-weight: 700;
		text-align: center;
	}

	.subtitle {
		margin: 0;
		color: #64748b;
		text-align: center;
		font-size: 0.875rem;
		line-height: 1.4;
	}

	.editor-wrapper {
		flex: 1;
		padding: 1rem;
		min-height: 0;
	}

	.footer {
		background: white;
		padding: 1rem 2rem;
		border-top: 1px solid #e2e8f0;
		box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
	}

	.footer p {
		margin: 0;
		color: #64748b;
		text-align: center;
		font-size: 0.875rem;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.header {
			padding: 1rem;
		}

		.header h1 {
			font-size: 1.5rem;
		}

		.subtitle {
			font-size: 0.75rem;
		}

		.editor-wrapper {
			padding: 0.5rem;
		}

		.footer {
			padding: 0.75rem 1rem;
		}
	}

	/* Dark theme support for the page itself */
	@media (prefers-color-scheme: dark) {
		main {
			background: #0f172a;
		}

		.header,
		.footer {
			background: #1e293b;
			border-color: #334155;
		}

		.header h1 {
			color: #f1f5f9;
		}

		.subtitle,
		.footer p {
			color: #94a3b8;
		}
	}
</style>
