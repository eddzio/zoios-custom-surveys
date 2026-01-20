"use client"

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Home as HomeIcon, PlusCircle, Settings, User, HelpCircle } from "react-feather";
import { StepNavigation } from "./components/StepNavigation";
import { QuestionListSidebar, QuestionItem } from "./components/QuestionListSidebar";
import { QuestionDetailPanel } from "./components/QuestionDetailPanel";
import { RecipientsPage } from "./components/RecipientsPage";
import { SettingsPage } from "./components/SettingsPage";
import { ResultsPage } from "./components/ResultsPage";
import { SurveyListPage, Survey } from "./components/SurveyListPage";

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

// Sample surveys for the list
const initialSurveys: Survey[] = [
  {
    id: 1,
    name: "[Copy] Workcation Evaluation 2024 Barcelona",
    questionCount: 5,
    status: "draft",
    lastUpdated: "07 March 2025",
    createdBy: "Christian Højbo Møller",
  },
  {
    id: 2,
    name: "Workcation Evaluation 2024 Barcelona",
    questionCount: 5,
    status: "draft",
    lastUpdated: "07 March 2025",
    createdBy: "Christian Højbo Møller",
  },
  {
    id: 3,
    name: "Workcation Evaluation 2024 Barcelona",
    questionCount: 5,
    responseCount: 7,
    status: "sent",
    lastUpdated: "15 January 2026",
    sentDate: "15 January 2026",
    createdBy: "Christian Højbo Møller",
  },
];

