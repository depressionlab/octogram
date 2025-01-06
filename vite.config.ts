import { defineConfig } from 'vite';

export default defineConfig(({ isSsrBuild }) => ({
	plugins: [],
	build: {
		sourcemap: true,
		target: isSsrBuild ? 'ESNext' : 'modules',
		outDir: isSsrBuild ? './dist/server' : './dist/client',
	},
}));
