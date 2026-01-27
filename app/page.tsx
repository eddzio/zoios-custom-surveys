"use client"

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Home as HomeIcon, PlusCircle, Settings, User, HelpCircle, MoreVertical, Users } from "react-feather";
import { toast } from "sonner";
import { StepNavigation } from "./components/StepNavigation";
import { QuestionListSidebar, QuestionItem, Section } from "./components/QuestionListSidebar";
import { QuestionDetailPanel } from "./components/QuestionDetailPanel";
import { SectionBlock } from "./components/SectionBlock";
import { RecipientsPage } from "./components/RecipientsPage";
import { SettingsPage } from "./components/SettingsPage";
import { ResultsPage } from "./components/ResultsPage";
import { SurveyListPage, Survey, Collaborator } from "./components/SurveyListPage";
import { RespondentSurveyPage } from "./components/RespondentSurveyPage";
import { GroupsPage } from "./components/GroupsPage";

// Initial state with pizza-themed questions spanning all types
const initialQuestions: QuestionItem[] = [
  {
    id: 1,
    number: "1",
    questionText: "What's your favorite pizza topping combination?",
    description: "Describe your ideal pizza with all the toppings you love. Be as specific as you'd like!",
    questionType: "Text",
    isRequired: true,
    scaleType: "0-5",
    scaleMinLabel: "",
    scaleMaxLabel: "",
    multipleChoiceOptions: ["", ""],
  },
  {
    id: 2,
    number: "2",
    questionText: "How would you rate the quality of our pizza crust?",
    description: "Consider factors like crispiness, chewiness, and overall texture.",
    questionType: "Scale",
    isRequired: true,
    scaleType: "0-10",
    scaleMinLabel: "Terrible",
    scaleMaxLabel: "Perfect",
    multipleChoiceOptions: ["", ""],
  },
  {
    id: 3,
    number: "3",
    questionText: "Do you prefer pineapple on pizza?",
    description: "The age-old debate - where do you stand on Hawaiian pizza?",
    questionType: "Yes-no",
    isRequired: false,
    scaleType: "0-5",
    scaleMinLabel: "",
    scaleMaxLabel: "",
    multipleChoiceOptions: ["", ""],
  },
  {
    id: 4,
    number: "4",
    questionText: "What type of pizza crust do you prefer?",
    description: "Select the crust style that makes your perfect pizza.",
    questionType: "Multiple-choice",
    isRequired: true,
    scaleType: "0-5",
    scaleMinLabel: "",
    scaleMaxLabel: "",
    multipleChoiceOptions: ["Thin & Crispy", "Hand-tossed Traditional", "Deep Dish Chicago Style", "Neapolitan Wood-fired", "Stuffed Crust"],
  },
  {
    id: 5,
    number: "5",
    questionText: "How satisfied are you with pizza delivery times in your area?",
    description: "Think about your recent delivery experiences.",
    questionType: "Scale",
    isRequired: false,
    scaleType: "0-5",
    scaleMinLabel: "Very Dissatisfied",
    scaleMaxLabel: "Very Satisfied",
    multipleChoiceOptions: ["", ""],
  },
  {
    id: 6,
    number: "6",
    questionText: "Would you recommend our pizzeria to a friend?",
    description: "Based on your overall experience with our food and service.",
    questionType: "Yes-no",
    isRequired: true,
    scaleType: "0-5",
    scaleMinLabel: "",
    scaleMaxLabel: "",
    multipleChoiceOptions: ["", ""],
  },
  {
    id: 7,
    number: "7",
    questionText: "What improvements would you suggest for our menu?",
    description: "We're always looking to improve. Share your ideas for new items, changes, or anything else!",
    questionType: "Text",
    isRequired: false,
    scaleType: "0-5",
    scaleMinLabel: "",
    scaleMaxLabel: "",
    multipleChoiceOptions: ["", ""],
  },
  {
    id: 8,
    number: "8",
    questionText: "When do you typically order pizza?",
    description: "Select all the occasions when you're most likely to order.",
    questionType: "Multiple-choice",
    isRequired: false,
    scaleType: "0-5",
    scaleMinLabel: "",
    scaleMaxLabel: "",
    multipleChoiceOptions: ["Weeknight dinner", "Weekend treat", "Parties & gatherings", "Late night snack", "Lunch break"],
  },
];

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
    createdBy: "Ed Orozco",
    collaborators: [
      { id: 101, name: "Johnny Pecorino", role: "editor" },
      { id: 102, name: "Frankie Bobby Boyle", role: "viewer" },
    ],
  },
  {
    id: 2,
    name: "Team Satisfaction Q1 2026",
    questionCount: 8,
    responseCount: 0,
    status: "sent",
    lastUpdated: "20 January 2026",
    sentDate: "20 January 2026",
    createdBy: "Ed Orozco",
  },
  {
    id: 3,
    name: "Workcation Evaluation 2024 Barcelona",
    questionCount: 5,
    responseCount: 7,
    status: "sent",
    lastUpdated: "15 January 2026",
    sentDate: "15 January 2026",
    createdBy: "Ed Orozco",
  },
  // Shared surveys - user is a collaborator
  {
    id: 4,
    name: "Q1 2026 Employee Engagement Survey",
    questionCount: 12,
    responseCount: 45,
    status: "sent",
    lastUpdated: "10 January 2026",
    sentDate: "05 January 2026",
    createdBy: "Ed Orozco",
    sharedWith: {
      role: "viewer",
      sharedBy: "Ed Orozco",
    },
  },
  {
    id: 5,
    name: "Remote Work Policy Feedback",
    questionCount: 8,
    status: "draft",
    lastUpdated: "18 January 2026",
    createdBy: "Ed Orozco",
    sharedWith: {
      role: "editor",
      sharedBy: "Ed Orozco",
    },
  },
];

