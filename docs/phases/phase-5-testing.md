# Phase 5: 测试和发布

## 📋 阶段概述

**目标**: 确保代码质量并准备发布，包括全面的测试覆盖、性能基准测试、npm 发布配置和 CI/CD 流水线设置。

**预计时间**: 3-4 天
**负责人**: LLM Code Agent
**前置条件**: Phase 4 开发体验优化完成

## 🎯 主要任务

### 5.1 全面测试覆盖
- [ ] 单元测试编写和覆盖
- [ ] 集成测试实现
- [ ] E2E 测试场景
- [ ] 组件测试优化
- [ ] 类型测试验证
- [ ] 性能测试基准

### 5.2 质量保证
- [ ] 代码覆盖率分析
- [ ] 性能基准测试
- [ ] 可访问性测试
- [ ] 浏览器兼容性测试
- [ ] 内存泄漏检测
- [ ] 安全性检查

### 5.3 文档完善
- [ ] README 文档优化
- [ ] CHANGELOG 生成
- [ ] API 参考文档
- [ ] 迁移指南
- [ ] 贡献指南完善
- [ ] 许可证和法律文档

### 5.4 发布配置
- [ ] npm 包配置优化
- [ ] 构建脚本完善
- [ ] 版本管理设置
- [ ] 发布流程自动化
- [ ] 包大小优化
- [ ] 依赖管理优化

### 5.5 CI/CD 流水线
- [ ] GitHub Actions 配置
- [ ] 自动化测试流水线
- [ ] 发布自动化
- [ ] 质量门禁设置
- [ ] 监控和告警
- [ ] 回滚机制

## 📂 详细实施步骤

### 步骤 1: 设置测试框架和配置

**更新 vitest.config.ts**:
```typescript
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts,svelte}'],
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/**'
      ],
      thresholds: {
        global: {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    },
    globals: true,
    testTimeout: 10000,
    hookTimeout: 10000
  },
  resolve: {
    alias: {
      $lib: resolve(__dirname, 'src/lib')
    }
  }
});
```

**创建 src/test/setup.ts**:
```typescript
import { vi, beforeAll, afterEach } from 'vitest';
import { render } from '@testing-library/svelte';
import { readable } from 'svelte/store';

// Mock DOM APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock performance API
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByName: vi.fn(() => []),
    getEntriesByType: vi.fn(() => []),
  },
});

// Mock console methods for testing
beforeAll(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

// Reset mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});

// Mock Milkdown editor
vi.mock('@milkdown/crepe', () => ({
  Crepe: {
    make: vi.fn(() => ({
      use: vi.fn().mockReturnThis(),
      create: vi.fn(() => ({
        destroy: vi.fn(),
        state: {
          doc: {
            content: { size: 0 },
            textContent: '',
            childCount: 0
          },
          selection: {
            from: 0,
            to: 0,
            empty: true
          },
          tr: {
            replaceWith: vi.fn().mockReturnThis(),
            setNodeMarkup: vi.fn().mockReturnThis(),
            addMark: vi.fn().mockReturnThis(),
            replaceSelectionWith: vi.fn().mockReturnThis(),
            dispatch: vi.fn()
          },
          apply: vi.fn(),
          plugins: []
        },
        view: {
          dom: document.createElement('div'),
          dispatch: vi.fn(),
          focus: vi.fn(),
          blur: vi.fn()
        },
        schema: {
          marks: { link: { create: vi.fn() } },
          nodes: {
            image: { create: vi.fn() },
            text: vi.fn()
          }
        },
        stateUpdate: readable(null),
        action: vi.fn(),
        use: vi.fn(),
        config: vi.fn()
      }))
    })
  },
  commonmark: {},
  gfm: {},
  nord: {},
  nordLight: {}
}));

// Custom render function with Svelte 5 support
export const renderSvelte = (Component: any, props: any = {}) => {
  return render(Component, { props });
};
```

### 步骤 2: 编写组件单元测试

