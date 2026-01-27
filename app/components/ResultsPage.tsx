"use client"

import React, { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { QuestionItem } from "./QuestionListSidebar";

interface ResultsPageProps {
  questions: QuestionItem[];
}

// Dimension definitions
const DIMENSIONS = {
  department: {
    label: "Department",
    segments: ["Engineering", "Product", "Design", "Marketing", "Sales", "Operations", "HR", "Finance"],
  },
  location: {
    label: "Location",
    segments: ["San Francisco", "New York", "London", "Berlin", "Tokyo", "Remote"],
  },
  tenure: {
    label: "Tenure",
    segments: ["< 1 year", "1-2 years", "2-5 years", "5+ years"],
  },
  level: {
    label: "Level",
    segments: ["Individual Contributor", "Manager", "Senior Manager", "Director", "VP+"],
  },
} as const;

type DimensionKey = keyof typeof DIMENSIONS;

interface Employee {
  id: number;
  name: string;
  department: string;
  location: string;
  tenure: string;
  level: string;
}

// Generate 60 fake employees
const generateEmployees = (): Employee[] => {
  const firstNames = [
    "Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Jamie", "Quinn", "Avery", "Sage",
    "Dakota", "Reese", "Skyler", "Charlie", "Drew", "Emery", "Finley", "Hayden", "Kennedy", "Lane",
    "Marley", "Noah", "Oakley", "Parker", "Peyton", "Phoenix", "Remy", "River", "Rowan", "Sawyer",
    "Spencer", "Sydney", "Tatum", "Terry", "Val", "Blake", "Cameron", "Devon", "Ellis", "Francis",
    "stone", "Harper", "Indie", "Jesse", "Kai", "Lee", "Logan", "Micah", "Noel", "Ollie",
    "Pat", "Ray", "Robin", "Sam", "Shannon", "Shawn", "Toby", "Tracy", "Winter", "Zion",
  ];

  const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
  ];

  const employees: Employee[] = [];

  for (let i = 0; i < 60; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / 2) % lastNames.length];

    employees.push({
      id: i + 1,
      name: `${firstName} ${lastName}`,
      department: DIMENSIONS.department.segments[Math.floor(Math.random() * DIMENSIONS.department.segments.length)],
      location: DIMENSIONS.location.segments[Math.floor(Math.random() * DIMENSIONS.location.segments.length)],
      tenure: DIMENSIONS.tenure.segments[Math.floor(Math.random() * DIMENSIONS.tenure.segments.length)],
      level: DIMENSIONS.level.segments[Math.floor(Math.random() * DIMENSIONS.level.segments.length)],
    });
  }

  return employees;
};

const EMPLOYEES = generateEmployees();

// Checkbox types and components
type CheckboxState = "unchecked" | "checked" | "partial";

