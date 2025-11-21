import type { ThemeDefinition, ThemeName, ThemeRegistry } from './types';
import { CssThemeInjector } from './injector';

/**
 * 主题管理器 - 统一管理主题的注册和应用
 */
export class ThemeManager {
	private injector: CssThemeInjector;
	private registry: ThemeRegistry;
	private currentTheme: ThemeDefinition | undefined;

	constructor(
		registry?: ThemeRegistry,
		rootElement: HTMLElement = typeof document !== 'undefined' ? document.documentElement : null as any
	) {
		// 如果没有提供注册器，需要延迟初始化
		this.registry = registry || (typeof window !== 'undefined' ?
			(() => {
				// 延迟导入以避免循环依赖
				try {
					const { globalThemeRegistry } = require('./index');
					return globalThemeRegistry;
				} catch {
					// 如果无法导入，创建一个临时的注册器实例
					const { ThemeRegistryImpl } = require('./registry');
					return new ThemeRegistryImpl();
				}
			})() : null as any
		);
		this.injector = new CssThemeInjector(rootElement);
	}

	/**
	 * 注册新主题
	 */
	register(theme: ThemeDefinition): void {
		this.registry.register(theme);
	}

	/**
	 * 应用指定主题
	 */
	async apply(themeName: ThemeName): Promise<void> {
		const theme = this.registry.get(themeName);
		if (!theme) {
			throw new Error(`Theme "${themeName}" not found. Available themes: ${this.registry.getNames().join(', ')}`);
		}

		// 应用主题
		this.injector.apply(theme);
		this.currentTheme = theme;

		// 触发主题变化事件
		this.dispatchThemeChangeEvent(theme);
	}

	/**
	 * 切换到指定主题（如果当前主题不同）
	 */
	async switch(themeName: ThemeName): Promise<void> {
		if (this.currentTheme?.name === themeName) {
			return; // 已经是当前主题，无需切换
		}

		await this.apply(themeName);
	}

	/**
	 * 获取当前主题
	 */
	getCurrent(): ThemeDefinition | undefined {
		return this.currentTheme;
	}

	/**
	 * 获取当前主题名称
	 */
	getCurrentName(): ThemeName | undefined {
		return this.currentTheme?.name;
	}

	/**
	 * 获取所有可用主题
	 */
	getAvailableThemes(): ThemeDefinition[] {
		return this.registry.getAll();
	}

	/**
	 * 检查主题是否存在
	 */
	hasTheme(themeName: ThemeName): boolean {
		return this.registry.has(themeName);
	}

	/**
	 * 移除当前主题
	 */
	remove(): void {
		this.injector.remove();
		this.currentTheme = undefined;
		this.dispatchThemeChangeEvent(undefined);
	}

	/**
	 * 从localStorage恢复主题
	 */
	restoreFromStorage(storageKey = 'milkdown-theme'): void {
		if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
			try {
				const savedTheme = localStorage.getItem(storageKey);
				if (savedTheme && this.hasTheme(savedTheme)) {
					this.apply(savedTheme);
				}
			} catch (error) {
				console.warn('Failed to restore theme from localStorage:', error);
			}
		}
	}

	/**
	 * 保存主题到localStorage
	 */
	saveToStorage(storageKey = 'milkdown-theme'): void {
		if (this.currentTheme && typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
			try {
				localStorage.setItem(storageKey, this.currentTheme.name);
			} catch (error) {
				console.warn('Failed to save theme to localStorage:', error);
			}
		}
	}

	/**
	 * 应用并保存主题
	 */
	async applyAndPersist(themeName: ThemeName, storageKey = 'milkdown-theme'): Promise<void> {
		await this.apply(themeName);
		this.saveToStorage(storageKey);
	}

	/**
	 * 触发主题变化事件
	 */
	private dispatchThemeChangeEvent(theme: ThemeDefinition | undefined): void {
		if (typeof window !== 'undefined') {
			const event = new CustomEvent('themechange', {
				detail: { theme, themeName: theme?.name },
			});
			window.dispatchEvent(event);
		}
	}

	/**
	 * 监听主题变化
	 */
	onThemeChange(callback: (theme: ThemeDefinition | undefined) => void): () => void {
		if (typeof window === 'undefined') {
			return () => {}; // SSR环境返回空清理函数
		}

		const handler = ((event: CustomEvent) => {
			callback(event.detail.theme);
		}) as EventListener;

		window.addEventListener('themechange', handler);

		// 返回清理函数
		return () => {
			window.removeEventListener('themechange', handler);
		};
	}
}

// 注意：全局实例现在在 index.ts 中管理以避免循环依赖