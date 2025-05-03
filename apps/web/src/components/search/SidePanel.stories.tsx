import type { Meta, StoryObj } from '@storybook/react';
import SidePanel from './Sidepanel';
import { useState } from 'react';

const meta: Meta<typeof SidePanel> = {
    title: 'Search/SidePanel',
    component: SidePanel,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `선택된 계약서 조항을 사이드 패널 형태로 보여주는 컴포넌트입니다. 
        사용자는 조항을 선택하여 본문을 확인하거나, 원문 계약서를 미리보기로 열 수 있습니다.`
            }
        }
    },
    argTypes: {
        data: {
            description: '계약서 데이터 객체',
            control: false,
        },
        clickedItem: {
            description: '클릭된 조항 정보 (cidx 필드 포함)',
            control: false,
        },
        showSidebar: {
            description: '사이드패널 표시 여부',
            control: 'boolean',
            defaultValue: true,
        },
        setShowSidebar: {
            description: '사이드패널 상태 변경 함수',
            control: false,
        },
    },
};

export default meta;
type Story = StoryObj<typeof SidePanel>;

export const Default: Story = {
    render: () => {
        const [showSidebar, setShowSidebar] = useState(true);

        const dummyData = {
            id: '1',
            url: 'https://docs.google.com/document/d/e/2PACX-1vRUlq-dummy-doc/pub?embedded=true',
            title: '표준 용역 계약서',
            partyA: '마이리걸팀',
            partyB: '김장리 기업법무센터',
            industry: 'IT 서비스',
            purpose: '용역의 범위 및 보수에 관한 사항을 규정',
            clause_array: [
                { idx: 1, text: '목적' },
                { idx: 2, text: '용역 범위' },
            ],
            content_array: [
                [
                    { tag: 'h2', idx: 1, text: '목적', html: '<h2>제1조 목적</h2>' },
                    { tag: 'p', idx: 1, text: '', html: '<p>이 계약은 ... 목적을 가진다.</p>' },
                ],
                [
                    { tag: 'h2', idx: 2, text: '용역 범위', html: '<h2>제2조 용역 범위</h2>' },
                    { tag: 'p', idx: 2, text: '', html: '<p>갑은 을에게 다음과 같은 용역을 수행하게 한다...</p>' },
                ],
            ],
            contract_title: '표준 계약서',
        };

        const dummyClicked = {
            cidx: 1,
        };

        return (
            <div className="relative h-[800px] bg-gray-100">
                <SidePanel
                    data={dummyData}
                    clickedItem={dummyClicked}
                    showSidebar={showSidebar}
                    setShowSidebar={setShowSidebar}
                />
            </div>
        );
    },
};
