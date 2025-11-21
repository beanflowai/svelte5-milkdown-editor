import type { ThemeDefinition } from '../types';

export const frameDarkTheme: ThemeDefinition = {
	name: 'frame-dark',
	displayName: 'Frame Dark',
	colors: {
		background: '#1a202c', // Dark background
		onBackground: '#f7fafc', // Light text
		surface: '#2d3748', // Dark surface
		surfaceLow: '#4a5568', // Darker surface
		onSurface: '#e2e8f0', // Light surface text
		onSurfaceVariant: '#a0aec0', // Medium light variant text
		outline: '#718096', // Border color
		primary: '#63b3ed', // Blue primary
		secondary: '#4a5568', // Dark secondary
		onSecondary: '#e2e8f0', // Light text on secondary
		inverse: '#e2e8f0', // Light inverse background
		onInverse: '#2d3748', // Dark text on inverse
		inlineCode: '#f6ad55', // Orange inline code
		error: '#fc8181', // Light red for errors
		hover: '#4a5568', // Hover state
		selected: '#2b6cb040', // Selected state with transparency
		inlineArea: '#2d3748', // Inline area background
	},
	fonts: {
		title: "'Noto Serif', Cambria, 'Times New Roman', Times, serif",
		default: "'Noto Sans', Arial, Helvetica, sans-serif",
		code: "'Space Mono', Fira Code, Menlo, Monaco, 'Courier New', Courier, monospace",
	},
	shadows: {
		light: '0px 1px 3px 1px rgba(0, 0, 0, 0.4), 0px 1px 2px 0px rgba(0, 0, 0, 0.6)',
		medium: '0px 2px 6px 2px rgba(0, 0, 0, 0.4), 0px 1px 2px 0px rgba(0, 0, 0, 0.6)',
	},
};