// apps/web/.storybook/preview.ts
import type { Preview } from '@storybook/react';
import '../src/styles/globals.css'; // ← 이 경로가 정확해야 함

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: '^on[A-Z].*' },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
	},
};

export default preview;
