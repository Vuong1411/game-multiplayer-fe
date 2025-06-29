import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// @project
import styles from './styles.module.scss';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import QuestionView from './components/QuestionView';
import ConfigurationBar from './components/ConfigurationBar';
import { QuestionSet, Question, Answer } from '@project/types/question';
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
    const [deletedQuestionIds, setDeletedQuestionIds] = useState<number[]>([]);
    const [deletedAnswerIds, setDeletedAnswerIds] = useState<number[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    // Thông báo
    const [notification, setNotification] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'warning' | 'info';
    }>({
        open: false,
        message: '',
        severity: 'success'
    });

    //const [showSettingsPanel, setShowSettingsPanel] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                const newQuestionSet: Partial<QuestionSet> = {
                    id: -(Date.now()),
                    title: '',
                    description: ''
                }
                setQuestionSet(newQuestionSet as QuestionSet);
                setQuestionsWithAnswers([]);
                return;
            }

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
            content: '',
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

        const tempId = -(Date.now() + Math.random() * 1000);

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
        // Xóa trên database
        if (questionId > 0) {
            setDeletedQuestionIds(prev => [...prev, questionId]);
            const answersDelete = questionsWithAnswers.find(
                item => item.question.id === questionId
            )?.answers || [];
            const answerIdsDelete = answersDelete
                .filter(answer => answer.id > 0)
                .map(answer => answer.id);
            setDeletedAnswerIds(prev => [...prev, ...answerIdsDelete]);
        }
        // Xóa câu hỏi và đáp án liên quan trên UI
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
        // Xoá database
        if (answerId > 0) {
            setDeletedAnswerIds(pre => [...pre, answerId]);
        };

        // Xóa trên UI
        setQuestionsWithAnswers(prev => prev.map(item =>
            item.question.id === selectedQuestionId
                ? { ...item, answers: item.answers.filter(answer => answer.id !== answerId)}
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

        setIsSaving(true);

        try {
            // 1. Cập nhật bộ câu hỏi
            const questionSetFile = pendingUploads.get(`questionset_${questionSet.id}`);
            if( questionSet.id < 0) {
                const newId = await questionSetService.create({
                    title: questionSet.title,
                    description: questionSet.description
                }, questionSetFile);
                if (newId) questionSet.id = newId;
            }
            await questionSetService.update(questionSet.id, questionSet, questionSetFile);

            // 2. Xóa các câu hỏi đã bị xóa
            for (const deletedQuestionId of deletedQuestionIds) {
                try {
                    await questionService.delete(deletedQuestionId);
                    console.log(`Đã xóa câu hỏi ID: ${deletedQuestionId}`);
                } catch (err) {
                    console.error(`Lỗi khi xóa câu hỏi ID ${deletedQuestionId}:`, err);
                }
            }

            // 3. Xóa các đáp án đã bị xóa
            for (const deletedAnswerId of deletedAnswerIds) {
                try {
                    await answerService.delete(deletedAnswerId);
                    console.log(`Đã xóa đáp án ID: ${deletedAnswerId}`);
                } catch (err) {
                    console.error(`Lỗi khi xóa đáp án ID ${deletedAnswerId}:`, err);
                }
            }

            // 4. Cập nhật các câu hỏi
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

                // 5. Cập nhật đáp án cho từng câu hỏi
                for (const answer of item.answers) {
                    if (answer.question_id !== item.question.id) {
                        answer.question_id = item.question.id;
                    }
                    if (answer.id < 0) {
                        // Thêm mới đáp án
                        const newAnswerId = await answerService.create({
                            question_id: answer.question_id,
                            content: answer.content,
                            is_correct: answer.is_correct
                        });
                        if (newAnswerId) answer.id = newAnswerId;
                    } else {
                        // Cập nhật đáp án đã tồn tại
                        await answerService.update(answer.id, answer);
                    }
                }
            }
            // 6. Reset danh sách xóa
            setDeletedQuestionIds([]);
            setDeletedAnswerIds([]);

            // Hiển thị thông báo thành công
            setNotification({
                open: true,
                message: 'Cập nhật thành công! Đang chuyển hướng...',
                severity: 'success'
            });

            // Chờ 1,5 giây để người dùng thấy thông báo trước khi chuyển hướng
            setTimeout(() => {
                navigate(`/details/${questionSet.id}`);
            }, 1500);

        } catch (err) {
            console.error('Failed to save quiz:', err);

            // Hiển thị thông báo lỗi
            setNotification({
                open: true,
                message: 'Có lỗi xảy ra khi lưu. Vui lòng thử lại!',
                severity: 'error'
            });

        } finally {
            setIsSaving(false);
        }
    }

    // Hàm đóng notification
    const handleCloseNotification = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotification(prev => ({ ...prev, open: false }));
    };

    return (
        <Box className={styles.container}>
            <Topbar
                quiz={questionSet}
                onSave={handleSave}
                onQuestionSetChange={handleQuestionSetChange}
                onQuestionSetImageChange={handleQuestionSetImageChange}
                isSaving={isSaving}
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

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseNotification} 
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Creator;