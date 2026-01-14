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
    <div className="flex items-center gap-1 px-2 py-1 bg-[#f5f5f4] border border-[var(--border)] rounded">
      <span className="text-sm text-[var(--label-light)] truncate max-w-[120px]">
        {label}
      </span>
      <button className="w-5 h-5 flex items-center justify-center text-[var(--label-light)] hover:text-[var(--label-primary)]">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 2L10 10M10 2L2 10" strokeLinecap="round" />
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
  const [minimumResponses, setMinimumResponses] = useState(2);
  const [minimumGroupSize, setMinimumGroupSize] = useState(3);
  const [selectedCollaborator, setSelectedCollaborator] = useState("");

  return (
    <div className="flex-1 flex overflow-hidden bg-[#f5f5f4]">
      <div className="flex-1 flex gap-4 p-6 overflow-y-auto justify-center">
        {/* Left column - Settings */}
        <div className="flex-1 flex flex-col gap-4 max-w-[500px]">
          {/* Anonymity settings */}
          <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
            <h3
              className="text-lg font-medium text-[var(--label-primary)] mb-1"
              style={{ fontFamily: "Bitter, serif" }}
            >
              Anonymity settings
            </h3>
            <p className="text-base text-[var(--label-light)] mb-4">
              Let a colleague make changes to this survey
            </p>

            {/* Minimum responses */}
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 flex items-center justify-center bg-[#f5f5f4] rounded-full text-sm text-[var(--label-primary)]"
                  style={{ fontFamily: "DM Mono, monospace" }}
                >
                  {minimumResponses}
                </div>
                <span className="text-base text-[var(--label-primary)]">
                  Minimum responses
                </span>
              </div>
              <button className="h-10 px-4 bg-white border border-[var(--border)] text-[var(--label-primary)] text-sm font-medium rounded-lg hover:bg-gray-50">
                Edit
              </button>
            </div>

            {/* Minimum group size */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 flex items-center justify-center bg-[#f5f5f4] rounded-full text-sm text-[var(--label-primary)]"
                  style={{ fontFamily: "DM Mono, monospace" }}
                >
                  {minimumGroupSize}
                </div>
                <span className="text-base text-[var(--label-primary)]">
                  Minimum segment or group size
                </span>
              </div>
              <button className="h-10 px-4 bg-white border border-[var(--border)] text-[var(--label-primary)] text-sm font-medium rounded-lg hover:bg-gray-50">
                Edit
              </button>
            </div>
          </div>

          {/* Collaborators */}
          <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
            <h3
              className="text-lg font-medium text-[var(--label-primary)] mb-1"
              style={{ fontFamily: "Bitter, serif" }}
            >
              Collaborators
            </h3>
            <p className="text-base text-[var(--label-light)] mb-4">
              Let a colleague make changes to this survey
            </p>

            <select
              value={selectedCollaborator}
              onChange={(e) => setSelectedCollaborator(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-[var(--border)] rounded-lg text-base text-[var(--label-light)] focus:outline-none focus:ring-1 focus:ring-[var(--control-primary)] focus:ring-opacity-20"
            >
              <option value="">Select colleague</option>
              <option value="anna">Anna</option>
              <option value="marcus">Marcus</option>
              <option value="sofia">Sofia</option>
            </select>
          </div>

          {/* Delete survey */}
          <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
            <h3
              className="text-lg font-medium text-[var(--label-primary)] mb-1"
              style={{ fontFamily: "Bitter, serif" }}
            >
              Delete survey
            </h3>
            <p className="text-base text-[var(--label-light)] mb-4">
              Deletes the questions and all results. If the survey has been sent,
              recipients won&apos;t be able to answer.
            </p>

            <button className="h-10 px-4 bg-white border border-red-500 text-red-500 text-sm font-medium rounded-lg hover:bg-red-50">
              Delete survey
            </button>
          </div>
        </div>

        {/* Right column - Summary */}
        <div className="flex-1 flex flex-col gap-4 max-w-[500px]">
          {/* Questions summary */}
          <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-lg font-medium text-[var(--label-primary)]"
                style={{ fontFamily: "Bitter, serif" }}
              >
                Questions · {questions.length}
              </h3>
              <button
                onClick={onEditQuestions}
                className="h-10 px-4 bg-white border border-[var(--border)] text-[var(--label-primary)] text-sm font-medium rounded-lg hover:bg-gray-50"
              >
                Edit
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
              {questions.map((question, index) => (
                <div key={question.id} className="flex gap-2">
                  <span
                    className="text-sm text-[var(--label-light)] w-5 shrink-0"
                    style={{ fontFamily: "DM Mono, monospace" }}
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm text-[var(--label-primary)] line-clamp-1">
                    {question.questionText || `Question ${index + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recipients summary */}
          <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-lg font-medium text-[var(--label-primary)]"
                style={{ fontFamily: "Bitter, serif" }}
              >
                Recipients · {recipients.length}
              </h3>
              <button
                onClick={onEditRecipients}
                className="h-10 px-4 bg-white border border-[var(--border)] text-[var(--label-primary)] text-sm font-medium rounded-lg hover:bg-gray-50"
              >
                Edit
              </button>
            </div>

            <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto">
              {recipients.map((recipient) => (
                <Tag key={recipient.id} label={recipient.name} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
