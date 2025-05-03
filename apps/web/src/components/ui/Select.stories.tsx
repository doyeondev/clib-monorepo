// apps/web/src/components/ui/Select.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Select, { SelectOption } from './Select';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof Select> = {
    title: 'UI/Select',
    component: Select,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: '드롭다운 선택 컴포넌트. 옵션 목록에서 항목을 선택할 수 있습니다.'
            }
        }
    }
};

export default meta;
type Story = StoryObj<typeof Select>;

const sampleOptions: SelectOption[] = [
    { value: 'apple', label: '사과' },
    { value: 'banana', label: '바나나' },
    { value: 'cherry', label: '체리' },
];

export const Default: Story = {
    render: () => {
        const [selected, setSelected] = useState('banana');

        return (
            <div className="w-64">
                <Select
                    options={sampleOptions}
                    value={selected}
                    onChange={(val) => setSelected(val)}
                    label="과일 선택"
                    helperText="좋아하는 과일을 선택하세요"
                    placeholder="선택해주세요"
                />
            </div>
        );
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // 라벨 확인
        const label = canvas.getByText('과일 선택');
        await expect(label).toBeInTheDocument();

        // 선택된 값 확인
        const selectedOption = canvas.getByText('바나나');
        await expect(selectedOption).toBeInTheDocument();

        // 헬퍼 텍스트 확인
        const helperText = canvas.getByText('좋아하는 과일을 선택하세요');
        await expect(helperText).toBeInTheDocument();

        // 드롭다운 클릭
        await userEvent.click(selectedOption);

        // 옵션 목록 표시 확인
        const applOption = canvas.getByText('사과');
        await expect(applOption).toBeInTheDocument();

        // 옵션 선택
        await userEvent.click(applOption);

        console.log('Select 컴포넌트 인터랙션 테스트 완료');
    }
};

export const WithError: Story = {
    render: () => {
        const [selected, setSelected] = useState('');

        return (
            <div className="w-64">
                <Select
                    options={sampleOptions}
                    value={selected}
                    onChange={(val) => setSelected(val)}
                    label="과일 선택"
                    error={true}
                    errorText="필수 항목입니다"
                    required={true}
                />
            </div>
        );
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // 에러 메시지 확인
        const errorText = canvas.getByText('필수 항목입니다');
        await expect(errorText).toBeInTheDocument();

        // 필수 표시 확인
        const requiredMark = canvas.getByText('*');
        await expect(requiredMark).toBeInTheDocument();

        console.log('Select 에러 상태 테스트 완료');
    }
};
