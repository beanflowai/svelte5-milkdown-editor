<script lang="ts">
	import { MilkdownProvider, MilkdownEditor } from '$lib';

	let markdownContent = $state(`# Milkdown

👋 Welcome to Milkdown. We are so glad to see you here!

💭 You may wonder, what is Milkdown? Please write something here.

> ⚠️ **Not the right side!**
>
> Please try something on the left side.

![1.00](https://github.com/Milkdown/milkdown/blob/main/polar.jpeg "Hello by a polar bear")

You're seeing this editor called **🥞Crepe**, which is an editor built on top of Milkdown.

If you want to install this editor, you can run \`npm install @milkdown/crepe\`. Then you can use it like this:

\`\`\`js
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
// We have some themes for you to choose, ex.
import "@milkdown/crepe/theme/frame.css";

// Or you can create your own theme
import "./your-theme.css";

const crepe = new Crepe({
  root: "#app",
  defaultValue: "# Hello, Milkdown!",
});

crepe.create().then(() => {
  console.log("Milkdown is ready!");
});

// Before unmount
crepe.destroy();
\`\`\`

---

## Structure

> 🍼 [Milkdown](https://github.com/Milkdown/milkdown) is a WYSIWYG markdown editor framework.
>
> Which means you can build your own markdown editor with Milkdown.

In the real world, a typical milkdown editor is built on top of 3 layers:

- [x] 🥛 Core: The core of Milkdown, which provides the plugin loading system with the editor concepts.
- [x] 🧇 Plugins: A set of plugins that can be used to extend the functionalities of the editor.
- [x] 🍮 Components: Some headless components that can be used to build your own editor.

At the start, you may find it hard to understand all these concepts.
But don't worry, we have this \`@milkdown/crepe\` editor for you to get started quickly.

---

## You can do more with Milkdown

In Milkdown, you can extend the editor in many ways:

| Feature      | Description                                          | Example                   |
| ------------ | ---------------------------------------------------- | ------------------------- |
| 🎨 Theme     | Create your own theme with CSS                       | Nord, Dracula             |
| 🧩 Plugin    | Create your own plugin to extend the editor          | Search, Collab            |
| 📦 Component | Create your own component to build your own editor   | Slash Menu, Toolbar       |
| 📚 Syntax    | Create your own syntax to extend the markdown parser | Image with Caption, LaTex |

We have provided a lot of plugins and components, with an out-of-the-box crepe editor for you to use and learn.

---

## Open Source

- Milkdown is an open-source project under the MIT license.
- Everyone is welcome to contribute to the project, and you can use it in your own project for free.
- Please let me know what you are building with Milkdown, I would be so glad to see that!

Maintaining Milkdown is a lot of work, and we are working on it in our spare time.
If you like Milkdown, please consider supporting us by [sponsoring](https://github.com/sponsors/Saul-Mirone) the project.
We'll be so grateful for your support.

## Who built Milkdown?

Milkdown is built by [Mirone](https://github.com/Saul-Mirone) and designed by [Meo](https://meo.cool).`);

	let currentTheme = $state<'nord' | 'nord-dark' | 'frame' | 'frame-dark'>('nord');

	function handleContentChange(content: string) {
		markdownContent = content;
		console.log('Content changed:', content.substring(0, 50) + (content.length > 50 ? '...' : ''));
	}

	function handleAutoSave(content: string) {
		console.log('Auto-saved:', content.substring(0, 50) + (content.length > 50 ? '...' : ''));
	}

	// Store editor instance to handle theme changes
	let editorInstance: any = $state(null);

	// React to theme changes
	$effect(() => {
		if (editorInstance && typeof editorInstance.setTheme === 'function') {
			editorInstance.setTheme(currentTheme);
			console.log(`Theme changed to: ${currentTheme}`);
		}
	});
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
				bind:this={editorInstance}
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
