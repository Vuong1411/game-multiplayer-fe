import { useState } from 'react';
import { Box } from '@mui/material';
// @project
import styles from './styles.module.scss';
import TabFilter from '../../components/common/Tab';
import SearchBar from '../../components/common/SearchBar';
import MyQuizList from '../../components/library/QuizList';
import { mockQuestionSets } from '../../mocks/QuestionSet';

const Library = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <>
            <Box className={styles.header}>
                <TabFilter
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
                <SearchBar
                    placeholder="Tìm kiếm bộ câu hỏi..."
                    onSearch={setSearchQuery}
                />
            </Box>

            <Box className={styles.content}>
                <MyQuizList
                    questionSets={mockQuestionSets.filter(item =>
                        item.title.toLowerCase().includes(searchQuery.toLowerCase())
                    )}
                />
            </Box>
        </>
    );
};

export default Library;