const CheckboxIcon = ({ state }: { state: CheckboxState }) => {
  const getCheckboxStyle = () => {
    if (state === "checked" || state === "partial") {
      return "bg-[var(--control-primary)] border-[var(--control-primary)]";
    }
    return "bg-white border-[var(--border)]";
  };

  return (
    <div
      className={`w-5 h-5 rounded flex items-center justify-center border-2 shrink-0 ${getCheckboxStyle()}`}
    >
      {state === "checked" && (
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 7L6 11L12 3"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {state === "partial" && (
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
          <path
            d="M3 7H11"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
};

// Dimension Row Component with checkbox
const DimensionRow = ({
  state,
  label,
  isSelected,
  onSelect,
  onToggle,
}: {
  state: CheckboxState;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  onToggle: () => void;
}) => {
  return (
    <div
      className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-stone-50 ${
        isSelected ? "bg-[var(--bg-neutral)]" : ""
      }`}
    >
      <button onClick={onToggle} className="shrink-0">
        <CheckboxIcon state={state} />
      </button>
      <button
        onClick={onSelect}
        className="flex-1 flex items-center gap-3 text-left"
      >
        <span className="flex-1 text-base text-[var(--label-primary)]">{label}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className={isSelected ? "text-[var(--control-primary)]" : "text-[var(--label-light)]"}
        >
          <path
            d="M5 2L10 7L5 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

// Segment Row Component with checkbox
const SegmentRow = ({
  label,
  state,
  onToggle,
}: {
  label: string;
  state: CheckboxState;
  onToggle: () => void;
}) => {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-stone-50 text-left"
    >
      <CheckboxIcon state={state} />
      <span className="text-base text-[var(--label-primary)]">{label}</span>
    </button>
  );
};

// Dummy data generation functions - now accept respondent count
function generateTextResponses(respondentCount: number): string[] {
  const allResponses = [
    "The event was very well organized and informative.",
    "I learned a lot about team collaboration techniques.",
    "The venue was excellent, great location and facilities.",
    "Would have preferred more interactive sessions.",
    "Networking opportunities were valuable.",
    "The speakers were engaging and knowledgeable.",
    "Food and accommodation exceeded expectations.",
    "Schedule was a bit too packed, needed more breaks.",
    "Great team bonding experience overall.",
    "Looking forward to the next one!",
    "Really appreciated the attention to detail.",
    "The breakout sessions were particularly useful.",
    "Could use more time for Q&A.",
    "Excellent catering and refreshments.",
    "The agenda was well-structured.",
    "Loved the collaborative workshop format.",
    "Would recommend to colleagues.",
    "Very insightful presentations.",
    "Good balance of work and social activities.",
    "The facilitators were professional and helpful.",
  ];

  // Return a subset based on respondent count
  const count = Math.min(respondentCount, allResponses.length);
  return allResponses.slice(0, count);
}

function generateYesNoResponses(respondentCount: number): { yes: number; no: number } {
  // Distribute responses based on respondent count
  const yesRatio = 0.6 + Math.random() * 0.25; // 60-85% yes
  const yes = Math.round(respondentCount * yesRatio);
  const no = respondentCount - yes;
  return { yes, no };
}

function generateScaleResponses(scaleType: "0-5" | "0-10", respondentCount: number): number[] {
  const max = scaleType === "0-5" ? 5 : 10;
  const responses: number[] = [];

  for (let i = 0; i < respondentCount; i++) {
    // Weighted towards higher scores (bell curve shifted right)
    const rand = Math.random();
    let value: number;
    if (rand < 0.05) value = 0;
    else if (rand < 0.1) value = Math.floor(max * 0.2);
    else if (rand < 0.2) value = Math.floor(max * 0.4);
    else if (rand < 0.4) value = Math.floor(max * 0.6);
    else if (rand < 0.7) value = Math.floor(max * 0.8);
    else value = max;
    responses.push(value);
  }
  return responses;
}

function generateMultipleChoiceResponses(options: string[], respondentCount: number): Record<string, number> {
  const result: Record<string, number> = {};
  const validOptions = options.filter(o => o.trim());

  // Distribute respondents across options (each person picks one)
  let remaining = respondentCount;
  validOptions.forEach((option, index) => {
    if (index === validOptions.length - 1) {
      result[option] = remaining;
    } else {
      const share = Math.floor(remaining * (0.1 + Math.random() * 0.4));
      result[option] = share;
      remaining -= share;
    }
  });

  return result;
}

// Calculate median
function calculateMedian(numbers: number[]): number {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

// Calculate average
function calculateAverage(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

// Text Summary Card Content Component (no wrapper)
const TextSummaryCardContent = ({ responses }: { responses: string[] }) => {
  const summaryPoints = [
    "Overall positive sentiment about the event organization and venue",
    "Strong appreciation for networking and team bonding opportunities",
    "Speakers and content were well-received by participants",
    "Some feedback suggests desire for more breaks and interactive sessions",
  ];

  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2L8.5 5.5L12 6L9.5 8.5L10 12L7 10.5L4 12L4.5 8.5L2 6L5.5 5.5L7 2Z" fill="white" />
          </svg>
        </div>
        <h4 className="text-base font-medium text-[var(--label-primary)]">AI Summary</h4>
      </div>
      <ul className="space-y-2 mb-4">
        {summaryPoints.map((point, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-[var(--label-primary)]">
            <span className="text-[var(--accent)] mt-1">•</span>
            {point}
          </li>
        ))}
      </ul>
      <p className="text-xs text-[var(--label-light)]">Based on {responses.length} responses</p>
    </>
  );
};

// Donut Chart Content Component for Yes/No (no wrapper)
const YesNoDonutChartContent = ({ data }: { data: { yes: number; no: number } }) => {
  const total = data.yes + data.no;
  const yesPercentage = total > 0 ? Math.round((data.yes / total) * 100) : 0;

  const chartData = [
    { name: "Yes", value: data.yes },
    { name: "No", value: data.no },
  ];

  const COLORS = ["#292524", "#d6d3d1"];

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="relative w-[180px] h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-4xl font-medium text-[var(--label-primary)]"
              style={{ fontFamily: "DM Mono, monospace" }}
            >
              {yesPercentage}%
            </span>
            <span className="text-sm text-[var(--label-light)]">Yes</span>
          </div>
        </div>
      </div>
      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#292524]" />
          <span className="text-sm text-[var(--label-primary)]">Yes ({data.yes})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#d6d3d1]" />
          <span className="text-sm text-[var(--label-light)]">No ({data.no})</span>
        </div>
      </div>
    </>
  );
};

// Distribution Bar Chart Content for Scale (no wrapper)
const ScaleBarChartContent = ({
  responses,
  scaleType,
}: {
  responses: number[];
  scaleType: "0-5" | "0-10";
}) => {
  const max = scaleType === "0-5" ? 5 : 10;
  const median = responses.length > 0 ? calculateMedian(responses) : 0;
  const average = responses.length > 0 ? calculateAverage(responses) : 0;

  // Build distribution data
  const distribution: Record<number, number> = {};
  for (let i = 0; i <= max; i++) {
    distribution[i] = 0;
  }
  responses.forEach((val) => {
    distribution[val] = (distribution[val] || 0) + 1;
  });

  const chartData = Object.entries(distribution).map(([key, value]) => ({
    score: key,
    count: value,
  }));

  return (
    <>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
            <XAxis
              dataKey="score"
              tick={{ fontSize: 12, fill: "#79716b", fontFamily: "DM Mono, monospace" }}
              axisLine={{ stroke: "#e7e5e4" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#79716b", fontFamily: "DM Mono, monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e7e5e4",
                borderRadius: "8px",
                fontSize: "12px",
                fontFamily: "DM Mono, monospace",
              }}
            />
            <Bar dataKey="count" fill="#292524" radius={[4, 4, 0, 0]} />
            <ReferenceLine
              y={distribution[Math.round(median)] || 0}
              stroke="#f5855c"
              strokeDasharray="5 5"
              label={{
                value: `Median: ${median.toFixed(1)}`,
                position: "right",
                fontSize: 11,
                fill: "#f5855c",
                fontFamily: "DM Mono, monospace",
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Stats */}
      <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-[var(--border)]">
        <div className="text-center">
          <span
            className="text-2xl font-semibold text-[var(--label-primary)] block"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            {median.toFixed(1)}
          </span>
          <span className="text-xs text-[var(--label-light)]">Median</span>
        </div>
        <div className="text-center">
          <span
            className="text-2xl font-semibold text-[var(--label-primary)] block"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            {average.toFixed(1)}
          </span>
          <span className="text-xs text-[var(--label-light)]">Average</span>
        </div>
        <div className="text-center">
          <span
            className="text-2xl font-semibold text-[var(--label-primary)] block"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            {responses.length}
          </span>
          <span className="text-xs text-[var(--label-light)]">Responses</span>
        </div>
      </div>
    </>
  );
};

// Vertical Bar Chart Content for Multiple Choice (no wrapper)
const MultipleChoiceBarChartContent = ({ data }: { data: Record<string, number> }) => {
  const chartData = Object.entries(data).map(([option, count]) => ({
    option: option.length > 20 ? option.substring(0, 20) + "..." : option,
    fullOption: option,
    count,
  }));

  const total = Object.values(data).reduce((a, b) => a + b, 0);

  return (
    <>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
            <XAxis
              dataKey="option"
              tick={{ fontSize: 11, fill: "#79716b" }}
              axisLine={{ stroke: "#e7e5e4" }}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#79716b", fontFamily: "DM Mono, monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e7e5e4",
                borderRadius: "8px",
                fontSize: "12px",
                fontFamily: "DM Mono, monospace",
              }}
              formatter={(value) => {
                const numValue = value as number;
                return [`${numValue} (${total > 0 ? Math.round((numValue / total) * 100) : 0}%)`, "Responses"];
              }}
            />
            <Bar dataKey="count" fill="#292524" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-[var(--label-light)] text-center mt-2">
        {total} total responses
      </p>
    </>
  );
};

// Main Results Page Component
export const ResultsPage: React.FC<ResultsPageProps> = ({ questions }) => {
  const [selectedDimension, setSelectedDimension] = useState<DimensionKey | null>(null);
  const [selectedSegments, setSelectedSegments] = useState<Set<string>>(new Set());

  // Calculate dimension checkbox state
  const getDimensionState = (dimensionKey: DimensionKey): CheckboxState => {
    const segments = DIMENSIONS[dimensionKey].segments;
    const selectedCount = segments.filter((s) => selectedSegments.has(`${dimensionKey}:${s}`)).length;

    if (selectedCount === 0) return "unchecked";
    if (selectedCount === segments.length) return "checked";
    return "partial";
  };

  // Handle dimension checkbox toggle (select all / deselect all)
  const handleDimensionToggle = (dimensionKey: DimensionKey) => {
    const state = getDimensionState(dimensionKey);
    const segments = DIMENSIONS[dimensionKey].segments;

    setSelectedSegments((prev) => {
      const next = new Set(prev);
      if (state === "checked" || state === "partial") {
        // Deselect all segments in this dimension
        segments.forEach((s) => next.delete(`${dimensionKey}:${s}`));
      } else {
        // Select all segments in this dimension
        segments.forEach((s) => next.add(`${dimensionKey}:${s}`));
      }
      return next;
    });
  };

  // Handle segment checkbox toggle
  const handleSegmentToggle = (dimensionKey: DimensionKey, segment: string) => {
    const key = `${dimensionKey}:${segment}`;
    setSelectedSegments((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Handle Select All for current dimension
  const handleSelectAll = () => {
    if (!selectedDimension) return;

    const segments = DIMENSIONS[selectedDimension].segments;
    const allSelected = segments.every((s) => selectedSegments.has(`${selectedDimension}:${s}`));

    setSelectedSegments((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        segments.forEach((s) => next.delete(`${selectedDimension}:${s}`));
      } else {
        segments.forEach((s) => next.add(`${selectedDimension}:${s}`));
      }
      return next;
    });
  };

  // Get Select All state for current dimension
  const getSelectAllState = (): CheckboxState => {
    if (!selectedDimension) return "unchecked";
    return getDimensionState(selectedDimension);
  };

  // Filter employees based on selected segments
  const filteredEmployees = useMemo(() => {
    if (selectedSegments.size === 0) {
      return EMPLOYEES;
    }

    return EMPLOYEES.filter((emp) => {
      // Check if employee matches any selected segment
      for (const key of selectedSegments) {
        const [dimension, segment] = key.split(":");
        if (emp[dimension as DimensionKey] === segment) {
          return true;
        }
      }
      return false;
    });
  }, [selectedSegments]);

  // Generate dummy data for all questions (memoized to prevent regeneration)
  const questionResponses = useMemo(() => {
    const respondentCount = filteredEmployees.length;

    return questions.map((question) => {
      let responses: unknown;

      switch (question.questionType) {
        case "Text":
          responses = generateTextResponses(respondentCount);
          break;
        case "Yes-no":
          responses = generateYesNoResponses(respondentCount);
          break;
        case "Scale":
          responses = generateScaleResponses(question.scaleType || "0-5", respondentCount);
          break;
        case "Multiple-choice":
          responses = generateMultipleChoiceResponses(
            question.multipleChoiceOptions || ["Option A", "Option B", "Option C"],
            respondentCount
          );
          break;
        default:
          responses = null;
      }

      return {
        questionId: question.id,
        questionNumber: question.number,
        questionText: question.questionText || `Question ${question.number}`,
        description: question.description || "",
        questionType: question.questionType,
        scaleType: question.scaleType,
        multipleChoiceOptions: question.multipleChoiceOptions,
        responses,
      };
    });
  }, [questions, filteredEmployees.length]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-neutral)]">
      {/* Charts container */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-[900px] mx-auto space-y-6">
            {/* Filter bar */}
            <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                <h3
                  className="text-base font-medium text-[var(--label-primary)]"
                  style={{ fontFamily: "Bitter, serif" }}
                >
                  Filter results
                </h3>
                <div className="text-sm text-[var(--label-light)]" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {filteredEmployees.length} of {EMPLOYEES.length} respondents
                </div>
              </div>

              {/* Two-column layout */}
              <div className="flex">
                {/* Dimensions column */}
                <div className="flex-1 p-4 border-r border-[var(--border)]">
                  <p className="text-sm text-[var(--label-light)] mb-2">Dimensions</p>
                  <div className="flex flex-col">
                    {Object.entries(DIMENSIONS).map(([key, { label }]) => (
                      <DimensionRow
                        key={key}
                        state={getDimensionState(key as DimensionKey)}
                        label={label}
                        isSelected={selectedDimension === key}
                        onSelect={() => setSelectedDimension(key as DimensionKey)}
                        onToggle={() => handleDimensionToggle(key as DimensionKey)}
                      />
                    ))}
                  </div>
                </div>

                {/* Segments column */}
                <div className="flex-1 p-4">
                  <p className="text-sm text-[var(--label-light)] mb-2">Segments</p>
                  {selectedDimension ? (
                    <div className="flex flex-col">
                      <SegmentRow
                        label="Select all"
                        state={getSelectAllState()}
                        onToggle={handleSelectAll}
                      />
                      {DIMENSIONS[selectedDimension].segments.map((segment) => (
                        <SegmentRow
                          key={segment}
                          label={segment}
                          state={selectedSegments.has(`${selectedDimension}:${segment}`) ? "checked" : "unchecked"}
                          onToggle={() => handleSegmentToggle(selectedDimension, segment)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--label-light)] p-2">
                      Select a dimension to see segments
                    </p>
                  )}
                </div>
              </div>
            </div>

            {questionResponses.map((qr, index) => (
              <div key={qr.questionId} className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">
                {/* Question header - inside card */}
                <div className="flex items-start gap-3 p-5 border-b border-[var(--border)]">
                  <span
                    className="text-base text-[var(--label-light)] w-6 shrink-0 pt-0.5"
                    style={{ fontFamily: "DM Mono, monospace" }}
                  >
                    {qr.questionNumber}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-[var(--label-primary)]">
                      {qr.questionText}
                    </h3>
                    {qr.description && (
                      <p className="text-sm text-[var(--label-light)] mt-1">
                        {qr.description}
                      </p>
                    )}
                  </div>
                  <span
                    className="text-xs text-[var(--label-light)] shrink-0 px-2 py-1 bg-[var(--bg-neutral)] rounded"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {qr.questionType}
                    {qr.questionType === "Scale" && ` (${qr.scaleType})`}
                  </span>
                </div>

                {/* Chart content - no border since it's inside card */}
                <div className="p-5">
                  {qr.questionType === "Text" && (
                    <TextSummaryCardContent responses={qr.responses as string[]} />
                  )}
                  {qr.questionType === "Yes-no" && (
                    <YesNoDonutChartContent data={qr.responses as { yes: number; no: number }} />
                  )}
                  {qr.questionType === "Scale" && (
                    <ScaleBarChartContent
                      responses={qr.responses as number[]}
                      scaleType={qr.scaleType || "0-5"}
                    />
                  )}
                  {qr.questionType === "Multiple-choice" && (
                    <MultipleChoiceBarChartContent data={qr.responses as Record<string, number>} />
                  )}
                </div>
              </div>
            ))}

            {questions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-base text-[var(--label-light)]">
                  No questions to display. Add some questions first.
                </p>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};
