import type { Meta, StoryObj } from '@storybook/react';
import { DragAndDrop } from './DragAndDrop';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof DragAndDrop> = {
    title: 'Upload/DragAndDrop',
    component: DragAndDrop,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: '드래그 앤 드롭 또는 클릭으로 파일을 업로드할 수 있는 컴포넌트입니다.'
            }
        }
    }
};

export default meta;

type Story = StoryObj<typeof DragAndDrop>;

// 파일 업로드 모킹을 위한 유틸리티 함수
const createMockFileList = (files: File[]): FileList => {
    return {
        ...files,
        item: (index: number) => files[index],
        length: files.length,
    } as unknown as FileList;
};

export const Default: Story = {
    render: () => {
        return (
            <div className="w-[400px]">
                <DragAndDrop
                    onDrop={(files) => {
                        console.log('✅ 업로드된 파일 목록:', files);
                    }}
                />
            </div>
        );
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // 파일 업로드 영역이 표시되는지 확인 - 텍스트가 분할될 수 있으므로 부분 텍스트로 검색
        const uploadZone = canvas.getByText((content, element) => {
            return element?.textContent?.includes('클릭하여 파일을 선택') ?? false;
        });
        await expect(uploadZone).toBeInTheDocument();

        // 파일 형식 안내가 표시되는지 확인
        const fileFormatText = canvas.getByText((content, element) => {
            return element?.textContent?.includes('DOCX 파일을 지원합니다') ?? false;
        });
        await expect(fileFormatText).toBeInTheDocument();

        // 파일 업로드 영역이 상호작용 가능한지 확인
        const dropZone = canvas.getByRole('button') || uploadZone.closest('div[class*="cursor-pointer"]');
        await expect(dropZone).toBeInTheDocument();

        console.log('DragAndDrop 컴포넌트 렌더링 확인 완료');
    }
};

export const WithUploadedFile: Story = {
    render: () => {
        return (
            <div className="w-[400px]">
                <DragAndDrop
                    onDrop={(files) => {
                        console.log('✅ 업로드된 파일 목록:', files);
                    }}
                />
            </div>
        );
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // 파일 업로드 영역 찾기 - 텍스트가 분할될 수 있으므로 부분 텍스트로 검색
        const uploadZone = canvas.getByText((content, element) => {
            return element?.textContent?.includes('클릭하여 파일을 선택') ?? false;
        });

        // 파일 입력 필드 찾기
        const fileInput = uploadZone.closest('div')?.querySelector('input[type="file"]') as HTMLInputElement
            || canvasElement.querySelector('input[type="file"]') as HTMLInputElement;

        if (fileInput) {
            // 파일 업로드 시뮬레이션
            const file = new File(['dummy content'], 'test.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

            // 파일 업로드 이벤트 수동 디스패치
            await userEvent.upload(fileInput, file);

            console.log('파일 업로드 시뮬레이션 완료');
        } else {
            console.log('파일 입력 필드를 찾을 수 없습니다');
        }
    }
};
