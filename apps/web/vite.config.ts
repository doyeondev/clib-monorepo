import { defineConfig } from 'vite';
import { defineConfig as defineConfigVitest } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
/// <reference types="vitest" />

// https://vite.dev/config/
export default defineConfigVitest({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./vitest.setup.ts'],
		include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
	},
	// esbuild: {
	// 	drop: ['console', 'debugger'], // console.*과 debugger 제거
	// },
	define: {
		// process.env 변수를 전역으로 사용할 수 있게 합니다
		'process.env': process.env,
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		port: 5173,
		proxy: {
			'/api': {
				target: 'http://localhost:8081',
				changeOrigin: true,
				secure: false,
				// rewrite: path => path.replace(/^\/api/, '/api'),
			},
		},
	},
});
