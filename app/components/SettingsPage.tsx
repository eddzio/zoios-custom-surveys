"use client"

import React, { useState } from "react";
import { toast } from "sonner";
import { QuestionItem } from "./QuestionListSidebar";
import { Collaborator } from "./SurveyListPage";

interface Recipient {
  id: number;
  name: string;
}

interface SettingsPageProps {
  questions: QuestionItem[];
  recipients: Recipient[];
  collaborators: Collaborator[];
  onEditQuestions: () => void;
  onEditRecipients: () => void;
  onCollaboratorsChange: (collaborators: Collaborator[]) => void;
  onDeleteSurvey: () => void;
  triggerSave: (callback?: () => void) => void;
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

// Available people to add as collaborators
const availablePeople = [
  { id: 101, name: "Johnny Pecorino" },
  { id: 102, name: "Frankie Bobby Boyle" },
  { id: 103, name: "Anna Schmidt" },
  { id: 104, name: "Marcus Chen" },
  { id: 105, name: "Sofia Rodriguez" },
];

export const SettingsPage: React.FC<SettingsPageProps> = ({
  questions,
  recipients,
  collaborators,
  onEditQuestions,
  onEditRecipients,
  onCollaboratorsChange,
  onDeleteSurvey,
  triggerSave,
}) => {
  const [minimumResponses, setMinimumResponses] = useState("3");
  const [minimumGroupSize, setMinimumGroupSize] = useState("5");

  const handleMinimumResponsesChange = (value: string) => {
    setMinimumResponses(value);
    triggerSave();
  };

  const handleMinimumGroupSizeChange = (value: string) => {
    setMinimumGroupSize(value);
    triggerSave();
  };

  const handleAddCollaborator = () => {
    // Find first person not already a collaborator
    const existingIds = collaborators.map((c) => c.id);
    const availablePerson = availablePeople.find((p) => !existingIds.includes(p.id));
    if (availablePerson) {
      onCollaboratorsChange([
        ...collaborators,
        { id: availablePerson.id, name: availablePerson.name, role: "viewer" as const },
      ]);
      triggerSave();
    }
  };

  const handleRemoveCollaborator = (id: number) => {
    const collaborator = collaborators.find((c) => c.id === id);
    onCollaboratorsChange(collaborators.filter((c) => c.id !== id));
    if (collaborator) {
      triggerSave(() => {
        toast.success(`${collaborator.name} removed`);
      });
    }
  };

  const handleChangeCollaboratorRole = (id: number, role: "editor" | "viewer") => {
    onCollaboratorsChange(
      collaborators.map((c) => (c.id === id ? { ...c, role } : c))
    );
    triggerSave();
  };

  const handleChangeCollaboratorPerson = (oldId: number, newId: number) => {
    const person = availablePeople.find((p) => p.id === newId);
    if (person) {
      onCollaboratorsChange(
        collaborators.map((c) =>
          c.id === oldId ? { ...c, id: person.id, name: person.name } : c
        )
      );
      triggerSave();
    }
  };

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
                    onChange={(e) => handleMinimumResponsesChange(e.target.value)}
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
                    onChange={(e) => handleMinimumGroupSizeChange(e.target.value)}
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
                  Lets colleagues make changes to this survey. Editors can change the questions and recipients. Viewers can only see the results.
                </p>
              </div>

              {/* Collaborator list */}
              <div className="flex flex-col gap-3">
                {collaborators.map((collaborator) => {
                  const existingIds = collaborators.filter((c) => c.id !== collaborator.id).map((c) => c.id);
                  const availableForSelect = availablePeople.filter(
                    (p) => p.id === collaborator.id || !existingIds.includes(p.id)
                  );

                  return (
                    <div key={collaborator.id} className="flex items-end gap-3">
                      {/* Person select */}
                      <div className="flex-1 flex flex-col gap-1">
                        <label className="text-base text-[var(--label-primary)]">
                          Person
                        </label>
                        <div className="relative">
                          <select
                            value={collaborator.id}
                            onChange={(e) =>
                              handleChangeCollaboratorPerson(
                                collaborator.id,
                                Number(e.target.value)
                              )
                            }
                            className="w-full h-10 px-3 bg-white border border-[var(--border)] rounded-lg text-base text-[var(--label-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--control-primary)] focus:ring-opacity-20 appearance-none cursor-pointer"
                          >
                            {availableForSelect.map((person) => (
                              <option key={person.id} value={person.id}>
                                {person.name}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--label-light)" strokeWidth="1.5">
                              <path d="M4 5.5L7 8.5L10 5.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Role select */}
                      <div className="w-[140px] flex flex-col gap-1">
                        <label className="text-base text-[var(--label-primary)]">
                          Role
                        </label>
                        <div className="relative">
                          <select
                            value={collaborator.role}
                            onChange={(e) =>
                              handleChangeCollaboratorRole(
                                collaborator.id,
                                e.target.value as "editor" | "viewer"
                              )
                            }
                            className="w-full h-10 px-3 bg-white border border-[var(--border)] rounded-lg text-base text-[var(--label-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--control-primary)] focus:ring-opacity-20 appearance-none cursor-pointer"
                          >
                            <option value="editor">Editor</option>
                            <option value="viewer">Viewer</option>
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--label-light)" strokeWidth="1.5">
                              <path d="M4 5.5L7 8.5L10 5.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={() => handleRemoveCollaborator(collaborator.id)}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-[var(--border-negative)] text-[var(--label-negative)] rounded-full hover:bg-red-50 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M3 7H11" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  );
                })}

                {/* Add collaborator button */}
                {collaborators.length < availablePeople.length && (
                  <button
                    onClick={handleAddCollaborator}
                    className="text-base text-[var(--label-primary)] font-medium hover:text-[var(--control-primary)] transition-colors self-start mt-1"
                  >
                    + Add collaborator
                  </button>
                )}
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

              <button
                onClick={onDeleteSurvey}
                className="h-10 px-4 bg-white border border-[var(--border-negative)] text-[var(--label-negative)] text-base font-medium rounded-lg hover:bg-red-50 shadow-sm"
              >
                Delete survey
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
