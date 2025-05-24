import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// @project
import { Question, QuestionSet, Answer } from '@project/types/question';
import { Room, Player, PlayerAnswer } from '@project/types/room';
import { mockQuestionSets } from '@project/mocks/QuestionSet';
import { mockQuestions, mockAnswers } from '@project/mocks/Question';

const SoloGame = () => {
    const { id } = useParams(); // Room ID
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
                const questionSetData = mockQuestionSets.find(qs => qs.id === id);
            } catch (err) {
                console.error(err);
            }
        }
    });

    if (!room) {
        return <div>Room not found</div>;
    }

    return (
        <div>
            <h1>Game ID: {id}</h1>
            <p>Room ID: {room?.id}</p>
            <p>Room Pin: {room?.pin}</p>
            <p>Host ID: {room?.host_id}</p>
            <p>Status: {room?.status}</p>
        </div>
    );
}

export default SoloGame;