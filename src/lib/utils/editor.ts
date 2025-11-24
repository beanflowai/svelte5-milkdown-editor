import type { EditorOptions, EditorInstance } from '../types';
import { Crepe } from '@milkdown/crepe';
import { replaceAll } from '@milkdown/utils';

export async function createEditor(element: HTMLElement, options: EditorOptions = {}): Promise<EditorInstance> {
	// Map theme names to CSS class names
	const themeClassMap = {
		'nord': 'nord',
		'frame': 'frame'
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
	if (!instance.crepe || !instance.crepe.editor) {
		throw new Error('Cannot set content: editor instance not available');
	}

	try {
		// Use Milkdown official replaceAll utility
		instance.crepe.editor.action(replaceAll(content));
	} catch (error) {
		console.error('Failed to set markdown content:', error);
		throw new Error(`Failed to set content: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

export function destroyEditor(instance: EditorInstance): void {
	instance.crepe.destroy();
}