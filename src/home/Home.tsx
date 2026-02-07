import { useEffect, useState } from "react";
import Choice from "./Choice";
import type { DIFFICULTY, TYPE } from "../hooks/useQuiz";
import { useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaClock,
  FaHashtag,
  FaGraduationCap,
  FaRandom,
} from "react-icons/fa";

interface Category {
  id: number;
  name: string;
}

interface QuizOptions {
  category: string;
  difficulty: (typeof DIFFICULTY)[keyof typeof DIFFICULTY] | "random" | "";
  type: (typeof TYPE)[keyof typeof TYPE] | "random" | "";
  timer: string;
  questionCount: string;
}

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [options, setOptions] = useState<QuizOptions>({
    category: "random",
    difficulty: "random",
    type: "random",
    timer: "10",
    questionCount: "10",
  });

  const updateOption = <K extends keyof QuizOptions>(
    key: K,
    value: QuizOptions[K],
  ) => {
    setOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://opentdb.com/api_category.php");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const sortedCategories = [...result.trivia_categories].sort(
          (a: Category, b: Category) => a.name.localeCompare(b.name),
        );

        setCategories(sortedCategories);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();

    const storedOptions = localStorage.getItem("quiz-options");
    if (storedOptions) {
      const parsed = JSON.parse(storedOptions);
      if (parsed.options) {
        setOptions(parsed.options);
      }
    }
  }, []);

  const canStartQuiz =
    options.category &&
    options.difficulty &&
    options.type &&
    options.timer &&
    options.questionCount;

  const handleStartQuiz = (continueSession = false) => {
    if (!canStartQuiz) return;

    if (!continueSession) {
      localStorage.removeItem("quiz-session");
    }

    const quizOptions = {
      ...options,
      timer: String(Number(options.timer) * 60),
    };

    navigate("/quiz", {
      state: { options: quizOptions },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("api_token");
    localStorage.removeItem("quiz-session");
    navigate("/auth");
  };

  const hasQuizSession = Boolean(localStorage.getItem("quiz-session"));

  return (
    <div className="flex justify-center items-center px-4 lg:px-10 min-h-screen w-full py-8 bg-linear-to-br from-cyan-50 to-blue-100">
      <div className="text-black flex flex-col bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-2xl p-6 lg:p-8 gap-6 border border-gray-200">
        <div className="flex gap-5 justify-between items-center border-b border-gray-200 pb-4">
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-600 to-blue-600">
              Quiz App
            </h1>
            <p className="text-sm text-gray-600 mt-1">Test your knowledge!</p>
          </div>
          <button
            className="text-white bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-5 py-2 rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
            onClick={handleLogout}
            aria-label="Logout"
          >
            Logout
          </button>
        </div>

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg shadow-sm"
            role="alert"
          >
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {hasQuizSession && (
          <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 px-4 py-3 rounded-lg shadow-sm">
            <p className="font-medium flex items-center gap-2">
              <FaClock />
              You have an ongoing quiz session
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <label
            htmlFor="category"
            className="font-semibold text-gray-700 flex items-center gap-2"
          >
            <FaClipboardList className="text-cyan-600" />
            <span>Category</span>
          </label>
          <select
            id="category"
            value={options.category}
            onChange={(e) => updateOption("category", e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed shadow-sm hover:border-cyan-400"
          >
            <option value="">
              {isLoading ? "Loading categories..." : "-- Choose a category --"}
            </option>
            <option value="random">🎲 RANDOM</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-5">
          <Choice
            options={["Easy", "Medium", "Hard", "Random"]}
            changeValue={(value) => updateOption("difficulty", value)}
            currentValue={options.difficulty}
            title="Difficulty Level"
            icon={<FaGraduationCap className="text-cyan-600" />}
          />

          <Choice
            options={["Multiple", "Boolean", "Random"]}
            changeValue={(value) => updateOption("type", value)}
            currentValue={options.type}
            title="Question Type"
            icon={<FaRandom className="text-cyan-600" />}
          />

          <Choice
            options={["5", "10", "20", "30"]}
            changeValue={(value) => updateOption("timer", value)}
            currentValue={options.timer}
            title="Time Limit (minutes)"
            icon={<FaClock className="text-cyan-600" />}
          />

          <Choice
            options={["5", "10", "15", "20"]}
            changeValue={(value) => updateOption("questionCount", value)}
            currentValue={options.questionCount}
            title="Number of Questions"
            icon={<FaHashtag className="text-cyan-600" />}
          />
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => handleStartQuiz(false)}
            disabled={!canStartQuiz || isLoading}
            className="cursor-pointer w-full py-3 px-6 bg-linear-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none"
          >
            {isLoading ? "Loading..." : "Start New Quiz"}
          </button>

          {hasQuizSession && (
            <button
              onClick={() => handleStartQuiz(true)}
              disabled={!canStartQuiz || isLoading}
              className="cursor-pointer w-full py-3 px-6 bg-linear-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              Continue Previous Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
