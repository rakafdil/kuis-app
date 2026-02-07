import React from "react";

interface ChoiceProps<T = string> {
  options: string[];
  currentValue: T;
  changeValue: (value: T) => void;
  title: string;
  icon?: React.ReactNode;
}

const Choice = <T extends string>({
  options,
  currentValue,
  changeValue,
  title,
  icon,
}: ChoiceProps<T>) => {
  return (
    <div className="flex flex-col gap-3">
      <label className="font-semibold text-gray-700 flex items-center gap-2">
        {icon}
        <span>{title}</span>
      </label>

      <div className="flex gap-3 flex-wrap justify-start">
        {options.map((option) => {
          const value = option.toLowerCase() as T;
          const isActive = value === currentValue.toLowerCase();

          return (
            <button
              key={option}
              type="button"
              onClick={() => changeValue(value)}
              className={`group relative flex items-center gap-3 border-2 py-3 px-6 rounded-xl transition-all duration-200 cursor-pointer min-w-[120px] justify-center ${
                isActive
                  ? "bg-linear-to-r from-cyan-600 to-blue-600 border-cyan-600 text-white shadow-lg scale-105"
                  : "bg-white border-gray-300 text-gray-700 hover:border-cyan-500 hover:bg-cyan-50 hover:shadow-md"
              }`}
              aria-pressed={isActive}
              aria-label={`Select ${option}`}
            >
              {/* Radio Indicator */}
              <div
                className={`rounded-full w-5 h-5 border-2 transition-all flex items-center justify-center ${
                  isActive
                    ? "bg-white border-white"
                    : "border-gray-400 group-hover:border-cyan-500"
                }`}
              >
                {isActive && (
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
                )}
              </div>

              {/* Label */}
              <span
                className={`font-medium transition-all ${
                  isActive ? "font-semibold" : ""
                }`}
              >
                {option}
              </span>

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Choice;
