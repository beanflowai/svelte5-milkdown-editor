import type { Crepe, CrepeFeature } from '@milkdown/crepe';

export interface EditorInstance {
	crepe: Crepe;
}

export interface EditorOptions {
	/** Initial markdown content */
	defaultValue?: string;
	/** Editor features configuration */
	features?: Partial<Record<CrepeFeature, boolean>>;
	/** Theme configuration */
	theme?: 'nord' | 'nord-dark' | 'frame' | 'frame-dark';
	/** Placeholder text */
	placeholder?: string;
	/** Read-only mode */
	readonly?: boolean;
	/** Auto-save configuration */
	autosave?: {
		enabled: boolean;
		delay?: number;
		onSave?: (content: string) => void;
	};
}

export interface EditorContextValue {
	instance: EditorInstance | null;
	loading: boolean;
	error: Error | null;
	content: string;
	setContent: (content: string) => void;
}

export type MilkdownPlugin = {
	name: string;
	install: (crepe: Crepe) => void | Promise<void>;
	uninstall?: (crepe: Crepe) => void | Promise<void>;
};

export interface ToolbarConfig {
	items: ToolbarItem[];
	position?: 'top' | 'bottom' | 'floating';
}

export type ToolbarItem =
	| { type: 'separator' }
	| {
			type: 'action';
			icon: string;
			title: string;
			command: string;
			key?: string;
			active?: () => boolean;
	  }
	| {
			type: 'dropdown';
			icon: string;
			title: string;
			items: {
				title: string;
				command: string;
				active?: () => boolean;
			}[];
	  };