"use client"

import React, { useState, useRef } from "react";
import { StepNavigation } from "./components/StepNavigation";
import { QuestionListSidebar, QuestionItem } from "./components/QuestionListSidebar";
import { QuestionDetailPanel } from "./components/QuestionDetailPanel";
import { RecipientsPage } from "./components/RecipientsPage";
import { SettingsPage } from "./components/SettingsPage";

// Initial state with a single question
const initialQuestion: QuestionItem = {
  id: 1,
  number: "1",
  questionText: "",
  description: "",
  questionType: "Text",
  isRequired: false,
  scaleType: "0-5",
  scaleMinLabel: "",
  scaleMaxLabel: "",
  multipleChoiceOptions: ["", ""],
};

interface Recipient {
  id: number;
  name: string;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(1);
  const [questions, setQuestions] = useState<QuestionItem[]>([initialQuestion]);
  const [deleteError, setDeleteError] = useState<number | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);

  // Page title state
  const [pageTitle, setPageTitle] = useState("Workcation Evaluation 2024 Barcelona");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(pageTitle);
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const input = titleInputRef.current;

    if (input) {
      // Temporarily set the value to measure
      const prevValue = input.value;
      input.value = newValue;

      // Check if text overflows
      if (input.scrollWidth > input.clientWidth) {
        // Revert to previous value if it overflows
        input.value = prevValue;
        return;
      }
    }

    setEditedTitle(newValue);
  };

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      setPageTitle(editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleCancelTitle = () => {
    setEditedTitle(pageTitle);
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      handleCancelTitle();
    }
  };

  const getStepProgress = (stepNumber: number) => {
    if (stepNumber < currentStep) return "completed" as const;
    if (stepNumber === currentStep) return "current" as const;
    return "uncompleted" as const;
  };

  const steps = [
    { label: "Questions", progress: getStepProgress(1) },
    { label: "Recipients", progress: getStepProgress(2) },
    { label: "Settings", progress: getStepProgress(3) },
    { label: "Results", progress: getStepProgress(4) },
  ];

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleForward = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleAddQuestion = () => {
    const newId = Math.max(...questions.map((q) => q.id)) + 1;
    const newQuestion: QuestionItem = {
      id: newId,
      number: String(newId),
      questionText: "",
      description: "",
      questionType: "Text",
      isRequired: false,
      scaleType: "0-5",
      scaleMinLabel: "",
      scaleMaxLabel: "",
      multipleChoiceOptions: ["", ""],
    };
    setQuestions([...questions, newQuestion]);
    setSelectedQuestionId(newId);

    // Scroll to new question after a brief delay
    setTimeout(() => {
      document.getElementById(`question-${newId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const updateQuestion = (id: number, updates: Partial<QuestionItem>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)));
    // Clear delete error when user makes changes
    if (deleteError === id) {
      setDeleteError(null);
    }
  };

  const handleQuestionSelect = (id: number) => {
    setSelectedQuestionId(id);
    document.getElementById(`question-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleDeleteQuestion = (id: number) => {
    if (questions.length === 1) {
      setDeleteError(id);
      // Auto-clear error after 3 seconds
      setTimeout(() => setDeleteError(null), 3000);
      return;
    }

    setQuestions(questions.filter((q) => q.id !== id));
    if (selectedQuestionId === id && questions.length > 1) {
      const nextQuestion = questions.find((q) => q.id !== id);
      if (nextQuestion) setSelectedQuestionId(nextQuestion.id);
    }
    setDeleteError(null);
  };

  return (
    <div className="flex h-screen bg-[var(--background)]">
      {/* Collapsed navbar */}
      <div className="w-[68px] bg-white border-r border-[var(--border)]" />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page header */}
        <div className="bg-white border-b border-[var(--border)]">
          <div className="flex flex-col px-6 py-6">
            {/* Breadcrumbs */}
            <div className="flex items-center mb-1 pl-2">
              <span
                className="text-base text-[var(--label-light)] font-medium"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Custom surveys
              </span>
              <div className="w-10 h-10 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 2L10 7L5 12" stroke="var(--label-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            {/* Page Title */}
            <div className="flex items-center gap-3">
              <div
                className="w-[600px]"
                onMouseEnter={() => setIsTitleHovered(true)}
                onMouseLeave={() => setIsTitleHovered(false)}
              >
                {isEditingTitle ? (
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={editedTitle}
                    onChange={handleTitleChange}
                    onKeyDown={handleTitleKeyDown}
                    autoFocus
                    className="w-full text-2xl font-semibold text-[var(--label-primary)] bg-gray-100 px-2 py-1 rounded-lg outline-none focus:ring-1 focus:ring-[var(--control-primary)] focus:ring-opacity-20"
                    style={{
                      fontFamily: 'Bitter, serif',
                      letterSpacing: '-0.48px',
                      lineHeight: '36px'
                    }}
                  />
                ) : (
                  <h1
                    onClick={() => {
                      setIsEditingTitle(true);
                      setEditedTitle(pageTitle);
                    }}
                    className={`text-2xl font-semibold text-[var(--label-primary)] px-2 py-1 rounded-lg transition-colors truncate ${
                      isTitleHovered ? 'bg-gray-100 cursor-text' : ''
                    }`}
                    style={{
                      fontFamily: 'Bitter, serif',
                      letterSpacing: '-0.48px',
                      lineHeight: '36px'
                    }}
                  >
                    {pageTitle}
                  </h1>
                )}
              </div>
              {isEditingTitle && editedTitle !== pageTitle && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveTitle}
                    className="h-8 px-3 bg-[var(--control-primary)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelTitle}
                    className="h-8 px-3 bg-white border border-[var(--border)] text-[var(--label-primary)] text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step navigation */}
        <div className="flex items-center justify-center bg-white">
          <StepNavigation
            steps={steps}
            currentStep={currentStep}
            onBack={handleBack}
            onForward={handleForward}
            onStepClick={setCurrentStep}
          />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex overflow-hidden">
          {currentStep === 1 && (
            <>
              {/* Question list sidebar */}
              <QuestionListSidebar
                questions={questions}
                selectedQuestionId={selectedQuestionId}
                onQuestionSelect={handleQuestionSelect}
                onAddQuestion={handleAddQuestion}
              />

              {/* Question detail panels - ALL questions */}
              <div className="flex-1 bg-[#fafaf9] p-3 overflow-y-auto">
                <div className="max-w-[900px] mx-auto flex flex-col gap-3">
                  {questions.map((question) => (
                    <div
                      key={question.id}
                      id={`question-${question.id}`}
                      onClick={() => setSelectedQuestionId(question.id)}
                      className={`cursor-pointer ${selectedQuestionId === question.id ? "ring-1 ring-[var(--control-primary)] ring-opacity-30 rounded-2xl" : ""}`}
                    >
                      <QuestionDetailPanel
                        questionNumber={question.number}
                        questionText={question.questionText}
                        description={question.description}
                        questionType={question.questionType}
                        isRequired={question.isRequired}
                        showDeleteError={deleteError === question.id}
                        scaleType={question.scaleType}
                        scaleMinLabel={question.scaleMinLabel}
                        scaleMaxLabel={question.scaleMaxLabel}
                        multipleChoiceOptions={question.multipleChoiceOptions}
                        onQuestionChange={(text) => updateQuestion(question.id, { questionText: text })}
                        onDescriptionChange={(text) => updateQuestion(question.id, { description: text })}
                        onTypeChange={(type) => updateQuestion(question.id, { questionType: type })}
                        onRequiredChange={(required) => updateQuestion(question.id, { isRequired: required })}
                        onScaleTypeChange={(scaleType) => updateQuestion(question.id, { scaleType })}
                        onScaleMinLabelChange={(scaleMinLabel) => updateQuestion(question.id, { scaleMinLabel })}
                        onScaleMaxLabelChange={(scaleMaxLabel) => updateQuestion(question.id, { scaleMaxLabel })}
                        onMultipleChoiceOptionsChange={(multipleChoiceOptions) => updateQuestion(question.id, { multipleChoiceOptions })}
                        onCopy={() => {
                          const newId = Math.max(...questions.map((q) => q.id)) + 1;
                          const copiedQuestion = { ...question, id: newId, number: String(newId) };
                          setQuestions([...questions, copiedQuestion]);
                          setTimeout(() => {
                            setSelectedQuestionId(newId);
                            document.getElementById(`question-${newId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                          }, 100);
                        }}
                        onDelete={() => handleDeleteQuestion(question.id)}
                      />
                    </div>
                  ))}
                  {/* Add question button */}
                  <button
                    onClick={handleAddQuestion}
                    className="h-10 px-4 bg-white border border-[var(--border)] text-[var(--label-primary)] text-base font-medium rounded-lg shadow-sm hover:bg-gray-50 transition-colors self-center"
                  >
                    Add question
                  </button>
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <RecipientsPage
              recipients={recipients}
              onRecipientsChange={setRecipients}
            />
          )}

          {currentStep === 3 && (
            <SettingsPage
              questions={questions}
              recipients={recipients}
              onEditQuestions={() => setCurrentStep(1)}
              onEditRecipients={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && (
            <div className="flex-1 flex items-center justify-center bg-[#fafaf9]">
              <div className="text-center">
                <h2
                  className="text-2xl font-medium text-[var(--label-primary)] mb-2"
                  style={{ fontFamily: "Bitter, serif" }}
                >
                  Results
                </h2>
                <p className="text-base text-[var(--label-light)]">
                  Survey results will appear here once responses are collected.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
