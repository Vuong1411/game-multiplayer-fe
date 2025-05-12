import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
// @project
import styles from './styles.module.scss';
import TabFilter from '../../components/common/Tab';
import SearchBar from '../../components/common/SearchBar';
import MyQuizList from '../../components/library/QuizList';
import { questionSets } from '../../mocks/QuestionSet';

const Library = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const handleQuizClick = (id: string) => {
        navigate(`/detail/${id}`);
    };

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
                    questionSets={questionSets.filter(item =>
                        item.title.toLowerCase().includes(searchQuery.toLowerCase())
                    )}
                    onQuizClick={handleQuizClick}
                />
            </Box>
        </>
    );
};

export default Library;