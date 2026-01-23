"use client"

import React, { useState } from "react";
import { QuestionItem, Section } from "./QuestionListSidebar";

interface RespondentSurveyPageProps {
  surveyTitle: string;
  surveyDescription?: string;
  questions: QuestionItem[];
  sections: Section[];
  onClose: () => void;
}

interface Answer {
  questionId: number;
  value: string | number | boolean | null;
}

const ProgressBar = ({ current, total }: { current: number; total: number }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full h-1 bg-stone-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-stone-800 transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

const TextQuestion = ({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type your answer here..."
      className="w-full h-32 px-4 py-3 bg-white border border-[var(--border)] rounded-xl text-base text-[var(--label-primary)] placeholder:text-[var(--label-light)] focus:outline-none focus:ring-2 focus:ring-stone-800 focus:ring-opacity-30 resize-none"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    />
  );
};

const ScaleQuestion = ({
  scaleType,
  minLabel,
  maxLabel,
  value,
  onChange
}: {
  scaleType: "0-5" | "0-10";
  minLabel: string;
  maxLabel: string;
  value: number | null;
  onChange: (value: number) => void;
}) => {
  const maxValue = scaleType === "0-5" ? 5 : 10;
  const values = Array.from({ length: maxValue + 1 }, (_, i) => i);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        {values.map((num) => (
          <button
            key={num}
            onClick={() => onChange(num)}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-base font-medium transition-all ${
              value === num
                ? "bg-stone-800 text-white"
                : "bg-white border border-[var(--border)] text-[var(--label-primary)] hover:border-stone-800 hover:text-stone-800"
            }`}
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            {num}
          </button>
        ))}
      </div>
      {(minLabel || maxLabel) && (
        <div className="flex justify-between text-sm text-[var(--label-light)]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
};

const YesNoQuestion = ({
  value,
  onChange
}: {
  value: boolean | null;
  onChange: (value: boolean) => void;
}) => {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => onChange(true)}
        className={`flex-1 h-12 flex items-center justify-center rounded-xl text-base font-medium transition-all ${
          value === true
            ? "bg-stone-800 text-white"
            : "bg-white border border-[var(--border)] text-[var(--label-primary)] hover:border-stone-800 hover:text-stone-800"
        }`}
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        Yes
      </button>
      <button
        onClick={() => onChange(false)}
        className={`flex-1 h-12 flex items-center justify-center rounded-xl text-base font-medium transition-all ${
          value === false
            ? "bg-stone-800 text-white"
            : "bg-white border border-[var(--border)] text-[var(--label-primary)] hover:border-stone-800 hover:text-stone-800"
        }`}
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        No
      </button>
    </div>
  );
};

const MultipleChoiceQuestion = ({
  options,
  value,
  onChange
}: {
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      {options.filter(opt => opt.trim() !== "").map((option, index) => (
        <button
          key={index}
          onClick={() => onChange(option)}
          className={`w-full h-12 px-4 flex items-center gap-3 rounded-xl text-base text-left transition-all ${
            value === option
              ? "bg-stone-800 text-white"
              : "bg-white border border-[var(--border)] text-[var(--label-primary)] hover:border-stone-800"
          }`}
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
              value === option
                ? "border-white bg-white"
                : "border-[var(--border)]"
            }`}
          >
            {value === option && (
              <div className="w-2.5 h-2.5 rounded-full bg-stone-800" />
            )}
          </div>
          <span>{option}</span>
        </button>
      ))}
    </div>
  );
};

