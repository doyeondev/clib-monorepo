import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Toast from './Toast';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof Toast> = {
    title: 'Feedback/Toast',
    component: Toast,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
Toast 컴포넌트는 사용자에게 피드백 메시지를 전달할 때 사용됩니다.

✅ 주요 특징
- type: 'success' | 'error' | 'warning' | 'info' 타입에 따라 색상/아이콘이 다르게 표시됩니다.
- isVisible: 표시 여부 제어
- onClose: 수동 닫기 핸들러
- autoClose, autoCloseTime: 자동 닫기 설정 가능
- position: 'top-right', 'bottom-left' 등 다양한 위치 지정 가능

💡 사용 예시:
\`\`\`tsx
<Toast
  type="success"
  message="성공적으로 저장되었습니다."
  isVisible={true}
  onClose={() => setVisible(false)}
  position="center"
/>
\`\`\`
        `,
            },
        },
    },
};

export default meta;

type Story = StoryObj<typeof Toast>;

export const Success: Story = {
    render: () => {
        const [visible, setVisible] = useState(true);

        return (
            <Toast
                type="success"
                message="성공적으로 저장되었습니다."
                isVisible={visible}
                onClose={() => setVisible(false)}
                position="center"
                autoClose={false}
            />
        );
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // 메시지 확인
        const successMessage = canvas.getByText('성공적으로 저장되었습니다.');
        await expect(successMessage).toBeInTheDocument();

        // 성공 스타일 확인 - 부모 요소에서 클래스 확인
        const toastContainer = canvas.getByText('성공적으로 저장되었습니다.')
            .closest('div[class*="rounded-md"]');
        await expect(toastContainer).toHaveClass('bg-green-50');

        // 닫기 버튼 확인
        const closeButton = canvas.getByRole('button', { name: /닫기|close/i }) ||
            canvas.getByRole('button');
        await expect(closeButton).toBeInTheDocument();

        // 닫기 버튼 클릭 (실제 애플리케이션에서는 토스트가 사라짐)
        await userEvent.click(closeButton);

        console.log('Success Toast 테스트 완료');
    }
};

export const Error: Story = {
    render: () => {
        const [visible, setVisible] = useState(true);

        return (
            <Toast
                type="error"
                message="저장에 실패했습니다."
                isVisible={visible}
                onClose={() => setVisible(false)}
                position="center"
                autoClose={false}
            />
        );
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // 메시지 확인
        const errorMessage = canvas.getByText('저장에 실패했습니다.');
        await expect(errorMessage).toBeInTheDocument();

        // 에러 스타일 확인 - 부모 요소에서 클래스 확인
        const toastContainer = errorMessage.closest('div[class*="rounded-md"]');
        await expect(toastContainer).toHaveClass('bg-red-50');

        console.log('Error Toast 테스트 완료');
    }
};

export const Info: Story = {
    render: () => {
        const [visible, setVisible] = useState(true);

        return (
            <Toast
                type="info"
                message="새로운 업데이트가 있습니다."
                isVisible={visible}
                onClose={() => setVisible(false)}
                position="center"
                autoClose={false}
            />
        );
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // 메시지 확인
        const infoMessage = canvas.getByText('새로운 업데이트가 있습니다.');
        await expect(infoMessage).toBeInTheDocument();

        // 정보 스타일 확인 - 부모 요소에서 클래스 확인
        const toastContainer = infoMessage.closest('div[class*="rounded-md"]');
        await expect(toastContainer).toHaveClass('bg-blue-50');

        console.log('Info Toast 테스트 완료');
    }
};

export const Warning: Story = {
    render: () => {
        const [visible, setVisible] = useState(true);

        return (
            <Toast
                type="warning"
                message="입력값을 다시 확인해주세요."
                isVisible={visible}
                onClose={() => setVisible(false)}
                position="center"
                autoClose={false}
            />
        );
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // 메시지 확인
        const warningMessage = canvas.getByText('입력값을 다시 확인해주세요.');
        await expect(warningMessage).toBeInTheDocument();

        // 경고 스타일 확인 - 부모 요소에서 클래스 확인
        const toastContainer = warningMessage.closest('div[class*="rounded-md"]');
        await expect(toastContainer).toHaveClass('bg-yellow-50');

        console.log('Warning Toast 테스트 완료');
    }
};
