import type { EditorOptions, EditorInstance } from '../types';
import { Crepe } from '@milkdown/crepe';

export async function createEditor(element: HTMLElement, options: EditorOptions = {}): Promise<EditorInstance> {
	// Map theme names to CSS class names
	const themeClassMap = {
		'nord': 'nord',
		'nord-dark': 'nord-dark',
		'frame': 'frame',
		'frame-dark': 'frame-dark'
	};

	const crepe = new Crepe({
		root: element,
		defaultValue: options.defaultValue || '',
		features: options.features || {},
		// Apply theme by adding CSS class to the root element
		theme: themeClassMap[options.theme as keyof typeof themeClassMap] || 'nord'
	});

	await crepe.create();

	// Ensure the root element has the .milkdown class for proper styling
	element.classList.add('milkdown');

	// Apply theme data attribute to root element
	if (options.theme) {
		element.setAttribute('data-theme', options.theme);
	}

	return {
		crepe,
		theme: options.theme || 'nord'
	};
}

export function getMarkdownContent(instance: EditorInstance): string {
	return instance.crepe.getMarkdown();
}

export function setMarkdownContent(instance: EditorInstance, content: string): void {
	try {
		// In Milkdown 7.x with Crepe, we can use the setMarkdown method
		if (instance.crepe && typeof instance.crepe.setMarkdown === 'function') {
			instance.crepe.setMarkdown(content);
		} else {
			// Fallback: try to access the ProseMirror view directly
			const view = instance.crepe.editor?.view;
			if (view) {
				const { state, dispatch } = view;
				const { tr } = state;

				// Create a new transaction with the updated content
				const newDoc = state.schema.text(content);
				const newTr = tr.replaceWith(0, state.doc.content.size, newDoc.content);
				dispatch(newTr);
			} else {
				throw new Error('Cannot set content: editor view not available');
			}
		}
	} catch (error) {
		console.error('Failed to set markdown content:', error);
		throw new Error(`Failed to set content: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

export function destroyEditor(instance: EditorInstance): void {
	instance.crepe.destroy();
}