**创建 src/lib/components/__tests__/MilkdownProvider.test.ts**:
```typescript
import { render, screen, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getContext } from 'svelte';
import MilkdownProvider from '../MilkdownProvider.svelte';
import type { EditorContext } from '../../types';

// Mock getContext
vi.mock('svelte', async () => {
  const actual = await vi.importActual('svelte');
  return {
    ...actual,
    getContext: vi.fn(),
    setContext: vi.fn()
  };
});

describe('MilkdownProvider', () => {
  const mockSetContext = vi.fn();
  const mockGetContext = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (vi.mocked(setContext as any)).mockImplementation(mockSetContext);
    (vi.mocked(getContext as any)).mockImplementation(mockGetContext);
  });

  it('should render provider with children', () => {
    render(MilkdownProvider, {
      props: {
        children: () => 'Test Content'
      }
    });

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should set editor context', async () => {
    render(MilkdownProvider, {
      props: {
        children: () => 'Test Content',
        config: { theme: 'nord' }
      }
    });

    await waitFor(() => {
      expect(mockSetContext).toHaveBeenCalledWith('milkdown', expect.any(Object));
    });

    const contextArg = mockSetContext.mock.calls[0][1] as EditorContext;
    expect(contextArg).toHaveProperty('instance');
    expect(contextArg).toHaveProperty('create');
    expect(contextArg).toHaveProperty('destroy');
    expect(contextArg).toHaveProperty('update');
  });

  it('should show loading state initially', () => {
    render(MilkdownProvider, {
      props: {
        children: () => 'Test Content'
      }
    });

    expect(screen.getByText('Loading editor...')).toBeInTheDocument();
  });

  it('should render custom loading slot', () => {
    render(MilkdownProvider, {
      props: {
        children: () => 'Test Content',
        $$slots: {
          loading: () => 'Custom Loading Message'
        }
      }
    });

    expect(screen.getByText('Custom Loading Message')).toBeInTheDocument();
  });

  it('should handle error state', async () => {
    // Mock a failure in editor creation
    vi.mock('@milkdown/crepe', () => ({
      Crepe: {
        make: vi.fn(() => {
          throw new Error('Failed to create editor');
        })
      }
    }));

    render(MilkdownProvider, {
      props: {
        children: () => 'Test Content'
      }
    });

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it('should render custom error slot', async () => {
    vi.mock('@milkdown/crepe', () => ({
      Crepe: {
        make: vi.fn(() => {
          throw new Error('Custom error');
        })
      }
    }));

    render(MilkdownProvider, {
      props: {
        children: () => 'Test Content',
        $$slots: {
          error: ({ error }: { error: Error }) => `Error: ${error.message}`
        }
      }
    });

    await waitFor(() => {
      expect(screen.getByText('Error: Custom error')).toBeInTheDocument();
    });
  });
});
```

**创建 src/lib/components/__tests__/MilkdownEditor.test.ts**:
```typescript
import { render, screen, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MilkdownEditor from '../MilkdownEditor.svelte';
import { getContext } from 'svelte';

// Mock getContext to return editor context
vi.mock('svelte', async () => {
  const actual = await vi.importActual('svelte');
  return {
    ...actual,
    getContext: vi.fn()
  };
});

// Mock useEditor composable
vi.mock('../../composables/useEditor', () => ({
  useEditor: vi.fn(() => ({
    editor: {
      state: {
        doc: {
          content: { size: 100 },
          textContent: 'Test content'
        },
        selection: {
          from: 0,
          to: 0,
          empty: true
        },
        tr: {
          replaceWith: vi.fn().mockReturnThis(),
          dispatch: vi.fn()
        }
      },
      view: {
        dom: document.createElement('div'),
        dispatch: vi.fn()
      },
      schema: {
        text: vi.fn((content) => ({ text: content })),
        marks: { link: { create: vi.fn() } }
      }
    },
    loading: false,
    error: null,
    create: vi.fn(),
    destroy: vi.fn(),
    update: vi.fn()
  }))
}));

describe('MilkdownEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render editor container', () => {
    render(MilkdownEditor);

    const editorElement = screen.getByTestId('milkdown-editor') ||
                        document.querySelector('[data-milkdown-editor]');
    expect(editorElement).toBeInTheDocument();
  });

  it('should apply correct CSS classes', () => {
    render(MilkdownEditor);

    const editorElement = document.querySelector('[data-milkdown-editor]');
    expect(editorElement).toHaveClass('milkdown-editor');
    expect(editorElement).not.toHaveClass('loading');
    expect(editorElement).not.toHaveClass('error');
  });

  it('should show loading state', async () => {
    vi.mocked(require('../../composables/useEditor').useEditor).mockReturnValue({
      editor: null,
      loading: true,
      error: null,
      create: vi.fn(),
      destroy: vi.fn(),
      update: vi.fn()
    });

    render(MilkdownEditor);

    await waitFor(() => {
      expect(screen.getByText('Initializing editor...')).toBeInTheDocument();
    });
  });

  it('should show error state', async () => {
    vi.mocked(require('../../composables/useEditor').useEditor).mockReturnValue({
      editor: null,
      loading: false,
      error: new Error('Test error'),
      create: vi.fn(),
      destroy: vi.fn(),
      update: vi.fn()
    });

    render(MilkdownEditor);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load editor/)).toBeInTheDocument();
    });
  });

  it('should handle value prop changes', async () => {
    const onChange = vi.fn();
    const { rerender } = render(MilkdownEditor, {
      props: {
        value: 'Initial content',
        onChange
      }
    });

    // Simulate value change
    await rerender({
      value: 'Updated content',
      onChange
    });

    // Check that the editor state would be updated
    // This would require more complex mocking of the editor instance
  });

  it('should handle onReady callback', async () => {
    const onReady = vi.fn();

    render(MilkdownEditor, {
      props: {
        onReady
      }
    });

    // The onReady callback should be called when editor is ready
    // This requires the useEditor mock to trigger the callback
  });
});
```

