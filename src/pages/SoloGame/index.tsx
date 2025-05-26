import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// @project
import { Question, QuestionSet, Answer } from '@project/types/question';
import { Room, Player, PlayerAnswer } from '@project/types/room';
import { mockQuestionSets } from '@project/mocks/QuestionSet';
import { mockQuestions, mockAnswers } from '@project/mocks/Question';

const SoloGame = () => {
    const { id } = useParams<{ id: string }>();
    const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null);
    const [questionsWithAnswers, setQuestionsWithAnswers] = useState<{
        question: Question;
        answers: Answer[];
    }[]>([]);


    // Mock data for demonstration
    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const questionSetData = mockQuestionSets.find(qs => qs.id === Number(id));
                const questionsData = mockQuestions.filter(q => q.question_set_id === Number(id));
            } catch (err) {
                console.error(err);
            }
        }
    });

    return (
        <div>
        </div>
    );
}

export default SoloGame;