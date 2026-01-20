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

// Dummy data generation functions
function generateTextResponses(): string[] {
  return [
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
  ];
}

function generateYesNoResponses(): { yes: number; no: number } {
  const yes = Math.floor(Math.random() * 60) + 40; // 40-100
  const no = Math.floor(Math.random() * 30) + 10; // 10-40
  return { yes, no };
}

function generateScaleResponses(scaleType: "0-5" | "0-10"): number[] {
  const max = scaleType === "0-5" ? 5 : 10;
  const responses: number[] = [];
  const total = Math.floor(Math.random() * 50) + 80; // 80-130 responses

  for (let i = 0; i < total; i++) {
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

function generateMultipleChoiceResponses(options: string[]): Record<string, number> {
  const result: Record<string, number> = {};
  options.forEach((option) => {
    if (option.trim()) {
      result[option] = Math.floor(Math.random() * 40) + 10; // 10-50 responses per option
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

// Text Summary Card Component
const TextSummaryCard = ({ responses }: { responses: string[] }) => {
  const summaryPoints = [
    "Overall positive sentiment about the event organization and venue",
    "Strong appreciation for networking and team bonding opportunities",
    "Speakers and content were well-received by participants",
    "Some feedback suggests desire for more breaks and interactive sessions",
  ];

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-5">
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
    </div>
  );
};

// Donut Chart Component for Yes/No
const YesNoDonutChart = ({ data }: { data: { yes: number; no: number } }) => {
  const total = data.yes + data.no;
  const yesPercentage = Math.round((data.yes / total) * 100);

  const chartData = [
    { name: "Yes", value: data.yes },
    { name: "No", value: data.no },
  ];

  const COLORS = ["#292524", "#d6d3d1"];

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-5">
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
              className="text-4xl font-semibold text-[var(--label-primary)]"
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
    </div>
  );
};

// Distribution Bar Chart for Scale
const ScaleBarChart = ({
  responses,
  scaleType,
}: {
  responses: number[];
  scaleType: "0-5" | "0-10";
}) => {
  const max = scaleType === "0-5" ? 5 : 10;
  const median = calculateMedian(responses);
  const average = calculateAverage(responses);

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
    <div className="bg-white border border-[var(--border)] rounded-xl p-5">
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
            <XAxis
              dataKey="score"
              tick={{ fontSize: 12, fill: "#79716b" }}
              axisLine={{ stroke: "#e7e5e4" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#79716b" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e7e5e4",
                borderRadius: "8px",
                fontSize: "12px",
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
    </div>
  );
};

// Vertical Bar Chart for Multiple Choice
const MultipleChoiceBarChart = ({ data }: { data: Record<string, number> }) => {
  const chartData = Object.entries(data).map(([option, count]) => ({
    option: option.length > 20 ? option.substring(0, 20) + "..." : option,
    fullOption: option,
    count,
  }));

  const total = Object.values(data).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-5">
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
              tick={{ fontSize: 12, fill: "#79716b" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e7e5e4",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value) => {
                const numValue = value as number;
                return [`${numValue} (${Math.round((numValue / total) * 100)}%)`, "Responses"];
              }}
            />
            <Bar dataKey="count" fill="#292524" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-[var(--label-light)] text-center mt-2">
        {total} total responses
      </p>
    </div>
  );
};

// Main Results Page Component
export const ResultsPage: React.FC<ResultsPageProps> = ({ questions }) => {
  const [showData, setShowData] = useState(false);

  // Generate dummy data for all questions (memoized to prevent regeneration)
  const questionResponses = useMemo(() => {
    return questions.map((question) => {
      let responses: unknown;

      switch (question.questionType) {
        case "Text":
          responses = generateTextResponses();
          break;
        case "Yes-no":
          responses = generateYesNoResponses();
          break;
        case "Scale":
          responses = generateScaleResponses(question.scaleType || "0-5");
          break;
        case "Multiple-choice":
          responses = generateMultipleChoiceResponses(
            question.multipleChoiceOptions || ["Option A", "Option B", "Option C"]
          );
          break;
        default:
          responses = null;
      }

      return {
        questionId: question.id,
        questionText: question.questionText || `Question ${question.number}`,
        questionType: question.questionType,
        scaleType: question.scaleType,
        multipleChoiceOptions: question.multipleChoiceOptions,
        responses,
      };
    });
  }, [questions]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-neutral)]">
      {/* Header with Show Data button */}
      <div className="flex items-center justify-center py-6">
        <button
          onClick={() => setShowData(!showData)}
          className={`h-10 px-6 text-base font-medium rounded-lg shadow-sm transition-colors ${
            showData
              ? "bg-[var(--control-primary)] text-white hover:opacity-90"
              : "bg-white border border-[var(--border)] text-[var(--label-primary)] hover:bg-gray-50"
          }`}
        >
          {showData ? "Hide data" : "Show data"}
        </button>
      </div>

      {/* Charts container */}
      {showData ? (
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="max-w-[900px] mx-auto space-y-6">
            {questionResponses.map((qr, index) => (
              <div key={qr.questionId} className="space-y-3">
                {/* Question header */}
                <div className="flex items-start gap-3">
                  <span
                    className="text-base text-[var(--label-light)] w-6 shrink-0 pt-0.5"
                    style={{ fontFamily: "DM Mono, monospace" }}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-medium text-[var(--label-primary)]">
                      {qr.questionText}
                    </h3>
                    <span className="text-xs text-[var(--label-light)]">
                      {qr.questionType}
                      {qr.questionType === "Scale" && ` (${qr.scaleType})`}
                    </span>
                  </div>
                </div>

                {/* Chart based on question type */}
                {qr.questionType === "Text" && (
                  <TextSummaryCard responses={qr.responses as string[]} />
                )}
                {qr.questionType === "Yes-no" && (
                  <YesNoDonutChart data={qr.responses as { yes: number; no: number }} />
                )}
                {qr.questionType === "Scale" && (
                  <ScaleBarChart
                    responses={qr.responses as number[]}
                    scaleType={qr.scaleType || "0-5"}
                  />
                )}
                {qr.questionType === "Multiple-choice" && (
                  <MultipleChoiceBarChart data={qr.responses as Record<string, number>} />
                )}
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
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2
              className="text-2xl font-medium text-[var(--label-primary)] mb-2"
              style={{ fontFamily: "Bitter, serif" }}
            >
              Results
            </h2>
            <p className="text-base text-[var(--label-light)]">
              Click &quot;Show data&quot; to view survey response visualizations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