### 步骤 3: 编写 Composables 测试

**创建 src/lib/composables/__tests__/useEditor.test.ts**:
```typescript
import { renderHook } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getContext } from 'svelte';
import { useEditor } from '../useEditor';
import type { EditorContext } from '../../types';

// Mock getContext
vi.mock('svelte', () => ({
  getContext: vi.fn(),
  onMount: vi.fn(),
  onDestroy: vi.fn()
}));

// Mock Milkdown editor
const mockEditor = {
  stateUpdate: {
    subscribe: vi.fn((callback) => {
      callback('mock-state');
      return () => {};
    })
  },
  destroy: vi.fn()
};

const mockContext: EditorContext = {
  instance: {
    editor: mockEditor as any,
    loading: false,
    error: null
  },
  create: vi.fn(),
  destroy: vi.fn(),
  update: vi.fn()
};

describe('useEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getContext).mockReturnValue(mockContext);
  });

  it('should return editor context when used within provider', () => {
    const { result } = renderHook(() => useEditor());

    expect(result.current.editor).toBe(mockEditor);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should throw error when used outside provider', () => {
    vi.mocked(getContext).mockReturnValue(undefined as any);

    expect(() => {
      renderHook(() => useEditor());
    }).toThrow('useEditor must be used within a MilkdownProvider');
  });

  it('should call onReady callback when editor is ready', () => {
    const onReady = vi.fn();

    renderHook(() => useEditor({ onReady }));

    // Need to mock onMount to trigger the callback
    expect(onReady).toHaveBeenCalledWith(mockEditor);
  });

  it('should call onChange callback when state changes', () => {
    const onChange = vi.fn();

    renderHook(() => useEditor({ onChange }));

    // The subscription should be set up
    expect(mockEditor.stateUpdate.subscribe).toHaveBeenCalled();
  });

  it('should provide create, destroy, and update methods', () => {
    const { result } = renderHook(() => useEditor());

    expect(typeof result.current.create).toBe('function');
    expect(typeof result.current.destroy).toBe('function');
    expect(typeof result.current.update).toBe('function');
  });

  it('should handle loading state', () => {
    const loadingContext = {
      ...mockContext,
      instance: {
        ...mockContext.instance,
        loading: true
      }
    };
    vi.mocked(getContext).mockReturnValue(loadingContext);

    const { result } = renderHook(() => useEditor());

    expect(result.current.loading).toBe(true);
  });

  it('should handle error state', () => {
    const error = new Error('Test error');
    const errorContext = {
      ...mockContext,
      instance: {
        ...mockContext.instance,
        error
      }
    };
    vi.mocked(getContext).mockReturnValue(errorContext);

    const { result } = renderHook(() => useEditor());

    expect(result.current.error).toBe(error);
  });
});
```

### 步骤 4: 编写集成测试

**创建 src/lib/__tests__/integration/editor-integration.test.ts**:
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MilkdownProvider from '../../components/MilkdownProvider.svelte';
import MilkdownEditor from '../../components/MilkdownEditor.svelte';
import userEvent from '@testing-library/user-event';

