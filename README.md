# Svelte 5 Milkdown Editor

A modern Svelte 5 component library for [Milkdown](https://milkdown.dev/) markdown editor with split view, themes, and auto-save functionality.

## Features

- ✨ **Svelte 5** - Built with the latest Svelte 5 using runes
- 📝 **Rich Text Editing** - WYSIWYG markdown editor powered by Milkdown
- 🔀 **Split View** - Side-by-side visual and raw markdown editing with live sync
- 🎨 **Multiple Themes** - Nord, Nord Dark, Frame, and Frame Dark themes
- 💾 **Auto-save** - Optional auto-save functionality with customizable delay
- ✅ **Task Lists** - Interactive checkboxes for task management
- 🎯 **Syntax Highlighting** - Code blocks with syntax highlighting
- 📊 **Tables** - Full table support with styling
- 🔗 **Links & Images** - Rich link and image handling
- 📱 **Responsive** - Mobile-friendly design
- 💪 **TypeScript** - Full TypeScript support with type definitions

## Installation

```bash
npm install svelte5-milkdown-editor
```

## Usage

### Basic Editor

```svelte
<script>
  import { MilkdownEditor } from 'svelte5-milkdown-editor';
  import 'svelte5-milkdown-editor/styles';

  let content = $state('# Hello World\n\nStart editing!');

  function handleChange(newContent) {
    content = newContent;
    console.log('Content changed:', newContent);
  }

  function handleReady(instance) {
    console.log('Editor ready:', instance);
  }
</script>

<MilkdownEditor
  defaultValue={content}
  onChange={handleChange}
  onReady={handleReady}
  theme="nord"
  height="500px"
  placeholder="Start typing..."
/>
```

### Split View Editor

```svelte
<script>
  import { SplitViewEditor } from 'svelte5-milkdown-editor';
  import 'svelte5-milkdown-editor/styles';

  const markdown = `# Split View Demo

Edit on the left, see raw markdown on the right!

## Features
- ✅ Live synchronization
- ✅ Resizable panes
- ✅ Theme support`;

  function handleSave(content) {
    localStorage.setItem('content', content);
    console.log('Auto-saved!');
  }
</script>

<SplitViewEditor
  defaultValue={markdown}
  theme="nord-dark"
  height="600px"
  autosave={{
    enabled: true,
    delay: 2000,
    onSave: handleSave
  }}
/>
```

### With TypeScript

```typescript
import type { EditorOptions, EditorInstance } from 'svelte5-milkdown-editor';
import { MilkdownEditor } from 'svelte5-milkdown-editor';

const options: EditorOptions = {
  theme: 'nord',
  placeholder: 'Type here...',
  readonly: false
};

function handleReady(instance: EditorInstance) {
  // Access Milkdown Crepe instance
  const markdown = instance.crepe.getMarkdown();
  console.log(markdown);
}
```

## API Reference

### MilkdownEditor

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `string` | `''` | Initial markdown content |
| `theme` | `'nord' \| 'nord-dark' \| 'frame' \| 'frame-dark'` | `'nord'` | Editor theme |
| `height` | `string` | `'400px'` | Editor height (CSS value) |
| `minHeight` | `string` | `'300px'` | Minimum height (CSS value) |
| `placeholder` | `string` | `undefined` | Placeholder text |
| `readonly` | `boolean` | `false` | Read-only mode |
| `class` | `string` | `''` | Additional CSS classes |
| `id` | `string` | `'milkdown-editor'` | Element ID |
| `onChange` | `(content: string) => void` | `undefined` | Content change callback |
| `onReady` | `(instance: any) => void` | `undefined` | Editor ready callback |
| `onError` | `(error: Error) => void` | `undefined` | Error callback |
| `autosave` | `AutosaveConfig` | `undefined` | Auto-save configuration |

#### AutosaveConfig

```typescript
{
  enabled: boolean;
  delay?: number;  // milliseconds, default: 3000
  onSave?: (content: string) => void;
}
```

#### Methods

The component exports the following methods:

```typescript
// Get current markdown content
getContent(): string

// Set markdown content
setContent(content: string): void

// Get editor instance
getEditorInstance(): EditorInstance

// Focus the editor
focus(): void

// Blur the editor
blur(): void

// Set theme
setTheme(theme: 'nord' | 'nord-dark' | 'frame' | 'frame-dark'): void

// Get current theme
getTheme(): string
```

#### Example using methods

```svelte
<script>
  import { MilkdownEditor } from 'svelte5-milkdown-editor';

  let editor;

  function handleGetContent() {
    const content = editor.getContent();
    console.log(content);
  }

  function handleSetContent() {
    editor.setContent('# New Content');
  }
</script>

<MilkdownEditor bind:this={editor} />

<button onclick={handleGetContent}>Get Content</button>
<button onclick={handleSetContent}>Set Content</button>
```

### SplitViewEditor

Extends all props from `MilkdownEditor` with additional props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialViewMode` | `'split' \| 'editor' \| 'raw'` | `'split'` | Initial view mode |
| `showToolbar` | `boolean` | `true` | Show toolbar with controls |
| `resizable` | `boolean` | `true` | Allow pane resizing |

## Styling

### Import Styles

The package includes CSS for all Milkdown features. Import it in your app:

```javascript
// In your main JS/TS file
import 'svelte5-milkdown-editor/styles';
```

Or in your CSS file:

```css
@import 'svelte5-milkdown-editor/styles';
```

### Custom Styling

You can override styles using CSS variables:

```css
:root {
  --milkdown-primary-color: #2e3440;
  --milkdown-bg-color: #ffffff;
  --milkdown-border-color: #ccc;
  --milkdown-focus-color: #007bff;
}

/* Dark theme */
[data-theme="nord-dark"] {
  --milkdown-primary-color: #d8dee9;
  --milkdown-bg-color: #2e3440;
  --milkdown-border-color: #4c566a;
  --milkdown-focus-color: #5e81ac;
}
```

## Themes

The editor comes with 4 built-in themes:

- **Nord** - Light theme with arctic color palette
- **Nord Dark** - Dark variant of Nord theme
- **Frame** - Clean and minimal light theme
- **Frame Dark** - Dark variant of Frame theme

Switch themes dynamically:

```svelte
<script>
  let currentTheme = $state('nord');
</script>

<MilkdownEditor theme={currentTheme} />

<button onclick={() => currentTheme = 'nord'}>Nord</button>
<button onclick={() => currentTheme = 'nord-dark'}>Nord Dark</button>
<button onclick={() => currentTheme = 'frame'}>Frame</button>
<button onclick={() => currentTheme = 'frame-dark'}>Frame Dark</button>
```

## Requirements

- Svelte 5.0.0 or higher
- Node.js 18 or higher (recommended)

## Development

```bash
# Clone the repository
git clone https://github.com/yourusername/svelte5-milkdown-editor.git
cd svelte5-milkdown-editor

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build library
npm run package

# Check types
npm run check
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Your Name]

## Credits

- Built with [Milkdown](https://milkdown.dev/)
- Powered by [Svelte 5](https://svelte.dev/)
- Uses [ProseMirror](https://prosemirror.net/) under the hood

## Links

- [Documentation](https://github.com/yourusername/svelte5-milkdown-editor#readme)
- [npm Package](https://www.npmjs.com/package/svelte5-milkdown-editor)
- [GitHub Repository](https://github.com/yourusername/svelte5-milkdown-editor)
- [Issue Tracker](https://github.com/yourusername/svelte5-milkdown-editor/issues)
- [Milkdown Documentation](https://milkdown.dev/)
