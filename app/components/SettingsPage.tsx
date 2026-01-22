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
  surveyTitle: string;
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
  surveyTitle,
  onEditQuestions,
  onEditRecipients,
  onCollaboratorsChange,
  onDeleteSurvey,
  triggerSave,
}) => {
  const [minimumResponses, setMinimumResponses] = useState("3");
  const [minimumGroupSize, setMinimumGroupSize] = useState("5");
  const [surveyDescription, setSurveyDescription] = useState("");
  const [surveyImage, setSurveyImage] = useState<string | null>(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleMinimumResponsesChange = (value: string) => {
    setMinimumResponses(value);
    triggerSave();
  };

  const handleMinimumGroupSizeChange = (value: string) => {
    setMinimumGroupSize(value);
    triggerSave();
  };

  const handleDescriptionChange = (value: string) => {
    setSurveyDescription(value);
    triggerSave();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "image/png") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSurveyImage(event.target?.result as string);
        triggerSave();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSurveyImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      triggerSave(() => {
        toast.success(`${availablePerson.name} added as collaborator`);
      });
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
                  className="h-10 px-4 bg-white border border-[var(--border)] text-[var(--label-primary)] text-base font-medium rounded-lg hover:bg-gray-50 whitespace-nowrap shrink-0"
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
                  className="h-10 px-4 bg-white border border-[var(--border)] text-[var(--label-primary)] text-base font-medium rounded-lg hover:bg-gray-50 whitespace-nowrap shrink-0"
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

            {/* Survey Description section */}
            <div className="p-6 border-t border-[var(--border)]">
              <div className="mb-4">
                <h3
                  className="text-xl font-medium text-black mb-1"
                  style={{ fontFamily: "Bitter, serif" }}
                >
                  Survey description
                </h3>
                <p className="text-base text-[var(--label-light)]">
                  Customize the email that will be sent to recipients
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {/* Description textarea */}
                <div className="flex flex-col gap-1">
                  <label className="text-base text-[var(--label-primary)]">
                    Description
                  </label>
                  <textarea
                    value={surveyDescription}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    placeholder="Please answer the following survey"
                    rows={4}
                    className="px-3 py-2 bg-white border border-[var(--border)] rounded-lg text-base text-[var(--label-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--control-primary)] focus:ring-opacity-20 resize-none"
                  />
                  <span className="text-[13px] text-[var(--label-light)] leading-[18px]">
                    This text will appear in the email sent to recipients
                  </span>
                </div>

                {/* Image upload */}
                <div className="flex flex-col gap-1">
                  <label className="text-base text-[var(--label-primary)]">
                    Image (PNG)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="survey-image-upload"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="h-10 px-4 bg-white border border-[var(--border)] text-[var(--label-primary)] text-base font-medium rounded-lg hover:bg-gray-50 whitespace-nowrap shrink-0"
                    >
                      {surveyImage ? "Change image" : "Upload image"}
                    </button>
                    {surveyImage && (
                      <button
                        onClick={handleRemoveImage}
                        className="h-10 px-4 bg-white border border-[var(--border)] text-[var(--label-negative)] text-base font-medium rounded-lg hover:bg-red-50 whitespace-nowrap shrink-0"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {surveyImage && (
                    <div className="mt-2 relative w-fit">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={surveyImage}
                        alt="Survey preview"
                        className="max-w-[200px] max-h-[120px] rounded-lg border border-[var(--border)] object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Preview button */}
                <button
                  onClick={() => setShowEmailPreview(true)}
                  className="h-10 px-4 bg-white border border-[var(--border)] text-[var(--label-primary)] text-base font-medium rounded-lg hover:bg-gray-50 whitespace-nowrap shrink-0 self-start"
                >
                  Preview email
                </button>
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
                className="h-10 px-4 bg-white border border-[var(--border-negative)] text-[var(--label-negative)] text-base font-medium rounded-lg hover:bg-red-50 shadow-sm whitespace-nowrap shrink-0"
              >
                Delete survey
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Email Preview Modal */}
      {showEmailPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-[600px] max-h-[90vh] flex flex-col shadow-xl mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h2
                className="text-xl font-medium text-[var(--label-primary)]"
                style={{ fontFamily: "Bitter, serif" }}
              >
                Email preview
              </h2>
              <button
                onClick={() => setShowEmailPreview(false)}
                className="w-10 h-10 flex items-center justify-center text-[var(--label-light)] hover:text-[var(--label-primary)] hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 5L15 15M15 5L5 15" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Modal Content - Email Preview */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Fake email container */}
              <div className="border border-[var(--border)] rounded-lg overflow-hidden">
                {/* Email header */}
                <div className="bg-[var(--bg-neutral)] px-4 py-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2 text-sm text-[var(--label-light)]">
                    <span className="font-medium text-[var(--label-primary)]">Subject:</span>
                    <span>{surveyTitle}</span>
                  </div>
                </div>

                {/* Email body */}
                <div className="p-6 bg-white">
                  <div className="max-w-[400px] mx-auto flex flex-col items-center text-center gap-4">
                    {/* Survey title */}
                    <h3
                      className="text-2xl font-semibold text-[var(--label-primary)]"
                      style={{ fontFamily: "Bitter, serif" }}
                    >
                      {surveyTitle}
                    </h3>

                    {/* Description */}
                    <p className="text-base text-[var(--label-light)]">
                      {surveyDescription || "Please answer the following survey"}
                    </p>

                    {/* Image (only if uploaded) */}
                    {surveyImage && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={surveyImage}
                        alt="Survey"
                        className="max-w-full rounded-lg"
                      />
                    )}

                    {/* Answer survey button */}
                    <button className="h-10 px-6 bg-[var(--control-primary)] text-white text-base font-medium rounded-lg shadow-sm mt-2">
                      Answer survey
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-[var(--border)]">
              <button
                onClick={() => setShowEmailPreview(false)}
                className="h-10 px-4 bg-white border border-[var(--border)] text-[var(--label-primary)] text-base font-medium rounded-lg hover:bg-gray-50 whitespace-nowrap shrink-0"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
