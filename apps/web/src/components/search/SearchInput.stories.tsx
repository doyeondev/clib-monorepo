import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import SearchInput from './SearchInput';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof SearchInput> = {
    title: 'Search/SearchInput',
    component: SearchInput,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <MemoryRouter initialEntries={['/']}>
                <Story />
            </MemoryRouter>
        )
    ],
    parameters: {
        docs: {
            description: {
                component: `SearchInput 컴포넌트는 계약서 또는 조항을 검색할 수 있는 검색창입니다. 검색어 입력 시 자동완성과 하이라이팅이 적용된 결과를 보여주며, searchType에 따라 contract/article을 전환할 수 있습니다.`
            }
        }
    }
};

export default meta;

type Story = StoryObj<typeof SearchInput>;

export const ContractMode: Story = {
    render: () => {
        const [searchTerm, setSearchTerm] = useState('');
        const [searchType, setSearchType] = useState<'contract' | 'article'>('contract');

        return (
            <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchType={searchType}
                setSearchType={setSearchType as React.Dispatch<React.SetStateAction<string>>}
            />
        );
    }
};

export const ArticleMode: Story = {
    render: () => {
        const [searchTerm, setSearchTerm] = useState('');
        const [searchType, setSearchType] = useState<'contract' | 'article'>('article');

        return (
            <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchType={searchType}
                setSearchType={setSearchType as React.Dispatch<React.SetStateAction<string>>}
            />
        );
    }
};
