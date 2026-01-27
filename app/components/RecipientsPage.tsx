"use client"

import React, { useState, useEffect } from "react";

interface Recipient {
  id: number;
  name: string;
}

interface Segment {
  id: string;
  label: string;
}

interface Dimension {
  id: string;
  label: string;
  segments: Segment[];
}

interface RecipientsPageProps {
  recipients: Recipient[];
  onRecipientsChange: (recipients: Recipient[]) => void;
}

// Data structure: Dimensions contain segments
const dimensionsData: Dimension[] = [
  {
    id: "company",
    label: "Company",
    segments: [
      { id: "company-zoios", label: "Zoios" },
    ],
  },
  {
    id: "age",
    label: "Age",
    segments: [
      { id: "age-18-25", label: "18-25" },
      { id: "age-26-35", label: "26-35" },
      { id: "age-36-45", label: "36-45" },
      { id: "age-46-55", label: "46-55" },
      { id: "age-56+", label: "56+" },
    ],
  },
  {
    id: "department",
    label: "Department",
    segments: [
      { id: "dept-product", label: "Product" },
      { id: "dept-finance", label: "Finance" },
      { id: "dept-marketing", label: "Marketing" },
      { id: "dept-people-culture", label: "People & culture" },
      { id: "dept-pr", label: "PR" },
      { id: "dept-growth", label: "Growth" },
      { id: "dept-rd", label: "R&D" },
    ],
  },
  {
    id: "gender",
    label: "Gender",
    segments: [
      { id: "gender-male", label: "Male" },
      { id: "gender-female", label: "Female" },
      { id: "gender-non-binary", label: "Non-binary" },
      { id: "gender-prefer-not", label: "Prefer not to say" },
    ],
  },
  {
    id: "generation",
    label: "Generation",
    segments: [
      { id: "gen-z", label: "Generation Z (1997-2012)" },
      { id: "gen-millennial", label: "Millennial (1981-1996)" },
      { id: "gen-x", label: "Generation X (1965-1980)" },
      { id: "gen-boomer", label: "Baby Boomer (1946-1964)" },
      { id: "gen-silent", label: "Silent Generation (1928-1945)" },
    ],
  },
  {
    id: "kids",
    label: "Kids",
    segments: [
      { id: "kids-yes", label: "Has kids" },
      { id: "kids-no", label: "No kids" },
    ],
  },
  {
    id: "seniority",
    label: "Seniority",
    segments: [
      { id: "seniority-intern", label: "Intern" },
      { id: "seniority-junior", label: "Junior" },
      { id: "seniority-mid", label: "Mid-level" },
      { id: "seniority-senior", label: "Senior" },
      { id: "seniority-lead", label: "Lead" },
      { id: "seniority-manager", label: "Manager" },
      { id: "seniority-director", label: "Director" },
      { id: "seniority-vp", label: "VP" },
      { id: "seniority-c-level", label: "C-level" },
    ],
  },
];

// All people in the organization
const allPeople: Recipient[] = [
  { id: 1, name: "Salvador Dali" },
  { id: 2, name: "Ed Thompson" },
  { id: 3, name: "Jorge Martinez" },
  { id: 4, name: "Mikkel Andersen" },
  { id: 5, name: "Florian Weber" },
  { id: 6, name: "Anna Lindqvist" },
  { id: 7, name: "Marcus Johansson" },
  { id: 8, name: "Sofia Bergström" },
  { id: 9, name: "Lars Henriksen" },
  { id: 10, name: "Nina Pedersen" },
  { id: 11, name: "Erik Lindgren" },
  { id: 12, name: "Maria Santos" },
  { id: 13, name: "Thomas Müller" },
  { id: 14, name: "Lisa Eriksson" },
  { id: 15, name: "Henrik Larsson" },
];

