export interface ThemeColors {
	/** Background color for the main editor area */
	background: string;
	/** Text color on background */
	onBackground: string;
	/** Surface color for toolbars and panels */
	surface: string;
	/** Low emphasis surface color */
	surfaceLow: string;
	/** Text color on surfaces */
	onSurface: string;
	/** Variant text color on surfaces */
	onSurfaceVariant: string;
	/** Outline and border color */
	outline: string;
	/** Primary brand color */
	primary: string;
	/** Secondary accent color */
	secondary: string;
	/** Text color on secondary elements */
	onSecondary: string;
	/** Inverse background color */
	inverse: string;
	/** Text color on inverse background */
	onInverse: string;
	/** Inline code text color */
	inlineCode: string;
	/** Error state color */
	error: string;
	/** Hover state color */
	hover: string;
	/** Selected state color */
	selected: string;
	/** Inline area background color */
	inlineArea: string;
}

export interface ThemeFonts {
	/** Font for titles and headings */
	title: string;
	/** Default font for body text */
	default: string;
	/** Font for code blocks */
	code: string;
}

export interface ThemeShadows {
	/** Light shadow for elevated elements */
	light: string;
	/** Medium shadow for floating elements */
	medium: string;
}

export interface ThemeDefinition {
	/** Unique theme identifier */
	name: string;
	/** Display name for UI */
	displayName: string;
	/** Color palette */
	colors: ThemeColors;
	/** Typography settings */
	fonts: ThemeFonts;
	/** Shadow effects */
	shadows: ThemeShadows;
}

export type ThemeName = string;

export interface ThemeRegistry {
	/** Get theme by name */
	get(name: ThemeName): ThemeDefinition | undefined;
	/** Register a new theme */
	register(theme: ThemeDefinition): void;
	/** Get all registered themes */
	getAll(): ThemeDefinition[];
	/** Check if theme exists */
	has(name: ThemeName): boolean;
}

export interface ThemeInjector {
	/** Apply theme to DOM */
	apply(theme: ThemeDefinition): void;
	/** Remove all theme variables */
	remove(): void;
	/** Get currently applied theme */
	getCurrent(): ThemeDefinition | undefined;
}