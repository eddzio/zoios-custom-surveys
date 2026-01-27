"use client"

import React from "react";

type StepProgress = "completed" | "current" | "uncompleted";

interface Step {
  label: string;
  progress: StepProgress;
}

interface StepNavigationProps {
  steps: Step[];
  currentStep?: number;
  onBack?: () => void;
  onForward?: () => void;
  onStepClick?: (stepNumber: number) => void;
  disabledSteps?: number[];
  onPreview?: () => void;
}

const StepIndicator = ({ label, progress, onClick, disabled }: { label: string; progress: StepProgress; onClick?: () => void; disabled?: boolean }) => {
  const getTextStyle = () => {
    if (disabled) {
      return "text-[var(--label-light)] opacity-50";
    }
    if (progress === "completed" || progress === "current") {
      return "text-[var(--label-primary)] font-medium";
    }
    return "text-[var(--label-light)]";
  };

  const isCurrent = progress === "current";

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shrink-0 ${isCurrent ? "flex" : "hidden lg:flex"} ${disabled ? "cursor-not-allowed opacity-60" : "hover:bg-[var(--bg-neutral)]"}`}
    >
      {progress === "current" ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="var(--control-primary)" />
          <circle cx="12" cy="12" r="8" fill="white" />
          <circle cx="12" cy="12" r="5" fill="var(--control-primary)" />
        </svg>
      ) : progress === "completed" ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={disabled ? "opacity-50" : ""}>
          <circle cx="12" cy="12" r="12" fill="var(--control-primary)" />
          <path d="M7 12L10.5 15.5L17 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" stroke="var(--border-neutral)" strokeWidth="2" />
        </svg>
      )}
      <p className={`text-base ${getTextStyle()} whitespace-nowrap`}>
        {label}
      </p>
    </button>
  );
};

export const StepNavigation: React.FC<StepNavigationProps> = ({ steps, currentStep = 1, onBack, onForward, onStepClick, disabledSteps = [], onPreview }) => {
  const getForwardButtonLabel = () => {
    if (currentStep === 3) return "Send survey";
    return "Continue";
  };

  const allStepsDisabled = disabledSteps.length > 0 && disabledSteps.includes(1) && disabledSteps.includes(2) && disabledSteps.includes(3);

  return (
    <div className="w-full bg-[var(--bg-card)] border-b border-[var(--border)] flex items-center justify-between px-6 py-2">
      {/* Preview button */}
      <div className="w-[120px] shrink-0">
        {!allStepsDisabled && onPreview && currentStep < 4 && (
          <button
            onClick={onPreview}
            className="h-10 px-4 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--label-primary)] text-base font-medium rounded-lg shadow-sm hover:bg-[var(--bg-neutral)] transition-colors whitespace-nowrap shrink-0"
          >
            Preview survey
          </button>
        )}
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-1 shrink-0">
        {steps.map((step, index) => (
          <StepIndicator
            key={index}
            label={step.label}
            progress={step.progress}
            onClick={() => onStepClick?.(index + 1)}
            disabled={disabledSteps.includes(index + 1)}
          />
        ))}
      </div>

      {/* Back and Forward buttons */}
      <div className="flex items-center gap-2 justify-end shrink-0">
        {allStepsDisabled ? (
          <div /> // Empty space for viewer-only mode
        ) : currentStep < 4 && (
          <>
            {currentStep > 1 && (
              <button
                onClick={onBack}
                className="h-10 px-4 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--label-primary)] text-base font-medium rounded-lg shadow-sm hover:bg-[var(--bg-neutral)] transition-colors whitespace-nowrap shrink-0"
              >
                Back
              </button>
            )}
            <button
              onClick={onForward}
              className="h-10 px-4 bg-[var(--control-primary)] text-[var(--control-secondary)] text-base font-medium rounded-lg shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
            >
              {getForwardButtonLabel()}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
