import type { EditorOptions, EditorInstance } from '../types';
export declare function useEditor(): {
    instance: EditorInstance | null;
    loading: boolean;
    error: Error | null;
    content: string;
    setContent: (content: string) => void;
};
export declare function useEditorInstance(element: HTMLElement, options?: EditorOptions): {
    createInstance: () => Promise<void>;
    destroyInstance: () => void;
    setContent: (newContent: string) => void;
    getContent: () => string;
    setTheme: (newTheme: "nord" | "nord-dark" | "frame" | "frame-dark") => Promise<void>;
    getTheme: () => string;
    getInstance: () => EditorInstance | null;
    getLoading: () => boolean;
    getError: () => Error | null;
};
