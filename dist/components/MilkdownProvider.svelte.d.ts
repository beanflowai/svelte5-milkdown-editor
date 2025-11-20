import type { EditorOptions } from '../types';
interface Props {
    /** Default editor options for all child editors */
    defaultOptions?: EditorOptions;
    children: any;
}
declare const MilkdownProvider: import("svelte").Component<Props, {}, "">;
type MilkdownProvider = ReturnType<typeof MilkdownProvider>;
export default MilkdownProvider;