// Mock userEvent
vi.mock('@testing-library/user-event', () => ({
  default: {
    click: vi.fn(),
    type: vi.fn(),
    keyboard: vi.fn()
  }
}));

describe('Editor Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should integrate provider and editor components', async () => {
    const TestComponent = {
      components: { MilkdownProvider, MilkdownEditor },
      template: `
        <MilkdownProvider>
          <MilkdownEditor value="# Hello World" />
        </MilkdownProvider>
      `
    };

    render(TestComponent);

    await waitFor(() => {
      const editor = document.querySelector('[data-milkdown-editor]');
      expect(editor).toBeInTheDocument();
    });
  });

  it('should handle value changes between components', async () => {
    let currentValue = '# Initial Title';

    const TestComponent = {
      components: { MilkdownProvider, MilkdownEditor },
      props: ['value'],
      emits: ['change'],
      template: `
        <MilkdownProvider>
          <MilkdownEditor
            :value="value"
            @change="$emit('change', $event)"
          />
        </MilkdownProvider>
      `
    };

    const { getByText } = render(TestComponent, {
      props: { value: currentValue }
    });

    // Wait for editor to initialize
    await waitFor(() => {
      expect(document.querySelector('[data-milkdown-editor]')).toBeInTheDocument();
    });

    // Simulate content change
    const newValue = '# Updated Title';
    // This would require more complex integration with the actual editor
  });

  it('should handle theme changes', async () => {
    const TestComponent = {
      components: { MilkdownProvider, MilkdownEditor },
      data() {
        return {
          config: { theme: 'default' }
        };
      },
      template: `
        <MilkdownProvider :config="config">
          <MilkdownEditor />
        </MilkdownProvider>
      `
    };

    render(TestComponent);

    // Wait for initialization
    await waitFor(() => {
      expect(document.querySelector('[data-milkdown-editor]')).toBeInTheDocument();
    });

    // Change theme
    // This would require implementing theme switching in the test
  });

  it('should handle error recovery', async () => {
    // Mock an error condition
    vi.mock('@milkdown/crepe', () => ({
      Crepe: {
        make: vi.fn(() => {
          throw new Error('Initialization error');
        })
      }
    }));

    const TestComponent = {
      components: { MilkdownProvider, MilkdownEditor },
      template: `
        <MilkdownProvider>
          <MilkdownEditor />
        </MilkdownProvider>
      `
    };

    render(TestComponent);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });

    // Test retry mechanism
    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    // Verify retry behavior
  });
});
```

### 步骤 5: 编写 E2E 测试

**创建 tests/e2e/editor.spec.ts**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Milkdown Editor E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load editor page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Svelte 5 Milkdown Editor');
    await expect(page.locator('[data-milkdown-editor]')).toBeVisible();
  });

  test('should allow typing in editor', async ({ page }) => {
    const editor = page.locator('[data-milkdown-editor] .ProseMirror');
    await editor.click();
    await page.keyboard.type('# Hello E2E Test');

    await expect(editor).toContainText('# Hello E2E Test');
  });

  test('should show toolbar buttons', async ({ page }) => {
    const toolbar = page.locator('.milkdown-toolbar');
    await expect(toolbar).toBeVisible();

    // Check for common toolbar buttons
    await expect(page.locator('[title="Bold"]')).toBeVisible();
    await expect(page.locator('[title="Italic"]')).toBeVisible();
    await expect(page.locator('[title="Header"]')).toBeVisible();
  });

  test('should apply formatting via toolbar', async ({ page }) => {
    const editor = page.locator('[data-milkdown-editor] .ProseMirror');
    await editor.click();
    await page.keyboard.type('Hello World');

    // Select text
    await page.keyboard.press('Home');
    await page.keyboard.down('Shift');
    await page.keyboard.press('End');
    await page.keyboard.up('Shift');

    // Apply bold formatting
    await page.locator('[title="Bold"]').click();

    // Check if formatting was applied
    const boldElement = page.locator('strong');
    await expect(boldElement).toBeVisible();
  });

  test('should show word count', async ({ page }) => {
    const editor = page.locator('[data-milkdown-editor] .ProseMirror');
    await editor.click();
    await page.keyboard.type('This is a test with multiple words');

    // Word count should be displayed
    const wordCount = page.locator('.word-count');
    await expect(wordCount).toContainText('7');
  });

  test('should handle theme switching', async ({ page }) => {
    const themeSelector = page.locator('#theme-select');
    await themeSelector.selectOption('nordLight');

    // Check if theme was applied (verify CSS classes)
    const editor = page.locator('[data-milkdown-editor]');
    await expect(editor).toHaveClass(/theme-nordLight/);
  });

  test('should handle content export', async ({ page }) => {
    const editor = page.locator('[data-milkdown-editor] .ProseMirror');
    await editor.click();
    await page.keyboard.type('# Test Export Content');

    // Click export button
    const exportButton = page.locator('button:has-text("Export")');
    await exportButton.click();

    // Verify download was triggered (simplified check)
    const download = await page.waitForEvent('download');
    expect(download.suggestedFilename()).toBe('content.md');
  });

  test('should handle content import', async ({ page }) => {
    const fileContent = '# Imported Content\n\nThis was imported from a file.';

    // Create a mock file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.md',
      mimeType: 'text/markdown',
      buffer: Buffer.from(fileContent)
    });

    // Verify content was imported
    const editor = page.locator('[data-milkdown-editor] .ProseMirror');
    await expect(editor).toContainText('Imported Content');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Emulate mobile device
    await page.setViewportSize({ width: 375, height: 667 });

    const editor = page.locator('[data-milkdown-editor]');
    await expect(editor).toBeVisible();

    // Check if toolbar is compact on mobile
    const toolbar = page.locator('.milkdown-toolbar');
    await expect(toolbar).toHaveClass(/compact/);

    // Check if button labels are hidden
    const buttonLabels = page.locator('.toolbar-button .label');
    await expect(buttonLabels.first()).not.toBeVisible();
  });

  test('should handle keyboard shortcuts', async ({ page }) => {
    const editor = page.locator('[data-milkdown-editor] .ProseMirror');
    await editor.click();
    await page.keyboard.type('Bold text');

    // Select text
    await page.keyboard.press('Home');
    await page.keyboard.down('Shift');
    await page.keyboard.press('End');
    await page.keyboard.up('Shift');

    // Apply bold with Ctrl+B
    await page.keyboard.press('Meta+B');

    // Check if text is bold
    const boldElement = page.locator('strong');
    await expect(boldElement).toBeVisible();
  });

  test('should handle right-click context menu', async ({ page }) => {
    const editor = page.locator('[data-milkdown-editor] .ProseMirror');
    await editor.click();
    await page.keyboard.type('Test context menu');

    // Right-click
    await editor.click({ button: 'right' });

    // Check if context menu appears
    const contextMenu = page.locator('.context-menu');
    await expect(contextMenu).toBeVisible();
  });
});
```

