import type { Meta, StoryObj } from '@storybook/react';
import ContractList from './ContractList';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof ContractList> = {
    title: 'Search/ContractList',
    component: ContractList,
    decorators: [
        (Story) => (
            <MemoryRouter initialEntries={['/']}>
                <Story />
            </MemoryRouter>
        )
    ],
    tags: ['autodocs', 'deprecated'], // ← 여기 추가
    parameters: {
        docs: {
            description: {
                component:
                    '⚠️ 이 컴포넌트는 더 이상 사용되지 않으며, 새로운 ContractCardList 컴포넌트를 대신 사용하세요.\n\nContractList 컴포넌트는 계약서 목록 데이터를 카드 형식으로 보여주며, 클릭 시 해당 계약서 ID를 세션에 저장하고 /clause 페이지로 이동합니다. 각각의 계약서는 업계명, 당사자명, 제목을 포함합니다.'
            }
        }
    }
};

export default meta;

type Story = StoryObj<typeof ContractList>;

const mockData = [
    {
        id: 'abc123',
        title: '프리랜서 용역계약서',
        partyA: '김장리 기업법무센터',
        partyB: '홍길동',
        industry: 'IT 업계'
    },
    {
        id: 'def456',
        title: '비밀유지계약서(NDA)',
        partyA: '카카오',
        partyB: '마이리걸팀',
        industry: '플랫폼 서비스'
    }
];

export const Default: Story = {
    render: () => <ContractList contractList={mockData} />
};
