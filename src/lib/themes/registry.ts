import type { ThemeDefinition, ThemeRegistry, ThemeName } from './types';

/**
 * 主题注册器 - 管理所有可用的主题
 */
export class ThemeRegistryImpl implements ThemeRegistry {
	private themes = new Map<ThemeName, ThemeDefinition>();

	/**
	 * 注册新主题
	 */
	register(theme: ThemeDefinition): void {
		if (this.themes.has(theme.name)) {
			console.warn(`Theme "${theme.name}" is already registered. Overwriting.`);
		}
		this.themes.set(theme.name, theme);
	}

	/**
	 * 根据名称获取主题
	 */
	get(name: ThemeName): ThemeDefinition | undefined {
		return this.themes.get(name);
	}

	/**
	 * 获取所有已注册的主题
	 */
	getAll(): ThemeDefinition[] {
		return Array.from(this.themes.values());
	}

	/**
	 * 检查主题是否存在
	 */
	has(name: ThemeName): boolean {
		return this.themes.has(name);
	}

	/**
	 * 移除主题
	 */
	unregister(name: ThemeName): boolean {
		return this.themes.delete(name);
	}

	/**
	 * 获取主题名称列表
	 */
	getNames(): ThemeName[] {
		return Array.from(this.themes.keys());
	}

	/**
	 * 清空所有主题
	 */
	clear(): void {
		this.themes.clear();
	}

	/**
	 * 获取主题数量
	 */
	size(): number {
		return this.themes.size;
	}
}

/**
 * 全局主题注册器实例 - 延迟初始化以支持SSR
 */
let globalThemeRegistryInstance: ThemeRegistryImpl | null = null;

export const globalThemeRegistry = new Proxy({} as ThemeRegistryImpl, {
	get(target, prop) {
		if (!globalThemeRegistryInstance && typeof window !== 'undefined') {
			globalThemeRegistryInstance = new ThemeRegistryImpl();
		}
		return globalThemeRegistryInstance?.[prop as keyof ThemeRegistryImpl];
	},
	has(target, prop) {
		if (!globalThemeRegistryInstance && typeof window !== 'undefined') {
			globalThemeRegistryInstance = new ThemeRegistryImpl();
		}
		return globalThemeRegistryInstance ? prop in globalThemeRegistryInstance : false;
	}
});