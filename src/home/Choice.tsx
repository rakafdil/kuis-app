/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

type ChoiceProps = {
  options: string[];
  currentValue: string;
  changeValue: (value: any) => void;
  title: string;
};

const Choice: React.FC<ChoiceProps> = ({
  options,
  currentValue,
  changeValue,
  title,
}) => {
  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <label className="font-medium">Select {title}</label>

      <div className="flex gap-4 flex-wrap justify-center">
        {options.map((o) => {
          const value = o.toLowerCase();
          const isActive = value === currentValue.toLowerCase();
          return (
            <button
              key={o}
              type="button"
              onClick={() => changeValue(value)}
              className={`flex items-center gap-2 border py-3 px-5 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-cyan-100 border-cyan-500"
                  : "bg-white border-gray-400 hover:bg-gray-100"
              }`}
            >
              <div
                className={`rounded-full w-4 h-4 border-2 transition-all ${
                  isActive ? "bg-cyan-500 border-cyan-500" : "border-gray-400"
                }`}
              />
              <span className={isActive ? "font-semibold" : ""}>{o}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Choice;
