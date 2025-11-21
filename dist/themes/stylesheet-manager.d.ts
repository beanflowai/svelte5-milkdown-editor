/**
 * ThemeStylesheetManager - 动态管理 Milkdown Crepe 主题样式表
 *
 * 使用官方推荐的动态样式表切换方法：
 * 通过 <link> 元素的 disabled 属性来启用/禁用主题
 */
export type ThemeName = 'nord' | 'nord-dark' | 'frame' | 'frame-dark';
export declare class ThemeStylesheetManager {
    private static instance;
    private currentTheme;
    private styleElements;
    private initialized;
    private constructor();
    /**
     * 获取单例实例
     */
    static getInstance(): ThemeStylesheetManager;
    /**
     * 初始化主题管理器
     * 预加载所有主题样式，但只启用指定的默认主题
     */
    initialize(defaultTheme?: ThemeName): Promise<void>;
    /**
     * 加载所有主题样式
     */
    private loadAllThemes;
    /**
     * 加载单个主题
     */
    private loadTheme;
    /**
     * 设置当前主题
     */
    setTheme(themeName: ThemeName): void;
    /**
     * 获取当前主题
     */
    getCurrentTheme(): ThemeName | null;
    /**
     * 获取所有可用主题
     */
    getAvailableThemes(): ThemeName[];
    /**
     * 触发主题变化事件
     */
    private dispatchThemeChangeEvent;
    /**
     * 监听主题变化
     */
    onThemeChange(callback: (theme: ThemeName) => void): () => void;
    /**
     * 清理资源
     */
    destroy(): void;
}
export declare function getThemeManager(): ThemeStylesheetManager;
export declare function initializeThemeManager(defaultTheme?: ThemeName): Promise<ThemeStylesheetManager>;
export declare function setTheme(themeName: ThemeName): void;
export declare function getCurrentTheme(): ThemeName | null;