### 步骤 6: 性能测试

**创建 tests/performance/editor-performance.test.ts**:
```typescript
import { test, expect } from '@playwright/test';
import { performance } from 'perf_hooks';

test.describe('Editor Performance Tests', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = performance.now();

    await page.goto('/');
    await page.waitForSelector('[data-milkdown-editor]');

    const loadTime = performance.now() - startTime;

    // Should load within 2 seconds
    expect(loadTime).toBeLessThan(2000);

    console.log(`Page load time: ${loadTime.toFixed(2)}ms`);
  });

  test('should initialize editor quickly', async ({ page }) => {
    await page.goto('/');

    const startTime = performance.now();
    await page.waitForSelector('[data-milkdown-editor]:not(.loading)');
    const initTime = performance.now() - startTime;

    // Editor should initialize within 1 second
    expect(initTime).toBeLessThan(1000);

    console.log(`Editor initialization time: ${initTime.toFixed(2)}ms`);
  });

  test('should handle large documents efficiently', async ({ page }) => {
    await page.goto('/');

    const editor = page.locator('[data-milkdown-editor] .ProseMirror');
    await editor.click();

    // Generate large content (1000 lines)
    const largeContent = Array.from({ length: 1000 }, (_, i) =>
      `Line ${i + 1}: This is a long line with some text content for performance testing.`
    ).join('\n');

    const startTime = performance.now();
    await page.keyboard.type(largeContent);
    const inputTime = performance.now() - startTime;

    // Should handle large input within reasonable time
    expect(inputTime).toBeLessThan(5000);

    console.log(`Large document input time: ${inputTime.toFixed(2)}ms`);
    console.log(`Document length: ${largeContent.length} characters`);
  });

  test('should maintain responsiveness during editing', async ({ page }) => {
    await page.goto('/');

    const editor = page.locator('[data-milkdown-editor] .ProseMirror');
    await editor.click();

    // Simulate rapid typing
    const startTime = performance.now();

    for (let i = 0; i < 100; i++) {
      await page.keyboard.type('Test line ' + i + '\n');

      // Check if editor remains responsive (no freezing)
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;

      // Should not take more than 50ms per line on average
      expect(elapsed / (i + 1)).toBeLessThan(50);
    }

    const totalTime = performance.now() - startTime;
    console.log(`Rapid typing total time: ${totalTime.toFixed(2)}ms`);
    console.log(`Average time per line: ${(totalTime / 100).toFixed(2)}ms`);
  });

  test('should not leak memory during extended use', async ({ page }) => {
    await page.goto('/');

    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    // Perform extensive editing
    const editor = page.locator('[data-milkdown-editor] .ProseMirror');
    await editor.click();

    for (let cycle = 0; cycle < 10; cycle++) {
      // Add content
      for (let i = 0; i < 50; i++) {
        await page.keyboard.type(`Cycle ${cycle}, Line ${i}\n`);
      }

      // Clear content
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Delete');

      // Force garbage collection if available
      await page.evaluate(() => {
        if ((window as any).gc) {
          (window as any).gc();
        }
      });
    }

    // Check final memory usage
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    const memoryIncrease = finalMemory - initialMemory;
    const memoryIncreaseMB = memoryIncrease / (1024 * 1024);

    // Memory increase should be reasonable (< 10MB)
    expect(memoryIncreaseMB).toBeLessThan(10);

    console.log(`Memory usage increase: ${memoryIncreaseMB.toFixed(2)}MB`);
  });
});
```

