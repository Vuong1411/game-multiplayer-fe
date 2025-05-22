import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
// @project
import styles from './styles.module.scss';
import MyQuizList from './components/QuizList';
import TabFilter from '@project/components/common/Tab';
import SearchBar from '@project/components/common/SearchBar';
import { QuestionSet } from '@project/types/question';
import { questionSetService } from '@project/services/questionSet.service';

const Library = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await questionSetService.getAll();
                setQuestionSets(data);
            } catch (error) {
                console.error('Failed to fetch question sets:', error);
            }
        };
        fetchData();
    }, []);


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
                />
            </Box>
        </>
    );
};

export default Library;