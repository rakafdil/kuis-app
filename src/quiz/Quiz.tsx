import React, { useState, useMemo } from "react";
import { CgSandClock } from "react-icons/cg";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaTrophy,
  FaExclamationTriangle,
} from "react-icons/fa";
import useQuiz from "../hooks/useQuiz";
import { useNavigate } from "react-router-dom";

const formatToMMSS = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const Quiz: React.FC = () => {
  const {
    quizData,
    isLoading,
    timer,
    setQuizData,
    stopTimer,
    isDone,
    setIsDone,
  } = useQuiz();

  const [currNum, setCurrNum] = useState(1);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const answered = quizData.filter((q) => q.isCorrect !== undefined).length;
    const correct = quizData.filter((q) => q.isCorrect === true).length;
    const incorrect = quizData.filter((q) => q.isCorrect === false).length;
    const unanswered = quizData.length - answered;
    const percentage =
      quizData.length > 0 ? Math.round((correct / quizData.length) * 100) : 0;

    return { answered, correct, incorrect, unanswered, percentage };
  }, [quizData]);

  const checkAnswer = (answer: string) => {
    setQuizData((prev) =>
      prev.map((q, i) => {
        if (i !== currNum - 1 || q.isCorrect !== undefined) return q;
        return {
          ...q,
          isCorrect: answer === q.correctAnswer,
        };
      }),
    );
  };

  const handleSubmit = () => {
    stopTimer();
    setIsDone(true);
    setShowResultsModal(true);
  };

  const handleAnswerClick = (answer: string) => {
    if (isDone || currentQuestion?.isCorrect !== undefined) return;

    checkAnswer(answer);

    setTimeout(() => {
      if (currNum < quizData.length) {
        setCurrNum((prev) => prev + 1);
      }
    }, 500);
  };

  const handleFinish = () => {
    localStorage.removeItem("quiz-session");
    navigate("/");
  };

  const currentQuestion = quizData[currNum - 1];
  const isCorrect = currentQuestion?.isCorrect;
  const isAnswered = isCorrect !== undefined;

  const isTimerLow = timer < 60;
  const isTimerCritical = timer < 30;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center px-4 lg:px-10 min-h-screen w-full py-8">
        <div className="text-black flex flex-col bg-white/90 backdrop-blur-2xl rounded-xl shadow-lg w-full max-w-2xl p-6 lg:p-8 gap-6 justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-600"></div>
          <p className="text-lg font-medium text-gray-700">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center items-center px-4 lg:px-10 min-h-screen w-full py-8 bg-linear-to-br from-cyan-50 to-blue-100">
      <div className="text-black flex flex-col bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-3xl p-6 lg:p-8 gap-6 border border-gray-200">
        {showResultsModal && isDone && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={(e) =>
              e.target === e.currentTarget && setShowResultsModal(false)
            }
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-scaleIn">
              <div className="mb-6">
                {stats.percentage >= 70 ? (
                  <FaTrophy className="text-6xl text-yellow-500 mx-auto mb-4 animate-bounce" />
                ) : (
                  <FaExclamationTriangle className="text-6xl text-orange-500 mx-auto mb-4" />
                )}
                <h2 className="text-3xl font-bold text-gray-800">
                  Quiz Completed!
                </h2>
                <p className="text-gray-600 mt-2">
                  {stats.percentage >= 70
                    ? "Great job! 🎉"
                    : "Keep practicing! 💪"}
                </p>
              </div>

              <div className="mb-6">
                <div className="relative inline-flex items-center justify-center w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke={
                        stats.percentage >= 70
                          ? "#10b981"
                          : stats.percentage >= 40
                            ? "#f59e0b"
                            : "#ef4444"
                      }
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${stats.percentage * 3.51} 351`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute text-3xl font-bold">
                    {stats.percentage}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Questions</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {quizData.length}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Answered</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.answered}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-700">Correct</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.correct}
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-sm text-red-700">Incorrect</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.incorrect}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  onClick={() => setShowResultsModal(false)}
                  aria-label="Review answers"
                >
                  Review Answers
                </button>
                <button
                  className="px-6 py-3 bg-linear-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-medium"
                  onClick={handleFinish}
                  aria-label="Finish quiz"
                >
                  Finish
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
          <button
            className="text-white bg-red-500 hover:bg-red-600 rounded-lg px-4 py-2 transition-colors font-medium shadow-md hover:shadow-lg"
            onClick={handleFinish}
            aria-label="Cancel quiz"
          >
            Exit Quiz
          </button>
          <h1 className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-600 to-blue-600">
            QUIZ
          </h1>
          <div className="w-24"></div>{" "}
        </div>

        <div className="flex gap-4 justify-between items-center bg-linear-to-r from-cyan-50 to-blue-50 rounded-lg p-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-lg font-bold text-gray-800">
              Question {currNum} / {quizData.length}
            </span>
            <span className="text-xs text-gray-500">
              Answered: {stats.answered} | Correct: {stats.correct}
            </span>
          </div>

          <div
            className={`flex gap-2 items-center text-xl font-semibold px-4 py-2 rounded-lg ${
              isTimerCritical
                ? "bg-red-100 text-red-700 animate-pulse"
                : isTimerLow
                  ? "bg-orange-100 text-orange-700"
                  : "bg-white text-gray-700"
            }`}
          >
            <CgSandClock
              className={
                isTimerCritical
                  ? "animate-[spin_2s_linear_infinite]"
                  : "animate-[spin_5s_linear_infinite]"
              }
            />
            <span>{formatToMMSS(Number(timer))}</span>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-linear-to-r from-cyan-600 to-blue-600 h-2 transition-all duration-500 ease-out"
            style={{ width: `${(stats.answered / quizData.length) * 100}%` }}
          />
        </div>

        <div className="flex flex-col gap-6 bg-linear-to-br from-white to-gray-50 rounded-xl p-6 min-h-[450px] border border-gray-200 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold">
              Q{currNum}
            </span>
            <p className="text-lg font-medium text-gray-800 flex-1 leading-relaxed">
              {currentQuestion?.question}
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              {currentQuestion?.category}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentQuestion?.difficulty === "easy"
                  ? "bg-green-100 text-green-700"
                  : currentQuestion?.difficulty === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {currentQuestion?.difficulty?.toUpperCase()}
            </span>
          </div>

          <div className="flex flex-col gap-3 mt-2">
            {currentQuestion?.shuffledAnswers.map((answer, i) => {
              const isThisCorrect = currentQuestion.correctAnswer === answer;
              const showCorrect = isDone || isAnswered;
              const isSelected =
                isAnswered &&
                ((isCorrect && isThisCorrect) ||
                  (!isCorrect && !isThisCorrect));

              return (
                <button
                  key={i}
                  type="button"
                  className={`group w-full flex items-center gap-3 border-2 py-4 px-5 rounded-xl transition-all duration-300 ${
                    !showCorrect && !isDone
                      ? "border-gray-300 hover:border-cyan-500 hover:bg-cyan-50 hover:shadow-md active:scale-98"
                      : isThisCorrect
                        ? "border-green-500 bg-green-50 shadow-md"
                        : isSelected
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 bg-gray-50 opacity-60"
                  }`}
                  onClick={() => handleAnswerClick(answer)}
                  disabled={isDone || isAnswered}
                  aria-label={`Answer option ${i + 1}: ${answer}`}
                >
                  <div className="flex-shrink-0">
                    {showCorrect && isThisCorrect ? (
                      <FaCheckCircle className="text-green-600 text-xl" />
                    ) : showCorrect && isSelected && !isThisCorrect ? (
                      <FaTimesCircle className="text-red-600 text-xl" />
                    ) : (
                      <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-400 group-hover:border-cyan-500 transition-colors text-xs font-semibold">
                        {String.fromCharCode(65 + i)}
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-left flex-1 ${
                      showCorrect && isThisCorrect
                        ? "font-bold text-green-700"
                        : showCorrect && isSelected && !isThisCorrect
                          ? "font-medium text-red-700"
                          : "text-gray-700"
                    }`}
                  >
                    {answer}
                  </span>
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div
              className={`p-4 rounded-lg ${
                isCorrect
                  ? "bg-green-100 border border-green-300"
                  : "bg-red-100 border border-red-300"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  isCorrect ? "text-green-800" : "text-red-800"
                }`}
              >
                {isCorrect
                  ? "✓ Correct! Well done!"
                  : `✗ Incorrect. The correct answer is: ${currentQuestion?.correctAnswer}`}
              </p>
            </div>
          )}

          <div className="flex gap-3 justify-between mt-auto pt-4 border-t border-gray-200">
            <button
              className="py-2 px-6 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              onClick={() => setCurrNum((prev) => prev - 1)}
              disabled={currNum === 1}
              aria-label="Previous question"
            >
              ← Previous
            </button>

            <div className="flex gap-3">
              {currNum === quizData.length ? (
                <button
                  className="py-2 px-6 text-white bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                  onClick={handleSubmit}
                  aria-label="Submit quiz"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  className="py-2 px-6 text-white bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                  onClick={() => setCurrNum((prev) => prev + 1)}
                  aria-label="Next question"
                >
                  Next →
                </button>
              )}

              {isDone && !showResultsModal && (
                <button
                  className="py-2 px-6 text-white bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                  onClick={handleFinish}
                  aria-label="Finish and return home"
                >
                  Finish
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center p-4 bg-gray-50 rounded-lg">
          {quizData.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setCurrNum(idx + 1)}
              className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                idx + 1 === currNum
                  ? "bg-cyan-600 text-white shadow-md scale-110"
                  : q.isCorrect === true
                    ? "bg-green-200 text-green-800 hover:bg-green-300"
                    : q.isCorrect === false
                      ? "bg-red-200 text-red-800 hover:bg-red-300"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-cyan-500 hover:bg-cyan-50"
              }`}
              aria-label={`Go to question ${idx + 1}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
