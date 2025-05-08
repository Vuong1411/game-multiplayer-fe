import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
// @project
import styles from './styles.module.scss';
import TabFilter from '../../components/common/Tab';
import QuestionSetList from '../../components/common/List/QuestionSetList';
import { questionSets } from '../../mocks/QuestionSet';

const Library = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);

    const handleQuizClick = (id: string) => {
        navigate(`/detail/${id}`);
    };

    return (
        <>
            <TabFilter
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            <Box className={styles.content}>
                <QuestionSetList
                    questionSets={questionSets}
                    onQuizClick={handleQuizClick}
                />
            </Box>
        </>
    );
};

export default Library;