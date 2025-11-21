/**
 * Milkdown 主题管理
 * 使用动态样式表切换方案（官方推荐）
 */

export {
	ThemeStylesheetManager,
	getThemeManager,
	initializeThemeManager,
	setTheme,
	getCurrentTheme,
	type ThemeName
} from './stylesheet-manager';

// 便捷的初始化函数
export async function initializeThemes(defaultTheme: import('./stylesheet-manager').ThemeName = 'nord') {
	if (typeof window !== 'undefined') {
		const { initializeThemeManager } = await import('./stylesheet-manager');
		await initializeThemeManager(defaultTheme);
	}
}
