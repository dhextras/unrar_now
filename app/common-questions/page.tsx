"use client";

import { useState } from "react";

import questions from "@/app/questions.json";

export default function CommonQuestions() {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const handleQuestionClick = (id: number) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  return (
    <div className="bg-white text-gray-900 max-w-[768px] w-auto mx-auto mt-12">
      <h1 className="text-4xl font-bold mt-12">
        Common Questions About RAR files
      </h1>
      <p className="text-sm mt-4">
        Check out our informative blog on RAR files to learn how to open,
        extract, and manage these compressed file formats.
      </p>
      <p className="text-sm mt-2">
        Find helpful tips, detailed guides, and recommendations for software.
        Stay informed with the latest updates and make the most of your RAR
        files.
      </p>
      <ol className="mt-8 space-y-2">
        {questions.map((q, i) => (
          <li key={i}>
            <div
              className="flex items-center group cursor-pointer"
              onClick={() => handleQuestionClick(i)}
            >
              <span
                className={`text-lg mr-2 transform transition-transform duration-300 ${
                  expandedQuestion === i ? "rotate-90" : ""
                }
                  `}
              >
                &#x25B6;
              </span>
              <p className="text-black underline group-hover:font-semibold w-full text-left">
                {q.question}
              </p>
            </div>
            {expandedQuestion === i && (
              <div className="ml-8 mt-1 bg-gray-100 p-4 rounded-md animate-slidedown">
                <p className="font-semibold">{q.answer}</p>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
