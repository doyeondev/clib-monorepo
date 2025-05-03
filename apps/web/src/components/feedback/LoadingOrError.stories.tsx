import type { Meta, StoryObj } from '@storybook/react';
import LoadingOrError from './LoadingOrError';

const meta: Meta<typeof LoadingOrError> = {
    title: 'Feedback/LoadingOrError',
    component: LoadingOrError,
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof LoadingOrError>;

export const LoadingState: Story = {
    args: {
        loading: true,
        error: null,
        children: '데이터 로딩 중...', // 이건 실제로 표시되지 않음
    },
};

export const ErrorState: Story = {
    args: {
        loading: false,
        error: new Error('네트워크 에러 발생'),
        children: '이 내용은 에러 시 렌더링되지 않음',
    },
};

export const SuccessState: Story = {
    args: {
        loading: false,
        error: null,
        children: (
            <div className="p-4 bg-green-100 rounded text-green-800 text-sm">
                ✅ 정상적으로 데이터가 로드되었습니다.
            </div>
        ),
    },
};