export default function Home() {
  // View state: "list" shows survey list, "editor" shows survey editor
  const [currentView, setCurrentView] = useState<"list" | "editor">("list");
  const [surveys, setSurveys] = useState<Survey[]>(initialSurveys);
  const [currentSurveyId, setCurrentSurveyId] = useState<number | null>(null);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(1);
  const [questions, setQuestions] = useState<QuestionItem[]>([initialQuestion]);
  const [deleteError, setDeleteError] = useState<number | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [movingQuestionId, setMovingQuestionId] = useState<number | null>(null);

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

  const handleMoveQuestion = (id: number, direction: 'up' | 'down') => {
    const index = questions.findIndex((q) => q.id === id);
    if (index === -1) return;

    setMovingQuestionId(id);

    if (direction === 'up' && index > 0) {
      const newQuestions = [...questions];
      [newQuestions[index], newQuestions[index - 1]] = [newQuestions[index - 1], newQuestions[index]];
      setQuestions(newQuestions);
    } else if (direction === 'down' && index < questions.length - 1) {
      const newQuestions = [...questions];
      [newQuestions[index], newQuestions[index + 1]] = [newQuestions[index + 1], newQuestions[index]];
      setQuestions(newQuestions);
    }
  };

  // Survey list handlers
  const handleCreateSurvey = () => {
    const newId = Math.max(...surveys.map((s) => s.id), 0) + 1;
    const newSurvey: Survey = {
      id: newId,
      name: "New Survey",
      questionCount: 1,
      status: "draft",
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      createdBy: "You",
    };
    setSurveys([newSurvey, ...surveys]);
    setCurrentSurveyId(newId);
    setPageTitle("New Survey");
    setQuestions([initialQuestion]);
    setSelectedQuestionId(1);
    setRecipients([]);
    setCurrentStep(1);
    setCurrentView("editor");
  };

  const handleOpenSurvey = (id: number) => {
    const survey = surveys.find((s) => s.id === id);
    if (survey) {
      setCurrentSurveyId(id);
      setPageTitle(survey.name);
      setCurrentStep(1); // Go to Questions
      setCurrentView("editor");
    }
  };

  const handleEditSurvey = (id: number) => {
    const survey = surveys.find((s) => s.id === id);
    if (survey) {
      setCurrentSurveyId(id);
      setPageTitle(survey.name);
      setCurrentStep(3); // Go to Settings
      setCurrentView("editor");
    }
  };

  const handleDuplicateSurvey = (id: number) => {
    const survey = surveys.find((s) => s.id === id);
    if (survey) {
      const newId = Math.max(...surveys.map((s) => s.id), 0) + 1;
      const duplicatedSurvey: Survey = {
        ...survey,
        id: newId,
        name: `[Copy] ${survey.name}`,
        status: "draft",
        responseCount: undefined,
        sentDate: undefined,
        lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      };
      setSurveys([duplicatedSurvey, ...surveys]);
    }
  };

  const handleDeleteSurvey = (id: number) => {
    setSurveys(surveys.filter((s) => s.id !== id));
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setCurrentSurveyId(null);
  };

  return (
    <div className="h-screen bg-[#fffaf6] overflow-hidden relative">
      {/* Navbar - floating on left */}
      <div className="fixed left-4 top-[68px] bottom-4 w-[68px] bg-white border border-[var(--border)] rounded-2xl flex flex-col items-center py-4 z-10">
        {/* Logo placeholder */}
        <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center mb-6">
          <span className="text-white font-bold text-lg">C</span>
        </div>

        {/* Nav icons */}
        <div className="flex flex-col items-center gap-2">
          <button className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--label-light)] hover:bg-[var(--bg-neutral)] hover:text-[var(--label-primary)] transition-colors">
            <HomeIcon size={20} />
          </button>
          <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--bg-neutral)] text-[var(--label-primary)]">
            <PlusCircle size={20} />
          </button>
          <button className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--label-light)] hover:bg-[var(--bg-neutral)] hover:text-[var(--label-primary)] transition-colors">
            <Settings size={20} />
          </button>
        </div>

        {/* Bottom icons */}
        <div className="mt-auto flex flex-col items-center gap-2">
          <button className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--label-light)] hover:bg-[var(--bg-neutral)] hover:text-[var(--label-primary)] transition-colors">
            <HelpCircle size={20} />
          </button>
          <button className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--label-light)] hover:bg-[var(--bg-neutral)] hover:text-[var(--label-primary)] transition-colors">
            <User size={20} />
          </button>
        </div>
      </div>

      {/* Main content - centered container */}
      <div className="h-full flex justify-center py-4 pl-[100px]">
        <div className="w-full max-w-[1300px] bg-white rounded-2xl border border-[var(--border)] flex flex-col overflow-hidden">

          {currentView === "list" ? (
            <SurveyListPage
              surveys={surveys}
              onCreateSurvey={handleCreateSurvey}
              onOpenSurvey={handleOpenSurvey}
              onEditSurvey={handleEditSurvey}
              onDuplicateSurvey={handleDuplicateSurvey}
              onDeleteSurvey={handleDeleteSurvey}
            />
          ) : (
            <>
          {/* Page header */}
          <div className="border-b border-[var(--border)]">
          <div className="flex flex-col px-6 py-6">
            {/* Breadcrumbs */}
            <div className="flex items-center mb-1 pl-2">
              <button
                onClick={handleBackToList}
                className="text-base text-[var(--label-light)] font-medium hover:text-[var(--label-primary)] transition-colors"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Custom surveys
              </button>
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
          <div className="flex items-center justify-center">
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
                onMoveQuestion={handleMoveQuestion}
              />

              {/* Question detail panels - ALL questions */}
              <div className="flex-1 bg-[#fafaf9] p-3 overflow-y-auto">
                <div className="max-w-[900px] mx-auto flex flex-col gap-3">
                  {questions.map((question) => (
                    <motion.div
                      key={question.id}
                      layout
                      layoutId={`question-card-${question.id}`}
                      transition={{ type: "spring", mass: 1, stiffness: 230, damping: 25 }}
                      onLayoutAnimationComplete={() => {
                        if (movingQuestionId === question.id) {
                          setMovingQuestionId(null);
                        }
                      }}
                      id={`question-${question.id}`}
                      onClick={() => setSelectedQuestionId(question.id)}
                      style={{ zIndex: movingQuestionId === question.id ? 10 : 1 }}
                      className={`relative cursor-pointer ${selectedQuestionId === question.id ? "ring-1 ring-[var(--control-primary)] ring-opacity-30 rounded-2xl" : ""}`}
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
                        canMoveUp={questions.findIndex((q) => q.id === question.id) > 0}
                        canMoveDown={questions.findIndex((q) => q.id === question.id) < questions.length - 1}
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
                        onMoveUp={() => handleMoveQuestion(question.id, 'up')}
                        onMoveDown={() => handleMoveQuestion(question.id, 'down')}
                      />
                    </motion.div>
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
            <ResultsPage questions={questions} />
          )}
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
