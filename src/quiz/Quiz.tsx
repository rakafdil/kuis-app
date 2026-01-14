import React, { useState, useEffect } from "react";
import { CgSandClock } from "react-icons/cg";
import useQuiz from "../hooks/useQuiz";
import { useNavigate } from "react-router-dom";

const formatToMMSS = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const formattedMins = String(mins).padStart(2, "0");
  const formattedSecs = String(secs).padStart(2, "0");

  return `${formattedMins}:${formattedSecs}`;
};

function Quiz() {
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
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDone) {
      setShowModal(true);
    }
  }, [isDone]);

  const checkAnswer = (answer: string) => {
    setQuizData((prev) =>
      prev.map((q, i) => {
        if (i !== currNum - 1 || q.isCorrect !== undefined) return q;

        return {
          ...q,
          isCorrect: answer === q.correctAnswer,
        };
      })
    );
  };

  const handleSubmit = () => {
    stopTimer();
    setIsDone(true);
  };

  const currentQuestion = quizData[currNum - 1];
  const isCorrect = currentQuestion?.isCorrect;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center px-4 lg:px-10 min-h-screen w-full py-8">
        <div className="text-black flex flex-col bg-white/90 backdrop-blur-2xl rounded-xl shadow-lg w-full max-w-2xl p-6 lg:p-8 gap-6 justify-center items-center animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center items-center px-4 lg:px-10 min-h-screen w-full py-8">
      <div className="text-black flex flex-col bg-white/90 backdrop-blur-2xl rounded-xl shadow-lg w-full max-w-2xl p-6 lg:p-8 gap-6">
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center animate-scaleIn">
              <h2 className="text-2xl font-bold mb-4">Quiz Finished 🎉</h2>

              <p className="mb-6 text-gray-700">You’ve completed the quiz!</p>
              <div className="pb-10">
                <p>Total Questions: {quizData.length}</p>
                <p>
                  Answered Questions:{" "}
                  {quizData.filter((q) => q.isCorrect !== undefined).length}
                </p>
                <p>
                  Total Wrong Questions:{" "}
                  {quizData.filter((q) => q.isCorrect === false).length}
                </p>
                <p>
                  Total Right Questions:{" "}
                  {quizData.filter((q) => q.isCorrect === true).length}
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
                  onClick={() => setShowModal(false)}
                >
                  Review
                </button>

                <button
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 cursor-pointer"
                  onClick={() => {
                    localStorage.removeItem("quiz-session");
                    navigate("/");
                  }}
                >
                  Finish
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 items-center">
          <button
            className="text-white bg-red-500 rounded-sm px-3 py-2 hover:bg-red-400 cursor-pointer w-fit"
            onClick={() => {
              localStorage.removeItem("quiz-session");
              navigate("/");
            }}
          >
            Cancel
          </button>
          <h1 className="text-2xl lg:text-3xl font-bold text-center pb-4 self-center">
            QUIZ
          </h1>
        </div>
        <div className="flex gap-2 justify-between items-center">
          <span>
            Question {currNum}/{quizData.length} <br />
            Answered: {quizData.filter((q) => q.isCorrect !== undefined).length}
          </span>
          <div className="flex gap-2 justify-center items-center text-xl">
            <CgSandClock className="animate-[spin_5s_linear_infinite]" />
            <span>{formatToMMSS(Number(timer))}</span>
          </div>
        </div>
        <div className="flex flex-col gap-6 bg-white rounded-md p-4 min-h-[428px]">
          <p>{quizData[currNum - 1]?.question}</p>
          <div className="flex flex-col gap-3">
            {quizData?.[currNum - 1]?.shuffledAnswers.map((a, i) => {
              return (
                <button
                  key={i}
                  type="button"
                  className={`w-full flex items-center gap-2 border py-3 px-5 rounded-xl ${
                    isCorrect === undefined && !isDone
                      ? "border-gray-300"
                      : quizData?.[currNum - 1]?.correctAnswer === a
                      ? "border-green-500"
                      : "border-red-400"
                  }`}
                  onClick={() => {
                    checkAnswer(a);
                    if (currNum === quizData?.length) {
                      setCurrNum((prev) => prev);
                    } else {
                      setCurrNum((prev) => prev + 1);
                    }
                  }}
                  disabled={isDone || isCorrect !== undefined}
                >
                  <span
                    className={
                      isDone && quizData?.[currNum - 1]?.correctAnswer === a
                        ? "font-bold text-green-700"
                        : ""
                    }
                  >
                    {a}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex gap-3 self-end align-bottom mt-auto">
            <button
              className="py-2 px-4 cursor-pointer"
              onClick={() => setCurrNum((prev) => prev - 1)}
              disabled={currNum === 1}
            >
              Back
            </button>
            <button
              className="py-2 px-4 cursor-pointer text-white bg-blue-700 rounded-xl"
              onClick={() => {
                if (currNum === quizData?.length) {
                  handleSubmit();
                } else {
                  setCurrNum((prev) => prev + 1);
                }
              }}
            >
              {currNum === quizData?.length ? "Submit" : "Next"}
            </button>

            {isDone && !showModal && (
              <button
                className="py-2 px-4 cursor-pointer text-white bg-green-700 rounded-xl"
                onClick={() => {
                  localStorage.removeItem("quiz-session");
                  navigate("/");
                }}
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
