import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:4000/',
				changeOrigin: true,
			},
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './setupTests.ts',
	},
});
