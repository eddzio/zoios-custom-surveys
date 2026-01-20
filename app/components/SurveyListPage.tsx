"use client"

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "react-feather";

export interface Survey {
  id: number;
  name: string;
  questionCount: number;
  responseCount?: number;
  status: "draft" | "sent";
  lastUpdated: string;
  sentDate?: string;
  createdBy: string;
}

interface SurveyListPageProps {
  surveys: Survey[];
  onCreateSurvey: () => void;
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
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors"
      >
        <MoreVertical size={14} className="text-[var(--label-light)]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-[var(--border)] rounded-lg shadow-lg py-1 min-w-[160px] z-20">
          <button
            onClick={() => {
              onDuplicate();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-[var(--label-primary)] hover:bg-gray-50 transition-colors"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Duplicate survey
          </button>
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-[var(--label-primary)] hover:bg-gray-50 transition-colors"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Edit survey
          </button>
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 transition-colors"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Delete survey
          </button>
        </div>
      )}
    </div>
  );
};

const SurveyRow = ({
  survey,
  onDuplicate,
  onEdit,
  onDelete,
}: {
  survey: Survey;
  onDuplicate: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className="flex items-center p-6 border-b border-[var(--border)] hover:bg-gray-50/50 transition-colors">
      {/* Left - Name and stats */}
      <div className="flex-1 flex flex-col gap-1">
        <p
          className="text-base font-medium text-[var(--label-primary)]"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {survey.name}
        </p>
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
          Created by {survey.createdBy}
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
          className="h-10 px-4 bg-[var(--control-primary)] text-white text-base font-medium rounded-lg shadow-sm hover:opacity-90 transition-opacity"
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
