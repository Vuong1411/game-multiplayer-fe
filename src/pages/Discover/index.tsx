import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, CircularProgress, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useSearchParams } from 'react-router-dom';
import { questionSetService } from '@project/services';
import { QuestionSet } from '@project/types/question';

import QuizList from './components/QuizList';

const Discover = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [input, setInput] = useState(search);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let res;
                if (search.trim()) {
                    res = await questionSetService.search(search);
                } else {
                    res = await questionSetService.getAll();
                }
                setQuestionSets(res || []);
            } catch (e) {
                setQuestionSets([]);
            }
            setLoading(false);
        };
        fetchData();
    }, [search]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setSearch(input);
            setSearchParams({ search: input });
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Khám phá bộ câu hỏi
            </Typography>
            <TextField
                placeholder="Tìm kiếm bộ câu hỏi..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleSearch}
                fullWidth
                sx={{ mb: 3 }}
                InputProps={{
                    endAdornment: (
                        input ? (
                            <IconButton
                                size="small"
                                onClick={() => {
                                    setInput('');
                                    setSearch('');
                                    setSearchParams({});
                                }}
                            >
                                <ClearIcon />
                            </IconButton>
                        ) : null
                    ),
                }}
            />
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <QuizList questionSets={questionSets} />
            )}
        </Box>
    );
};

export default Discover;