### 步骤 7: 配置 npm 发布

**更新 package.json for publishing**:
```json
{
  "name": "@milkdown/svelte5",
  "version": "1.0.0",
  "description": "Svelte 5 components for Milkdown editor",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./components": {
      "import": "./dist/components/index.js",
      "types": "./dist/components/index.d.ts"
    },
    "./composables": {
      "import": "./dist/composables/index.js",
      "types": "./dist/composables/index.d.ts"
    },
    "./utils": {
      "import": "./dist/utils/index.js",
      "types": "./dist/utils/index.d.ts"
    },
    "./types": {
      "import": "./dist/types/index.js",
      "types": "./dist/types/index.d.ts"
    },
    "./themes": {
      "import": "./dist/themes/index.js",
      "types": "./dist/themes/index.d.ts"
    },
    "./styles": "./dist/styles/index.css"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "dev": "vite dev",
    "build": "npm run build:lib && npm run build:types",
    "build:lib": "vite build",
    "build:types": "svelte-package && svelte-check --tsconfig ./tsconfig.lib.json",
    "build:docs": "typedoc src/lib/index.ts",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:coverage": "vitest run --coverage",
    "test:perf": "playwright test tests/performance",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:lib": "svelte-check --tsconfig ./tsconfig.lib.json",
    "lint": "prettier --check . && eslint .",
    "format": "prettier --write .",
    "prepublishOnly": "npm run build && npm run test:coverage",
    "release": "changeset publish",
    "size-check": "bundlesize"
  },
  "keywords": [
    "svelte",
    "svelte5",
    "milkdown",
    "markdown",
    "editor",
    "wysiwyg",
    "rich-text"
  ],
  "author": "Milkdown Team",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/milkdown/milkdown.git",
    "directory": "packages/svelte5"
  },
  "bugs": {
    "url": "https://github.com/milkdown/milkdown/issues"
  },
  "homepage": "https://milkdown.dev",
  "peerDependencies": {
    "svelte": "^5.0.0"
  },
  "dependencies": {
    "@milkdown/crepe": "^7.17.1",
    "@milkdown/kit": "^7.17.1",
    "@milkdown/theme-nord": "^7.17.1"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "@sveltejs/adapter-auto": "^7.0.0",
    "@sveltejs/kit": "^2.47.1",
    "@sveltejs/package": "^2.2.5",
    "@sveltejs/vite-plugin-svelte": "^6.2.1",
    "@testing-library/svelte": "^5.0.0",
    "@testing-library/user-event": "^14.5.1",
    "@types/node": "^22",
    "@typescript-eslint/eslint-plugin": "^8.46.1",
    "@typescript-eslint/parser": "^8.46.1",
    "@vitest/coverage-v8": "^2.0.0",
    "@vitest/ui": "^2.0.0",
    "bundlesize": "^0.18.1",
    "eslint": "^9.38.0",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-svelte": "^3.12.4",
    "jsdom": "^27.0.0",
    "playwright": "^1.40.0",
    "prettier": "^3.6.2",
    "prettier-plugin-svelte": "^3.4.0",
    "svelte": "^5.41.0",
    "svelte-check": "^4.3.3",
    "typedoc": "^0.26.3",
    "typescript": "^5.9.3",
    "vite": "^7.1.10",
    "vitest": "^2.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "publishConfig": {
    "access": "public"
  },
  "bundlesize": [
    {
      "path": "./dist/index.js",
      "maxSize": "200kb"
    }
  ]
}
```

