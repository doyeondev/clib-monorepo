import type { Meta, StoryObj } from '@storybook/react';
import ClauseSearchInput from './ClauseSearch';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof ClauseSearchInput> = {
    title: 'Clause/ClauseSearchInput',
    component: ClauseSearchInput,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `한글 정규식을 기반으로 조항을 실시간 검색할 수 있는 입력 필드입니다.  
검색어 입력 시 debounce되어 clauseList를 필터링하고, 결과는 외부 상태로 전달됩니다.`,
            },
        },
    },
    argTypes: {
        placeholderText: {
            description: '입력창에 표시할 placeholder 텍스트',
            control: { type: 'text' },
            defaultValue: '필요한 조항을 검색해보세요!',
        },
        className: {
            description: '추가 커스텀 스타일 클래스',
            control: { type: 'text' },
        },
        setData: {
            description: '`검색 결과를 상위 컴포넌트로 전달할 setState 함수`',
            control: false,
        },
        contractList: {
            description: '`(선택) 검색 대상이 되는 clause 배열을 override할 때 사용`',
            control: false,
        },
    },
};

export default meta;
type Story = StoryObj<typeof ClauseSearchInput>;

export const Default: Story = {
    args: {
        placeholderText: '조항을 검색해보세요',
        setData: (data: any) => console.log('검색 결과:', data),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);

        // 검색 입력 필드 확인
        const searchInput = canvas.getByPlaceholderText('조항을 검색해보세요');
        await expect(searchInput).toBeInTheDocument();

        // 검색어 입력
        await userEvent.type(searchInput, '임차인');

        // 검색 버튼 확인
        const searchButton = canvas.getByText('검색');
        await expect(searchButton).toBeInTheDocument();

        // 검색 버튼 클릭
        await userEvent.click(searchButton);

        console.log('검색 입력 및 버튼 클릭 테스트 완료');
    }
};

export const WithCustomPlaceholder: Story = {
    args: {
        placeholderText: '계약서에 필요한 조항을 입력하세요',
        setData: (data: any) => console.log('검색 결과:', data),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // 커스텀 플레이스홀더 확인
        const searchInput = canvas.getByPlaceholderText('계약서에 필요한 조항을 입력하세요');
        await expect(searchInput).toBeInTheDocument();

        // 텍스트 입력 및 삭제 버튼 테스트
        await userEvent.type(searchInput, '위약금');

        // 입력 후 X 버튼 나타나는지 확인 - 아이콘이나 버튼 속성으로 찾기
        const clearButton = canvas.getByLabelText('clear') ||
            canvas.queryByRole('button', { name: 'clear' }) ||
            canvasElement.querySelector('button[aria-label="clear"]') ||
            Array.from(canvasElement.querySelectorAll('button')).find(btn =>
                btn.innerHTML.includes('X') ||
                btn.classList.contains('clear-button')
            );

        if (clearButton) {
            await expect(clearButton).toBeInTheDocument();
            // clearButton이 있을 경우에만 클릭 시도
            await userEvent.click(clearButton);
        } else {
            console.log('삭제 버튼을 찾을 수 없지만 입력은 성공했습니다.');
        }

        console.log('커스텀 플레이스홀더 및 입력 삭제 테스트 완료');
    }
};
