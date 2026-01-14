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
  const getCheckboxStyle = () => {
    if (progress === "completed") {
      return "bg-white border-2 border-[var(--control-primary)] flex items-center justify-center";
    }
    if (progress === "current") {
      return "bg-white border-2 border-[var(--control-primary)] flex items-center justify-center";
    }
    return "bg-white border-2 border-[var(--border-neutral)]";
  };

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
      className={`flex-col gap-2 items-center px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors ${isCurrent ? "flex" : "hidden lg:flex"}`}
    >
      <div className={`w-6 h-6 rounded-full hidden lg:flex ${getCheckboxStyle()}`}>
        {progress === "completed" && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7L6 11L12 3" stroke="var(--control-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {progress === "current" && (
          <div className="w-3 h-3 rounded-full bg-[var(--control-primary)]" />
        )}
      </div>
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
