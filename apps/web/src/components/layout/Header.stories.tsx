// apps/web/src/components/layout/Header.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import Header from './Header';
import { MemoryRouter } from 'react-router-dom';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof Header> = {
    title: 'Layout/Header',
    component: Header,
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
                component: '웹 사이트 헤더 컴포넌트. 로고와 네비게이션 링크를 포함합니다.'
            }
        }
    }
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // 로고 확인
        const logoElement = canvas.getByText('Clib');
        await expect(logoElement).toBeInTheDocument();

        // 네비게이션 링크 확인
        const assetLink = canvas.getByText('Clib Asset');
        await expect(assetLink).toBeInTheDocument();

        const myDataLink = canvas.getByText('내 조항 데이터');
        await expect(myDataLink).toBeInTheDocument();

        const uploadLink = canvas.getByText('계약서 업로드');
        await expect(uploadLink).toBeInTheDocument();

        // 클릭 상호작용 테스트
        await userEvent.click(logoElement);
        console.log('로고 클릭 테스트 완료');

        await userEvent.hover(assetLink);
        console.log('Asset 링크 호버 테스트 완료');
    }
};
