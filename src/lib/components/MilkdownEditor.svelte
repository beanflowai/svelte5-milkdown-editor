<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { EditorOptions } from '../types';
	import { useEditorInstance } from '../composables/useEditor';
	import { globalThemeRegistry, ThemeManager } from '../themes';
	import '../styles/milkdown.css';

	interface Props {
		/** Editor options */
		options?: EditorOptions;
		/** Initial markdown content */
		defaultValue?: string;
		/** CSS class for the editor container */
		class?: string;
		/** Editor ID */
		id?: string;
		/** Placeholder text */
		placeholder?: string;
		/** Read-only mode */
		readonly?: boolean;
		/** Height of the editor */
		height?: string;
		/** Minimum height */
		minHeight?: string;
		/** Theme */
		theme?: 'nord' | 'nord-dark' | 'frame' | 'frame-dark';
		/** Auto-save configuration */
		autosave?: {
			enabled: boolean;
			delay?: number;
			onSave?: (content: string) => void;
		};
		/** Events */
		onReady?: (instance: any) => void;
		onChange?: (content: string) => void;
		onError?: (error: Error) => void;
	}

	let {
		options = {},
		defaultValue = '',
		class: className = '',
		id = 'milkdown-editor',
		placeholder,
		readonly,
		height = '400px',
		minHeight = '300px',
		theme = 'nord',
		autosave,
		onReady,
		onChange,
		onError
	}: Props = $props();

	// Editor element reference
	let editorElement: HTMLElement;
	let editorAPI: ReturnType<typeof useEditorInstance> | null = null;

	// Timers and intervals
	let contentMonitorInterval: any = null;
	let autoSaveTimeout: any = null;

	// Reactive state
	let loading = $state(true);
	let error = $state<Error | null>(null);
	let instance = $state<any>(null);

	// Content tracking
	let lastKnownContent = $state('');
	let pendingAutoSave = $state(false);

	// Create local theme manager for this editor instance
	let localThemeManager: ThemeManager;

	// Apply theme using local theme manager
	$effect(() => {
		if (theme && localThemeManager && editorElement) {
			// 确保编辑器DOM已准备就绪后立即应用主题
			try {
				localThemeManager.apply(theme);
			} catch (error) {
				console.warn('Failed to apply theme:', error);
			}
		}
	});

	// Set theme data attribute on editor element
	$effect(() => {
		if (editorElement && theme) {
			editorElement.setAttribute('data-theme', theme);
		}
	});

	// Merge default options with props
	const mergedOptions: EditorOptions = {
		defaultValue,
		placeholder,
		readonly,
		theme,
		autosave,
		...options
	};

	// Auto-save helper function
	const scheduleAutoSave = (content: string) => {
		if (!autosave?.enabled || pendingAutoSave) return;

		pendingAutoSave = true;
		autoSaveTimeout = setTimeout(() => {
			if (autosave.onSave) {
				autosave.onSave(content);
			}
			pendingAutoSave = false;
			autoSaveTimeout = null;
		}, autosave.delay || 3000); // 3 seconds default
	};

	// Content change detection
	const checkContentChanges = () => {
		if (!editorAPI || loading) return;

		try {
			const currentContent = editorAPI.getContent();

			// Only trigger onChange if content actually changed
			if (currentContent !== lastKnownContent && onChange) {
				onChange(currentContent);
				scheduleAutoSave(currentContent);
				lastKnownContent = currentContent;
			}
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : 'Unknown error';
			console.error('Error checking content changes:', errorMsg);
			error = new Error(`Failed to check content changes: ${errorMsg}`);
			if (onError) {
				onError(error);
			}
		}
	};

	// Initialize editor
	onMount(async () => {
		if (!editorElement) return;

		try {
			loading = true;
			error = null;

			// Create local theme manager for this editor instance
			localThemeManager = new ThemeManager(globalThemeRegistry, editorElement);

			editorAPI = useEditorInstance(editorElement, mergedOptions);
			await editorAPI.createInstance();

			// Update state
			instance = editorAPI.getInstance();
			loading = false;

			// Apply initial theme immediately after editor creation
			if (theme && localThemeManager) {
				localThemeManager.apply(theme);
			}

			// Initialize last known content
			lastKnownContent = editorAPI.getContent();

			// Notify ready
			if (instance && onReady) {
				onReady(instance);
			}

			// Set up Milkdown event listeners if available
			if (instance?.crepe) {
				try {
					// 正确使用 Crepe 的 on API
					instance.crepe.on((listenerManager) => {
						// 监听文档更新
						listenerManager.updated(() => {
							checkContentChanges();
						});

						// 监听 Markdown 内容更新
						listenerManager.markdownUpdated(() => {
							checkContentChanges();
						});

						// 监听选择变化
						listenerManager.selectionUpdated(() => {
							checkContentChanges();
						});
					});

					// 仍然保留轮询作为备选，但间隔更长
					contentMonitorInterval = setInterval(checkContentChanges, 15000); // 15秒
				} catch (e) {
					console.warn('Failed to set up event listeners, using polling fallback:', e);
					// 轮询备选方案
					contentMonitorInterval = setInterval(checkContentChanges, 8000); // 8秒
				}
			} else {
				// 轮询备选方案
				contentMonitorInterval = setInterval(checkContentChanges, 8000);
			}

		} catch (err) {
			error = err instanceof Error ? err : new Error('Failed to initialize editor');
			loading = false;
			if (onError) {
				onError(error);
			}
		}
	});

	// Cleanup on destroy - moved to top level
	onDestroy(() => {
		if (contentMonitorInterval) {
			clearInterval(contentMonitorInterval);
			contentMonitorInterval = null;
		}
		if (autoSaveTimeout) {
			clearTimeout(autoSaveTimeout);
			autoSaveTimeout = null;
		}
		if (editorAPI) {
			editorAPI.destroyInstance();
		}
	});

	// Public methods
	export function getContent() {
		return editorAPI?.getContent() || '';
	}

	export function setContent(content: string) {
		editorAPI?.setContent(content);
	}

	export function getEditorInstance() {
		return instance;
	}

	export function focus() {
		editorElement?.focus();
	}

	export function blur() {
		editorElement?.blur();
	}

	export async function setTheme(newTheme: 'nord' | 'nord-dark' | 'frame' | 'frame-dark') {
		try {
			if (localThemeManager) {
				await localThemeManager.apply(newTheme);
			}
			if (editorElement) {
				editorElement.setAttribute('data-theme', newTheme);
			}
		} catch (error) {
			console.error('Failed to set theme:', error);
			throw error;
		}
	}

	export function getTheme(): string {
		return localThemeManager?.getCurrentName() || theme || 'nord';
	}
</script>

<div
	class="milkdown milkdown-editor {className}"
	class:loading
	class:error
	{id}
	style="height: {height}; min-height: {minHeight}; flex: 1;"
	bind:this={editorElement}
	role="textbox"
	aria-multiline="true"
	aria-label="Markdown editor"
	tabindex={readonly ? -1 : 0}
>
	{#if loading}
		<div class="loading-indicator">
			<div class="spinner"></div>
			<span>Loading editor...</span>
		</div>
	{:else if error}
		<div class="error-message">
			<strong>Error:</strong> {error.message}
		</div>
	{/if}
</div>

<style>
	/* Additional component-specific styles can go here */
</style>