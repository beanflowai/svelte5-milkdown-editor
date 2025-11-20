<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { EditorOptions } from '../types';
	import { useEditorInstance } from '../composables/useEditor';
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
			console.error('Error checking content changes:', err);
		}
	};

	// Initialize editor
	onMount(async () => {
		if (!editorElement) return;

		try {
			loading = true;
			error = null;

			editorAPI = useEditorInstance(editorElement, mergedOptions);
			await editorAPI.createInstance();

			// Update state
			instance = editorAPI.getInstance();
			loading = false;

			// Initialize last known content
			lastKnownContent = editorAPI.getContent();

			// Notify ready
			if (instance && onReady) {
				onReady(instance);
			}

			// Set up Milkdown event listeners if available
			if (instance?.crepe) {
				try {
					instance.crepe.on('update', () => {
						checkContentChanges();
					});
				} catch (e) {
					// Fallback to polling if events don't work
					contentMonitorInterval = setInterval(checkContentChanges, 3000);
				}
			} else {
				// Fallback polling (3 seconds, much less frequent)
				contentMonitorInterval = setInterval(checkContentChanges, 3000);
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
</script>

<div
	class="milkdown-editor {className}"
	class:loading
	class:error
	{id}
	style="height: {height}; min-height: {minHeight};"
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