// 导出所有类型
export type {
	ThemeColors,
	ThemeFonts,
	ThemeShadows,
	ThemeDefinition,
	ThemeName,
	ThemeRegistry,
	ThemeInjector,
} from './types';

// 导出核心类
export { CssThemeInjector } from './injector';
export { ThemeRegistryImpl } from './registry';
export { ThemeManager } from './manager';

// 导入类用于内部使用
import { ThemeRegistryImpl } from './registry';
import { ThemeManager } from './manager';

// 导出内置主题 - 同步导入避免循环依赖
import { frameTheme } from './themes/frame';
import { nordTheme } from './themes/nord';
import { frameDarkTheme } from './themes/frame-dark';
import { nordDarkTheme } from './themes/nord-dark';

// 导出主题实例
export { frameTheme, nordTheme, frameDarkTheme, nordDarkTheme };

// 全局实例 - 延迟初始化避免 SSR 问题
let globalThemeRegistryInstance: ThemeRegistryImpl | null = null;
let globalThemeManagerInstance: ThemeManager | null = null;

export const globalThemeRegistry = new Proxy({} as ThemeRegistryImpl, {
	get(target, prop) {
		if (!globalThemeRegistryInstance && typeof window !== 'undefined') {
			globalThemeRegistryInstance = new ThemeRegistryImpl();
			// 注册内置主题
			globalThemeRegistryInstance.register(frameTheme);
			globalThemeRegistryInstance.register(nordTheme);
			globalThemeRegistryInstance.register(frameDarkTheme);
			globalThemeRegistryInstance.register(nordDarkTheme);
		}
		return globalThemeRegistryInstance?.[prop as keyof ThemeRegistryImpl];
	},
	has(target, prop) {
		if (!globalThemeRegistryInstance && typeof window !== 'undefined') {
			globalThemeRegistryInstance = new ThemeRegistryImpl();
			// 注册内置主题
			globalThemeRegistryInstance.register(frameTheme);
			globalThemeRegistryInstance.register(nordTheme);
			globalThemeRegistryInstance.register(frameDarkTheme);
			globalThemeRegistryInstance.register(nordDarkTheme);
		}
		return globalThemeRegistryInstance ? prop in globalThemeRegistryInstance : false;
	}
});

export const globalThemeManager = new Proxy({} as ThemeManager, {
	get(target, prop) {
		if (!globalThemeManagerInstance && typeof window !== 'undefined') {
			globalThemeManagerInstance = new ThemeManager(globalThemeRegistry);
		}
		return globalThemeManagerInstance?.[prop as keyof ThemeManager];
	},
	has(target, prop) {
		if (!globalThemeManagerInstance && typeof window !== 'undefined') {
			globalThemeManagerInstance = new ThemeManager(globalThemeRegistry);
		}
		return globalThemeManagerInstance ? prop in globalThemeManagerInstance : false;
	}
});

/**
 * 便捷函数：获取当前主题管理器
 */
export function getThemeManager() {
	return globalThemeManager;
}

/**
 * 便捷函数：应用主题
 */
export async function applyTheme(themeName: string) {
	return globalThemeManager.apply(themeName);
}

/**
 * 便捷函数：切换主题
 */
export async function switchTheme(themeName: string) {
	return globalThemeManager.switch(themeName);
}

/**
 * 便捷函数：获取当前主题
 */
export function getCurrentTheme() {
	return globalThemeManager.getCurrent();
}

/**
 * 初始化主题系统 - 确保在客户端环境中初始化
 */
export function initializeThemes() {
	// 触发 Proxy 初始化
	if (typeof window !== 'undefined') {
		// 访问属性会触发 Proxy 的初始化
		globalThemeRegistry.has('nord');
	}
}