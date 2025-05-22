import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// @project
import styles from './styles.module.scss';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import QuestionView from './components/QuestionView';
import ConfigurationBar from './components/ConfigurationBar';
import { QuestionSet, Question, Answer } from '@project/types/question';
// import { mockQuestions, mockAnswers } from '../../mocks/Question';
import { questionSetService, questionService, answerService } from '@project/services';

const Creator = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // question set id
    const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null);
    const [questionsWithAnswers, setQuestionsWithAnswers] = useState<{
        question: Question;
        answers: Answer[];
    }[]>([]);
    const [selectedQuestionId, setSelectedQuestionId] = useState<number | undefined>();
    //const [showSettingsPanel, setShowSettingsPanel] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                // Lấy bộ câu hỏi từ API
                const questionSetData = await questionSetService.getById(Number(id));
                setQuestionSet(questionSetData);

                // Lấy danh sách câu hỏi từ API
                const questionsData = await questionService.getAll(Number(id));
                const questionsList = await Promise.all(
                    questionsData.map(async (question) => ({
                        question,
                        answers: await answerService.getAll(question.id),
                    }))
                );
                setQuestionsWithAnswers(questionsList);

                // Nếu có câu hỏi, chọn câu hỏi đầu tiên
                if (questionsList.length > 0) {
                    setSelectedQuestionId(questionsList[0].question.id);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [id]);

    // Hàm xử lý khi chọn câu hỏi từ sidebar
    const handleSelectQuestion = (questionId: number) => {
        setSelectedQuestionId(questionId);
    };

    const questions = questionsWithAnswers.map(item => item.question);
    const answers = questionsWithAnswers.flatMap(item => item.answers);

    // Tìm câu hỏi và đáp án được chọn
    const selected = questionsWithAnswers.find(
        item => item.question.id === selectedQuestionId
    );
    const selectedQuestion = selected?.question || null;
    const selectedAnswers = selected?.answers || [];

    // Hàm thêm câu hỏi mới
    const handleAddQuestion = () => {
        const tempId = -(Date.now());
        // Tạo câu hỏi mới với ID ngẫu nhiên
        const newQuestion: Question = {
            id: tempId,
            question_set_id: 1,
            content: 'Câu hỏi mới',
            type: 'choice',
            time_limit: 20,
            points: 10,
            image_url: '',
        };

        // Tạo sẵn 4 đáp án mặc định
        const newAnswers: Answer[] = [
            {
                id: tempId * 10 - 1,
                question_id: tempId,
                content: '',
                is_correct: true
            },
            {
                id: tempId * 10 - 2,
                question_id: tempId,
                content: '',
                is_correct: false
            },
            {
                id: tempId * 10 - 3,
                question_id: tempId,
                content: '',
                is_correct: false
            },
            {
                id: tempId * 10 - 4,
                question_id: tempId,
                content: '',
                is_correct: false
            }
        ];

        // Thêm câu hỏi mới vào danh sách
        setQuestionsWithAnswers(prev => [...prev, { question: newQuestion, answers: newAnswers }]);

        setSelectedQuestionId(newQuestion.id);
    };

    // Hàm xử lý tạo đáp án mới
    const handleAddAnswer = () => {
        if (!selectedQuestionId) return;
        const tempId = Math.max(...answers.map(a => a.id), 0) + 1;

        // Tạo đáp án mới
        const newAnswer: Answer = {
            id: tempId,
            question_id: selectedQuestionId,
            content: ``,
            is_correct: selectedAnswers.length === 0
        };

        // Cập nhật questionsWithAnswers
        setQuestionsWithAnswers(prev => prev.map(item =>
            item.question.id === selectedQuestionId
                ? { ...item, answers: [...item.answers, newAnswer] }
                : item
        ));
    };


    // Tạo slide mới (câu hỏi loại text)
    const handleAddSlide = () => {

    };

    // Hàm xử lý thay đổi bộ câu hỏi
    const handleQuestionSetChange = (changes: Partial<QuestionSet>) => {
        if (!questionSet) return;
        setQuestionSet(prev => prev ? { ...prev, ...changes } : null);
    };

    // Hàm xử lý thay đổi câu hỏi
    const handleQuestionChange = (changes: Partial<Question>) => {
        if (!selectedQuestionId) return;

        setQuestionsWithAnswers(prev => prev.map(item =>
            item.question.id === selectedQuestionId
                ? { ...item, question: { ...item.question, ...changes } }
                : item
        ));
    };

    // Hàm xử lý thay đổi đáp án
    const handleAnswerChange = (answerId: number, changes: Partial<Answer>) => {
        if (!selectedQuestionId) return;

        setQuestionsWithAnswers(prev => prev.map(item =>
            item.question.id === selectedQuestionId
                ? {
                    ...item,
                    answers: item.answers.map(answer =>
                        answer.id === answerId
                            ? { ...answer, ...changes }
                            : answer
                    )
                }
                : item
        ));
    };

    // Hàm xử lý xóa câu hỏi
    const handleQuestionDelete = (questionId: number) => {
        // Xóa câu hỏi và đáp án liên quan
        const deleted = questionsWithAnswers.filter(
            item => item.question.id !== questionId
        );
        setQuestionsWithAnswers(deleted);

        if (selectedQuestionId === questionId) {
            setSelectedQuestionId(deleted[0]?.question?.id);
        }
    };

    // Hàm xử lý xóa đáp án
    const handleAnswerDelete = (answerId: number) => {
        setQuestionsWithAnswers(prev => prev.map(item =>
            item.question.id === selectedQuestionId
                ? {
                    ...item,
                    answers: item.answers.filter(answer => answer.id !== answerId)
                }
                : item
        ));
    };

    return (
        <Box className={styles.container}>
            <Topbar quiz={questionSet} onQuestionSetChange={handleQuestionSetChange} />

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
                            onQuestionChange={handleQuestionChange}
                            onAnswerCreate={handleAddAnswer}
                            onAnswerChange={handleAnswerChange}
                            onAnswerDelete={handleAnswerDelete}
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
                        <ConfigurationBar
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