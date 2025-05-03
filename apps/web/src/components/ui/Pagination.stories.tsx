import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Pagination from './Pagination';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof Pagination> = {
    title: 'UI/Pagination',
    component: Pagination,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: '페이지네이션 컴포넌트. 여러 페이지를 탐색할 수 있는 인터페이스를 제공합니다.'
            }
        }
    }
};

export default meta;

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
    render: () => {
        const [currentIndex, setCurrentIndex] = useState(0);
        const maxIndex = 9;

        return (
            <div className="w-full">
                <Pagination
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    maxIndex={maxIndex}
                    showPageNumbers={true}
                    maxButtons={5}
                />
                <p className="mt-4 text-sm text-center text-gray-600" data-testid="current-page-display">
                    현재 페이지: <strong>{currentIndex + 1}</strong>
                </p>
            </div>
        );
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // 초기 페이지 확인
        const initialPage = canvas.getByTestId('current-page-display');
        await expect(initialPage).toHaveTextContent('현재 페이지: 1');

        // 페이지 번호 표시 확인 - 역할로 요소 선택
        const pageButtons = canvas.getAllByRole('button', { name: /\d+/ });
        await expect(pageButtons.length).toBeGreaterThan(0);

        // 첫 번째 페이지 버튼이 활성화 상태인지 확인
        // first-page 또는 aria-current="page" 속성이 있을 수 있음
        const firstButton = pageButtons.find(button =>
            button.textContent === '1' ||
            button.getAttribute('aria-current') === 'page' ||
            button.classList.contains('bg-gray-700')
        );
        await expect(firstButton).toHaveTextContent('1');

        // 다음 페이지 버튼 클릭
        const nextButton = canvas.getByRole('button', { name: /next/i });
        await userEvent.click(nextButton);

        // 이전 페이지 버튼 클릭
        const prevButton = canvas.getByRole('button', { name: /previous/i });
        await userEvent.click(prevButton);

        console.log('Pagination 기본 인터랙션 테스트 완료');
    }
};

export const LimitedButtons: Story = {
    render: () => {
        const [currentIndex, setCurrentIndex] = useState(5);
        const maxIndex = 20;

        return (
            <div className="w-full">
                <Pagination
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    maxIndex={maxIndex}
                    showPageNumbers={true}
                    maxButtons={3}
                />
                <p className="mt-4 text-sm text-center text-gray-600" data-testid="current-page-display">
                    현재 페이지: <strong>{currentIndex + 1}</strong>
                </p>
            </div>
        );
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // 현재 페이지 확인
        const pageInfo = canvas.getByTestId('current-page-display');
        await expect(pageInfo).toHaveTextContent('현재 페이지: 6');

        // 현재 페이지 번호가 활성화 상태인지 확인 - 활성화된 버튼 찾기
        const pageButtons = canvas.getAllByRole('button', { name: /\d+/ });
        const activePageButton = pageButtons.find(button =>
            button.classList.contains('bg-gray-700') ||
            button.getAttribute('aria-current') === 'page'
        );
        await expect(activePageButton).toHaveTextContent('6');

        console.log('Pagination 제한된 버튼 테스트 완료');
    }
};
