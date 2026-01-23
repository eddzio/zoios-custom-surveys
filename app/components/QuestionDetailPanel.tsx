"use client"

import React, { useState } from "react";

type QuestionType = "Text" | "Scale" | "Yes-no" | "Multiple-choice";

type ScaleType = "0-5" | "0-10";

interface QuestionDetailProps {
  questionNumber: string;
  questionText: string;
  description: string;
  questionType: QuestionType;
  isRequired: boolean;
  showDeleteError?: boolean;
  // Scale-specific props
  scaleType?: ScaleType;
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
  // Multiple-choice specific props
  multipleChoiceOptions?: string[];
  // Move controls
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onQuestionChange?: (text: string) => void;
  onDescriptionChange?: (text: string) => void;
  onTypeChange?: (type: QuestionType) => void;
  onRequiredChange?: (required: boolean) => void;
  onScaleTypeChange?: (scaleType: ScaleType) => void;
  onScaleMinLabelChange?: (label: string) => void;
  onScaleMaxLabelChange?: (label: string) => void;
  onMultipleChoiceOptionsChange?: (options: string[]) => void;
  onCopy?: () => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const TypeSelector = ({
  selectedType,
  onTypeChange,
}: {
  selectedType: QuestionType;
  onTypeChange: (type: QuestionType) => void;
}) => {
  const types: QuestionType[] = ["Text", "Scale", "Yes-no", "Multiple-choice"];

  return (
    <div className="flex flex-col lg:flex-row gap-1 shrink-0">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onTypeChange(type)}
          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-stone-50 shrink-0"
        >
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              selectedType === type
                ? "border-[var(--control-primary)] bg-[var(--control-primary)]"
                : "border-[var(--border)] bg-white"
            }`}
          >
            {selectedType === type && (
              <div className="w-3 h-3 rounded-full bg-white" />
            )}
          </div>
          <span className="text-base text-[var(--label-primary)]">{type}</span>
        </button>
      ))}
    </div>
  );
};

const ToggleSwitch = ({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) => {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`w-[52px] h-[30px] rounded-full p-[3px] transition-colors ${
        enabled ? "bg-[var(--control-primary)]" : "bg-[var(--border)]"
      }`}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full transition-transform ${
          enabled ? "translate-x-[22px]" : "translate-x-0"
        }`}
      />
    </button>
  );
};

