import type { EditorOptions } from '../types';
import '../styles/milkdown.css';
interface Props {
    /** Editor options */
    options?: EditorOptions;
    /** Initial markdown content */
    defaultValue?: string;
    /** CSS class for the editor container */
    class?: string;
    /** Editor ID */
    id?: string;
    /** Placeholder text */
    placeholder?: string;
    /** Read-only mode */
    readonly?: boolean;
    /** Height of the editor */
    height?: string;
    /** Minimum height */
    minHeight?: string;
    /** Theme */
    theme?: 'nord' | 'nord-dark' | 'frame' | 'frame-dark';
    /** Auto-save configuration */
    autosave?: {
        enabled: boolean;
        delay?: number;
        onSave?: (content: string) => void;
    };
    /** Events */
    onReady?: (instance: any) => void;
    onChange?: (content: string) => void;
    onError?: (error: Error) => void;
}
declare const MilkdownEditor: import("svelte").Component<Props, {
    getContent: () => string;
    setContent: (content: string) => void;
    getEditorInstance: () => any;
    focus: () => void;
    blur: () => void;
    setTheme: (newTheme: "nord" | "nord-dark" | "frame" | "frame-dark") => void;
    getTheme: () => string;
}, "">;
type MilkdownEditor = ReturnType<typeof MilkdownEditor>;
export default MilkdownEditor;
