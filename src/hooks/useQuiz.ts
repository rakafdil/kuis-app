const BASE_URL = `https://opentdb.com/api.php?token=${localStorage.getItem(
  "api_token"
)}`;

export const TYPE = {
  MULTIPLE: "multiple",
  BOOLEAN: "boolean",
} as const;

export const DIFFICULTY = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
} as const;

interface Quiz {
  type: (typeof TYPE)[keyof typeof TYPE];
  difficulty: (typeof DIFFICULTY)[keyof typeof DIFFICULTY];
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

function useQuiz() {
  return;
}

export default useQuiz;
