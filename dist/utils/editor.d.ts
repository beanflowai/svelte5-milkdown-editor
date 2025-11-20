import type { EditorOptions, EditorInstance } from '../types';
export declare function createEditor(element: HTMLElement, options?: EditorOptions): Promise<EditorInstance>;
export declare function getMarkdownContent(instance: EditorInstance): string;
export declare function setMarkdownContent(instance: EditorInstance, content: string): void;
export declare function destroyEditor(instance: EditorInstance): void;
