"use client"

import React from "react";
import { motion } from "framer-motion";

export interface Section {
  id: number;
  name: string;
  // Position in the list (index after which this section divider appears)
  afterQuestionIndex: number;
}

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
  sections?: Section[];
  selectedQuestionId?: number;
  selectedSectionId?: number | null;
  onQuestionSelect?: (id: number) => void;
  onSectionSelect?: (id: number) => void;
  onAddQuestion?: () => void;
  onMoveQuestion?: (id: number, direction: "up" | "down") => void;
}

const SectionDivider = ({
  name,
  isSelected,
  onClick
}: {
  name: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-2 px-6 py-1 transition-colors
        ${isSelected ? 'bg-[#f5f5f4]' : 'hover:bg-stone-50'}
      `}
    >
      <div className="flex items-center justify-center gap-2 w-full">
        <div
          className="flex-1 h-0 border-t border-dashed border-[var(--label-light)]"
        />
        <span
          className="text-sm text-[var(--label-light)] whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]"
          style={{ fontFamily: 'DM Mono, monospace' }}
        >
          {name}
        </span>
        <div
          className="flex-1 h-0 border-t border-dashed border-[var(--label-light)]"
        />
      </div>
    </button>
  );
};

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
          : 'text-[var(--label-light)] hover:bg-stone-50'
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
  sections = [],
  selectedQuestionId,
  selectedSectionId,
  onQuestionSelect,
  onSectionSelect,
  onAddQuestion,
}) => {
  // Build the list with sections interspersed
  const buildListWithSections = () => {
    const items: Array<{ type: 'question' | 'section'; data: QuestionItem | Section }> = [];

    // Sort sections by afterQuestionIndex
    const sortedSections = [...sections].sort((a, b) => a.afterQuestionIndex - b.afterQuestionIndex);

    let sectionIndex = 0;

    questions.forEach((question, index) => {
      items.push({ type: 'question', data: question });

      // Check if any sections should appear after this question
      while (
        sectionIndex < sortedSections.length &&
        sortedSections[sectionIndex].afterQuestionIndex === index
      ) {
        items.push({ type: 'section', data: sortedSections[sectionIndex] });
        sectionIndex++;
      }
    });

    // Add any remaining sections at the end
    while (sectionIndex < sortedSections.length) {
      items.push({ type: 'section', data: sortedSections[sectionIndex] });
      sectionIndex++;
    }

    return items;
  };

  const listItems = buildListWithSections();

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
            className="h-10 px-4 bg-white border border-[var(--border)] text-[var(--label-primary)] rounded-lg shadow-sm hover:bg-stone-50 transition-colors whitespace-nowrap shrink-0"
          >
            <span className="label-button">Add question</span>
          </button>
        </div>
        <div className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {listItems.map((item) => {
            if (item.type === 'question') {
              const question = item.data as QuestionItem;
              return (
                <motion.div
                  key={`question-${question.id}`}
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
              );
            } else {
              const section = item.data as Section;
              return (
                <motion.div
                  key={`section-${section.id}`}
                  layout
                  layoutId={`section-row-${section.id}`}
                  transition={{ type: "spring", mass: 1, stiffness: 230, damping: 25 }}
                >
                  <SectionDivider
                    name={section.name}
                    isSelected={selectedSectionId === section.id}
                    onClick={() => onSectionSelect?.(section.id)}
                  />
                </motion.div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};
