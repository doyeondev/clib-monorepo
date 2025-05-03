// apps/web/src/components/layout/Footer.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import Footer from './Footer';
import { MemoryRouter } from 'react-router-dom';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof Footer> = {
    title: 'Layout/Footer',
    component: Footer,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
    parameters: {
        docs: {
            description: {
                component: '웹 사이트 푸터 컴포넌트. 저작권 정보와 회사 정보를 포함합니다.'
            }
        }
    }
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // 저작권 정보 확인
        const copyrightElement = canvas.getByText(/© 2023 clib/i);
        await expect(copyrightElement).toBeInTheDocument();

        // 회사 정보 확인
        const companyElement = canvas.getByText(/주식회사 마이리걸팀/i);
        await expect(companyElement).toBeInTheDocument();

        // 대표 정보 확인
        const ceoElement = canvas.getByText(/대표 김도연/i);
        await expect(ceoElement).toBeInTheDocument();

        // 로고 이미지 확인
        const images = canvas.getAllByRole('img');
        await expect(images.length).toBeGreaterThan(0);

        console.log('푸터 검증 테스트 완료');
    }
};
