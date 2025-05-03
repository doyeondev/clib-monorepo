import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DragAndDrop } from './DragAndDrop';

/**
 * DragAndDrop 컴포넌트 테스트
 * 
 * 파일 업로드 UI 인터랙션 및 이벤트 처리 테스트
 */
describe('DragAndDrop 컴포넌트', () => {
    it('기본 UI 요소가 렌더링되는지 확인', () => {
        render(<DragAndDrop onDrop={() => { }} />);

        // 파일 형식 안내 확인
        expect(screen.getByText(/DOCX 파일을 지원합니다/i)).toBeInTheDocument();

        // 파일 입력 필드가 있는지 확인
        const fileInput = document.querySelector('input[type="file"]');
        expect(fileInput).toBeInTheDocument();

        // 드롭존 UI 요소가 있는지 확인
        const dropZone = document.querySelector('.drop-zone');
        expect(dropZone).toBeInTheDocument();

        // 업로드 아이콘이 있는지 확인
        const uploadIcon = document.querySelector('svg');
        expect(uploadIcon).toBeInTheDocument();

        // 콘솔에 결과 출력
        console.log('DragAndDrop 기본 UI 렌더링 테스트 통과');
    });

    it('파일 선택 시 onDrop 콜백이 호출되는지 확인', () => {
        // 콜백 함수 모킹
        const onDropMock = vi.fn();
        render(<DragAndDrop onDrop={onDropMock} />);

        // 파일 입력 필드 찾기
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

        // 파일 선택 이벤트 시뮬레이션
        const file = new File(['dummy content'], 'test.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        fireEvent.change(fileInput, { target: { files: [file] } });

        // onDrop 콜백이 호출되었는지 확인
        expect(onDropMock).toHaveBeenCalled();

        // 콜백에 전달된 파일 정보 확인
        const uploadedFiles = onDropMock.mock.calls[0][0];
        expect(uploadedFiles).toHaveLength(1);
        expect(uploadedFiles[0].name).toBe('test.docx');

        console.log('DragAndDrop 파일 선택 이벤트 테스트 통과');
    });

    it('드래그 앤 드롭 이벤트가 제대로 처리되는지 확인', () => {
        // 콜백 함수 모킹
        const onDropMock = vi.fn();
        render(<DragAndDrop onDrop={onDropMock} />);

        // 드롭 영역 찾기
        const dropZone = document.querySelector('.drop-zone');
        expect(dropZone).toBeInTheDocument();

        // 드래그 이벤트 시뮬레이션
        fireEvent.dragOver(dropZone as HTMLElement);

        // 드래그 오버 스타일 변경 확인 - 클래스에 border-blue-500 포함 여부 확인
        expect(dropZone).toHaveClass('border-blue-500');

        // 드래그 리브 이벤트 시뮬레이션
        fireEvent.dragLeave(dropZone as HTMLElement);
        expect(dropZone).not.toHaveClass('border-blue-500');

        console.log('DragAndDrop 드래그 이벤트 테스트 통과');
    });
}); 