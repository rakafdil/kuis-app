import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BASE_API = "https://opentdb.com/api.php";

export const TYPE = {
  MULTIPLE: "multiple",
  BOOLEAN: "boolean",
} as const;

export const DIFFICULTY = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
} as const;

type QuizType = (typeof TYPE)[keyof typeof TYPE];
type QuizDifficulty = (typeof DIFFICULTY)[keyof typeof DIFFICULTY];

interface Quiz {
  type: QuizType;
  difficulty: QuizDifficulty;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface QuizResponse {
  response_code: number;
  results: Quiz[];
}

interface QuizDisplay {
  question: string;
  incorrectAnswers: string[];
  correctAnswer: string;
  shuffledAnswers: string[];
  isCorrect?: boolean;
  type: QuizType;
  difficulty: QuizDifficulty;
  category: string;
}

const decodeHtml = (text: string) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = text;
  return txt.value;
};

function useQuiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const options = location.state?.options;

  const [timer, setTimer] = useState<number>(() => {
    const cached = localStorage.getItem("quiz-session");
    if (!cached) return options?.timer ?? 60;

    const parsed = JSON.parse(cached);
    return parsed.timer ?? options?.timer ?? 60;
  });

  const timerRef = useRef<number | null>(null);

  const [quizData, setQuizData] = useState<QuizDisplay[]>(() => {
    const cached = localStorage.getItem("quiz-session");
    if (!cached) return [];

    const parsed = JSON.parse(cached);
    return parsed.quiz ?? [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  const fetchQuiz = useCallback(async () => {
    if (!options) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        amount: String(options.questionCount),
      });

      if (options.category !== "random")
        params.set("category", String(options.category));
      if (options.difficulty !== "random")
        params.set("difficulty", options.difficulty);
      if (options.type !== "random") params.set("type", options.type);

      const token = localStorage.getItem("api_token");
      let response = await fetch(
        `${BASE_API}?token=${token}&${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      let data: QuizResponse = await response.json();

      if (data.response_code === 4) {
        const refresh = await fetch(
          `https://opentdb.com/api_token.php?command=reset&token=${token}`
        );
        const result = await refresh.json();

        localStorage.setItem("api_token", result.token);

        response = await fetch(
          `${BASE_API}?token=${result.token}&${params.toString()}`
        );

        data = await response.json();
      }

      if (data.response_code !== 0) {
        throw new Error("Failed to fetch quiz data");
      }

      const cleanedData = data.results.map((q) => {
        const answers = [...q.incorrect_answers, q.correct_answer]
          .map(decodeHtml)
          .sort(() => Math.random() - 0.5);

        return {
          question: decodeHtml(q.question),
          correctAnswer: decodeHtml(q.correct_answer),
          incorrectAnswers: q.incorrect_answers.map(decodeHtml),
          shuffledAnswers: answers,
          isCorrect: undefined,
          type: q.type,
          difficulty: q.difficulty,
          category: q.category,
        };
      });

      setQuizData(cleanedData);

      localStorage.setItem(
        "quiz-session",
        JSON.stringify({
          quiz: cleanedData,
          timer: timer,
        })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  useEffect(() => {
    if (quizData.length === 0) return;

    localStorage.setItem(
      "quiz-session",
      JSON.stringify({
        quiz: quizData,
        timer,
      })
    );
  }, [quizData, timer]);

  useEffect(() => {
    if (quizData.length === 0) {
      fetchQuiz();
    }
  }, [fetchQuiz, quizData.length]);

  useEffect(() => {
    const cached = localStorage.getItem("quiz-session");
    if (cached) {
      const parsed = JSON.parse(cached).quiz;
      setQuizData(parsed);
    } else {
      fetchQuiz();
    }
  }, [fetchQuiz]);

  useEffect(() => {
    if (!options) {
      navigate("/");
    }
  }, [navigate, options]);

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current !== null) return;

    timerRef.current = window.setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          stopTimer();
          setIsDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stopTimer]);

  useEffect(() => {
    if (!isDone) {
      startTimer();
    }
    return () => {
      stopTimer();
    };
  }, [startTimer, stopTimer, isDone]);

  return {
    quizData,
    setQuizData,
    startTimer,
    stopTimer,
    setIsDone,
    timer,
    isLoading,
    error,
    isDone,
  };
}

export default useQuiz;
