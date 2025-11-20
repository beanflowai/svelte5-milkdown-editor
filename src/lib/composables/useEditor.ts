import { getContext, onMount, onDestroy } from 'svelte';
import type { EditorContextValue, EditorOptions, EditorInstance } from '../types';
import { createEditor, destroyEditor, getMarkdownContent, setMarkdownContent } from '../utils/editor';

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
		if (instance) {
			try {
				setMarkdownContent(instance, newContent);
				content = newContent;
			} catch (err) {
				error = err instanceof Error ? err : new Error('Failed to set content');
			}
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

	return {
		createInstance,
		destroyInstance,
		setContent,
		getContent,
		getInstance: () => instance,
		getLoading: () => loading,
		getError: () => error
	};
}