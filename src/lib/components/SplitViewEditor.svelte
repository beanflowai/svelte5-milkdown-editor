<script lang="ts">
	import MilkdownEditor from './MilkdownEditor.svelte';
	import type { EditorOptions } from '../types';
	import { globalThemeManager } from '../themes';

	interface Props {
		/** Initial markdown content */
		defaultValue?: string;
		/** Editor theme */
		theme?: 'nord' | 'nord-dark' | 'frame' | 'frame-dark';
		/** Editor height */
		height?: string;
		/** Auto-save configuration */
		autosave?: {
			enabled: boolean;
			delay?: number;
			onSave?: (content: string) => void;
		};
		/** Placeholder text */
		placeholder?: string;
		/** Events */
		onReady?: (instance: any) => void;
		onError?: (error: Error) => void;
	}

	let {
		defaultValue = '# Hello Milkdown\n\nStart typing...',
		theme = 'nord',
		height = '500px',
		autosave,
		placeholder,
		onReady,
		onError
	}: Props = $props();

	// Layout state
	let splitPosition = $state(50); // percentage
	let isDragging = $state(false);
	let viewMode = $state<'split' | 'editor' | 'raw'>('split');

	// Content state
	let markdownContent = $state(defaultValue);
	let rawTextContent = $state(defaultValue);

	// Editor instance
	let editorInstance: any = $state(null);

	// Handle content changes from editor
	function handleContentChange(content: string) {
		markdownContent = content;
		rawTextContent = content; // Sync raw text display

		// Auto-save if enabled
		if (autosave?.enabled) {
			handleAutoSave(content);
		}
	}

	function handleAutoSave(content: string) {
		if (autosave?.onSave) {
			console.log('Auto-saved:', content.substring(0, 50) + (content.length > 50 ? '...' : ''));
			autosave.onSave(content);
		}
	}

	// Handle raw text editing (optional - allow editing raw text)
	function handleRawTextChange(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		const newContent = target.value;
		rawTextContent = newContent;

		// Update editor content
		if (editorInstance && typeof editorInstance.setContent === 'function') {
			editorInstance.setContent(newContent);
		}
		markdownContent = newContent;
	}

	// Handle split resize
	function handleMouseDown(e: MouseEvent) {
		isDragging = true;
		document.body.style.cursor = 'col-resize';
		document.body.style.userSelect = 'none';
		e.preventDefault();
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDragging) return;

		const container = e.currentTarget as HTMLElement;
		const rect = container.getBoundingClientRect();
		const percentage = ((e.clientX - rect.left) / rect.width) * 100;
		splitPosition = Math.max(20, Math.min(80, percentage));
	}

	function handleMouseUp() {
		isDragging = false;
		document.body.style.cursor = '';
		document.body.style.userSelect = '';
	}

	// Utility functions
	function getWordCount(content: string): number {
		return content.trim().split(/\s+/).filter(word => word.length > 0).length;
	}

	function copyToClipboard(content: string): void {
		navigator.clipboard.writeText(content).then(() => {
			console.log('Content copied to clipboard');
		}).catch(err => {
			console.error('Failed to copy content:', err);
		});
	}

	// Handle theme changes
	async function setTheme(newTheme: 'nord' | 'nord-dark' | 'frame' | 'frame-dark') {
		try {
			await globalThemeManager.apply(newTheme);
			// Update split view container theme
			const container = document.querySelector('.split-view-container');
			if (container) {
				container.setAttribute('data-theme', newTheme);
			}
		} catch (error) {
			console.error('Failed to set theme:', error);
		}
	}
</script>

<svelte:window onmousemove={handleMouseMove} onmouseup={handleMouseUp} />

