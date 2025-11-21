/**
 * Milkdown 主题管理
 * 使用动态样式表切换方案（官方推荐）
 */
export { ThemeStylesheetManager, getThemeManager, initializeThemeManager, setTheme, getCurrentTheme, type ThemeName } from './stylesheet-manager';
export declare function initializeThemes(defaultTheme?: import('./stylesheet-manager').ThemeName): Promise<void>;
