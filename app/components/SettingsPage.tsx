"use client"

import React, { useState } from "react";
import { QuestionItem } from "./QuestionListSidebar";

interface Recipient {
  id: number;
  name: string;
}

interface SettingsPageProps {
  questions: QuestionItem[];
  recipients: Recipient[];
  onEditQuestions: () => void;
  onEditRecipients: () => void;
}

const Tag = ({ label }: { label: string }) => {
  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-[var(--bg-neutral)] border border-[var(--border)] rounded">
      <span className="text-base text-[var(--label-light)] truncate max-w-[140px]">
        {label}
      </span>
      <button className="w-6 h-6 flex items-center justify-center text-[var(--label-light)] hover:text-[var(--label-primary)]">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 3L11 11M11 3L3 11" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};

export const SettingsPage: React.FC<SettingsPageProps> = ({
  questions,
  recipients,
  onEditQuestions,
  onEditRecipients,
}) => {
  const [minimumResponses, setMinimumResponses] = useState("3");
  const [minimumGroupSize, setMinimumGroupSize] = useState("5");
  const [selectedCollaborator, setSelectedCollaborator] = useState("");

  return (
    <div className="flex-1 flex overflow-hidden bg-[var(--bg-neutral)]">
      <div className="flex-1 flex flex-col gap-3 p-6 overflow-y-auto">
        {/* Centered content container */}
        <div className="mx-auto w-full max-w-[900px] flex flex-col gap-3">
          {/* Top row - Summary cards */}
          <div className="flex gap-3">
            {/* Questions summary */}
            <div className="flex-1 bg-white border border-[var(--border)] rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-0">
                <h3
                  className="text-xl font-medium text-[var(--label-primary)]"
                  style={{ fontFamily: "Bitter, serif" }}
                >
                  Questions · {questions.length}
                </h3>
                <button
                  onClick={onEditQuestions}
                  className="h-10 px-4 bg-white border border-[var(--border)] text-[var(--label-primary)] text-base font-medium rounded-lg hover:bg-gray-50"
                >
                  Edit
                </button>
              </div>

              {/* Questions list */}
              <div className="p-6 pt-4">
                <div className="flex flex-col max-h-[328px] overflow-y-auto custom-scrollbar">
                  {questions.map((question, index) => (
                    <div key={question.id} className="flex gap-2 py-2">
                      <span
                        className="text-base text-[var(--label-light)] w-6 shrink-0"
                        style={{ fontFamily: "DM Mono, monospace" }}
                      >
                        {index + 1}
                      </span>
                      <span className="text-base text-[var(--label-primary)] line-clamp-2">
                        {question.questionText || `Question ${index + 1}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recipients summary */}
            <div className="flex-1 bg-white border border-[var(--border)] rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-0">
                <h3
                  className="text-xl font-medium text-[var(--label-primary)]"
                  style={{ fontFamily: "Bitter, serif" }}
                >
                  Recipients · {recipients.length}
                </h3>
                <button
                  onClick={onEditRecipients}
                  className="h-10 px-4 bg-white border border-[var(--border)] text-[var(--label-primary)] text-base font-medium rounded-lg hover:bg-gray-50"
                >
                  Edit
                </button>
              </div>

              {/* Recipients tags */}
              <div className="p-6 pt-4 relative">
                <div className="flex flex-wrap gap-2 max-h-[328px] overflow-y-auto custom-scrollbar pb-4">
                  {recipients.map((recipient) => (
                    <Tag key={recipient.id} label={recipient.name} />
                  ))}
                </div>
                {/* Gradient fade at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Bottom - Settings card */}
          <div className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden">
            {/* Anonymity settings section */}
            <div className="p-6">
              <div className="mb-4">
                <h3
                  className="text-xl font-medium text-black mb-1"
                  style={{ fontFamily: "Bitter, serif" }}
                >
                  Anonymity settings
                </h3>
                <p className="text-base text-[var(--label-light)]">
                  Choose the anonymity thresholds for this survey
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {/* Minimum responses input */}
                <div className="flex flex-col gap-1">
                  <label className="text-base text-[var(--label-primary)]">
                    Minimum responses
                  </label>
                  <input
                    type="text"
                    value={minimumResponses}
                    onChange={(e) => setMinimumResponses(e.target.value)}
                    className="h-10 px-3 bg-white border border-[var(--border)] rounded-lg text-sm text-[var(--label-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--control-primary)] focus:ring-opacity-20"
                    style={{ fontFamily: "DM Mono, monospace" }}
                  />
                  <span className="text-[13px] text-[var(--label-light)] leading-[18px]">
                    How many people need to respond before you see any results
                  </span>
                </div>

                {/* Minimum segment or group size input */}
                <div className="flex flex-col gap-1">
                  <label className="text-base text-[var(--label-primary)]">
                    Minimum segment or group size
                  </label>
                  <input
                    type="text"
                    value={minimumGroupSize}
                    onChange={(e) => setMinimumGroupSize(e.target.value)}
                    className="h-10 px-3 bg-white border border-[var(--border)] rounded-lg text-sm text-[var(--label-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--control-primary)] focus:ring-opacity-20"
                    style={{ fontFamily: "DM Mono, monospace" }}
                  />
                  <span className="text-[13px] text-[var(--label-light)] leading-[18px]">
                    How many people a segment should have for you to see results
                  </span>
                </div>
              </div>
            </div>

            {/* Collaborator section */}
            <div className="p-6 border-t border-[var(--border)]">
              <div className="mb-4">
                <h3
                  className="text-xl font-medium text-black mb-1"
                  style={{ fontFamily: "Bitter, serif" }}
                >
                  Collaborator
                </h3>
                <p className="text-base text-[var(--label-light)]">
                  Let a colleague make changes to this survey
                </p>
              </div>

              <div className="relative">
                <select
                  value={selectedCollaborator}
                  onChange={(e) => setSelectedCollaborator(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[var(--border)] rounded-lg text-base text-[var(--label-light)] focus:outline-none focus:ring-1 focus:ring-[var(--control-primary)] focus:ring-opacity-20 appearance-none cursor-pointer"
                >
                  <option value="">Select colleague</option>
                  <option value="anna">Anna</option>
                  <option value="marcus">Marcus</option>
                  <option value="sofia">Sofia</option>
                </select>
                {/* Dropdown chevron */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--label-light)" strokeWidth="1.5">
                    <path d="M4 5.5L7 8.5L10 5.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Delete survey section */}
            <div className="p-6 border-t border-[var(--border)]">
              <div className="mb-4">
                <h3
                  className="text-xl font-medium text-black mb-1"
                  style={{ fontFamily: "Bitter, serif" }}
                >
                  Delete survey
                </h3>
                <p className="text-base text-[var(--label-light)]">
                  Deletes the questions and all results. If the survey has been sent,
                  recipients won&apos;t be able to answer.
                </p>
              </div>

              <button className="h-10 px-4 bg-white border border-[var(--border-negative)] text-[var(--label-negative)] text-base font-medium rounded-lg hover:bg-red-50 shadow-sm">
                Delete survey
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
