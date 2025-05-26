import { useState, useEffect, useRef } from 'react';
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
    const [pendingUploads, setPendingUploads] = useState<Map<string, File>>(new Map());
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

    // Hàm xử lý thay đổi ảnh bộ câu hỏi
    const handleQuestionSetImageChange = (url: string | undefined, file?: File) => {
        if (!questionSet) return;

        setQuestionSet(prev => prev ? { ...prev, image_url: url } : null);

        // Store file for later upload
        if (file && url) {
            setPendingUploads(prev => {
                const newMap = new Map(prev);
                newMap.set(`questionset_${questionSet.id}`, file);
                return newMap;
            });
        } else if (!url) {
            // Remove from pending uploads if deleted
            setPendingUploads(prev => {
                const newMap = new Map(prev);
                newMap.delete(`questionset_${questionSet.id}`);
                return newMap;
            });
        }
    };

    // Hàm xử lý thay đổi ảnh câu hỏi
    const handleQuestionImageChange = (questionId: number, url: string | undefined, file?: File) => {
        setQuestionsWithAnswers(prev => prev.map(item =>
            item.question.id === questionId
                ? { ...item, question: { ...item.question, image_url: url } }
                : item
        ));

        // Store file for later upload
        if (file && url) {
            setPendingUploads(prev => {
                const newMap = new Map(prev);
                newMap.set(`question_${questionId}`, file);
                return newMap;
            });
        } else if (!url) {
            setPendingUploads(prev => {
                const newMap = new Map(prev);
                newMap.delete(`question_${questionId}`);
                return newMap;
            });
        }
    };

    const handleSave = async () => {
        if (!questionSet) return;

        try {
            // 1. Cập nhật bộ câu hỏi
            const questionSetFile = pendingUploads.get(`questionset_${questionSet.id}`);
            await questionSetService.update(questionSet.id, questionSet, questionSetFile);

            // 2. Cập nhật các câu hỏi
            for (const item of questionsWithAnswers) {
                const questionFile = pendingUploads.get(`question_${item.question.id}`);

                if (item.question.id < 0) {
                    // Thêm mới câu hỏi
                    const newId = await questionService.create({
                        question_set_id: questionSet.id,
                        content: item.question.content,
                        type: item.question.type,
                        points: item.question.points,
                        time_limit: item.question.time_limit
                    }, questionFile);
                    if (newId) item.question.id = newId;
                } else {
                    // Cập nhật câu hỏi đã tồn tại
                    await questionService.update(item.question.id, item.question, questionFile);
                }

                // 3. Cập nhật đáp án cho từng câu hỏi
                for (const answer of item.answers) {
                    if (answer.id < 0) {
                        // Thêm mới đáp án
                        const newId = await answerService.create({
                            question_id: item.question.id,
                            content: answer.content,
                            is_correct: answer.is_correct
                        });
                        if (newId) answer.id = newId;
                    } else {
                        // Cập nhật đáp án đã tồn tại
                        await answerService.update(answer.id, answer);
                    }
                }
            }

            navigate(`/detail/${questionSet.id}`);
        } catch (err) {
            console.error('Failed to save quiz:', err);
        }
    }

    return (
        <Box className={styles.container}>
            <Topbar
                quiz={questionSet}
                onSave={handleSave}
                onQuestionSetChange={handleQuestionSetChange}
                onQuestionSetImageChange={handleQuestionSetImageChange}
            />

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
                            onQuestionImageChange={handleQuestionImageChange}
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