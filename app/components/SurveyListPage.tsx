"use client"

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "react-feather";

export interface Collaborator {
  id: number;
  name: string;
  role: "editor" | "viewer";
}

export interface Survey {
  id: number;
  name: string;
  questionCount: number;
  responseCount?: number;
  status: "draft" | "sent";
  lastUpdated: string;
  sentDate?: string;
  createdBy: string;
  collaborators?: Collaborator[];
  // For surveys shared with the current user
  sharedWith?: {
    role: "editor" | "viewer";
    sharedBy: string;
  };
}

interface SurveyListPageProps {
  surveys: Survey[];
  onCreateSurvey: () => void;
  onOpenSurvey: (id: number) => void;
  onEditSurvey: (id: number) => void;
  onDuplicateSurvey: (id: number) => void;
  onDeleteSurvey: (id: number) => void;
}

const SurveyRowMenu = ({
  onDuplicate,
  onEdit,
  onDelete,
}: {
  onDuplicate: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-10 h-10 flex items-center justify-center bg-white border border-[var(--border)] rounded-lg shadow-sm hover:bg-stone-100 transition-colors"
      >
        <MoreVertical size={14} className="text-[var(--label-light)]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-[var(--border)] rounded-lg shadow-lg py-1 min-w-[160px] z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-[var(--label-primary)] hover:bg-stone-100 transition-colors"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Duplicate survey
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-[var(--label-primary)] hover:bg-stone-100 transition-colors"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Edit survey
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Delete survey
          </button>
        </div>
      )}
    </div>
  );
};

const SurveyStatusLabel = ({ survey }: { survey: Survey }) => {
  if (survey.status === "draft") {
    return (
      <span
        className="inline-flex items-center h-6 px-2 rounded-md text-xs font-medium bg-stone-100 border border-stone-200 text-stone-800"
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        Not sent
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center h-6 px-2 rounded-md text-xs font-medium border border-emerald-500 bg-white text-emerald-800"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      Sent
    </span>
  );
};

const SurveyRow = ({
  survey,
  onClick,
  onDuplicate,
  onEdit,
  onDelete,
}: {
  survey: Survey;
  onClick: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center p-6 border-b border-[var(--border)] hover:bg-[#f5f5f4] transition-colors cursor-pointer"
    >
      {/* Left - Name and stats */}
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <p
            className="text-base font-medium text-[var(--label-primary)]"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {survey.name}
          </p>
          <SurveyStatusLabel survey={survey} />
        </div>
        <div className="flex items-center gap-2 text-[13px] text-[var(--label-light)]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          <span>{survey.questionCount} questions</span>
          {survey.status === "sent" && survey.responseCount !== undefined && (
            <>
              <span>·</span>
              <span>{survey.responseCount} responses</span>
            </>
          )}
        </div>
      </div>

      {/* Right - Dates and creator */}
      <div className="flex-1 flex flex-col items-end gap-0 pr-6">
        <p
          className="text-[13px] text-[var(--label-light)]"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {survey.status === "sent" && survey.sentDate
            ? `Sent on ${survey.sentDate}`
            : `Last updated on ${survey.lastUpdated}`}
        </p>
        <p
          className="text-[13px] text-[var(--label-primary)]"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {survey.sharedWith
            ? `Shared by ${survey.sharedWith.sharedBy} · ${survey.sharedWith.role === "editor" ? "You're an editor" : "You're a viewer"}`
            : `Created by ${survey.createdBy}`
          }
        </p>
      </div>

      {/* Menu */}
      <SurveyRowMenu
        onDuplicate={onDuplicate}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};

export const SurveyListPage: React.FC<SurveyListPageProps> = ({
  surveys,
  onCreateSurvey,
  onOpenSurvey,
  onEditSurvey,
  onDuplicateSurvey,
  onDeleteSurvey,
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
        <h1
          className="text-2xl font-semibold text-[var(--label-primary)]"
          style={{
            fontFamily: 'Bitter, serif',
            letterSpacing: '-0.48px',
            lineHeight: '36px'
          }}
        >
          Custom surveys
        </h1>
        <button
          onClick={onCreateSurvey}
          className="h-10 px-4 bg-[var(--control-primary)] text-white text-base font-medium rounded-lg shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Create survey
        </button>
      </div>

      {/* Survey list */}
      <div className="flex-1 overflow-y-auto">
        {surveys.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[var(--label-light)]">
            <p className="text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>
              No surveys yet
            </p>
            <p className="text-sm mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Create your first survey to get started
            </p>
          </div>
        ) : (
          surveys.map((survey) => (
            <SurveyRow
              key={survey.id}
              survey={survey}
              onClick={() => onOpenSurvey(survey.id)}
              onDuplicate={() => onDuplicateSurvey(survey.id)}
              onEdit={() => onEditSurvey(survey.id)}
              onDelete={() => onDeleteSurvey(survey.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
