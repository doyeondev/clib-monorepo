/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './src/styles/**/*.{css,scss}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#632fad',
					light: '#8a63d2',
					dark: '#4a2383',
				},
				secondary: {
					DEFAULT: '#0f4a86',
					light: '#0675ac',
					dark: '#0c3a6a',
				},
				accent: {
					DEFAULT: '#FF6F53',
				},
			},
			animation: {
				'bounce-short': 'bounce 0.5s linear 1.5',
			},
			fontSize: {
				xs: '.75rem',
				sm: '.875rem',
				base: '1rem',
				lg: '1.125rem',
				xl: '1.25rem',
				'2xl': '1.5rem',
				'3xl': '1.875rem',
				'4xl': '2.25rem',
				'5xl': '3rem',
				'6xl': '4rem',
			},
		},
	},
	plugins: [require('@tailwindcss/forms'), require('tailwind-scrollbar-hide')],
};