### 步骤 8: 配置 CI/CD 流水线

**创建 .github/workflows/ci.yml**:
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  release:
    types: [ published ]

env:
  NODE_VERSION: '20'

jobs:
  lint:
    name: Lint and Format
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Check formatting
        run: npm run format -- --check

      - name: Lint
        run: npm run lint

  type-check:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run check
        run: npm run check:lib

  test:
    name: Test
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20]
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

  e2e-test:
    name: E2E Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Build
        run: npm run build

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload E2E test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7

  performance-test:
    name: Performance Test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run performance tests
        run: npm run test:perf

      - name: Performance baseline check
        run: |
          # Parse performance results and check against baseline
          # This would involve comparing load times, memory usage, etc.

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, type-check, test]
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build library
        run: npm run build

      - name: Check bundle size
        run: npm run size-check

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
          retention-days: 7

  security:
    name: Security Audit
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Audit dependencies
        run: npm audit --audit-level=high

      - name: Run CodeQL Analysis
        uses: github/codeql-action/analyze@v2
        with:
          languages: javascript

  publish:
    name: Publish to npm
    runs-on: ubuntu-latest
    needs: [lint, type-check, test, e2e-test, build, security]
    if: github.event_name == 'release' && github.event.action == 'published'
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          registry-url: 'https://registry.npmjs.org'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Publish to npm
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

  deploy-docs:
    name: Deploy Documentation
    runs-on: ubuntu-latest
    needs: [build]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build documentation
        run: npm run build:docs

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/dist
```

## ✅ 完成标准

### 必须完成项
- [ ] 单元测试覆盖率 > 90%
- [ ] 集成测试通过
- [ ] E2E 测试场景完整
- [ ] 性能基准测试通过
- [ ] npm 发布配置完成
- [ ] CI/CD 流水线工作正常
- [ ] 文档完整且准确
- [ ] 包大小优化完成

### 验证测试
```bash
# 运行所有测试
npm run test

# 检查测试覆盖率
npm run test:coverage

# 运行 E2E 测试
npm run test:e2e

# 运行性能测试
npm run test:perf

# 构建验证
npm run build

# 发布测试
npm run publish -- --dry-run
```

### 质量指标
- **代码覆盖率**: > 90%
- **包大小**: < 200KB (gzipped)
- **加载时间**: < 2s
- **编辑器初始化**: < 1s
- **内存增长**: < 10MB (extended use)
- **类型错误**: 0
- **安全漏洞**: 0

## 📝 注意事项

1. **测试稳定性**: 确保测试在不同环境下都能稳定运行
2. **性能回归**: 定期监控性能指标，防止回归
3. **发布安全**: 确保发布流程有适当的回滚机制
4. **文档同步**: 保持代码和文档同步更新
5. **版本管理**: 遵循语义化版本控制规范

## 🚀 发布完成

恭喜！完成所有 5 个阶段后，Svelte 5 Milkdown Editor npm 包就可以正式发布到 npm 仓库了。

### 发布后工作
1. **社区推广**: 在 Svelte 和 Milkdown 社区宣传
2. **用户反馈**: 收集和处理用户反馈
3. **持续维护**: 修复 bug，添加新功能
4. **版本迭代**: 规划后续版本的功能

### 支持和维护
- 创建 GitHub Issues 和 Discussions
- 提供详细的使用文档和示例
- 建立社区贡献指南
- 定期更新依赖和安全补丁

这个完整的项目计划为创建高质量的 Svelte 5 Milkdown 编辑器包提供了详细的路线图，确保项目的成功实施和长期维护。