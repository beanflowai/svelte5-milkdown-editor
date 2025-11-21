import { getContext, onMount, onDestroy } from 'svelte';
import type { EditorContextValue, EditorOptions, EditorInstance } from '../types';
import { createEditor, destroyEditor, getMarkdownContent, setMarkdownContent } from '../utils/editor';
import { setTheme as setGlobalTheme, type ThemeName } from '../themes';

export function useEditor() {
	const context = getContext<EditorContextValue>('milkdown');

	if (!context) {
		throw new Error('useEditor must be used within a MilkdownProvider');
	}

	return {
		instance: context.instance,
		loading: context.loading,
		error: context.error,
		content: context.content,
		setContent: context.setContent
	};
}

export function useEditorInstance(element: HTMLElement, options: EditorOptions = {}) {
	let instance: EditorInstance | null = null;
	let loading = true;
	let error: Error | null = null;
	let content = options.defaultValue || '';

	const createInstance = async () => {
		if (!element) return;

		try {
			loading = true;
			error = null;

			const editorInstance = await createEditor(element, options);
			instance = editorInstance;

			// Get initial content
			content = getMarkdownContent(editorInstance);

			loading = false;
		} catch (err) {
			error = err instanceof Error ? err : new Error('Failed to create editor');
			loading = false;
		}
	};

	const destroyInstance = () => {
		if (instance) {
			try {
				destroyEditor(instance);
				instance = null;
			} catch (err) {
				console.error('Failed to destroy editor:', err);
			}
		}
	};

	const setContent = (newContent: string) => {
		if (!instance) {
			const newError = new Error('Cannot set content: editor instance not available');
			error = newError;
			throw newError;
		}

		try {
			setMarkdownContent(instance, newContent);
			content = newContent;
			console.log('Content successfully updated');
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : 'Unknown error';
			console.error('Failed to set content:', errorMsg);
			error = new Error(`Failed to set content: ${errorMsg}`);
			throw error;
		}
	};

	const getContent = (): string => {
		if (instance) {
			try {
				content = getMarkdownContent(instance);
			} catch (err) {
				error = err instanceof Error ? err : new Error('Failed to get content');
			}
		}
		return content;
	};

	const setTheme = (newTheme: ThemeName) => {
		setGlobalTheme(newTheme);
		if (instance) {
			instance.theme = newTheme;
		}
	};

	const getTheme = (): string => {
		return instance?.theme || 'nord';
	};

	return {
		createInstance,
		destroyInstance,
		setContent,
		getContent,
		setTheme,
		getTheme,
		getInstance: () => instance,
		getLoading: () => loading,
		getError: () => error
	};
}