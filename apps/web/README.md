# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
	extends: [
		// Remove ...tseslint.configs.recommended and replace with this
		...tseslint.configs.recommendedTypeChecked,
		// Alternatively, use this for stricter rules
		...tseslint.configs.strictTypeChecked,
		// Optionally, add this for stylistic rules
		...tseslint.configs.stylisticTypeChecked,
	],
	languageOptions: {
		// other options...
		parserOptions: {
			project: ['./tsconfig.node.json', './tsconfig.app.json'],
			tsconfigRootDir: import.meta.dirname,
		},
	},
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
	plugins: {
		// Add the react-x and react-dom plugins
		'react-x': reactX,
		'react-dom': reactDom,
	},
	rules: {
		// other rules...
		// Enable its recommended typescript rules
		...reactX.configs['recommended-typescript'].rules,
		...reactDom.configs.recommended.rules,
	},
});
```

# Clib 웹 애플리케이션 (Web App)

## 테스트 전략

본 프로젝트는 다음과 같은 3단계 테스트 전략을 사용합니다:

### 1. 단위 및 통합 테스트 (Vitest + Testing Library)

- **파일 패턴**: `*.test.tsx`
- **목적**: 컴포넌트 및 함수 단위 검증
- **도구**: Vitest, Testing Library
- **실행 방법**: `npm test` 또는 `npm run test:watch`

```bash
# 모든 테스트 실행
npm test

# 특정 파일 테스트
npm test -- src/components/search/SearchInput.test.tsx

# 감시 모드로 실행 (파일 변경 시 자동 테스트)
npm run test:watch
```

### 2. 컴포넌트 수준 E2E 테스트 (Storybook + Playwright)

- **파일 패턴**: `*.stories.tsx` 내 `play` 함수
- **목적**: Storybook 컴포넌트 내 사용자 시나리오 검증
- **도구**: Storybook Test Runner (Playwright 기반)
- **실행 방법**: `npm run test-storybook`

```bash
# Storybook 테스트 실행
npm run test-storybook
```

### 3. 페이지 수준 E2E 테스트 (Playwright)

- **파일 패턴**: `e2e/*.spec.ts`
- **목적**: 전체 페이지 통합 검증
- **도구**: Playwright
- **실행 방법**: `npm run e2e`

```bash
# E2E 테스트 실행 (구현 예정)
npm run e2e
```

## Best Practices

1. **새 컴포넌트 작성 시**:

   - `.tsx` 컴포넌트 파일 작성
   - `.stories.tsx` 스토리북 파일 작성 (인터랙션 포함)
   - `.test.tsx` 단위 테스트 파일 작성

2. **테스트 범위**:
   - 단위 테스트: 개별 컴포넌트 렌더링 및 기능 검증
   - 스토리북 테스트: 사용자 인터랙션 및 시각적 검증
   - E2E 테스트: 여러 컴포넌트 및 페이지 간 전체 흐름 검증
