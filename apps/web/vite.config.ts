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
				// 개발 환경에서는 localhost:8081을 사용, 그 외에는 프로덕션 URL 사용
				target: process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : process.env.VITE_API_URL || 'https://api.clib.kr',
				changeOrigin: true,
				secure: false,
				// rewrite: path => path.replace(/^\/api/, '/api'),
			},
		},
	},
});
