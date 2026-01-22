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
  const [showEmailPreview, setShowEmailPreview] = useState(false);

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
          <div className="bg-white rounded-2xl w-full max-w-[750px] max-h-[90vh] flex flex-col shadow-xl mx-4">
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

            {/* Modal Content - Apple Mail Mockup */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-[#f5f5f5] rounded-xl flex flex-col shadow-lg overflow-hidden border border-[var(--border)]">
                {/* macOS Window Title Bar */}
                <div className="bg-gradient-to-b from-[#e8e8e8] to-[#d8d8d8] px-4 py-2.5 flex items-center border-b border-[#c0c0c0]">
                  {/* Traffic light buttons */}
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e2463e]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#dea123]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1eab2f]" />
                  </div>
                  {/* Window title */}
                  <div className="flex-1 text-center">
                    <span className="text-[13px] font-medium text-[#4d4d4d]">{surveyTitle}</span>
                  </div>
                  {/* Spacer to balance traffic lights */}
                  <div className="w-[52px]" />
                </div>

                {/* Apple Mail Toolbar */}
                <div className="bg-gradient-to-b from-[#f8f8f8] to-[#ececec] px-3 py-1.5 flex items-center gap-1 border-b border-[#d1d1d1]">
                  {/* Reply button */}
                  <div className="p-1.5 rounded">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M8 4L3 9L8 14" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 9H12C14.7614 9 17 11.2386 17 14V16" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {/* Reply All button */}
                  <div className="p-1.5 rounded">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M8 4L3 9L8 14" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M11 4L6 9L11 14" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 9H12C14.2091 9 16 10.7909 16 13V16" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {/* Forward button */}
                  <div className="p-1.5 rounded">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M12 4L17 9L12 14" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 9H8C5.23858 9 3 11.2386 3 14V16" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="w-px h-5 bg-[#d1d1d1] mx-1" />
                  {/* Archive button */}
                  <div className="p-1.5 rounded">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect x="3" y="4" width="14" height="4" rx="1" stroke="#666" strokeWidth="1.5"/>
                      <path d="M4 8V15C4 15.5523 4.44772 16 5 16H15C15.5523 16 16 15.5523 16 15V8" stroke="#666" strokeWidth="1.5"/>
                      <path d="M8 11H12" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  {/* Delete button */}
                  <div className="p-1.5 rounded">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 6H15M8 6V4H12V6M6 6V16H14V6" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex-1" />
                  {/* Flag button */}
                  <div className="p-1.5 rounded">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 4V17M4 4L15 7L4 11" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                {/* Email Header Section */}
                <div className="bg-white px-5 py-4 border-b border-[#e5e5e5]">
                  {/* From */}
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-[13px] text-[#888] w-14 text-right shrink-0 pt-0.5">From:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[var(--brand-primary)] flex items-center justify-center">
                        <span className="text-white text-xs font-medium">Z</span>
                      </div>
                      <span className="text-[13px] text-[#333]">Zoios &lt;surveys@zoios.io&gt;</span>
                    </div>
                  </div>
                  {/* Subject */}
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-[13px] text-[#888] w-14 text-right shrink-0">Subject:</span>
                    <span className="text-[13px] text-[#333] font-medium">{surveyTitle}</span>
                  </div>
                  {/* Date */}
                  <div className="flex items-start gap-3">
                    <span className="text-[13px] text-[#888] w-14 text-right shrink-0">Date:</span>
                    <span className="text-[13px] text-[#888]">
                      {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                {/* Email Body */}
                <div className="bg-[#fffaf6]">
                  <div className="p-8">
                    <div className="max-w-[440px] mx-auto flex flex-col items-center text-center gap-5">
                      {/* Company Logo */}
                      <svg width="48" height="48" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 226.471C50 218.89 56.268 212.745 64 212.745H236C243.732 212.745 250 218.89 250 226.471V236.275C250 243.855 243.732 250 236 250H64C56.268 250 50 243.855 50 236.275V226.471Z" fill="#E35151"/>
                        <path d="M50.0026 63.7255C50.0026 56.1451 56.2707 50 64.0026 50H74.0026C81.7346 50 88.0026 56.1451 88.0026 63.7255V232.353C88.0026 239.933 81.7346 246.078 74.0026 246.078H64.0026C56.2707 246.078 50.0026 239.933 50.0026 232.353V63.7255Z" fill="#E35151"/>
                        <path d="M150.014 73.1437C154.337 66.8592 163.039 65.201 169.449 69.4399L177.739 74.9222C184.149 79.1611 185.841 87.6919 181.517 93.9763L85.336 233.775C81.0124 240.059 72.3109 241.717 65.9008 237.479L57.6104 231.996C51.2003 227.757 49.5089 219.227 53.8326 212.942L150.014 73.1437Z" fill="#E35151"/>
                        <path d="M217.177 136.409C224.127 133.086 232.508 135.915 235.898 142.729L240.281 151.54C243.671 158.353 240.785 166.57 233.835 169.894L79.2429 243.815C72.2934 247.138 63.912 244.309 60.5226 237.495L56.1388 228.684C52.7494 221.87 55.6353 213.653 62.5848 210.33L217.177 136.409Z" fill="#E35151"/>
                      </svg>

                      {/* Survey title */}
                      <h3
                        className="text-2xl font-semibold text-[var(--label-primary)]"
                        style={{ fontFamily: "Bitter, serif" }}
                      >
                        {surveyTitle}
                      </h3>

                      {/* Description */}
                      <p className="text-base text-[var(--label-light)] leading-relaxed">
                        {surveyDescription || "Please answer the following survey"}
                      </p>

                      {/* Answer survey button */}
                      <button className="h-11 px-8 bg-[var(--control-primary)] text-white text-base font-medium rounded-lg shadow-sm mt-2 hover:opacity-90 transition-opacity">
                        Answer survey
                      </button>
                    </div>
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
