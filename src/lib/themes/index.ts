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
export { ThemeRegistryImpl, globalThemeRegistry } from './registry';
export { ThemeManager, globalThemeManager } from './manager';

// 导出内置主题
export { frameTheme } from './themes/frame';
export { nordTheme } from './themes/nord';
export { frameDarkTheme } from './themes/frame-dark';
export { nordDarkTheme } from './themes/nord-dark';

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

// 延迟初始化：注册内置主题
export function initializeThemes() {
	if (typeof window !== 'undefined') {
		import('./themes/frame').then(({ frameTheme }) => {
			globalThemeRegistry.register(frameTheme);
		});
		import('./themes/nord').then(({ nordTheme }) => {
			globalThemeRegistry.register(nordTheme);
		});
		import('./themes/frame-dark').then(({ frameDarkTheme }) => {
			globalThemeRegistry.register(frameDarkTheme);
		});
		import('./themes/nord-dark').then(({ nordDarkTheme }) => {
			globalThemeRegistry.register(nordDarkTheme);
		});
	}
}