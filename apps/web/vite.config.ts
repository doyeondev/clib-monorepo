import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	esbuild: {
		drop: ['console', 'debugger'], // console.*과 debugger 제거
	},
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
