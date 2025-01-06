import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ isSsrBuild }) => ({
	plugins: [tsconfigPaths()],
	build: {
		sourcemap: true,
		target: isSsrBuild ? 'ESNext' : 'modules',
		outDir: isSsrBuild ? './dist/server' : './dist/client',
	},
}));
