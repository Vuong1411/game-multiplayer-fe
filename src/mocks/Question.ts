import { Question, Answer } from '../types/question/question.types';
import img from '../assets/images/quiz/history.png';

// Mock data cho answers (tách riêng theo đúng interface)
export const mockAnswers: Answer[] = [
  { id: 1, question_id: 1, content: 'Aphrodite', is_correct: true },
  { id: 2, question_id: 1, content: 'Athena', is_correct: false },
  { id: 3, question_id: 1, content: 'Hera', is_correct: false },
  { id: 4, question_id: 1, content: 'Artemis', is_correct: false },
  
  { id: 5, question_id: 2, content: 'Apollo', is_correct: false },
  { id: 6, question_id: 2, content: 'Hermes', is_correct: false },
  { id: 7, question_id: 2, content: 'Zeus', is_correct: false },
  { id: 8, question_id: 2, content: 'Ares', is_correct: true },
  
  { id: 9, question_id: 3, content: 'Hades', is_correct: false },
  { id: 10, question_id: 3, content: 'Poseidon', is_correct: true },
  { id: 11, question_id: 3, content: 'Zeus', is_correct: false },
  { id: 12, question_id: 3, content: 'Apollo', is_correct: false },
  
  { id: 13, question_id: 4, content: 'Apollo', is_correct: true },
  { id: 14, question_id: 4, content: 'Hephaestus', is_correct: false },
  { id: 15, question_id: 4, content: 'Dionysus', is_correct: false },
  { id: 16, question_id: 4, content: 'Hermes', is_correct: false },
  
  { id: 17, question_id: 5, content: '46', is_correct: true },
  
  { id: 18, question_id: 6, content: 'Olympia', is_correct: true },
  
  { id: 19, question_id: 7, content: 'Hổ', is_correct: false },
  { id: 20, question_id: 7, content: 'Báo đốm', is_correct: true },
  { id: 21, question_id: 7, content: 'Sư tử', is_correct: false },
  { id: 22, question_id: 7, content: 'Ngựa', is_correct: false },
  
  { id: 23, question_id: 8, content: 'Trái Đất', is_correct: false },
  { id: 24, question_id: 8, content: 'Sao Mộc', is_correct: true },
  { id: 25, question_id: 8, content: 'Sao Thổ', is_correct: false },
  { id: 26, question_id: 8, content: 'Sao Thủy', is_correct: false },
];

// Tạo danh sách câu hỏi mẫu đúng theo interface
export const mockQuestions: Question[] = [
  {
    id: 1,
    question_set_id: 1,
    content: 'Ai là nữ thần tình yêu trong thần thoại Hy Lạp?',
    image_url: img,
    type: 'choice',
    time_limit: 20,
    difficulty: 'easy'
  },
  {
    id: 2,
    question_set_id: 1,
    content: 'Ai là thần của chiến tranh?',
    image_url: img,
    type: 'choice',
    time_limit: 20,
    difficulty: 'medium'
  },
  {
    id: 3,
    question_set_id: 1,
    content: 'Ai là thần của biển cả?',
    image_url: img,
    type: 'choice',
    time_limit: 20,
    difficulty: 'easy'
  },
  {
    id: 4,
    question_set_id: 1,
    content: 'Ai là thần của ân sủng?',
    image_url: img,
    type: 'choice',
    time_limit: 20,
    difficulty: 'hard'
  },
  {
    id: 5,
    question_set_id: 1,
    content: 'Số cột trong đền Parthenon là bao nhiêu?',
    image_url: img,
    type: 'text',
    time_limit: 30,
    difficulty: 'medium'
  },
  {
    id: 6,
    question_set_id: 1,
    content: 'Thành phố nào là quê hương của Olympic cổ đại?',
    image_url: img,
    type: 'text',
    time_limit: 25,
    difficulty: 'medium'
  },
  {
    id: 7,
    question_set_id: 2,
    content: 'Loài động vật nào có tốc độ nhanh nhất trên cạn?',
    image_url: img,
    type: 'choice',
    time_limit: 15,
    difficulty: 'easy'
  },
  {
    id: 8,
    question_set_id: 2,
    content: 'Hành tinh nào có kích thước lớn nhất trong Hệ Mặt Trời?',
    image_url: img,
    type: 'choice',
    time_limit: 20,
    difficulty: 'medium'
  }
];

export default mockQuestions;