export default function Home() {
  // View state: "list" shows survey list, "editor" shows survey editor, "groups" shows groups management
  const [currentView, setCurrentView] = useState<"list" | "editor" | "groups">("list");
  const [surveys, setSurveys] = useState<Survey[]>(initialSurveys);
  const [currentSurveyId, setCurrentSurveyId] = useState<number | null>(null);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(1);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<QuestionItem[]>(initialQuestions);
  const [sections, setSections] = useState<Section[]>([]);
  const [deleteError, setDeleteError] = useState<number | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [movingQuestionId, setMovingQuestionId] = useState<number | null>(null);
  const [movingSectionId, setMovingSectionId] = useState<number | null>(null);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  // Page title state
  const [pageTitle, setPageTitle] = useState("Workcation Evaluation 2024 Barcelona");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(pageTitle);
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Get current survey and check user's role
  const currentSurvey = currentSurveyId ? surveys.find((s) => s.id === currentSurveyId) : null;
  const isViewerOnly = currentSurvey?.sharedWith?.role === "viewer";
  const isSharedSurvey = !!currentSurvey?.sharedWith;

  // Survey menu state
  const [isSurveyMenuOpen, setIsSurveyMenuOpen] = useState(false);
  const surveyMenuRef = useRef<HTMLDivElement>(null);

  // Saving indicator state
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const savedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerSave = (callback?: () => void) => {
    // Clear any existing timeouts
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current);

    setSaveStatus("saving");

    saveTimeoutRef.current = setTimeout(() => {
      setSaveStatus("saved");
      // Execute callback (like showing toast) after save completes
      if (callback) callback();

      savedTimeoutRef.current = setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    }, 2000);
  };

  // Close survey menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (surveyMenuRef.current && !surveyMenuRef.current.contains(event.target as Node)) {
        setIsSurveyMenuOpen(false);
      }
    };

    if (isSurveyMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSurveyMenuOpen]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Limit to 50 characters to stay within max width
    if (newValue.length <= 50) {
      setEditedTitle(newValue);
    }
  };

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      const newTitle = editedTitle.trim();
      setPageTitle(newTitle);
      // Update the survey name in the list
      if (currentSurveyId) {
        setSurveys(surveys.map((s) =>
          s.id === currentSurveyId ? { ...s, name: newTitle } : s
        ));
      }
      triggerSave();
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
    // Viewers can only see Results, no navigation allowed
    if (isViewerOnly) return;
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleForward = () => {
    // Viewers can only see Results, no navigation allowed
    if (isViewerOnly) return;
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepClick = (step: number) => {
    // Viewers can only see Results
    if (isViewerOnly && step !== 4) return;
    setCurrentStep(step);
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
    triggerSave();

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
    triggerSave();
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
    triggerSave();
  };

  const handleMoveQuestion = (id: number, direction: 'up' | 'down') => {
    const index = questions.findIndex((q) => q.id === id);
    if (index === -1) return;

    setMovingQuestionId(id);

    if (direction === 'up' && index > 0) {
      const newQuestions = [...questions];
      [newQuestions[index], newQuestions[index - 1]] = [newQuestions[index - 1], newQuestions[index]];
      setQuestions(newQuestions);
      triggerSave();
    } else if (direction === 'down' && index < questions.length - 1) {
      const newQuestions = [...questions];
      [newQuestions[index], newQuestions[index + 1]] = [newQuestions[index + 1], newQuestions[index]];
      setQuestions(newQuestions);
      triggerSave();
    }
  };

  // Section handlers
  const handleAddSection = () => {
    const newId = sections.length > 0 ? Math.max(...sections.map((s) => s.id)) + 1 : 1;
    const newSection: Section = {
      id: newId,
      name: `Section ${newId + 1}`,
      afterQuestionIndex: questions.length - 1, // Add after the last question
    };
    setSections([...sections, newSection]);
    setSelectedSectionId(newId);
    setSelectedQuestionId(0); // Deselect any question
    triggerSave();

    // Scroll to new section after a brief delay
    setTimeout(() => {
      document.getElementById(`section-${newId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleSectionSelect = (id: number) => {
    setSelectedSectionId(id);
    setSelectedQuestionId(0); // Deselect any question
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const updateSection = (id: number, updates: Partial<Section>) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    triggerSave();
  };

  const handleDeleteSection = (id: number) => {
    setSections(sections.filter((s) => s.id !== id));
    if (selectedSectionId === id) {
      setSelectedSectionId(null);
      // Select first question if available
      if (questions.length > 0) {
        setSelectedQuestionId(questions[0].id);
      }
    }
    triggerSave();
  };

  const handleMoveSection = (id: number, direction: 'up' | 'down') => {
    const section = sections.find((s) => s.id === id);
    if (!section) return;

    setMovingSectionId(id);

    const currentIndex = section.afterQuestionIndex;
    let newIndex = currentIndex;

    if (direction === 'up' && currentIndex >= 0) {
      newIndex = currentIndex - 1;
    } else if (direction === 'down' && currentIndex < questions.length - 1) {
      newIndex = currentIndex + 1;
    }

    if (newIndex !== currentIndex) {
      setSections(sections.map((s) =>
        s.id === id ? { ...s, afterQuestionIndex: newIndex } : s
      ));
      triggerSave();
    }

    // Reset moving state after animation
    setTimeout(() => setMovingSectionId(null), 300);
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
      collaborators: [],
    };
    setSurveys([newSurvey, ...surveys]);
    setCurrentSurveyId(newId);
    setPageTitle("New Survey");
    setQuestions([{
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
    }]);
    setSelectedQuestionId(1);
    setSelectedSectionId(null);
    setSections([]);
    setRecipients([]);
    setCollaborators([]);
    setCurrentStep(1);
    setCurrentView("editor");
  };

  const handleOpenSurvey = (id: number) => {
    const survey = surveys.find((s) => s.id === id);
    if (survey) {
      setCurrentSurveyId(id);
      setPageTitle(survey.name);
      setCollaborators(survey.collaborators || []);
      // Viewers can only see Results page
      if (survey.sharedWith?.role === "viewer") {
        setCurrentStep(4); // Go directly to Results
      } else {
        setCurrentStep(1); // Go to Questions
      }
      setCurrentView("editor");
    }
  };

  const handleEditSurvey = (id: number) => {
    const survey = surveys.find((s) => s.id === id);
    if (survey) {
      setCurrentSurveyId(id);
      setPageTitle(survey.name);
      setCollaborators(survey.collaborators || []);
      // Viewers can only see Results page
      if (survey.sharedWith?.role === "viewer") {
        setCurrentStep(4);
      } else {
        setCurrentStep(3); // Go to Settings
      }
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
      toast.success("Survey duplicated", {
        action: {
          label: "Go to survey list",
          onClick: () => setCurrentView("list"),
        },
        actionButtonStyle: {
          backgroundColor: "transparent",
          color: "inherit",
          fontSize: "inherit",
          fontWeight: 600,
          textDecoration: "underline",
          padding: 0,
          margin: 0,
          marginLeft: 4,
        },
        classNames: {
          actionButton: "hover:no-underline",
        },
      });
    }
  };

  const handleDeleteSurvey = (id: number) => {
    setSurveys(surveys.filter((s) => s.id !== id));
    toast.success("Survey deleted");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setCurrentSurveyId(null);
  };

  // Survey menu handlers
  const handleRenameFromMenu = () => {
    setIsSurveyMenuOpen(false);
    setIsEditingTitle(true);
    setEditedTitle(pageTitle);
  };

  const handleDuplicateFromMenu = () => {
    setIsSurveyMenuOpen(false);
    if (currentSurveyId) {
      handleDuplicateSurvey(currentSurveyId);
    }
  };

  const handleDeleteFromMenu = () => {
    setIsSurveyMenuOpen(false);
    if (currentSurveyId) {
      handleDeleteSurvey(currentSurveyId);
      handleBackToList();
    }
  };

  // Show preview mode
  if (isPreviewMode) {
    return (
      <RespondentSurveyPage
        surveyTitle={pageTitle}
        surveyDescription="Please take a few minutes to complete this survey. Your feedback is valuable to us."
        questions={questions}
        sections={sections}
        onClose={() => setIsPreviewMode(false)}
      />
    );
  }

  return (
    <div className="h-screen bg-[var(--background)] overflow-hidden relative">
      {/* Navbar - floating on left */}
      <div className="fixed left-4 top-4 bottom-4 w-[68px] bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl flex flex-col items-center py-4 z-10">
        {/* Logo placeholder */}
        <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center mb-6">
          <span className="text-white font-bold text-lg">C</span>
        </div>

        {/* Nav icons */}
        <div className="flex flex-col items-center gap-2">
          <button className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--label-light)] hover:bg-[var(--bg-neutral)] hover:text-[var(--label-primary)] transition-colors">
            <HomeIcon size={20} />
          </button>
          <button
            onClick={() => setCurrentView("list")}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              currentView === "list" || currentView === "editor"
                ? "bg-[var(--bg-neutral)] text-[var(--label-primary)]"
                : "text-[var(--label-light)] hover:bg-[var(--bg-neutral)] hover:text-[var(--label-primary)]"
            }`}
          >
            <PlusCircle size={20} />
          </button>
          <button
            onClick={() => setCurrentView("groups")}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              currentView === "groups"
                ? "bg-[var(--bg-neutral)] text-[var(--label-primary)]"
                : "text-[var(--label-light)] hover:bg-[var(--bg-neutral)] hover:text-[var(--label-primary)]"
            }`}
          >
            <Users size={20} />
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
        <div className="w-full max-w-[1300px] bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] flex flex-col overflow-hidden">

          {currentView === "groups" ? (
            <GroupsPage />
          ) : currentView === "list" ? (
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
          <div className="flex items-start justify-between px-6 py-6">
            <div className="flex flex-col">
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
              <div className="flex items-center gap-1">
                <div
                  className="max-w-[600px] relative"
                  onMouseEnter={() => setIsTitleHovered(true)}
                  onMouseLeave={() => setIsTitleHovered(false)}
                >
                  {/* Hidden span to measure text width */}
                  <span
                    className="invisible absolute whitespace-pre text-2xl font-semibold px-2"
                    style={{
                      fontFamily: 'Bitter, serif',
                      letterSpacing: '-0.48px',
                    }}
                    aria-hidden="true"
                  >
                    {isEditingTitle ? editedTitle || ' ' : pageTitle || ' '}
                  </span>
                  {isEditingTitle ? (
                    <input
                      ref={titleInputRef}
                      type="text"
                      value={editedTitle}
                      onChange={handleTitleChange}
                      onKeyDown={handleTitleKeyDown}
                      autoFocus
                      className="text-2xl font-semibold text-[var(--label-primary)] bg-[var(--bg-neutral)] px-2 py-1 rounded-lg outline-none focus:ring-1 focus:ring-[var(--control-primary)] focus:ring-opacity-20"
                      style={{
                        fontFamily: 'Bitter, serif',
                        letterSpacing: '-0.48px',
                        lineHeight: '36px',
                        width: `calc(${Math.min(Math.max((editedTitle || ' ').length, 1), 50)}ch + 20px)`,
                        maxWidth: '600px',
                        minWidth: '100px',
                      }}
                    />
                  ) : (
                    <h1
                      onClick={() => {
                        setIsEditingTitle(true);
                        setEditedTitle(pageTitle);
                      }}
                      className={`text-2xl font-semibold text-[var(--label-primary)] px-2 py-1 rounded-lg transition-colors whitespace-nowrap ${
                        isTitleHovered ? 'bg-[var(--bg-neutral)] cursor-text' : ''
                      }`}
                      style={{
                        fontFamily: 'Bitter, serif',
                        letterSpacing: '-0.48px',
                        lineHeight: '36px',
                        maxWidth: '600px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {pageTitle}
                    </h1>
                  )}
                </div>
                {/* Survey menu */}
                <div className="relative" ref={surveyMenuRef}>
                  <button
                    onClick={() => setIsSurveyMenuOpen(!isSurveyMenuOpen)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--label-light)] hover:bg-[var(--bg-neutral)] hover:text-[var(--label-primary)] transition-colors"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {isSurveyMenuOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-lg py-1 z-20">
                      <button
                        onClick={handleRenameFromMenu}
                        className="w-full px-4 py-2 text-left text-sm text-[var(--label-primary)] hover:bg-[var(--bg-neutral)] transition-colors"
                      >
                        Rename
                      </button>
                      <button
                        onClick={handleDuplicateFromMenu}
                        className="w-full px-4 py-2 text-left text-sm text-[var(--label-primary)] hover:bg-[var(--bg-neutral)] transition-colors"
                      >
                        Duplicate survey
                      </button>
                      <button
                        onClick={handleDeleteFromMenu}
                        className="w-full px-4 py-2 text-left text-sm text-[var(--label-negative)] hover:bg-[var(--bg-neutral)] transition-colors"
                      >
                        Delete survey
                      </button>
                    </div>
                  )}
                </div>
                {isEditingTitle && editedTitle !== pageTitle && (
                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    <button
                      onClick={handleSaveTitle}
                      className="h-10 px-4 bg-[var(--control-primary)] text-[var(--control-secondary)] text-sm font-medium rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelTitle}
                      className="h-10 px-4 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--label-primary)] text-sm font-medium rounded-lg hover:bg-[var(--bg-neutral)] transition-colors whitespace-nowrap shrink-0"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Saving indicator and Back to surveys button */}
            <div className="flex items-center gap-3 shrink-0">
              {saveStatus !== "idle" && (
                <div className="flex items-center gap-2 shrink-0">
                  {saveStatus === "saving" ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-[var(--label-light)] shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm text-[var(--label-light)] whitespace-nowrap">Saving...</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-green-600 whitespace-nowrap">Changes saved</span>
                    </>
                  )}
                </div>
              )}
              <button
                onClick={handleBackToList}
                className="h-10 px-4 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--label-primary)] text-sm font-medium rounded-lg hover:bg-[var(--bg-neutral)] transition-colors whitespace-nowrap shrink-0"
              >
                Back to surveys
              </button>
            </div>
          </div>
        </div>

          {/* Step navigation - hidden for viewers */}
          {!isViewerOnly && (
            <div className="flex items-center justify-center">
              <StepNavigation
                steps={steps}
                currentStep={currentStep}
                onBack={handleBack}
                onForward={handleForward}
                onStepClick={handleStepClick}
                onPreview={() => setIsPreviewMode(true)}
              />
            </div>
          )}

          {/* Main content area */}
          <div className="flex-1 flex overflow-hidden">
          {currentStep === 1 && (
            <>
              {/* Question list sidebar */}
              <QuestionListSidebar
                questions={questions}
                sections={sections}
                selectedQuestionId={selectedQuestionId}
                selectedSectionId={selectedSectionId}
                onQuestionSelect={handleQuestionSelect}
                onSectionSelect={handleSectionSelect}
                onAddQuestion={handleAddQuestion}
                onMoveQuestion={handleMoveQuestion}
                onMoveSection={handleMoveSection}
              />

              {/* Question detail panels - ALL questions with sections */}
              <div className="flex-1 bg-[var(--background)] p-3 overflow-y-auto">
                <div className="max-w-[900px] mx-auto flex flex-col gap-3">
                  {(() => {
                    // Build list with sections interspersed
                    const items: Array<{ type: 'question' | 'section'; data: QuestionItem | Section }> = [];
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

                    return items.map((item) => {
                      if (item.type === 'question') {
                        const question = item.data as QuestionItem;
                        return (
                          <motion.div
                            key={`question-${question.id}`}
                            layout
                            layoutId={`question-card-${question.id}`}
                            transition={{ type: "spring", mass: 1, stiffness: 230, damping: 25 }}
                            onLayoutAnimationComplete={() => {
                              if (movingQuestionId === question.id) {
                                setMovingQuestionId(null);
                              }
                            }}
                            id={`question-${question.id}`}
                            onClick={() => {
                              setSelectedQuestionId(question.id);
                              setSelectedSectionId(null);
                            }}
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
                                  setSelectedSectionId(null);
                                  document.getElementById(`question-${newId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                                }, 100);
                              }}
                              onDelete={() => handleDeleteQuestion(question.id)}
                              onMoveUp={() => handleMoveQuestion(question.id, 'up')}
                              onMoveDown={() => handleMoveQuestion(question.id, 'down')}
                            />
                          </motion.div>
                        );
                      } else {
                        const section = item.data as Section;
                        return (
                          <motion.div
                            key={`section-${section.id}`}
                            layout
                            layoutId={`section-card-${section.id}`}
                            transition={{ type: "spring", mass: 1, stiffness: 230, damping: 25 }}
                            onLayoutAnimationComplete={() => {
                              if (movingSectionId === section.id) {
                                setMovingSectionId(null);
                              }
                            }}
                            id={`section-${section.id}`}
                            onClick={() => {
                              setSelectedSectionId(section.id);
                              setSelectedQuestionId(0);
                            }}
                            style={{ zIndex: movingSectionId === section.id ? 10 : 1 }}
                            className={`relative cursor-pointer ${selectedSectionId === section.id ? "ring-1 ring-[var(--control-primary)] ring-opacity-30 rounded-2xl" : ""}`}
                          >
                            <SectionBlock
                              name={section.name}
                              canMoveUp={section.afterQuestionIndex > 0}
                              canMoveDown={section.afterQuestionIndex < questions.length - 1}
                              onNameChange={(name) => updateSection(section.id, { name })}
                              onDelete={() => handleDeleteSection(section.id)}
                              onMoveUp={() => handleMoveSection(section.id, 'up')}
                              onMoveDown={() => handleMoveSection(section.id, 'down')}
                            />
                          </motion.div>
                        );
                      }
                    });
                  })()}
                  {/* Add question button */}
                  <button
                    onClick={handleAddQuestion}
                    className="h-10 px-4 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--label-primary)] text-base font-medium rounded-lg shadow-sm hover:bg-[var(--bg-neutral)] transition-colors self-center whitespace-nowrap shrink-0"
                  >
                    Add question
                  </button>
                  {/* Add section button */}
                  <button
                    onClick={handleAddSection}
                    className="w-full h-10 border border-dashed border-[var(--label-light)] text-[var(--label-light)] text-base font-medium rounded-2xl hover:bg-[var(--bg-neutral)] hover:border-[var(--label-primary)] hover:text-[var(--label-primary)] transition-colors"
                  >
                    Add section
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
              collaborators={collaborators}
              surveyTitle={pageTitle}
              createdBy={currentSurvey?.createdBy || "You"}
              onEditQuestions={() => setCurrentStep(1)}
              onEditRecipients={() => setCurrentStep(2)}
              onRecipientsChange={setRecipients}
              onCollaboratorsChange={setCollaborators}
              onDeleteSurvey={() => {
                if (currentSurveyId) {
                  handleDeleteSurvey(currentSurveyId);
                  handleBackToList();
                }
              }}
              triggerSave={triggerSave}
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
