"use client"

import React from "react";
import { motion } from "framer-motion";

export interface QuestionItem {
  id: number;
  number: string;
  questionText: string;
  description: string;
  questionType: "Text" | "Scale" | "Yes-no" | "Multiple-choice";
  isRequired: boolean;
  // Scale-specific properties
  scaleType?: "0-5" | "0-10";
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
  // Multiple-choice specific properties
  multipleChoiceOptions?: string[];
}

interface QuestionListSidebarProps {
  questions: QuestionItem[];
  selectedQuestionId?: number;
  onQuestionSelect?: (id: number) => void;
  onAddQuestion?: () => void;
}

const QuestionRow = ({
  question,
  isSelected,
  onClick
}: {
  question: QuestionItem;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-2 px-6 py-2 text-left transition-colors
        ${isSelected
          ? 'border-l-2 border-[var(--label-primary)] text-[var(--label-primary)] bg-[#f5f5f4]'
          : 'text-[var(--label-light)] hover:bg-gray-50'
        }
      `}
    >
      <span
        className="flex-shrink-0 w-[18px] text-sm font-mono overflow-hidden text-ellipsis"
        style={{ fontFamily: 'DM Mono, monospace' }}
      >
        {question.number}
      </span>
      <span
        className="flex-1 overflow-hidden"
        style={{
          fontFamily: 'Poppins, sans-serif',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {question.questionText || `Question ${question.number}`}
      </span>
    </button>
  );
};

export const QuestionListSidebar: React.FC<QuestionListSidebarProps> = ({
  questions,
  selectedQuestionId,
  onQuestionSelect,
  onAddQuestion,
}) => {
  return (
    <div className="hidden lg:flex w-[372px] bg-white flex-col h-full border-r border-[var(--border)]">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-6 flex items-center justify-between">
          <h2
            className="text-[20px] leading-6 font-medium text-[var(--label-primary)]"
            style={{ fontFamily: 'Bitter, serif' }}
          >
            Questions · {questions.length}
          </h2>
          <button
            onClick={onAddQuestion}
            className="h-10 px-4 bg-white border border-[var(--border)] text-[var(--label-primary)] rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <span className="label-button">Add question</span>
          </button>
        </div>
        <div className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {questions.map((question) => (
            <motion.div
              key={question.id}
              layout
              layoutId={`question-row-${question.id}`}
              transition={{ type: "spring", mass: 1, stiffness: 230, damping: 25 }}
            >
              <QuestionRow
                question={question}
                isSelected={selectedQuestionId === question.id}
                onClick={() => onQuestionSelect?.(question.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
