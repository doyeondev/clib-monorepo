import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import SearchContainerWrapper from './SearchContainerWrapper'; // ❗ 경로 수정됨 (SearchInput → SearchContainerWrapper)
import { MemoryRouter } from 'react-router-dom';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof SearchContainerWrapper> = {
    title: 'Search/SearchContainerWrapper',
    component: SearchContainerWrapper,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <MemoryRouter initialEntries={['/']}>
                <Story />
            </MemoryRouter>
        )
    ],
    parameters: {
        docs: {
            description: {
                component: '검색 컨테이너 래퍼 컴포넌트는 검색 타입에 따라 계약서 또는 조항 검색 UI를 표시합니다.'
            }
        },
        argTypes: {
            searchType: {
                control: 'radio',
                options: ['contract', 'clause'],
                description: '검색 타입 (계약서/조항)'
            }
        }
    }
};

export default meta; // 이 줄이 빠져 있었기 때문에 index.json 에러가 발생했던 것

type Story = StoryObj<typeof SearchContainerWrapper>;

export const ContractSearch: Story = {
    args: {
        contractList: [],
        searchType: 'contract',
        setSearchType: () => { }
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);

        // 계약서 검색 제목이 올바르게 표시되는지 확인
        await expect(canvas.getByText(/어떤 계약서 양식이 필요하신가요/i)).toBeInTheDocument();

        // 상태 변경 함수가 호출되었는지 콘솔에 기록
        console.log('계약서 검색 모드 활성화:', args.searchType);
    }
};

export const ClauseSearch: Story = {
    args: {
        contractList: [],
        searchType: 'clause',
        setSearchType: () => { }
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);

        // 조항 검색 제목이 올바르게 표시되는지 확인
        await expect(canvas.getByText(/계약서 조항을 검색하세요/i)).toBeInTheDocument();

        // 상태 변경 함수가 호출되었는지 콘솔에 기록
        console.log('조항 검색 모드 활성화:', args.searchType);
    }
};
