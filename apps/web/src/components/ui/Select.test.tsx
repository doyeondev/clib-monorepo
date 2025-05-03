import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Select, { SelectOption } from './Select';

/**
 * Select 컴포넌트 테스트
 * 
 * 드롭다운 선택 UI 요소 확인 및 상호작용 테스트
 */
describe('Select 컴포넌트', () => {
    // 테스트용 옵션 데이터
    const options: SelectOption[] = [
        { value: 'apple', label: '사과' },
        { value: 'banana', label: '바나나' },
        { value: 'cherry', label: '체리' },
    ];

    it('기본 UI 요소가 올바르게 렌더링되는지 확인', () => {
        render(
            <Select
                options={options}
                value="banana"
                onChange={() => { }}
                label="과일 선택"
                helperText="과일을 선택해주세요"
            />
        );

        // 라벨이 렌더링되는지 확인
        expect(screen.getByText('과일 선택')).toBeInTheDocument();

        // 선택된 값이 표시되는지 확인
        expect(screen.getByText('바나나')).toBeInTheDocument();

        // 도움말 텍스트가 표시되는지 확인
        expect(screen.getByText('과일을 선택해주세요')).toBeInTheDocument();

        console.log('Select 기본 UI 렌더링 테스트 통과');
    });

    it('드롭다운이 열리고 옵션이 표시되는지 확인', () => {
        render(
            <Select
                options={options}
                value="banana"
                onChange={() => { }}
            />
        );

        // 초기에는 옵션 목록이 표시되지 않음
        expect(screen.queryByText('사과')).not.toBeInTheDocument();

        // 드롭다운 버튼 클릭
        const selectButton = screen.getByText('바나나');
        fireEvent.click(selectButton);

        // 클릭 후 옵션 목록이 표시되는지 확인
        expect(screen.getByText('사과')).toBeInTheDocument();
        expect(screen.getByText('체리')).toBeInTheDocument();

        console.log('Select 드롭다운 열기 테스트 통과');
    });

    it('옵션 선택 시 onChange 콜백이 호출되는지 확인', () => {
        const onChangeMock = vi.fn();
        render(
            <Select
                options={options}
                value="banana"
                onChange={onChangeMock}
            />
        );

        // 드롭다운 열기
        fireEvent.click(screen.getByText('바나나'));

        // 다른 옵션 선택
        fireEvent.click(screen.getByText('사과'));

        // onChange가 선택한 값으로 호출되는지 확인
        expect(onChangeMock).toHaveBeenCalledWith('apple');

        console.log('Select 옵션 선택 테스트 통과');
    });

    it('필수 항목과 에러 상태가 표시되는지 확인', () => {
        render(
            <Select
                options={options}
                value=""
                onChange={() => { }}
                label="과일 선택"
                required={true}
                error={true}
                errorText="필수 항목입니다"
            />
        );

        // 필수 표시(*) 확인
        expect(screen.getByText('*')).toBeInTheDocument();

        // 에러 메시지 확인
        expect(screen.getByText('필수 항목입니다')).toBeInTheDocument();

        // 에러 메시지가 빨간색 텍스트로 표시되는지 확인
        const errorText = screen.getByText('필수 항목입니다');
        expect(errorText.className).toContain('text-red-500');

        console.log('Select 필수 항목 및 에러 상태 테스트 통과');
    });

    it('비활성화 상태일 때 상호작용이 금지되는지 확인', () => {
        render(
            <Select
                options={options}
                value="banana"
                onChange={() => { }}
                disabled={true}
            />
        );

        // 비활성화된 스타일이 적용되는지 확인
        const selectButton = screen.getByText('바나나').closest('button');
        expect(selectButton).toHaveClass('opacity-50');
        expect(selectButton).toHaveClass('cursor-not-allowed');

        // 버튼이 비활성화되었는지 확인
        expect(selectButton).toBeDisabled();

        // 클릭해도 드롭다운이 열리지 않는지 확인
        fireEvent.click(selectButton as HTMLElement);
        expect(screen.queryByText('사과')).not.toBeInTheDocument();

        console.log('Select 비활성화 상태 테스트 통과');
    });
}); 