const ScaleTypeSelector = ({
  selectedScaleType,
  onScaleTypeChange,
}: {
  selectedScaleType: ScaleType;
  onScaleTypeChange: (type: ScaleType) => void;
}) => {
  const scaleTypes: { value: ScaleType; label: string }[] = [
    { value: "0-5", label: "0-5 scale" },
    { value: "0-10", label: "0-10 scale" },
  ];

  return (
    <div className="flex gap-1">
      {scaleTypes.map((type) => (
        <button
          key={type.value}
          onClick={() => onScaleTypeChange(type.value)}
          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-stone-50"
        >
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              selectedScaleType === type.value
                ? "border-[var(--control-primary)] bg-[var(--control-primary)]"
                : "border-[var(--border)] bg-white"
            }`}
          >
            {selectedScaleType === type.value && (
              <div className="w-3 h-3 rounded-full bg-white" />
            )}
          </div>
          <span className="text-base text-[var(--label-primary)]">{type.label}</span>
        </button>
      ))}
    </div>
  );
};

const ScaleOptions = ({
  scaleType,
  minLabel,
  maxLabel,
  onScaleTypeChange,
  onMinLabelChange,
  onMaxLabelChange,
}: {
  scaleType: ScaleType;
  minLabel: string;
  maxLabel: string;
  onScaleTypeChange: (type: ScaleType) => void;
  onMinLabelChange: (label: string) => void;
  onMaxLabelChange: (label: string) => void;
}) => {
  const dotCount = scaleType === "0-5" ? 3 : 8;
  const maxValue = scaleType === "0-5" ? 5 : 10;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-base text-[var(--label-light)]">
          Type of scale
        </label>
        <ScaleTypeSelector
          selectedScaleType={scaleType}
          onScaleTypeChange={onScaleTypeChange}
        />
      </div>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1 w-[256px]">
          <label className="text-base text-[var(--label-light)]">
            0 — Label minimum value*
          </label>
          <input
            type="text"
            value={minLabel}
            onChange={(e) => onMinLabelChange(e.target.value)}
            placeholder="e.g. Never"
            className="h-10 px-3 py-1 bg-white border border-[var(--border)] rounded-lg text-base text-[var(--label-primary)] placeholder:text-[var(--label-light)] focus:outline-none focus:ring-1 focus:ring-[var(--control-primary)] focus:ring-opacity-20"
          />
        </div>
        <div className="flex items-end gap-4 py-4 flex-1 justify-center">
          {Array.from({ length: dotCount }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[var(--border)]"
            />
          ))}
        </div>
        <div className="flex flex-col gap-1 w-[256px]">
          <label className="text-base text-[var(--label-light)]">
            {maxValue} — Label for maximum value*
          </label>
          <input
            type="text"
            value={maxLabel}
            onChange={(e) => onMaxLabelChange(e.target.value)}
            placeholder="e.g. Always"
            className="h-10 px-3 py-1 bg-white border border-[var(--border)] rounded-lg text-base text-[var(--label-primary)] placeholder:text-[var(--label-light)] focus:outline-none focus:ring-1 focus:ring-[var(--control-primary)] focus:ring-opacity-20"
          />
        </div>
      </div>
    </div>
  );
};

const MultipleChoiceOptions = ({
  options,
  onOptionsChange,
}: {
  options: string[];
  onOptionsChange: (options: string[]) => void;
}) => {
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onOptionsChange(newOptions);
  };

  const handleAddOption = () => {
    onOptionsChange([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 1) return; // Keep at least one option
    const newOptions = options.filter((_, i) => i !== index);
    onOptionsChange(newOptions);
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="text-base text-[var(--label-light)]">
        Answer options
      </label>
      <div className="flex flex-col gap-4">
        {options.map((option, index) => (
          <div key={index} className="flex gap-3 items-start">
            <div
              className="w-10 h-10 flex items-center justify-center bg-white border border-[var(--border)] rounded-full shadow-sm flex-shrink-0"
              style={{ fontFamily: 'DM Mono, monospace' }}
            >
              <span className="text-sm text-[var(--label-primary)]">
                {index + 1}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder="e.g. Never"
                className="h-10 w-[256px] px-3 py-1 bg-white border border-[var(--border)] rounded-lg text-base text-[var(--label-primary)] placeholder:text-[var(--label-light)] focus:outline-none focus:ring-1 focus:ring-[var(--control-primary)] focus:ring-opacity-20"
              />
              {options.length > 1 && (
                <button
                  onClick={() => handleRemoveOption(index)}
                  className="w-10 h-10 flex items-center justify-center text-[var(--label-light)] hover:text-[var(--label-primary)] hover:bg-stone-50 rounded-lg"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M2 2L12 12M12 2L2 12" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleAddOption}
        className="flex items-center gap-2 h-10 px-4 py-2 text-base font-medium text-[var(--control-primary)] hover:bg-stone-50 rounded-lg self-start"
      >
        + Add option
      </button>
    </div>
  );
};

export const QuestionDetailPanel: React.FC<QuestionDetailProps> = ({
  questionNumber,
  questionText,
  description,
  questionType,
  isRequired,
  showDeleteError = false,
  scaleType = "0-5",
  scaleMinLabel = "",
  scaleMaxLabel = "",
  multipleChoiceOptions = [""],
  canMoveUp = false,
  canMoveDown = false,
  onQuestionChange,
  onDescriptionChange,
  onTypeChange,
  onRequiredChange,
  onScaleTypeChange,
  onScaleMinLabelChange,
  onScaleMaxLabelChange,
  onMultipleChoiceOptionsChange,
  onCopy,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  return (
    <div className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden">
      {/* Delete Error Banner */}
      {showDeleteError && (
        <div className="bg-red-500 text-white px-6 py-3 text-sm font-medium">
          Surveys need to have at least one question
        </div>
      )}

      {/* Header */}
      <div className="border-b border-[var(--border)] flex flex-wrap items-start justify-between p-6 gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 shrink-0">
          <div
            className="w-10 h-10 flex items-center justify-center bg-white border border-[var(--border)] rounded-full shadow-sm shrink-0"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            <span className="text-sm text-[var(--label-primary)]">
              {questionNumber}
            </span>
          </div>
          <TypeSelector
            selectedType={questionType}
            onTypeChange={(type) => onTypeChange?.(type)}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 h-10">
            <ToggleSwitch
              enabled={isRequired}
              onChange={(enabled) => onRequiredChange?.(enabled)}
            />
            <span className="text-base text-[var(--label-primary)]">
              Required
            </span>
          </div>
          <button
            onClick={onCopy}
            className="w-10 h-10 flex items-center justify-center bg-white border border-[var(--border)] rounded-lg shadow-sm hover:bg-stone-50"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="var(--label-light)"
              strokeWidth="1.5"
            >
              <rect x="5" y="5" width="7" height="7" rx="1" />
              <path d="M2 9V2.5C2 2.22 2.22 2 2.5 2H9" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="w-10 h-10 flex items-center justify-center bg-white border border-[var(--border)] rounded-lg shadow-sm hover:bg-stone-50"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="var(--label-light)"
              strokeWidth="1.5"
            >
              <path d="M2 4h10M5 4V2.5C5 2.22 5.22 2 5.5 2h3c.28 0 .5.22.5.5V4M3.5 4l.5 8.5c0 .28.22.5.5.5h5c.28 0 .5-.22.5-.5L10.5 4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-1">
          <label className="text-base text-[var(--label-light)]">
            Question*
          </label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => onQuestionChange?.(e.target.value)}
            className="h-10 px-3 py-1 bg-white border border-[var(--border)] rounded-lg text-base text-[var(--label-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--control-primary)] focus:ring-opacity-20"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-base text-[var(--label-light)]">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => onDescriptionChange?.(e.target.value)}
            className="h-10 px-3 py-1 bg-white border border-[var(--border)] rounded-lg text-base text-[var(--label-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--control-primary)] focus:ring-opacity-20"
          />
        </div>
        {questionType === "Scale" && (
          <ScaleOptions
            scaleType={scaleType}
            minLabel={scaleMinLabel}
            maxLabel={scaleMaxLabel}
            onScaleTypeChange={(type) => onScaleTypeChange?.(type)}
            onMinLabelChange={(label) => onScaleMinLabelChange?.(label)}
            onMaxLabelChange={(label) => onScaleMaxLabelChange?.(label)}
          />
        )}
        {questionType === "Multiple-choice" && (
          <MultipleChoiceOptions
            options={multipleChoiceOptions}
            onOptionsChange={(options) => onMultipleChoiceOptionsChange?.(options)}
          />
        )}
        {/* Move Up/Down Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown?.();
            }}
            disabled={!canMoveDown}
            className={`w-10 h-10 flex items-center justify-center bg-white border border-[var(--border)] rounded-lg shadow-sm ${
              canMoveDown ? 'hover:bg-stone-50 cursor-pointer' : 'opacity-40 cursor-not-allowed'
            }`}
            title="Move down"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="var(--label-light)"
              strokeWidth="1.5"
            >
              <path d="M7 2v10M3 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp?.();
            }}
            disabled={!canMoveUp}
            className={`w-10 h-10 flex items-center justify-center bg-white border border-[var(--border)] rounded-lg shadow-sm ${
              canMoveUp ? 'hover:bg-stone-50 cursor-pointer' : 'opacity-40 cursor-not-allowed'
            }`}
            title="Move up"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="var(--label-light)"
              strokeWidth="1.5"
            >
              <path d="M7 12V2M3 6l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
