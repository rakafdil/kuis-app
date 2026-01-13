import React, { useState } from "react";
import { CgSandClock } from "react-icons/cg";
import useQuiz from "../hooks/useQuiz";
import { useNavigate } from "react-router-dom";

function Quiz() {
  const { quizData, isLoading, time, setQuizData } = useQuiz();
  const [currNum, setCurrNum] = useState(1);

  const navigate = useNavigate();
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
    <div className="flex justify-center items-center px-4 lg:px-10 min-h-screen w-full py-8">
      <div className="text-black flex flex-col bg-white/90 backdrop-blur-2xl rounded-xl shadow-lg w-full max-w-2xl p-6 lg:p-8 gap-6">
        <div className="grid grid-cols-3 items-center">
          <button
            className="text-white bg-red-500 rounded-sm px-3 py-2 hover:bg-red-400 cursor-pointer w-fit"
            onClick={() => {
              localStorage.removeItem("quiz-data");
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
            <span>{time}</span>
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
                    isCorrect === undefined
                      ? "border-gray-300"
                      : quizData?.[currNum - 1]?.correctAnswer === a
                      ? "border-green-500"
                      : "border-red-400"
                  }`}
                  onClick={() => {
                    checkAnswer(a);
                  }}
                >
                  <span className={isCorrect ? "font-semibold" : ""}>{a}</span>
                </button>
              );
            })}
          </div>
          <div className="flex gap-3 self-end align-bottom mt-auto">
            <button
              className="py-2 px-4 cursor-pointer"
              onClick={() => setCurrNum((prev) => prev - 1)}
              disabled={currNum == 1}
            >
              Back
            </button>
            <button
              className="py-2 px-4 cursor-pointer text-white bg-blue-700 rounded-xl"
              onClick={() => setCurrNum((prev) => prev + 1)}
              disabled={currNum == quizData?.length}
            >
              {currNum == quizData?.length ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
