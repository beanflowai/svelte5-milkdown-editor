// 主题切换测试验证脚本
// 可以在浏览器控制台中运行此脚本来验证主题功能

console.log('🧪 开始主题切换验证测试...');

// 测试用的主题列表
const themes = ['nord', 'nord-dark', 'frame', 'frame-dark'];
let currentThemeIndex = 0;

// 查找测试页面中的主题选择器
const themeSelect = document.getElementById('theme-select');
if (themeSelect) {
    console.log('✅ 找到主题选择器');

    // 自动循环切换主题
    const testThemeCycle = () => {
        const theme = themes[currentThemeIndex];
        console.log(`🎨 切换到主题: ${theme}`);

        // 设置主题选择器的值
        themeSelect.value = theme;

        // 触发 change 事件
        themeSelect.dispatchEvent(new Event('change'));

        // 检查主题是否正确应用
        setTimeout(() => {
            const editorContainer = document.querySelector('.milkdown-editor');
            const dataTheme = editorContainer?.getAttribute('data-theme');
            const bgColor = getComputedStyle(editorContainer).backgroundColor;

            console.log(`📊 主题应用结果:`);
            console.log(`   - data-theme: ${dataTheme}`);
            console.log(`   - 背景色: ${bgColor}`);

            // 对于暗色主题，背景色应该是深色的
            if (theme.includes('dark')) {
                const rgb = bgColor.match(/\d+/g);
                if (rgb) {
                    const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
                    if (brightness < 128) {
                        console.log(`   ✅ 暗色主题正确应用 (亮度: ${brightness.toFixed(1)})`);
                    } else {
                        console.log(`   ❌ 暗色主题未正确应用 (亮度: ${brightness.toFixed(1)})`);
                    }
                }
            } else {
                console.log(`   ✅ 明亮主题处理完成`);
            }

            // 移动到下一个主题
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;

            // 继续测试下一个主题
            if (currentThemeIndex !== 0) {
                setTimeout(testThemeCycle, 2000);
            } else {
                console.log('🎉 主题切换测试完成！');
            }
        }, 1000);
    };

    // 开始测试
    setTimeout(testThemeCycle, 2000);

} else {
    console.log('❌ 未找到主题选择器，请确保在测试页面 (/test) 运行此脚本');
}

// 手动测试函数
window.testTheme = function(themeName) {
    const select = document.getElementById('theme-select');
    if (select && themes.includes(themeName)) {
        select.value = themeName;
        select.dispatchEvent(new Event('change'));
        console.log(`手动切换到主题: ${themeName}`);

        setTimeout(() => {
            const container = document.querySelector('.milkdown-editor');
            const computedStyle = getComputedStyle(container);

            console.log(`主题 ${themeName} 的样式:`);
            console.log(`背景色: ${computedStyle.backgroundColor}`);
            console.log(`边框色: ${computedStyle.borderColor}`);
            console.log(`文字色: ${computedStyle.color}`);

            // 检查CSS变量
            const cssVars = [
                '--milkdown-bg-color',
                '--milkdown-primary-color',
                '--milkdown-border-color',
                '--milkdown-text-color'
            ];

            cssVars.forEach(varName => {
                const value = computedStyle.getPropertyValue(varName);
                console.log(`${varName}: ${value.trim()}`);
            });
        }, 500);
    }
};

console.log('💡 使用方法:');
console.log('- 自动测试: 等待自动循环测试开始');
console.log('- 手动测试: testTheme("nord-dark")');

// 为每个主题创建快捷测试函数
themes.forEach(theme => {
    window[`test${theme.replace('-', '').charAt(0).toUpperCase() + theme.replace('-', '').slice(1)}`] = () => window.testTheme(theme);
});

console.log('- 快捷测试: testNordDark(), testFrameDark() 等');