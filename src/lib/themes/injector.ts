import type { ThemeDefinition, ThemeInjector } from './types';

/**
 * CSS变量注入器 - 负责将主题配置应用到DOM
 */
export class CssThemeInjector implements ThemeInjector {
	private currentTheme: ThemeDefinition | undefined;
	private readonly rootElement: HTMLElement;

	constructor(rootElement: HTMLElement = typeof document !== 'undefined' ? document.documentElement : null as any) {
		this.rootElement = rootElement;
	}

	/**
	 * 应用主题到DOM
	 */
	apply(theme: ThemeDefinition): void {
		if (!this.rootElement) {
			return; // SSR环境或无可用元素时跳过
		}

		const { colors, fonts, shadows } = theme;

		// 应用颜色变量
		this.rootElement.style.setProperty('--crepe-color-background', colors.background);
		this.rootElement.style.setProperty('--crepe-color-on-background', colors.onBackground);
		this.rootElement.style.setProperty('--crepe-color-surface', colors.surface);
		this.rootElement.style.setProperty('--crepe-color-surface-low', colors.surfaceLow);
		this.rootElement.style.setProperty('--crepe-color-on-surface', colors.onSurface);
		this.rootElement.style.setProperty('--crepe-color-on-surface-variant', colors.onSurfaceVariant);
		this.rootElement.style.setProperty('--crepe-color-outline', colors.outline);
		this.rootElement.style.setProperty('--crepe-color-primary', colors.primary);
		this.rootElement.style.setProperty('--crepe-color-secondary', colors.secondary);
		this.rootElement.style.setProperty('--crepe-color-on-secondary', colors.onSecondary);
		this.rootElement.style.setProperty('--crepe-color-inverse', colors.inverse);
		this.rootElement.style.setProperty('--crepe-color-on-inverse', colors.onInverse);
		this.rootElement.style.setProperty('--crepe-color-inline-code', colors.inlineCode);
		this.rootElement.style.setProperty('--crepe-color-error', colors.error);
		this.rootElement.style.setProperty('--crepe-color-hover', colors.hover);
		this.rootElement.style.setProperty('--crepe-color-selected', colors.selected);
		this.rootElement.style.setProperty('--crepe-color-inline-area', colors.inlineArea);

		// 应用字体变量
		this.rootElement.style.setProperty('--crepe-font-title', fonts.title);
		this.rootElement.style.setProperty('--crepe-font-default', fonts.default);
		this.rootElement.style.setProperty('--crepe-font-code', fonts.code);

		// 应用阴影变量
		this.rootElement.style.setProperty('--crepe-shadow-1', shadows.light);
		this.rootElement.style.setProperty('--crepe-shadow-2', shadows.medium);

		// 设置data-theme属性以便CSS选择器使用
		this.rootElement.setAttribute('data-theme', theme.name);

		// 确保根元素有.milkdown类
		if (typeof document !== 'undefined') {
			const milkdownElements = this.rootElement.querySelectorAll('.milkdown');
			milkdownElements.forEach((element) => {
				if (!element.classList.contains('milkdown')) {
					element.classList.add('milkdown');
				}
			});
		}

		this.currentTheme = theme;
	}

	/**
	 * 移除所有主题变量
	 */
	remove(): void {
		const properties = [
			// 颜色变量
			'--crepe-color-background',
			'--crepe-color-on-background',
			'--crepe-color-surface',
			'--crepe-color-surface-low',
			'--crepe-color-on-surface',
			'--crepe-color-on-surface-variant',
			'--crepe-color-outline',
			'--crepe-color-primary',
			'--crepe-color-secondary',
			'--crepe-color-on-secondary',
			'--crepe-color-inverse',
			'--crepe-color-on-inverse',
			'--crepe-color-inline-code',
			'--crepe-color-error',
			'--crepe-color-hover',
			'--crepe-color-selected',
			'--crepe-color-inline-area',
			// 字体变量
			'--crepe-font-title',
			'--crepe-font-default',
			'--crepe-font-code',
			// 阴影变量
			'--crepe-shadow-1',
			'--crepe-shadow-2',
		];

		properties.forEach((property) => {
			this.rootElement.style.removeProperty(property);
		});

		this.rootElement.removeAttribute('data-theme');
		this.currentTheme = undefined;
	}

	/**
	 * 获取当前应用的主题
	 */
	getCurrent(): ThemeDefinition | undefined {
		return this.currentTheme;
	}

	/**
	 * 检查特定主题是否已应用
	 */
	isApplied(themeName: string): boolean {
		return this.currentTheme?.name === themeName;
	}
}