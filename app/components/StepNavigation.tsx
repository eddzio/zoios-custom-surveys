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
}

const StepIndicator = ({ label, progress, onClick }: { label: string; progress: StepProgress; onClick?: () => void }) => {
  const getTextStyle = () => {
    if (progress === "completed" || progress === "current") {
      return "text-[var(--label-primary)] font-medium";
    }
    return "text-[var(--label-light)]";
  };

  const isCurrent = progress === "current";

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors ${isCurrent ? "flex" : "hidden lg:flex"}`}
    >
      {progress === "current" ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="var(--control-primary)" />
          <circle cx="12" cy="12" r="8" fill="white" />
          <circle cx="12" cy="12" r="5" fill="var(--control-primary)" />
        </svg>
      ) : progress === "completed" ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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

const RoundButton = ({ onClick, rotated = false }: { onClick?: () => void; rotated?: boolean }) => {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 flex items-center justify-center bg-white border border-[var(--border)] rounded-full shadow-sm hover:bg-gray-50 transition-colors"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className={rotated ? "rotate-180" : ""}
      >
        <path d="M8 12L4 7L8 2" stroke="var(--label-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
};

export const StepNavigation: React.FC<StepNavigationProps> = ({ steps, currentStep = 1, onBack, onForward, onStepClick }) => {
  const getForwardButtonLabel = () => {
    if (currentStep === 3) return "Send survey";
    return "Continue";
  };

  return (
    <div className="w-full bg-white border-b border-[var(--border)] flex items-center justify-between px-6 py-2">
      {/* Back button */}
      <div className="w-[120px]">
        {currentStep > 1 ? (
          <button
            onClick={onBack}
            className="h-10 px-4 bg-white border border-[var(--border)] text-[var(--label-primary)] text-base font-medium rounded-lg shadow-sm hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            Back
          </button>
        ) : (
          <RoundButton onClick={onBack} />
        )}
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-1">
        {steps.map((step, index) => (
          <StepIndicator
            key={index}
            label={step.label}
            progress={step.progress}
            onClick={() => onStepClick?.(index + 1)}
          />
        ))}
      </div>

      {/* Forward button */}
      <div className="w-[120px] flex justify-end">
        {currentStep < 4 ? (
          <button
            onClick={onForward}
            className="h-10 px-4 bg-[var(--control-primary)] text-white text-base font-medium rounded-lg shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            {getForwardButtonLabel()}
          </button>
        ) : (
          <RoundButton onClick={onForward} rotated={true} />
        )}
      </div>
    </div>
  );
};