export const RespondentSurveyPage: React.FC<RespondentSurveyPageProps> = ({
  surveyTitle,
  surveyDescription,
  questions,
  sections,
  onClose,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const getCurrentAnswer = () => {
    const answer = answers.find(a => a.questionId === currentQuestion?.id);
    return answer?.value ?? null;
  };

  const setAnswer = (value: string | number | boolean | null) => {
    setAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === currentQuestion.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { questionId: currentQuestion.id, value };
        return updated;
      }
      return [...prev, { questionId: currentQuestion.id, value }];
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setIsSubmitted(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const canProceed = () => {
    if (!currentQuestion.isRequired) return true;
    const answer = getCurrentAnswer();
    if (answer === null || answer === undefined) return false;
    if (typeof answer === "string" && answer.trim() === "") return false;
    return true;
  };

  // Find current section based on afterQuestionIndex
  const getCurrentSection = () => {
    if (sections.length === 0) return null;

    // Find the section that applies to current question
    // Sections have afterQuestionIndex which indicates after which question the section starts
    let currentSection: Section | null = null;
    for (const section of sections) {
      if (currentQuestionIndex > section.afterQuestionIndex) {
        currentSection = section;
      }
    }
    return currentSection;
  };

  const currentSection = getCurrentSection();

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#fffaf6] flex flex-col p-6">
        {/* Exit Preview button - top left */}
        <div className="max-w-2xl w-full mx-auto mb-6">
          <button
            onClick={onClose}
            className="h-10 px-4 bg-white border border-[var(--border)] text-[var(--label-primary)] text-base font-medium rounded-lg shadow-sm hover:bg-stone-50 transition-colors"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Exit Preview
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M5 12L10 17L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1
              className="text-2xl font-semibold text-[var(--label-primary)] mb-2"
              style={{ fontFamily: 'Bitter, serif' }}
            >
              Thank you!
            </h1>
            <p
              className="text-base text-[var(--label-light)] mb-8"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Your responses have been submitted successfully.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf6] flex flex-col p-6">
      {/* Exit Preview button - top left */}
      <div className="max-w-2xl w-full mx-auto mb-6">
        <button
          onClick={onClose}
          className="h-10 px-4 bg-white border border-[var(--border)] text-[var(--label-primary)] text-base font-medium rounded-lg shadow-sm hover:bg-stone-50 transition-colors"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Exit Preview
        </button>
      </div>

      {/* Header in rounded white container */}
      <div className="max-w-2xl w-full mx-auto mb-6">
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
          <h1
            className="text-2xl font-semibold text-[var(--label-primary)] mb-2"
            style={{ fontFamily: 'Bitter, serif', fontSize: '24px' }}
          >
            {surveyTitle}
          </h1>
          {surveyDescription && (
            <p
              className="text-base text-[var(--label-light)] mb-4"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {surveyDescription}
            </p>
          )}
          <ProgressBar current={currentQuestionIndex + 1} total={totalQuestions} />
          <div className="flex justify-between mt-2">
            <span
              className="text-sm text-[var(--label-light)]"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
          </div>
        </div>
      </div>

      {/* Question content in rounded white container */}
      <div className="max-w-2xl w-full mx-auto flex-1">
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
          {/* Question */}
          <div className="mb-8">
            {/* Section label */}
            {currentSection && (
              <div
                className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {currentSection.name}
              </div>
            )}
            <h2
              className="text-xl font-semibold text-[var(--label-primary)] mb-2"
              style={{ fontFamily: 'Bitter, serif' }}
            >
              {currentQuestion.questionText}
              {currentQuestion.isRequired && (
                <span className="text-stone-800 ml-1">*</span>
              )}
            </h2>
            {currentQuestion.description && (
              <p
                className="text-base text-[var(--label-light)]"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {currentQuestion.description}
              </p>
            )}
          </div>

          {/* Answer input */}
          <div className="mb-8">
            {currentQuestion.questionType === "Text" && (
              <TextQuestion
                value={(getCurrentAnswer() as string) || ""}
                onChange={(value) => setAnswer(value)}
              />
            )}
            {currentQuestion.questionType === "Scale" && (
              <ScaleQuestion
                scaleType={currentQuestion.scaleType || "0-5"}
                minLabel={currentQuestion.scaleMinLabel || ""}
                maxLabel={currentQuestion.scaleMaxLabel || ""}
                value={getCurrentAnswer() as number | null}
                onChange={(value) => setAnswer(value)}
              />
            )}
            {currentQuestion.questionType === "Yes-no" && (
              <YesNoQuestion
                value={getCurrentAnswer() as boolean | null}
                onChange={(value) => setAnswer(value)}
              />
            )}
            {currentQuestion.questionType === "Multiple-choice" && (
              <MultipleChoiceQuestion
                options={currentQuestion.multipleChoiceOptions || []}
                value={getCurrentAnswer() as string | null}
                onChange={(value) => setAnswer(value)}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={isFirstQuestion}
              className={`h-10 px-4 text-base font-medium rounded-lg transition-colors ${
                isFirstQuestion
                  ? "text-[var(--label-light)] cursor-not-allowed"
                  : "bg-white border border-[var(--border)] text-[var(--label-primary)] hover:bg-stone-50"
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`h-10 px-6 text-base font-medium rounded-lg transition-all ${
                canProceed()
                  ? "bg-stone-800 text-white hover:bg-stone-900"
                  : "bg-stone-200 text-stone-400 cursor-not-allowed"
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {isLastQuestion ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
