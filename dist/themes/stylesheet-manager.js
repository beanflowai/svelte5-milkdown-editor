/**
 * ThemeStylesheetManager - 动态管理 Milkdown Crepe 主题样式表
 *
 * 使用官方推荐的动态样式表切换方法：
 * 通过 <link> 元素的 disabled 属性来启用/禁用主题
 */
// 主题 CSS 文件路径映射
const THEME_PATHS = {
    nord: '@milkdown/crepe/theme/nord.css',
    'nord-dark': '@milkdown/crepe/theme/nord-dark.css',
    frame: '@milkdown/crepe/theme/frame.css',
    'frame-dark': '@milkdown/crepe/theme/frame-dark.css'
};
export class ThemeStylesheetManager {
    static instance = null;
    currentTheme = null;
    styleElements = new Map();
    initialized = false;
    constructor() {
        // 私有构造函数，使用单例模式
    }
    /**
     * 获取单例实例
     */
    static getInstance() {
        if (!ThemeStylesheetManager.instance) {
            ThemeStylesheetManager.instance = new ThemeStylesheetManager();
        }
        return ThemeStylesheetManager.instance;
    }
    /**
     * 初始化主题管理器
     * 预加载所有主题样式，但只启用指定的默认主题
     */
    async initialize(defaultTheme = 'nord') {
        if (this.initialized || typeof document === 'undefined') {
            return;
        }
        // 动态导入所有主题 CSS
        await this.loadAllThemes();
        // 设置默认主题
        this.setTheme(defaultTheme);
        this.initialized = true;
    }
    /**
     * 加载所有主题样式
     */
    async loadAllThemes() {
        const themes = Object.keys(THEME_PATHS);
        for (const themeName of themes) {
            await this.loadTheme(themeName);
        }
    }
    /**
     * 加载单个主题
     */
    async loadTheme(themeName) {
        if (this.styleElements.has(themeName)) {
            return; // 已加载
        }
        try {
            // 动态导入主题 CSS
            let cssContent;
            switch (themeName) {
                case 'nord':
                    cssContent = (await import('@milkdown/crepe/theme/nord.css?inline')).default;
                    break;
                case 'nord-dark':
                    cssContent = (await import('@milkdown/crepe/theme/nord-dark.css?inline')).default;
                    break;
                case 'frame':
                    cssContent = (await import('@milkdown/crepe/theme/frame.css?inline')).default;
                    break;
                case 'frame-dark':
                    cssContent = (await import('@milkdown/crepe/theme/frame-dark.css?inline')).default;
                    break;
                default:
                    throw new Error(`Unknown theme: ${themeName}`);
            }
            // 创建 style 元素
            const styleElement = document.createElement('style');
            styleElement.setAttribute('data-milkdown-theme', themeName);
            styleElement.textContent = cssContent;
            // 使用 media 属性禁用样式（比 disabled 更可靠）
            styleElement.media = 'not all';
            // 添加到 head
            document.head.appendChild(styleElement);
            this.styleElements.set(themeName, styleElement);
        }
        catch (error) {
            console.error(`Failed to load theme ${themeName}:`, error);
        }
    }
    /**
     * 设置当前主题
     */
    setTheme(themeName) {
        if (typeof document === 'undefined') {
            return;
        }
        // 使用 media 属性切换主题（比 disabled 更可靠）
        this.styleElements.forEach((element, name) => {
            if (name === themeName) {
                element.media = 'all'; // 启用
            }
            else {
                element.media = 'not all'; // 禁用
            }
        });
        this.currentTheme = themeName;
        // 触发主题变化事件
        this.dispatchThemeChangeEvent(themeName);
    }
    /**
     * 获取当前主题
     */
    getCurrentTheme() {
        return this.currentTheme;
    }
    /**
     * 获取所有可用主题
     */
    getAvailableThemes() {
        return Object.keys(THEME_PATHS);
    }
    /**
     * 触发主题变化事件
     */
    dispatchThemeChangeEvent(themeName) {
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('milkdown-theme-change', {
                detail: { theme: themeName }
            });
            window.dispatchEvent(event);
        }
    }
    /**
     * 监听主题变化
     */
    onThemeChange(callback) {
        if (typeof window === 'undefined') {
            return () => { };
        }
        const handler = ((event) => {
            callback(event.detail.theme);
        });
        window.addEventListener('milkdown-theme-change', handler);
        return () => {
            window.removeEventListener('milkdown-theme-change', handler);
        };
    }
    /**
     * 清理资源
     */
    destroy() {
        this.styleElements.forEach((element) => {
            element.remove();
        });
        this.styleElements.clear();
        this.currentTheme = null;
        this.initialized = false;
        ThemeStylesheetManager.instance = null;
    }
}
// 导出便捷函数
export function getThemeManager() {
    return ThemeStylesheetManager.getInstance();
}
export async function initializeThemeManager(defaultTheme = 'nord') {
    const manager = ThemeStylesheetManager.getInstance();
    await manager.initialize(defaultTheme);
    return manager;
}
export function setTheme(themeName) {
    ThemeStylesheetManager.getInstance().setTheme(themeName);
}
export function getCurrentTheme() {
    return ThemeStylesheetManager.getInstance().getCurrentTheme();
}
