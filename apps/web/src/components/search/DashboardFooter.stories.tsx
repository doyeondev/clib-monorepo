import type { Meta, StoryObj } from '@storybook/react';
import DashboardFooter from './DashboardFooter';
import { useState } from 'react';

const meta: Meta<typeof DashboardFooter> = {
    title: 'Search/DashboardFooter',
    component: DashboardFooter,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `DashboardFooter 컴포넌트는 하단 페이지네이션 UI를 구성합니다. 현재 페이지 인덱스와 최대 페이지 인덱스를 기반으로 이전/다음 버튼 및 페이지 번호 버튼을 렌더링합니다.`
            }
        }
    }
};

export default meta;

type Story = StoryObj<typeof DashboardFooter>;

export const Default: Story = {
    render: () => {
        const [index, setIndex] = useState(0);
        const max = 4;

        const handlePaginationClick = (e: React.MouseEvent<HTMLElement>) => {
            const target = e.currentTarget as HTMLButtonElement;
            const id = target.id;
            const name = target.dataset.name;

            if (name === 'paginationBtn') {
                if (id === 'btnPrevious' && index > 0) setIndex(index - 1);
                if (id === 'btnNext' && index < max) setIndex(index + 1);
            } else if (name === 'paginationNum') {
                setIndex(Number(id));
            }
        };

        return (
            <div className="p-10">
                <DashboardFooter
                    onClickHandler={handlePaginationClick}
                    currentIndex={index}
                    maxIndex={max}
                />
                <p className="mt-4 text-sm text-gray-600">현재 페이지: {index + 1}</p>
            </div>
        );
    }
};
