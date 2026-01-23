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
  onMoveSection?: (id: number, direction: "up" | "down") => void;
}

const MoveArrows = ({
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
}: {
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}) => {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMoveDown();
        }}
        disabled={!canMoveDown}
        className={`w-8 h-8 flex items-center justify-center bg-white border border-[var(--border)] rounded-lg transition-colors ${
          canMoveDown ? 'hover:bg-stone-100' : 'opacity-40 cursor-not-allowed'
        }`}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 2v8M3 7l3 3 3-3" stroke="var(--label-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMoveUp();
        }}
        disabled={!canMoveUp}
        className={`w-8 h-8 flex items-center justify-center bg-white border border-[var(--border)] rounded-lg transition-colors ${
          canMoveUp ? 'hover:bg-stone-100' : 'opacity-40 cursor-not-allowed'
        }`}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 10V2M3 5l3-3 3 3" stroke="var(--label-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

const SectionDivider = ({
  name,
  isSelected,
  onClick,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
}: {
  name: string;
  isSelected: boolean;
  onClick: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        group w-full flex items-center gap-2 px-6 py-1 transition-colors cursor-pointer
        ${isSelected ? 'bg-[#f5f5f4]' : 'hover:bg-stone-50'}
      `}
    >
      <div className="flex items-center justify-center gap-2 flex-1 min-w-0">
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
      {onMoveUp && onMoveDown && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <MoveArrows
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
          />
        </div>
      )}
    </div>
  );
};

const QuestionRow = ({
  question,
  isSelected,
  onClick,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
}: {
  question: QuestionItem;
  isSelected: boolean;
  onClick: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        group w-full flex items-center gap-2 px-6 py-2 text-left transition-colors cursor-pointer
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
        className="flex-1 overflow-hidden min-w-0"
        style={{
          fontFamily: 'Poppins, sans-serif',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {question.questionText || `Question ${question.number}`}
      </span>
      {onMoveUp && onMoveDown && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <MoveArrows
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
          />
        </div>
      )}
    </div>
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
  onMoveQuestion,
  onMoveSection,
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
          {listItems.map((item, index) => {
            if (item.type === 'question') {
              const question = item.data as QuestionItem;
              const questionIndex = questions.findIndex(q => q.id === question.id);
              const canMoveUp = questionIndex > 0;
              const canMoveDown = questionIndex < questions.length - 1;

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
                    onMoveUp={onMoveQuestion ? () => onMoveQuestion(question.id, "up") : undefined}
                    onMoveDown={onMoveQuestion ? () => onMoveQuestion(question.id, "down") : undefined}
                    canMoveUp={canMoveUp}
                    canMoveDown={canMoveDown}
                  />
                </motion.div>
              );
            } else {
              const section = item.data as Section;
              const sectionIndex = sections.findIndex(s => s.id === section.id);
              const canMoveUp = sectionIndex > 0 || section.afterQuestionIndex > 0;
              const canMoveDown = section.afterQuestionIndex < questions.length - 1;

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
                    onMoveUp={onMoveSection ? () => onMoveSection(section.id, "up") : undefined}
                    onMoveDown={onMoveSection ? () => onMoveSection(section.id, "down") : undefined}
                    canMoveUp={canMoveUp}
                    canMoveDown={canMoveDown}
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
