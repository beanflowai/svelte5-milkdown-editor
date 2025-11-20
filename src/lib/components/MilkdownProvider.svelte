<script lang="ts">
	import type { EditorOptions } from '../types';

	interface Props {
		/** Default editor options for all child editors */
		defaultOptions?: EditorOptions;
		children: any;
	}

	let { defaultOptions = {}, children }: Props = $props();

	// Simple provider - just passes through children
	// In the future, this could provide context for multiple editors
</script>

{@render children()}