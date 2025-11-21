import type { ThemeDefinition } from '../types';

export const frameTheme: ThemeDefinition = {
	name: 'frame',
	displayName: 'Frame',
	colors: {
		background: '#ffffff',
		onBackground: '#000000',
		surface: '#f7f7f7',
		surfaceLow: '#ededed',
		onSurface: '#1c1c1c',
		onSurfaceVariant: '#4d4d4d',
		outline: '#a8a8a8',
		primary: '#333333',
		secondary: '#cfcfcf',
		onSecondary: '#000000',
		inverse: '#f0f0f0',
		onInverse: '#1a1a1a',
		inlineCode: '#ba1a1a',
		error: '#ba1a1a',
		hover: '#e0e0e0',
		selected: '#d5d5d5',
		inlineArea: '#cacaca',
	},
	fonts: {
		title: "'Noto Serif', Cambria, 'Times New Roman', Times, serif",
		default: "'Noto Sans', Arial, Helvetica, sans-serif",
		code: "'Space Mono', Fira Code, Menlo, Monaco, 'Courier New', Courier, monospace",
	},
	shadows: {
		light: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
		medium: '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
	},
};