import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	define: {
		// Vue功能标志 - 防止在Svelte项目中出现警告
		__VUE_OPTIONS_API__: JSON.stringify(false),
		__VUE_PROD_DEVTOOLS__: JSON.stringify(false),
		__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/test-setup.ts']
	}
});
