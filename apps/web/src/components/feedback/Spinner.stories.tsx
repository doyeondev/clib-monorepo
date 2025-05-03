import type { Meta, StoryObj } from '@storybook/react';
import Spinner from './Spinner';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof Spinner> = {
    title: 'Feedback/Spinner',
    component: Spinner,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: '데이터 로딩 중 표시를 위한 스피너 컴포넌트입니다.'
            }
        }
    }
};

export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // 로딩 스피너 확인
        const spinner = canvas.getByRole('status');
        await expect(spinner).toBeInTheDocument();

        // 로딩 텍스트 확인
        const loadingText = canvas.getByText('데이터를 로딩중입니다');
        await expect(loadingText).toBeInTheDocument();

        // 스피너 스타일 확인
        const svgElement = canvas.getByRole('status').querySelector('svg');
        await expect(svgElement).toHaveClass('animate-spin');

        console.log('Spinner 컴포넌트 테스트 완료');
    }
};
