// 主题修复验证脚本
// 在浏览器控制台中运行此脚本来验证CSS变量名修复是否有效

console.log('🔧 开始验证主题修复...');

// 检查当前编辑器的CSS变量
function checkCurrentCSSVariables() {
    const editor = document.querySelector('.milkdown-editor');
    if (!editor) {
        console.log('❌ 未找到编辑器元素');
        return;
    }

    const computedStyle = getComputedStyle(editor);

    // 检查关键的CSS变量
    const crepeVariables = [
        '--crepe-color-background',
        '--crepe-color-on-background',
        '--crepe-color-surface',
        '--crepe-color-primary'
    ];

    console.log('📊 当前CSS变量值:');
    crepeVariables.forEach(varName => {
        const value = computedStyle.getPropertyValue(varName);
        console.log(`  ${varName}: ${value.trim() || '(未设置)'}`);
    });

    // 检查背景色
    const bgColor = computedStyle.backgroundColor;
    console.log(`🎨 实际背景色: ${bgColor}`);

    // 分析亮度
    const rgb = bgColor.match(/\d+/g);
    if (rgb) {
        const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
        const isDark = brightness < 128;
        console.log(`💡 亮度值: ${brightness.toFixed(1)} (${isDark ? '暗色' : '亮色'})`);
        return { isDark, brightness, variables: crepeVariables.map(v => ({ name: v, value: computedStyle.getPropertyValue(v) })) };
    }

    return null;
}

// 测试主题切换
async function testThemeSwitch(themeName) {
    console.log(`\n🔄 测试切换到主题: ${themeName}`);

    const select = document.getElementById('theme-select');
    if (!select) {
        console.log('❌ 未找到主题选择器');
        return;
    }

    // 设置主题
    select.value = themeName;
    select.dispatchEvent(new Event('change'));

    // 等待主题应用
    await new Promise(resolve => setTimeout(resolve, 500));

    // 检查结果
    const result = checkCurrentCSSVariables();
    if (result) {
        const shouldBeDark = themeName.includes('dark');
        const isCorrectTheme = result.isDark === shouldBeDark;

        console.log(`✅ 主题应用${isCorrectTheme ? '正确' : '错误'}:`);
        console.log(`   - 期望: ${shouldBeDark ? '暗色' : '亮色'}`);
        console.log(`   - 实际: ${result.isDark ? '暗色' : '亮色'}`);

        if (!isCorrectTheme) {
            console.log(`   - ⚠️  主题切换可能未完全生效`);
        }
    }

    return result;
}

// 自动测试所有主题
async function testAllThemes() {
    console.log('🧪 开始自动测试所有主题...');

    const themes = ['nord', 'nord-dark', 'frame', 'frame-dark'];
    const results = [];

    for (const theme of themes) {
        const result = await testThemeSwitch(theme);
        results.push({ theme, result });
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n📋 测试结果汇总:');
    results.forEach(({ theme, result }) => {
        const status = result ?
            (result.isDark === theme.includes('dark') ? '✅' : '❌') : '⚠️';
        console.log(`  ${status} ${theme}`);
    });

    const passed = results.filter(r => r.result && r.result.isDark === r.theme.includes('dark')).length;
    console.log(`\n🎯 测试通过率: ${passed}/${themes.length} (${Math.round(passed/themes.length*100)}%)`);
}

// 检查注入器是否正确工作
function checkInjector() {
    console.log('\n🔍 检查主题注入器...');

    // 查找可能的根元素
    const possibleRoots = [
        document.documentElement,
        document.querySelector('.milkdown-editor'),
        document.querySelector('body')
    ].filter(Boolean);

    possibleRoots.forEach((root, index) => {
        console.log(`📍 检查根元素 ${index + 1}:`, root.tagName.toLowerCase());

        const hasDataTheme = root.hasAttribute('data-theme');
        const dataTheme = root.getAttribute('data-theme');

        console.log(`   - data-theme: ${dataTheme || '(未设置)'}`);

        // 检查是否有crepe变量
        const style = root.style;
        const hasCrepeVars = Array.from(style).filter(prop => prop.startsWith('--crepe-')).length > 0;
        console.log(`   - crepe变量数量: ${hasCrepeVars ? '有' : '无'}`);
    });
}

// 立即执行检查
checkInjector();
checkCurrentCSSVariables();

// 提供手动测试函数
window.testAllThemes = testAllThemes;
window.testTheme = testThemeSwitch;
window.checkVars = checkCurrentCSSVariables;

console.log('\n💡 可用命令:');
console.log('- testAllThemes() - 自动测试所有主题');
console.log('- testTheme("nord-dark") - 测试特定主题');
console.log('- checkVars() - 检查当前CSS变量');

// 3秒后开始自动测试
setTimeout(() => {
    console.log('\n🚀 3秒后开始自动测试...');
    testAllThemes();
}, 3000);