// Sample recipients mapped to segments
const segmentToRecipients: Record<string, Recipient[]> = {
  // Company
  "company-zoios": allPeople,
  // Age groups
  "age-18-25": [allPeople[11], allPeople[8]],
  "age-26-35": [allPeople[0], allPeople[1], allPeople[4], allPeople[7]],
  "age-36-45": [allPeople[2], allPeople[3], allPeople[5], allPeople[9]],
  "age-46-55": [allPeople[6], allPeople[10], allPeople[12]],
  "age-56+": [allPeople[13], allPeople[14]],
  // Departments
  "dept-product": [allPeople[0], allPeople[1]],
  "dept-finance": [allPeople[10], allPeople[12]],
  "dept-marketing": [allPeople[2], allPeople[3]],
  "dept-people-culture": [allPeople[4], allPeople[5]],
  "dept-pr": [allPeople[6]],
  "dept-growth": [allPeople[7], allPeople[11]],
  "dept-rd": [allPeople[8], allPeople[9], allPeople[13]],
  // Gender
  "gender-male": [allPeople[0], allPeople[1], allPeople[2], allPeople[3], allPeople[6], allPeople[8], allPeople[10], allPeople[12], allPeople[14]],
  "gender-female": [allPeople[5], allPeople[7], allPeople[9], allPeople[11], allPeople[13]],
  "gender-non-binary": [allPeople[4]],
  "gender-prefer-not": [],
  // Generation
  "gen-z": [allPeople[11], allPeople[8]],
  "gen-millennial": [allPeople[0], allPeople[1], allPeople[4], allPeople[7], allPeople[9]],
  "gen-x": [allPeople[2], allPeople[3], allPeople[5], allPeople[6], allPeople[10]],
  "gen-boomer": [allPeople[12], allPeople[13], allPeople[14]],
  "gen-silent": [],
  // Kids
  "kids-yes": [allPeople[2], allPeople[5], allPeople[6], allPeople[10], allPeople[12], allPeople[13], allPeople[14]],
  "kids-no": [allPeople[0], allPeople[1], allPeople[3], allPeople[4], allPeople[7], allPeople[8], allPeople[9], allPeople[11]],
  // Seniority
  "seniority-intern": [allPeople[11]],
  "seniority-junior": [allPeople[8]],
  "seniority-mid": [allPeople[1], allPeople[7], allPeople[9]],
  "seniority-senior": [allPeople[0], allPeople[4]],
  "seniority-lead": [allPeople[2], allPeople[3]],
  "seniority-manager": [allPeople[5], allPeople[6]],
  "seniority-director": [allPeople[10], allPeople[13]],
  "seniority-vp": [allPeople[12]],
  "seniority-c-level": [allPeople[14]],
};

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
      className={`w-6 h-6 rounded flex items-center justify-center border-2 shrink-0 ${getCheckboxStyle()}`}
    >
      {state === "checked" && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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

const Checkbox = ({
  state,
  onChange,
  label,
}: {
  state: CheckboxState;
  onChange: () => void;
  label: string;
}) => {
  return (
    <button
      onClick={onChange}
      className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-stone-50 text-left"
    >
      <CheckboxIcon state={state} />
      <span className="text-base text-[var(--label-primary)]">{label}</span>
    </button>
  );
};

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

const Tag = ({
  label,
}: {
  label: string;
}) => {
  return (
    <div className="flex items-center px-2 py-1 bg-[var(--bg-neutral)] border border-[var(--border)] rounded">
      <span className="text-base text-[var(--label-light)] truncate max-w-[150px]">
        {label}
      </span>
    </div>
  );
};

export const RecipientsPage: React.FC<RecipientsPageProps> = ({
  recipients,
  onRecipientsChange,
}) => {
  const [activeTab, setActiveTab] = useState<"segments" | "individuals">("segments");
  const [selectedDimensionId, setSelectedDimensionId] = useState<string>("department");
  const [selectedSegments, setSelectedSegments] = useState<Set<string>>(new Set([
    "dept-product",
    "dept-marketing",
    "dept-people-culture",
    "dept-pr",
    "dept-growth",
    "dept-rd",
  ]));
  const [selectedIndividuals, setSelectedIndividuals] = useState<Set<number>>(new Set());

  // Update recipients when segment selection changes (segments tab)
  useEffect(() => {
    if (activeTab !== "segments") return;

    const newRecipients: Recipient[] = [];
    const seenIds = new Set<number>();

    selectedSegments.forEach((segmentId) => {
      const segmentRecipients = segmentToRecipients[segmentId] || [];
      segmentRecipients.forEach((recipient) => {
        if (!seenIds.has(recipient.id)) {
          seenIds.add(recipient.id);
          newRecipients.push(recipient);
        }
      });
    });

    onRecipientsChange(newRecipients);
  }, [selectedSegments, activeTab, onRecipientsChange]);

  // Update recipients when individual selection changes (individuals tab)
  useEffect(() => {
    if (activeTab !== "individuals") return;

    const newRecipients = allPeople.filter((p) => selectedIndividuals.has(p.id));
    onRecipientsChange(newRecipients);
  }, [selectedIndividuals, activeTab, onRecipientsChange]);

  // Get the currently selected dimension
  const selectedDimension = dimensionsData.find((d) => d.id === selectedDimensionId);

  // Calculate dimension checkbox state
  const getDimensionState = (dimension: Dimension): CheckboxState => {
    const segmentIds = dimension.segments.map((s) => s.id);
    const selectedCount = segmentIds.filter((id) => selectedSegments.has(id)).length;

    if (selectedCount === 0) return "unchecked";
    if (selectedCount === segmentIds.length) return "checked";
    return "partial";
  };

  // Handle dimension checkbox toggle (select all / deselect all)
  const handleDimensionToggle = (dimension: Dimension) => {
    const state = getDimensionState(dimension);
    const segmentIds = dimension.segments.map((s) => s.id);

    setSelectedSegments((prev) => {
      const next = new Set(prev);
      if (state === "checked" || state === "partial") {
        // Deselect all segments in this dimension
        segmentIds.forEach((id) => next.delete(id));
      } else {
        // Select all segments in this dimension
        segmentIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  // Handle segment checkbox click
  const handleSegmentClick = (segmentId: string) => {
    setSelectedSegments((prev) => {
      const next = new Set(prev);
      if (next.has(segmentId)) {
        next.delete(segmentId);
      } else {
        next.add(segmentId);
      }
      return next;
    });
  };

  // Handle Select All for current dimension
  const handleSelectAll = () => {
    if (!selectedDimension) return;

    const segmentIds = selectedDimension.segments.map((s) => s.id);
    const allSelected = segmentIds.every((id) => selectedSegments.has(id));

    setSelectedSegments((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        segmentIds.forEach((id) => next.delete(id));
      } else {
        segmentIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  // Get Select All state for current dimension
  const getSelectAllState = (): CheckboxState => {
    if (!selectedDimension) return "unchecked";
    return getDimensionState(selectedDimension);
  };

  // Handle removing a recipient
  const handleRemoveRecipient = (recipientId: number) => {
    // Find which segments contain this recipient and might need to be deselected
    // For simplicity, just remove from the recipients list directly
    onRecipientsChange(recipients.filter((r) => r.id !== recipientId));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden bg-[var(--bg-neutral)]">
        {/* Left panel - Selection */}
        <div className="flex-[2] flex flex-col bg-white border-r border-[var(--border)]">
          {/* Header */}
          <div className="p-6 border-b border-[var(--border)]">
            <h2
              className="text-[20px] font-medium text-[var(--label-primary)]"
              style={{ fontFamily: "Bitter, serif" }}
            >
              Choose recipients · {recipients.length}
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[var(--border)]">
            <button
              onClick={() => setActiveTab("segments")}
              className={`px-6 py-2 text-base font-medium border-b-2 ${
                activeTab === "segments"
                  ? "border-[var(--control-primary)] text-[var(--label-primary)]"
                  : "border-transparent text-[var(--label-light)]"
              }`}
            >
              Segments
            </button>
            <button
              onClick={() => setActiveTab("individuals")}
              className={`px-6 py-2 text-base border-b-2 ${
                activeTab === "individuals"
                  ? "border-[var(--control-primary)] text-[var(--label-primary)]"
                  : "border-transparent text-[var(--label-light)]"
              }`}
            >
              Individuals
            </button>
          </div>

          {/* Selection content */}
          {activeTab === "segments" && (
            <div className="flex-1 flex overflow-hidden">
              {/* Dimensions column */}
              <div className="flex-1 p-6 border-r border-[var(--border)] overflow-y-auto">
                <p className="text-base text-[var(--label-light)] mb-2">Dimensions</p>
                <div className="flex flex-col">
                  {dimensionsData.map((dimension) => (
                    <DimensionRow
                      key={dimension.id}
                      state={getDimensionState(dimension)}
                      label={dimension.label}
                      isSelected={selectedDimensionId === dimension.id}
                      onSelect={() => setSelectedDimensionId(dimension.id)}
                      onToggle={() => handleDimensionToggle(dimension)}
                    />
                  ))}
                </div>
              </div>

              {/* Segments column */}
              <div className="flex-1 p-6 overflow-y-auto">
                <p className="text-base text-[var(--label-light)] mb-2">Segments</p>

                {selectedDimension && (
                  <div className="flex flex-col">
                    {/* Select All checkbox */}
                    <Checkbox
                      state={getSelectAllState()}
                      onChange={handleSelectAll}
                      label="Select all"
                    />

                    {/* Individual segments */}
                    {selectedDimension.segments.map((segment) => (
                      <Checkbox
                        key={segment.id}
                        state={selectedSegments.has(segment.id) ? "checked" : "unchecked"}
                        onChange={() => handleSegmentClick(segment.id)}
                        label={segment.label}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "individuals" && (
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 p-6 overflow-y-auto">
                <p className="text-base text-[var(--label-light)] mb-2">People</p>
                <div className="flex flex-col">
                  {/* Select All checkbox */}
                  <Checkbox
                    state={
                      selectedIndividuals.size === 0
                        ? "unchecked"
                        : selectedIndividuals.size === allPeople.length
                        ? "checked"
                        : "partial"
                    }
                    onChange={() => {
                      if (selectedIndividuals.size === allPeople.length) {
                        setSelectedIndividuals(new Set());
                      } else {
                        setSelectedIndividuals(new Set(allPeople.map((p) => p.id)));
                      }
                    }}
                    label="Select all"
                  />
                  {/* Individual people */}
                  {allPeople.map((person) => (
                    <Checkbox
                      key={person.id}
                      state={selectedIndividuals.has(person.id) ? "checked" : "unchecked"}
                      onChange={() => {
                        setSelectedIndividuals((prev) => {
                          const next = new Set(prev);
                          if (next.has(person.id)) {
                            next.delete(person.id);
                          } else {
                            next.add(person.id);
                          }
                          return next;
                        });
                      }}
                      label={person.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right panel - Selected recipients */}
        <div className="flex-1 bg-white p-6 overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {recipients.map((recipient) => (
              <Tag
                key={recipient.id}
                label={recipient.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