<div class="split-view-container" class:dragging={isDragging}>
	<!-- Toolbar -->
	<div class="toolbar">
		<div class="view-controls">
			<button
				class:active={viewMode === 'editor'}
				onclick={() => viewMode = 'editor'}
				title="Show editor only"
			>
				<span class="icon">📝</span>
				Editor
			</button>
			<button
				class:active={viewMode === 'split'}
				onclick={() => viewMode = 'split'}
				title="Show split view"
			>
				<span class="icon">📊</span>
				Split View
			</button>
			<button
				class:active={viewMode === 'raw'}
				onclick={() => viewMode = 'raw'}
				title="Show raw markdown only"
			>
				<span class="icon">📄</span>
				Raw Text
			</button>
		</div>

		<div class="toolbar-controls">
			<label for="theme-select">Theme:</label>
			<select
				id="theme-select"
				bind:value={theme}
				onchange={(e) => setTheme((e.target as HTMLSelectElement).value)}
			>
				<option value="nord">Nord</option>
				<option value="nord-dark">Nord Dark</option>
				<option value="frame">Frame Light</option>
				<option value="frame-dark">Frame Dark</option>
			</select>
		</div>
	</div>

	<!-- Split content area -->
	<div class="content-area">
		<!-- Editor pane -->
		<div
			class="editor-pane"
			style="flex-basis: {viewMode === 'split' ? splitPosition + '%' : '100%'}"
			class:hidden={viewMode === 'raw'}
		>
			<div class="pane-header">
				<h3>
					<span class="icon">📝</span>
					Visual Editor
				</h3>
				<div class="pane-stats">
					<span class="word-count">{getWordCount(markdownContent)} words</span>
					<span class="char-count">{markdownContent.length} chars</span>
				</div>
			</div>

			<div class="editor-content" style="height: calc({height} - 60px);">
				<MilkdownEditor
					bind:this={editorInstance}
					defaultValue={markdownContent}
					height="100%"
					placeholder={placeholder || 'Start typing your markdown here...'}
					theme={theme}
					onChange={handleContentChange}
					onReady={onReady}
					onError={onError}
				/>
			</div>
		</div>

		<!-- Resize handle -->
		{#if viewMode === 'split'}
			<div
				class="resize-handle"
				onmousedown={handleMouseDown}
				class:dragging={isDragging}
				title="Drag to resize panes"
			></div>
		{/if}

		<!-- Raw text pane -->
		<div
			class="raw-pane"
			style="flex-basis: {viewMode === 'split' ? (100 - splitPosition) + '%' : '100%'}"
			class:hidden={viewMode === 'editor'}
		>
			<div class="pane-header">
				<h3>
					<span class="icon">📄</span>
					Raw Markdown
				</h3>
				<div class="pane-controls">
					<button
						onclick={() => copyToClipboard(rawTextContent)}
						class="icon-button"
						title="Copy markdown to clipboard"
					>
						📋 Copy
					</button>
				</div>
			</div>

			<div class="raw-content" style="height: calc({height} - 60px);">
				<textarea
					bind:value={rawTextContent}
					oninput={handleRawTextChange}
					placeholder="Your markdown will appear here..."
					class="raw-textarea"
					spellcheck="false"
				></textarea>
			</div>
		</div>
	</div>

	<!-- Status bar -->
	<div class="status-bar">
		<span class="status-text">
			{viewMode === 'split' ? 'Split View' : viewMode === 'editor' ? 'Editor Only' : 'Raw Text Only'}
		</span>
		<span class="line-info">
			{markdownContent.split('\n').length} lines
		</span>
		{#if autosave?.enabled}
			<span class="autosave-info">Auto-save enabled</span>
		{/if}
	</div>
</div>

<style>
	.split-view-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: #fff;
		color: #333;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		overflow: hidden;
	}

	.split-view-container.dragging {
		cursor: col-resize;
	}

	/* Toolbar */
	.toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background: #f8f9fa;
		border-bottom: 1px solid var(--border-color, #e2e8f0);
		min-height: 60px;
		flex-shrink: 0;
	}

	.view-controls {
		display: flex;
		gap: 0.5rem;
	}

	.view-controls button {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--border-color, #e2e8f0);
		background: #fff;
		color: #333;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.view-controls button:hover {
		background: #f1f3f4;
		border-color: #d1d5db;
	}

	.view-controls button.active {
		background: #007bff;
		color: white;
		border-color: #007bff;
	}

	.view-controls button .icon {
		font-size: 1rem;
	}

	.toolbar-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.toolbar-controls label {
		font-weight: 500;
		color: #333;
		font-size: 0.875rem;
	}

	.toolbar-controls select {
		padding: 0.375rem 0.5rem;
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 4px;
		background: #fff;
		color: #333;
		font-size: 0.875rem;
		cursor: pointer;
	}

	/* Content area */
	.content-area {
		display: flex;
		flex: 1;
		overflow: hidden;
		position: relative;
	}

	.editor-pane,
	.raw-pane {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		min-width: 200px;
	}

	.editor-pane.hidden,
	.raw-pane.hidden {
		display: none;
	}

	.pane-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background: #f8f9fa;
		border-bottom: 1px solid var(--border-color, #e2e8f0);
		flex-shrink: 0;
		min-height: 60px;
	}

	.pane-header h3 {
		margin: 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: #333;
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}

	.pane-stats {
		display: flex;
		gap: 1rem;
		font-size: 0.75rem;
		color: var(--text-muted, #666);
	}

	.pane-controls {
		display: flex;
		gap: 0.5rem;
	}

	.icon-button {
		padding: 0.375rem 0.5rem;
		font-size: 0.75rem;
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 4px;
		background: #fff;
		color: #333;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.icon-button:hover {
		background: #f1f3f4;
		border-color: #d1d5db;
	}

	/* Editor content */
	.editor-content {
		padding: 0; /* 移除内边距，因为 MilkdownEditor 自己会处理 */
		overflow: hidden; /* 外层容器隐藏溢出，让内部编辑器处理滚动 */
		display: flex;
		flex-direction: column;
		min-height: 0; /* 确保flex子元素能正确缩小 */
		flex: 1; /* 占据剩余空间 */
	}

	/* Raw text content */
	.raw-content {
		padding: 1rem;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.raw-textarea {
		flex: 1;
		border: 1px solid #e2e8f0;
		border-radius: 4px;
		padding: 0.75rem;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
		font-size: 0.875rem;
		line-height: 1.5;
		resize: none;
		outline: none;
		background: #f8f9fa;
		color: #333;
	}

	.raw-textarea:focus {
		border-color: #007bff;
		box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
	}

	/* Resize handle */
	.resize-handle {
		width: 4px;
		background: var(--resize-handle-bg, #e2e8f0);
		cursor: col-resize;
		position: relative;
		flex-shrink: 0;
		transition: background-color 0.2s ease;
	}

	.resize-handle:hover,
	.resize-handle.dragging {
		background: #007bff;
	}

	.resize-handle::before {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 2px;
		height: 24px;
		background: var(--resize-handle-indicator, #999);
		border-radius: 1px;
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	.resize-handle:hover::before,
	.resize-handle.dragging::before {
		opacity: 1;
	}

	/* Status bar */
	.status-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 1rem;
		background: var(--status-bar-bg, #f8f9fa);
		border-top: 1px solid var(--border-color, #e2e8f0);
		font-size: 0.75rem;
		color: var(--text-muted, #666);
		flex-shrink: 0;
		min-height: 40px;
	}

	.status-bar span {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.content-area {
			flex-direction: column;
		}

		.resize-handle {
			width: 100%;
			height: 4px;
			cursor: row-resize;
		}

		.resize-handle::before {
			width: 24px;
			height: 2px;
		}

		.toolbar {
			flex-direction: column;
			gap: 0.75rem;
			align-items: stretch;
		}

		.view-controls,
		.toolbar-controls {
			justify-content: center;
		}

		.pane-header {
			flex-direction: column;
			gap: 0.5rem;
			align-items: flex-start;
		}
	}

	/* Theme-specific variables for frame theme */
	.split-view-container[data-theme="frame"] {
		--toolbar-bg: #f8f9fa;
		--pane-header-bg: #ffffff;
		--button-bg: #ffffff;
		--button-color: #333333;
		--button-hover-bg: #e9ecef;
		--button-hover-border: #dee2e6;
		--code-bg: #f8f9fa;
		--status-bar-bg: #f8f9fa;
		--text-muted: #6c757d;
		--border-color: #dee2e6;
		--resize-handle-bg: #dee2e6;
		--resize-handle-indicator: #adb5bd;
	}
</style>