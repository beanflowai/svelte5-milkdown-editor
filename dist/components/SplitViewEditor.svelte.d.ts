interface Props {
    /** Initial markdown content */
    defaultValue?: string;
    /** Editor theme */
    theme?: 'nord' | 'nord-dark' | 'frame' | 'frame-dark';
    /** Editor height */
    height?: string;
    /** Auto-save configuration */
    autosave?: {
        enabled: boolean;
        delay?: number;
        onSave?: (content: string) => void;
    };
    /** Placeholder text */
    placeholder?: string;
    /** Events */
    onReady?: (instance: any) => void;
    onError?: (error: Error) => void;
}
declare const SplitViewEditor: import("svelte").Component<Props, {}, "">;
type SplitViewEditor = ReturnType<typeof SplitViewEditor>;
export default SplitViewEditor;
