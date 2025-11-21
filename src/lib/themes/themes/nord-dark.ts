import type { ThemeDefinition } from '../types';

export const nordDarkTheme: ThemeDefinition = {
	name: 'nord-dark',
	displayName: 'Nord Dark',
	colors: {
		background: '#2e3440', // Nord0 - Polar Night
		onBackground: '#d8dee9', // Nord6 - Snow Storm
		surface: '#3b4252', // Nord1 - Polar Night
		surfaceLow: '#434c5e', // Nord2 - Polar Night
		onSurface: '#d8dee9', // Nord6 - Snow Storm
		onSurfaceVariant: '#88c0d0', // Nord8 - Frost
		outline: '#4c566a', // Nord3 - Polar Night
		primary: '#5e81ac', // Nord9 - Frost
		secondary: '#4c566a', // Nord3 - Polar Night
		onSecondary: '#d8dee9', // Nord6 - Snow Storm
		inverse: '#d8dee9', // Nord6 - Snow Storm
		onInverse: '#2e3440', // Nord0 - Polar Night
		inlineCode: '#ebcb8b', // Nord13 - Aurora
		error: '#bf616a', // Nord11 - Aurora
		hover: '#434c5e', // Nord2 - Polar Night
		selected: '#5e81ac40', // Nord9 with transparency
		inlineArea: '#3b4252', // Nord1 - Polar Night
	},
	fonts: {
		title: 'Rubik, Cambria, "Times New Roman", Times, serif',
		default: 'Inter, Arial, Helvetica, sans-serif',
		code: "'JetBrains Mono', Menlo, Monaco, 'Courier New', Courier, monospace",
	},
	shadows: {
		light: '0px 1px 3px 1px rgba(0, 0, 0, 0.3), 0px 1px 2px 0px rgba(0, 0, 0, 0.5)',
		medium: '0px 2px 6px 2px rgba(0, 0, 0, 0.3), 0px 1px 2px 0px rgba(0, 0, 0, 0.5)',
	},
};