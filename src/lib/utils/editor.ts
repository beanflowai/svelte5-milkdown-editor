import type { EditorOptions, EditorInstance } from '../types';
import { Crepe } from '@milkdown/crepe';

export async function createEditor(element: HTMLElement, options: EditorOptions = {}): Promise<EditorInstance> {
	const crepe = new Crepe({
		root: element,
		defaultValue: options.defaultValue || '',
		features: options.features || {}
	});

	await crepe.create();

	return {
		crepe
	};
}

export function getMarkdownContent(instance: EditorInstance): string {
	return instance.crepe.getMarkdown();
}

export function setMarkdownContent(instance: EditorInstance, content: string): void {
	// TODO: Implement set content functionality for Milkdown 7.x
	// For now, this is a placeholder
	console.warn('setMarkdownContent not yet implemented for Milkdown 7.x');
}

export function destroyEditor(instance: EditorInstance): void {
	instance.crepe.destroy();
}