// apps/web/src/components/layout/Layout.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import Layout from './Layout';
import { MemoryRouter } from 'react-router-dom';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof Layout> = {
    title: 'Layout/Layout',
    component: Layout,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        )
    ],
    parameters: {
        docs: {
            description: {
                component: '전체 레이아웃 컴포넌트. 헤더, 콘텐츠 영역, 푸터를 포함합니다.'
            }
        }
    }
};

export default meta;
type Story = StoryObj<typeof Layout>;

export const Default: Story = {
    args: {
        children: <div data-testid="test-content" className="p-8 text-center bg-white">테스트 콘텐츠 영역입니다.</div>
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // 헤더에 있는 로고 확인
        const logoElement = canvas.getByText('Clib');
        await expect(logoElement).toBeInTheDocument();

        // 콘텐츠 영역 확인
        const contentElement = canvas.getByText('테스트 콘텐츠 영역입니다.');
        await expect(contentElement).toBeInTheDocument();

        // 푸터 확인
        const footerElement = canvas.getByText(/© 2023 clib/i);
        await expect(footerElement).toBeInTheDocument();

        console.log('레이아웃 구조 검증 테스트 완료');
    }
};
