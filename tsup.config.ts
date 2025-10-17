// tsup.config.ts o tsup.config.js
import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm', 'cjs'],
	dts: true,
	sourcemap: true,
	clean: true,
	target: 'es2020',
	minify: false,
	outDir: 'dist',
	splitting: false,
	outExtension({ format }) {
		return {
			js: format === 'esm' ? '.mjs' : '.cjs'
		};
	}
});
