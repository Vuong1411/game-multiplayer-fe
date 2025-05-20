import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// @project
import styles from './styles.module.scss';
import Topbar from '../../components/creator/Topbar';
import Sidebar from '../../components/creator/Sidebar';
import QuestionView from '../../components/creator/QuestionView';
import SettingsPanel from '../../components/creator/SettingsPannel';
import { Question, Answer } from '../../types/question';
import { mockQuestions, mockAnswers } from '../../mocks/Question';
import { questionSetService } from '../../services/questionSet.service';

const Creator = () => {
    // Lấy quizId từ URL
    const { id } = useParams<{ id: string }>();

    // State để quản lý danh sách câu hỏi và đáp án
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [questionsWithAnswers, setQuestionsWithAnswers] = useState<{
        question: Question;
        answers: Answer[];
    }[]>([]);
    const [selectedQuestionId, setSelectedQuestionId] = useState<number | undefined>();
    const [showSettingsPanel, setShowSettingsPanel] = useState(false);

    // Load mock data khi component mount
    useEffect(() => {
        const questions = mockQuestions.filter(q => q.question_set_id === Number(id));
        setQuestionsWithAnswers(
            questions.map(question => ({
                question,
                answers: mockAnswers.filter(answer => answer.question_id === question.id),
            }))
        );
        setAnswers(mockAnswers);
        if (mockQuestions.length > 0) {
            setSelectedQuestionId(mockQuestions[0].id);
        } else {
            handleAddQuestion();
        }
    }, [id]);

    // Tìm câu hỏi được chọn để hiển thị chi tiết
    const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

    // Lấy đáp án cho câu hỏi được chọn
    const selectedAnswers = selectedQuestionId
        ? answers.filter(answer => answer.question_id === selectedQuestionId)
        : [];

    // Hàm xử lý khi chọn câu hỏi từ sidebar
    const handleSelectQuestion = (questionId: number) => {
        setSelectedQuestionId(questionId);
    };

    // Hàm thêm câu hỏi mới
    const handleAddQuestion = () => {
        const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
        // Tạo câu hỏi mới với ID ngẫu nhiên
        const newQuestion: Question = {
            id: newId,
            question_set_id: 1,
            content: 'Câu hỏi',
            type: 'choice',
            time_limit: 20,
            point: 10,
        };

        const newAnswers: Answer[] = [
            {
                id: answers.length > 0 ? Math.max(...answers.map(a => a.id)) + 1 : 1,
                question_id: newQuestion.id,
                content: '',
                is_correct: false
            },
            {
                id: answers.length > 0 ? Math.max(...answers.map(a => a.id)) + 2 : 2,
                question_id: newQuestion.id,
                content: '',
                is_correct: false
            },
            {
                id: answers.length > 0 ? Math.max(...answers.map(a => a.id)) + 3 : 3,
                question_id: newQuestion.id,
                content: '',
                is_correct: false
            },
            {
                id: answers.length > 0 ? Math.max(...answers.map(a => a.id)) + 4 : 4,
                question_id: newQuestion.id,
                content: '',
                is_correct: false
            }
        ];

        // Thêm câu hỏi mới vào danh sách
        setQuestions([...questions, newQuestion]);
        setAnswers([...answers, ...newAnswers]);

        // Chọn câu hỏi mới thêm
        setSelectedQuestionId(newQuestion.id);
    };

    const handleAddSlide = () => {
        // Tạo slide mới (câu hỏi loại text)
    };

    // Hàm xử lý thay đổi câu hỏi
    const handleQuestionChange = (changes: Partial<Question>) => {
        if (!selectedQuestionId) return;

        const updatedQuestions = questions.map(q =>
            q.id === selectedQuestionId ? { ...q, ...changes } : q
        );

        setQuestions(updatedQuestions);
    };

    // Hàm xử lý xóa câu hỏi
    const handleQuestionDelete = (questionId: number) => {
        // Xóa câu hỏi và đáp án liên quan
        const updatedQuestions = questions.filter(q => q.id !== questionId);
        setQuestions(updatedQuestions);

        // Xóa đáp án liên quan
        const updatedAnswers = answers.filter(answer => answer.question_id !== questionId);
        setAnswers(updatedAnswers);

        if (selectedQuestionId === questionId) {
            setSelectedQuestionId(updatedQuestions.length > 0 ? updatedQuestions[0].id : undefined);
        }
    };

    // Hàm xử lý thay đổi đáp án
    const handleAnswerChange = (answerId: number, changes: Partial<Answer>) => {
        const updatedAnswers = answers.map(answer =>
            answer.id === answerId ? { ...answer, ...changes } : answer
        );
        setAnswers(updatedAnswers);
    };

    // Hàm xử lý tạo đáp án mới
    const handleCreateAnswer = () => {
        if (!selectedQuestionId) return;

        // Tạo ID mới
        const newId = Math.max(...answers.map(a => a.id), 0) + 1;

        // Tạo đáp án mới
        const newAnswer: Answer = {
            id: newId,
            question_id: selectedQuestionId,
            content: `Đáp án ${selectedAnswers.length + 1}`,
            is_correct: selectedAnswers.length === 0 // Đáp án đầu tiên mặc định là đúng
        };

        // Cập nhật state
        setAnswers([...answers, newAnswer]);
    };

    return (
        <Box className={styles.container}>
            <Topbar />

            <Box className={styles.contentWrapper}>
                <Sidebar
                    questions={questions}
                    answers={answers}
                    selectedQuestionId={selectedQuestionId}
                    onSelectQuestion={handleSelectQuestion}
                    onAddQuestion={handleAddQuestion}
                    onAddSlide={handleAddSlide}
                />
                <Box component="main" className={styles.mainContent}>
                    {selectedQuestion ? (
                        <QuestionView
                            question={selectedQuestion}
                            answers={selectedAnswers}
                            onAnswerCreate={handleCreateAnswer}
                            onQuestionChange={handleQuestionChange}
                            onAnswerChange={handleAnswerChange}
                            onAnswerDelete={(answerId) => {
                                const updatedAnswers = answers.filter(answer => answer.id !== answerId);
                                setAnswers(updatedAnswers);
                            }}
                        />
                    ) : (
                        <Box p={3} display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">
                            <p>Chưa có câu hỏi nào</p>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddQuestion}
                                startIcon={<AddIcon />}
                                sx={{ mt: 2 }}
                            >
                                Tạo câu hỏi mới
                            </Button>
                        </Box>
                    )}
                </Box>
                <Box className={`${styles.settingsPanel}`}>
                    {selectedQuestion && (
                        <SettingsPanel
                            question={selectedQuestion}
                            onQuestionChange={handleQuestionChange}
                            onQuestionDelete={handleQuestionDelete}
                        />
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default Creator;