import { useEffect, useState } from "react";
import Choice from "./Choice";
import type { DIFFICULTY, TYPE } from "../hooks/useQuiz";
import { useNavigate } from "react-router-dom";

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
    value: QuizOptions[K]
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
          (a: Category, b: Category) => a.name.localeCompare(b.name)
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

  const handleStartQuiz = () => {
    if (!canStartQuiz) return;
    options.timer = String(Number(options.timer) * 60);
    navigate("/quiz", {
      state: {
        options,
      },
    });
  };
  const hasQuizSession = Boolean(localStorage.getItem("quiz-session"));

  return (
    <div className="flex justify-center items-center px-4 lg:px-10 min-h-screen w-full py-8">
      <div className="text-black flex flex-col bg-white/90 backdrop-blur-2xl rounded-xl shadow-lg w-full max-w-2xl p-6 lg:p-8 gap-6">
        <div className="flex gap-5 justify-center items-center">
          <h1 className="text-2xl lg:text-3xl font-bold text-center pb-4">
            QUIZ APP
          </h1>
          <button
            className="text-white bg-red-500 p-2 py-1"
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("api_token");
              navigate("/auth");
            }}
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="category" className="font-medium">
            Select Category
          </label>
          <select
            id="category"
            value={options.category}
            onChange={(e) => updateOption("category", e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {isLoading ? "Loading..." : "-- Choose a category --"}
            </option>
            <option value="random">RANDOM</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <Choice
          options={["Easy", "Medium", "Hard", "Random"]}
          changeValue={(value) => updateOption("difficulty", value)}
          currentValue={options.difficulty}
          title="Difficulty"
        />

        <Choice
          options={["Multiple", "Boolean", "Random"]}
          changeValue={(value) => updateOption("type", value)}
          currentValue={options.type}
          title="Type"
        />

        <Choice
          options={["5", "10", "20", "30"]}
          changeValue={(value) => updateOption("timer", value)}
          currentValue={options.timer}
          title="Timer (minutes)"
        />

        <Choice
          options={["5", "10", "15", "20"]}
          changeValue={(value) => updateOption("questionCount", value)}
          currentValue={options.questionCount}
          title="Number of Questions"
        />

        <button
          onClick={() => {
            localStorage.removeItem("quiz-session");
            handleStartQuiz();
          }}
          disabled={!canStartQuiz || isLoading}
          className="w-full mt-4 py-3 px-6 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
        >
          {isLoading ? "Loading..." : "New Quiz"}
        </button>
        <button
          onClick={handleStartQuiz}
          disabled={!canStartQuiz || isLoading || !hasQuizSession}
          className="w-full mt-4 py-3 px-6 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
        >
          {isLoading ? "Loading..." : "Continue Quiz"}
        </button>
      </div>
    </div>
  );
};

export default Home;
