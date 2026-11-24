import adapter from '@sveltejs/adapter-static';
import { sveltePreprocess } from 'svelte-preprocess';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			// Consult https://svelte.dev/docs/kit/integrations
			// for more information about preprocessors
			preprocess: sveltePreprocess({
				scss: {
					prependData: `@use "./src/lib/utils.scss" as *;`,
					api: 'modern'
				}
			}),
			compilerOptions: { runes: true },
			// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
			// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
			// See https://svelte.dev/docs/kit/adapters for more information about adapters.
			adapter: adapter(),

			paths: {
				base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
			}
		})
	],
	css: { preprocessorOptions: { scss: { api: 'modern-compiler' } } }
});
