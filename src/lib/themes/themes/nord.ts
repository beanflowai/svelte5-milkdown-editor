import type { ThemeDefinition } from '../types';

export const nordTheme: ThemeDefinition = {
	name: 'nord',
	displayName: 'Nord',
	colors: {
		background: '#fdfcff',
		onBackground: '#1b1c1d',
		surface: '#f8f9ff',
		surfaceLow: '#f2f3fa',
		onSurface: '#191c20',
		onSurfaceVariant: '#43474e',
		outline: '#73777f',
		primary: '#37618e',
		secondary: '#d7e3f8',
		onSecondary: '#101c2b',
		inverse: '#2e3135',
		onInverse: '#eff0f7',
		inlineCode: '#ba1a1a',
		error: '#ba1a1a',
		hover: '#eceef4',
		selected: '#e1e2e8',
		inlineArea: '#d8dae0',
	},
	fonts: {
		title: 'Rubik, Cambria, "Times New Roman", Times, serif',
		default: 'Inter, Arial, Helvetica, sans-serif',
		code: "'JetBrains Mono', Menlo, Monaco, 'Courier New', Courier, monospace",
	},
	shadows: {
		light: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
		medium: '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
	},
};