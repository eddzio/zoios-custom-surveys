"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo, createContext, useContext } from "react";
import { Search, Users, User, ChevronRight, ChevronDown, X, Award } from "react-feather";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Plus } from "react-feather";

// Types
interface Group {
  id: string;
  name: string;
  owner: string | null;
  memberCount: number;
  children: Group[];
}

interface Category {
  id: string;
  name: string;
  groups: Group[];
}

// Mock data
const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Company",
    groups: [
      {
        id: "g-1",
        name: "Acme Corp",
        owner: "John Smith",
        memberCount: 150,
        children: [],
      },
      {
        id: "g-2",
        name: "Beta Inc",
        owner: null,
        memberCount: 75,
        children: [],
      },
    ],
  },
  {
    id: "cat-2",
    name: "Age",
    groups: [
      { id: "g-3", name: "18-25", owner: null, memberCount: 45, children: [] },
      { id: "g-4", name: "26-35", owner: null, memberCount: 62, children: [] },
      { id: "g-5", name: "36-45", owner: null, memberCount: 38, children: [] },
      { id: "g-6", name: "46+", owner: null, memberCount: 25, children: [] },
    ],
  },
  {
    id: "cat-3",
    name: "Department",
    groups: [
      {
        id: "g-7",
        name: "Legal",
        owner: "Sarah Johnson",
        memberCount: 12,
        children: [],
      },
      {
        id: "g-8",
        name: "Sales",
        owner: "Mike Wilson",
        memberCount: 28,
        children: [],
      },
      {
        id: "g-9",
        name: "Product",
        owner: "Emily Chen",
        memberCount: 35,
        children: [],
      },
      {
        id: "g-10",
        name: "Marketing",
        owner: "David Lee",
        memberCount: 18,
        children: [],
      },
      {
        id: "g-11",
        name: "Engineering",
        owner: "Alex Turner",
        memberCount: 85,
        children: [
          {
            id: "g-12",
            name: "Data Science",
            owner: "Lisa Park",
            memberCount: 15,
            children: [],
          },
          {
            id: "g-13",
            name: "Platform",
            owner: "James Brown",
            memberCount: 22,
            children: [
              {
                id: "g-19",
                name: "Vision Pro",
                owner: "Michael Brown",
                memberCount: 5,
                children: [],
              },
              {
                id: "g-20",
                name: "Android",
                owner: "Chris Davis",
                memberCount: 8,
                children: [],
              },
              {
                id: "g-21",
                name: "iOS",
                owner: "Anna White",
                memberCount: 7,
                children: [],
              },
              {
                id: "g-22",
                name: "Meta Quest",
                owner: null,
                memberCount: 3,
                children: [],
              },
              {
                id: "g-23",
                name: "Apple Watch",
                owner: null,
                memberCount: 4,
                children: [],
              },
              {
                id: "g-24",
                name: "Android Watch",
                owner: null,
                memberCount: 2,
                children: [],
              },
            ],
          },
          {
            id: "g-14",
            name: "Mobile Team",
            owner: "Rachel Green",
            memberCount: 18,
            children: [],
          },
          {
            id: "g-15",
            name: "Access",
            owner: null,
            memberCount: 10,
            children: [],
          },
          {
            id: "g-16",
            name: "Growth Pod",
            owner: "Tom Harris",
            memberCount: 8,
            children: [],
          },
        ],
      },
      {
        id: "g-17",
        name: "Human Resources",
        owner: "Nancy Miller",
        memberCount: 8,
        children: [],
      },
      {
        id: "g-18",
        name: "Finance",
        owner: "Robert Taylor",
        memberCount: 14,
        children: [],
      },
    ],
  },
  {
    id: "cat-4",
    name: "Gender",
    groups: [
      { id: "g-25", name: "Male", owner: null, memberCount: 95, children: [] },
      { id: "g-26", name: "Female", owner: null, memberCount: 72, children: [] },
      { id: "g-27", name: "Non-binary", owner: null, memberCount: 8, children: [] },
    ],
  },
  {
    id: "cat-5",
    name: "Generation",
    groups: [
      { id: "g-28", name: "Gen Z", owner: null, memberCount: 35, children: [] },
      { id: "g-29", name: "Millennials", owner: null, memberCount: 68, children: [] },
      { id: "g-30", name: "Gen X", owner: null, memberCount: 45, children: [] },
      { id: "g-31", name: "Boomers", owner: null, memberCount: 22, children: [] },
    ],
  },
  {
    id: "cat-6",
    name: "Kids",
    groups: [
      { id: "g-32", name: "No kids", owner: null, memberCount: 85, children: [] },
      { id: "g-33", name: "1 child", owner: null, memberCount: 42, children: [] },
      { id: "g-34", name: "2+ children", owner: null, memberCount: 43, children: [] },
    ],
  },
  {
    id: "cat-7",
    name: "Seniority",
    groups: [
      { id: "g-35", name: "Junior", owner: null, memberCount: 48, children: [] },
      { id: "g-36", name: "Mid-level", owner: null, memberCount: 65, children: [] },
      { id: "g-37", name: "Senior", owner: null, memberCount: 42, children: [] },
      { id: "g-38", name: "Lead", owner: null, memberCount: 15, children: [] },
    ],
  },
];

// Mock member data
interface Member {
  id: string;
  name: string;
  email: string;
  status: "Active" | "Inactive" | "Pending";
}

const mockMembers: Member[] = [
  { id: "m-1", name: "Alyssa Milano", email: "am@zoios.io", status: "Active" },
  { id: "m-2", name: "Javier Bardem", email: "jb@zoios.io", status: "Active" },
  { id: "m-3", name: "Mila Kunis", email: "ml@zoios.io", status: "Active" },
  { id: "m-4", name: "Keanu Reeves", email: "kr@zoios.io", status: "Active" },
  { id: "m-5", name: "Scarlett Johansson", email: "sj@zoios.io", status: "Active" },
  { id: "m-6", name: "Idris Elba", email: "ie@zoios.io", status: "Active" },
];

// Edit Group Popup Component
interface EditGroupPopupProps {
  group: Group | { name: string; owner: string | null; memberCount: number };
  onClose: () => void;
}

function EditGroupPopup({ group, onClose }: EditGroupPopupProps) {
  const [activeTab, setActiveTab] = useState<"members" | "hierarchy">("members");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />
      {/* Popup */}
      <div className="relative bg-white rounded-2xl shadow-xl w-[580px] max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
          <h2 className="text-xl font-semibold text-[var(--label-primary)]">
            {group.name}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-[var(--label-light)] hover:text-[var(--label-primary)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border)]">
          <button
            onClick={() => setActiveTab("members")}
            className={`px-6 py-3 text-base font-medium transition-colors ${
              activeTab === "members"
                ? "text-[var(--label-primary)] border-b-2 border-[var(--control-primary)]"
                : "text-[var(--label-light)] hover:text-[var(--label-primary)]"
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab("hierarchy")}
            className={`px-6 py-3 text-base font-medium transition-colors ${
              activeTab === "hierarchy"
                ? "text-[var(--label-primary)] border-b-2 border-[var(--control-primary)]"
                : "text-[var(--label-light)] hover:text-[var(--label-primary)]"
            }`}
          >
            Hierarchy
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "members" && (
            <div className="flex flex-col gap-6">
              {/* Group responsible section */}
              <div>
                <h3 className="text-base font-medium text-[var(--label-primary)] mb-1">
                  Group responsible
                </h3>
                <p className="text-sm text-[var(--label-light)] mb-3">
                  Employees that are part of this group
                </p>
                <button className="flex items-center justify-between w-full max-w-[200px] h-10 px-3 bg-white border border-[var(--border)] rounded-lg text-sm text-[var(--label-light)]">
                  <span>{group.owner || "Add responsible"}</span>
                  <ChevronDown size={14} />
                </button>
              </div>

              {/* Members section */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-medium text-[var(--label-primary)]">
                    Members · {mockMembers.length}
                  </h3>
                  <button className="flex items-center gap-2 h-10 px-3 bg-white border border-[var(--border)] rounded-lg text-sm text-[var(--label-primary)]">
                    <span>Add members</span>
                    <ChevronDown size={14} />
                  </button>
                </div>
                <p className="text-sm text-[var(--label-light)] mb-4">
                  Employees that are part of this group
                </p>

                {/* Members table */}
                <div className="border border-[var(--border)] rounded-lg overflow-hidden">
                  {/* Table header */}
                  <div className="grid grid-cols-[1fr_1fr_100px] gap-4 px-4 py-3 bg-[var(--bg-neutral)] border-b border-[var(--border)]">
                    <span className="text-sm font-medium text-[var(--label-light)]">Name</span>
                    <span className="text-sm font-medium text-[var(--label-light)]">Email</span>
                    <span className="text-sm font-medium text-[var(--label-light)]">Status</span>
                  </div>
                  {/* Table rows */}
                  {mockMembers.map((member) => (
                    <div
                      key={member.id}
                      className="grid grid-cols-[1fr_1fr_100px] gap-4 px-4 py-3 border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg-neutral)] transition-colors"
                    >
                      <span className="text-sm text-[var(--label-primary)]">{member.name}</span>
                      <span className="text-sm text-[var(--label-primary)]">{member.email}</span>
                      <span className="text-sm text-[var(--label-primary)]">{member.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "hierarchy" && (
            <div className="text-sm text-[var(--label-light)]">
              Hierarchy view coming soon...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper to find group by path
const findGroupByPath = (
  categories: Category[],
  path: string[]
): Group | null => {
  if (path.length === 0) return null;

  const category = categories.find((c) => c.id === path[0]);
  if (!category) return null;

  let current: Group | undefined;
  let groups = category.groups;

  for (let i = 1; i < path.length; i++) {
    current = groups.find((g) => g.id === path[i]);
    if (!current) return null;
    groups = current.children;
  }

  return current || null;
};

// Helper to get all groups flattened for search
const flattenGroups = (
  categories: Category[]
): Array<{ group: Group; categoryId: string; path: string[] }> => {
  const result: Array<{ group: Group; categoryId: string; path: string[] }> = [];

  const traverse = (groups: Group[], categoryId: string, path: string[]) => {
    for (const group of groups) {
      const currentPath = [...path, group.id];
      result.push({ group, categoryId, path: currentPath });
      if (group.children.length > 0) {
        traverse(group.children, categoryId, currentPath);
      }
    }
  };

  for (const category of categories) {
    traverse(category.groups, category.id, [category.id]);
  }

  return result;
};

// Helper to convert groups to React Flow nodes and edges
const groupsToFlow = (
  groups: Group[],
  parentId: string | null = null,
  level: number = 0,
  siblingIndex: number = 0,
  siblingCount: number = 1
): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const nodeWidth = 140;
  const nodeHeight = 36;
  const horizontalGap = 40;
  const verticalGap = 60;

  // Calculate subtree width recursively (for top-to-bottom layout)
  const getSubtreeWidth = (group: Group): number => {
    if (group.children.length === 0) return nodeWidth;
    let totalWidth = 0;
    for (const child of group.children) {
      totalWidth += getSubtreeWidth(child) + horizontalGap;
    }
    return totalWidth - horizontalGap;
  };

  // Build nodes recursively with proper positioning (top-to-bottom)
  const buildNodes = (
    groups: Group[],
    parentId: string | null,
    level: number,
    startX: number
  ): number => {
    let currentX = startX;

    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      const subtreeWidth = getSubtreeWidth(group);
      const nodeX = currentX + subtreeWidth / 2 - nodeWidth / 2;

      nodes.push({
        id: group.id,
        position: { x: nodeX, y: level * (nodeHeight + verticalGap) },
        data: {
          label: group.name,
          owner: group.owner,
          memberCount: group.memberCount,
        },
        style: {
          width: nodeWidth,
          height: nodeHeight,
          padding: "6px 10px",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          backgroundColor: "var(--bg-primary)",
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--label-primary)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        },
      });

      if (parentId) {
        edges.push({
          id: `${parentId}-${group.id}`,
          source: parentId,
          target: group.id,
          type: "default",
          style: { stroke: "var(--border-neutral)", strokeWidth: 1.5 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "var(--border-neutral)",
            width: 16,
            height: 16,
          },
        });
      }

      if (group.children.length > 0) {
        buildNodes(group.children, group.id, level + 1, currentX);
      }

      currentX += subtreeWidth + horizontalGap;
    }

    return currentX;
  };

  buildNodes(groups, parentId, 0, 0);

  return { nodes, edges };
};

interface GroupsPageProps {
  onEditGroup?: (groupId: string) => void;
}

export function GroupsPage({ onEditGroup }: GroupsPageProps) {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    "cat-3"
  );
  const [selectedPath, setSelectedPath] = useState<string[]>(["cat-3"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [addingCategoryInline, setAddingCategoryInline] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingSiblingAt, setAddingSiblingAt] = useState<{
    parentPath: string[];
    columnIndex: number;
  } | null>(null);
  const [newSiblingName, setNewSiblingName] = useState("");
  const [activeTab, setActiveTab] = useState<"columns" | "chart">("columns");
  const [editingGroup, setEditingGroup] = useState<{
    group: Group | { name: string; owner: string | null; memberCount: number };
    isCategory: boolean;
  } | null>(null);

  const columnsContainerRef = useRef<HTMLDivElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);
  const siblingInputRef = useRef<HTMLInputElement>(null);

  // Get the selected category
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  // Build columns based on selected path
  const columns: Array<{ groups: Group[]; parentPath: string[] }> = [];
  if (selectedCategory) {
    columns.push({
      groups: selectedCategory.groups,
      parentPath: [selectedCategory.id],
    });

    let currentGroups = selectedCategory.groups;
    for (let i = 1; i < selectedPath.length; i++) {
      const groupId = selectedPath[i];
      const group = currentGroups.find((g) => g.id === groupId);
      if (group && group.children.length > 0) {
        columns.push({
          groups: group.children,
          parentPath: selectedPath.slice(0, i + 1),
        });
        currentGroups = group.children;
      }
    }
  }

  // Get the currently selected group (last in path)
  const selectedGroupId = selectedPath.length > 1 ? selectedPath[selectedPath.length - 1] : null;
  const selectedGroup = selectedGroupId
    ? findGroupByPath(categories, selectedPath)
    : null;

  // Search results
  const allGroups = flattenGroups(categories);
  const searchResults =
    searchQuery.length > 0
      ? allGroups.filter((item) =>
          item.group.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  // Auto-scroll to keep focused column visible
  useEffect(() => {
    if (columnsContainerRef.current && columns.length > 0) {
      const container = columnsContainerRef.current;
      const columnWidth = 256;
      const scrollTarget = (columns.length - 1) * columnWidth;
      container.scrollTo({ left: scrollTarget, behavior: "smooth" });
    }
  }, [columns.length]);

  // Focus inputs when shown
  useEffect(() => {
    if (addingCategoryInline && categoryInputRef.current) {
      categoryInputRef.current.focus();
    }
  }, [addingCategoryInline]);

  useEffect(() => {
    if (addingSiblingAt && siblingInputRef.current) {
      siblingInputRef.current.focus();
    }
  }, [addingSiblingAt]);

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedPath([categoryId]);
  };

  // Handle group selection
  const handleGroupSelect = (groupId: string, columnIndex: number) => {
    const newPath = [...selectedPath.slice(0, columnIndex + 1), groupId];
    setSelectedPath(newPath);
  };

  // Handle adding a new category
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        name: newCategoryName.trim(),
        groups: [],
      };
      setCategories([...categories, newCategory]);
      setSelectedCategoryId(newCategory.id);
      setSelectedPath([newCategory.id]);
      setNewCategoryName("");
      setAddingCategoryInline(false);
    }
  };

  // Handle adding a new sibling group
  const handleAddSibling = () => {
    if (!newSiblingName.trim() || !addingSiblingAt) return;

    const { parentPath } = addingSiblingAt;
    const newGroup: Group = {
      id: `g-${Date.now()}`,
      name: newSiblingName.trim(),
      owner: null,
      memberCount: 0,
      children: [],
    };

    const updatedCategories = [...categories];
    const categoryIndex = updatedCategories.findIndex(
      (c) => c.id === parentPath[0]
    );
    if (categoryIndex === -1) return;

    if (parentPath.length === 1) {
      // Adding to category root
      updatedCategories[categoryIndex].groups.push(newGroup);
    } else {
      // Adding to a group's children
      const addToGroup = (groups: Group[], pathIndex: number): boolean => {
        for (const group of groups) {
          if (group.id === parentPath[pathIndex]) {
            if (pathIndex === parentPath.length - 1) {
              group.children.push(newGroup);
              return true;
            } else {
              return addToGroup(group.children, pathIndex + 1);
            }
          }
        }
        return false;
      };
      addToGroup(updatedCategories[categoryIndex].groups, 1);
    }

    setCategories(updatedCategories);
    setSelectedPath([...parentPath, newGroup.id]);
    setNewSiblingName("");
    setAddingSiblingAt(null);
  };

  // Handle search result click
  const handleSearchResultClick = (categoryId: string, path: string[]) => {
    setSelectedCategoryId(categoryId);
    setSelectedPath(path);
    setSearchQuery("");
    setIsSearchFocused(false);
  };

  // Handle edit group
  const handleEditGroup = (groupId: string) => {
    if (onEditGroup) {
      onEditGroup(groupId);
    } else {
      console.log("Edit group:", groupId);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <h1
            className="text-2xl font-semibold text-[var(--label-primary)]"
            style={{ fontFamily: "Bitter, serif", letterSpacing: "-0.48px" }}
          >
            Groups
          </h1>
          {/* Search */}
          <div className="relative">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--label-light)]"
              />
              <input
                type="text"
                placeholder="Find a group"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-64 h-10 pl-10 pr-4 bg-[var(--control-secondary)] border border-[var(--border)] rounded-lg text-sm text-[var(--label-primary)] placeholder:text-[var(--label-light)] focus:outline-none focus:ring-1 focus:ring-[var(--control-primary)] focus:ring-opacity-30"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--label-light)] hover:text-[var(--label-primary)]"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {/* Search results dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--control-secondary)] border border-[var(--border)] rounded-lg shadow-lg max-h-64 overflow-y-auto z-20">
                {searchResults.slice(0, 10).map((result) => {
                  const category = categories.find(
                    (c) => c.id === result.categoryId
                  );
                  return (
                    <button
                      key={result.group.id}
                      onClick={() =>
                        handleSearchResultClick(result.categoryId, result.path)
                      }
                      className="w-full px-4 py-2 text-left hover:bg-[var(--bg-neutral)] transition-colors"
                    >
                      <div className="text-sm font-medium text-[var(--label-primary)]">
                        {result.group.name}
                      </div>
                      <div className="text-xs text-[var(--label-light)]">
                        {category?.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-0 border-b border-[var(--border)]">
          <button
            onClick={() => setActiveTab("columns")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "columns"
                ? "text-[var(--label-primary)] border-b-2 border-[var(--control-primary)]"
                : "text-[var(--label-light)] hover:text-[var(--label-primary)]"
            }`}
          >
            Columns
          </button>
          <button
            onClick={() => setActiveTab("chart")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "chart"
                ? "text-[var(--label-primary)] border-b-2 border-[var(--control-primary)]"
                : "text-[var(--label-light)] hover:text-[var(--label-primary)]"
            }`}
          >
            Chart
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Categories panel */}
        <div className="w-[383px] border-r border-[var(--border)] flex flex-col">
          {/* Categories header */}
          <div className="flex items-center justify-between px-6 py-6">
            <h2 className="text-base font-semibold text-[var(--label-primary)]">
              Categories
            </h2>
            <button
              onClick={() => setAddingCategoryInline(true)}
              className="h-10 px-4 bg-[var(--control-secondary)] border border-[var(--border)] text-[var(--label-primary)] text-sm font-medium rounded-lg hover:bg-[var(--bg-neutral)] transition-colors"
            >
              + Add category
            </button>
          </div>
          {/* Categories list */}
          <div className="flex-1 overflow-y-auto px-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                  selectedCategoryId === category.id
                    ? "bg-[var(--bg-neutral)]"
                    : "hover:bg-[var(--bg-neutral)]"
                }`}
              >
                <span
                  className={`text-sm ${
                    selectedCategoryId === category.id
                      ? "font-medium text-[var(--label-primary)]"
                      : "text-[var(--label-primary)]"
                  }`}
                >
                  {category.name}
                </span>
                <ChevronRight size={16} className="text-[var(--label-light)]" />
              </button>
            ))}
            {/* Inline add category */}
            {addingCategoryInline && (
              <div className="px-4 py-2">
                <input
                  ref={categoryInputRef}
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddCategory();
                    if (e.key === "Escape") {
                      setAddingCategoryInline(false);
                      setNewCategoryName("");
                    }
                  }}
                  onBlur={() => {
                    if (!newCategoryName.trim()) {
                      setAddingCategoryInline(false);
                      setNewCategoryName("");
                    }
                  }}
                  placeholder="Category name"
                  className="w-full h-10 px-3 bg-[var(--control-secondary)] border border-[var(--control-primary)] rounded-lg text-sm text-[var(--label-primary)] placeholder:text-[var(--label-light)] focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Groups columns */}
        {activeTab === "columns" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            ref={columnsContainerRef}
            className="flex-1 flex overflow-x-auto"
          >
            {columns.map((column, columnIndex) => {
              // Find the parent group for this column (to show the chrome)
              const parentGroupId = columnIndex > 0 ? selectedPath[columnIndex] : null;
              const parentGroup = parentGroupId
                ? findGroupByPath(categories, selectedPath.slice(0, columnIndex + 1))
                : null;

              // Calculate total member count for category (first column)
              const categoryMemberCount = selectedCategory
                ? selectedCategory.groups.reduce((sum, g) => sum + g.memberCount, 0)
                : 0;

              return (
                <div
                  key={columnIndex}
                  className="w-[280px] flex-shrink-0 border-r border-[var(--border)] flex flex-col"
                >
                  <div className="flex-1 overflow-y-auto p-2">
                    {/* Chrome - shows info about the parent of items in this column */}
                    {columnIndex === 0 && selectedCategory ? (
                      <div className="px-2 py-4 border-b border-[var(--border)] flex flex-col gap-3">
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between">
                            <span className="text-base font-medium text-[var(--label-primary)]">
                              {selectedCategory.name}
                            </span>
                            <div className="flex items-center gap-1 text-[var(--label-primary)]">
                              <Users size={14} />
                              <span className="text-base">
                                {categoryMemberCount}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[var(--label-light)]">
                            <span className="text-base">No responsible</span>
                            <Award size={14} />
                          </div>
                        </div>
                        <button
                          onClick={() => setEditingGroup({
                            group: {
                              name: selectedCategory.name,
                              owner: null,
                              memberCount: categoryMemberCount,
                            },
                            isCategory: true,
                          })}
                          className="w-full h-10 px-4 bg-[var(--control-secondary)] border border-[var(--border)] text-[var(--label-primary)] text-sm font-medium rounded-lg hover:bg-[var(--bg-neutral)] transition-colors shadow-[0px_1px_3px_0px_rgba(0,0,0,0.04)]"
                        >
                          Edit
                        </button>
                      </div>
                    ) : parentGroup ? (
                      <div className="px-2 py-4 border-b border-[var(--border)] flex flex-col gap-3">
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between">
                            <span className="text-base font-medium text-[var(--label-primary)]">
                              {parentGroup.name}
                            </span>
                            <div className="flex items-center gap-1 text-[var(--label-primary)]">
                              <Users size={14} />
                              <span className="text-base">
                                {parentGroup.memberCount}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[var(--label-light)]">
                            <span className="text-base">
                              {parentGroup.owner || "No responsible"}
                            </span>
                            <Award size={14} />
                          </div>
                        </div>
                        <button
                          onClick={() => setEditingGroup({
                            group: parentGroup,
                            isCategory: false,
                          })}
                          className="w-full h-10 px-4 bg-[var(--control-secondary)] border border-[var(--border)] text-[var(--label-primary)] text-sm font-medium rounded-lg hover:bg-[var(--bg-neutral)] transition-colors shadow-[0px_1px_3px_0px_rgba(0,0,0,0.04)]"
                        >
                          Edit
                        </button>
                      </div>
                    ) : null}
                    {column.groups.map((group) => {
                      const isSelected =
                        selectedPath[columnIndex + 1] === group.id;
                      const hasChildren = group.children.length > 0;

                      return (
                        <button
                          key={group.id}
                          onClick={() =>
                            handleGroupSelect(group.id, columnIndex)
                          }
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                            isSelected
                              ? "bg-[var(--bg-neutral)]"
                              : "hover:bg-[var(--bg-neutral)]"
                          }`}
                        >
                          <span
                            className={`text-sm ${
                              isSelected
                                ? "font-medium text-[var(--label-primary)]"
                                : "text-[var(--label-primary)]"
                            }`}
                          >
                            {group.name}
                          </span>
                          {hasChildren && (
                            <ChevronRight
                              size={16}
                              className="text-[var(--label-light)]"
                            />
                          )}
                        </button>
                      );
                    })}
                  {/* Add sibling button */}
                  {addingSiblingAt?.columnIndex === columnIndex ? (
                    <div className="px-1 py-1">
                      <input
                        ref={siblingInputRef}
                        type="text"
                        value={newSiblingName}
                        onChange={(e) => setNewSiblingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddSibling();
                          if (e.key === "Escape") {
                            setAddingSiblingAt(null);
                            setNewSiblingName("");
                          }
                        }}
                        onBlur={() => {
                          if (!newSiblingName.trim()) {
                            setAddingSiblingAt(null);
                            setNewSiblingName("");
                          }
                        }}
                        placeholder="Group name"
                        className="w-full h-10 px-3 bg-[var(--control-secondary)] border border-[var(--control-primary)] rounded-lg text-sm text-[var(--label-primary)] placeholder:text-[var(--label-light)] focus:outline-none"
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        setAddingSiblingAt({
                          parentPath: column.parentPath,
                          columnIndex,
                        })
                      }
                      className="w-full px-3 py-2 text-left text-sm text-[var(--control-primary)] hover:text-[var(--control-primary-hover)] transition-colors"
                    >
                      + Add sibling
                    </button>
                  )}
                  </div>
                </div>
              );
            })}
            {/* Empty state when no category selected */}
            {!selectedCategory && (
              <div className="flex-1 flex items-center justify-center text-[var(--label-light)]">
                Select a category to view groups
              </div>
            )}
          </div>
          {/* Horizontal scrollbar area */}
          {columns.length > 3 && (
            <div className="h-12 border-t border-[var(--border)] px-4 flex items-center">
              <div className="flex-1 h-2 bg-[var(--bg-neutral)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--border-neutral)] rounded-full"
                  style={{
                    width: `${Math.min(100, (3 / columns.length) * 100)}%`,
                    marginLeft: `${
                      (columnsContainerRef.current?.scrollLeft || 0) /
                      ((columnsContainerRef.current?.scrollWidth || 1) -
                        (columnsContainerRef.current?.clientWidth || 0)) *
                      (100 - Math.min(100, (3 / columns.length) * 100))
                    }%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
        )}

        {/* Chart view */}
        {activeTab === "chart" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedCategory ? (
              <ChartView
                groups={selectedCategory.groups}
                onGroupsChange={(newGroups) => {
                  setCategories((prev) =>
                    prev.map((cat) =>
                      cat.id === selectedCategoryId
                        ? { ...cat, groups: newGroups }
                        : cat
                    )
                  );
                }}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-[var(--label-light)]">
                Select a category to view chart
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Group Popup */}
      {editingGroup && (
        <EditGroupPopup
          group={editingGroup.group}
          onClose={() => setEditingGroup(null)}
        />
      )}
    </div>
  );
}

// Context for chart callbacks
interface ChartContextType {
  selectedNodeId: string | null;
  editingNodeId: string | null;
  onAddGroup: (nodeId: string) => void;
  onNameChange: (name: string) => void;
  onFinishEditing: () => void;
}

const ChartContext = createContext<ChartContextType | null>(null);

// Custom node component
interface GroupNodeData {
  label: string;
  nodeId: string;
}

function GroupNode({ data }: { data: GroupNodeData }) {
  const ctx = useContext(ChartContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSelected = ctx?.selectedNodeId === data.nodeId;
  const isEditing = ctx?.editingNodeId === data.nodeId;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <div
      className={`relative px-2.5 py-1.5 rounded-lg border bg-[var(--bg-primary)] text-[13px] font-medium text-[var(--label-primary)] ${
        isSelected ? "border-[var(--control-primary)] ring-2 ring-[var(--control-primary)] ring-opacity-20" : "border-[var(--border)]"
      }`}
      style={{ minWidth: 140 }}
    >
      <Handle type="target" position={Position.Top} className="!hidden" />
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          defaultValue={data.label}
          onChange={(e) => ctx?.onNameChange(e.target.value)}
          onBlur={() => ctx?.onFinishEditing()}
          onKeyDown={(e) => {
            if (e.key === "Enter") ctx?.onFinishEditing();
            if (e.key === "Escape") ctx?.onFinishEditing();
          }}
          className="w-full bg-transparent outline-none text-center"
        />
      ) : (
        <span className="block text-center">{data.label}</span>
      )}
      <Handle type="source" position={Position.Bottom} className="!hidden" />
      {isSelected && !isEditing && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            ctx?.onAddGroup(data.nodeId);
          }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 bg-[var(--control-primary)] text-white text-xs font-medium rounded-md hover:bg-[var(--control-primary-hover)] transition-colors whitespace-nowrap"
        >
          <Plus size={12} />
          Add group
        </button>
      )}
    </div>
  );
}

const nodeTypes = { groupNode: GroupNode };

// Chart view component
function ChartView({
  groups,
  onGroupsChange,
}: {
  groups: Group[];
  onGroupsChange: (groups: Group[]) => void;
}) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const editingNameRef = useRef<string>("");

  // Helper to add child to a group recursively
  const addChildToGroup = (groups: Group[], parentId: string, newChild: Group): Group[] => {
    return groups.map((group) => {
      if (group.id === parentId) {
        return { ...group, children: [...group.children, newChild] };
      }
      if (group.children.length > 0) {
        return {
          ...group,
          children: addChildToGroup(group.children, parentId, newChild),
        };
      }
      return group;
    });
  };

  // Helper to update group name recursively
  const updateGroupName = (groups: Group[], groupId: string, newName: string): Group[] => {
    return groups.map((group) => {
      if (group.id === groupId) {
        return { ...group, name: newName || "Empty group" };
      }
      if (group.children.length > 0) {
        return {
          ...group,
          children: updateGroupName(group.children, groupId, newName),
        };
      }
      return group;
    });
  };

  const handleAddGroup = useCallback(
    (parentId: string) => {
      const newId = `g-new-${Date.now()}`;
      const newGroup: Group = {
        id: newId,
        name: "Empty group",
        owner: null,
        memberCount: 0,
        children: [],
      };
      const newGroups = addChildToGroup(groups, parentId, newGroup);
      onGroupsChange(newGroups);
      setSelectedNodeId(newId);
      setEditingNodeId(newId);
      editingNameRef.current = "Empty group";
    },
    [groups, onGroupsChange]
  );

  const handleFinishEditing = useCallback(() => {
    if (editingNodeId) {
      const newGroups = updateGroupName(groups, editingNodeId, editingNameRef.current);
      onGroupsChange(newGroups);
      setEditingNodeId(null);
      editingNameRef.current = "";
    }
  }, [editingNodeId, groups, onGroupsChange]);

  const handleNameChange = useCallback((name: string) => {
    editingNameRef.current = name;
  }, []);

  // Build nodes
  const { nodes, edges } = useMemo(() => {
    const { nodes: baseNodes, edges } = groupsToFlow(groups);
    const nodes = baseNodes.map((node) => ({
      ...node,
      type: "groupNode",
      // Remove visual styles since GroupNode handles its own styling
      // Keep only position-related properties
      style: undefined,
      data: {
        label: node.data.label,
        nodeId: node.id,
      },
    }));
    return { nodes, edges };
  }, [groups]);

  const contextValue = useMemo<ChartContextType>(() => ({
    selectedNodeId,
    editingNodeId,
    onAddGroup: handleAddGroup,
    onNameChange: handleNameChange,
    onFinishEditing: handleFinishEditing,
  }), [selectedNodeId, editingNodeId, handleAddGroup, handleNameChange, handleFinishEditing]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (editingNodeId && editingNodeId !== node.id) {
        handleFinishEditing();
      }
      setSelectedNodeId(node.id);
    },
    [editingNodeId, handleFinishEditing]
  );

  const handlePaneClick = useCallback(() => {
    if (editingNodeId) {
      handleFinishEditing();
    }
    setSelectedNodeId(null);
  }, [editingNodeId, handleFinishEditing]);

  return (
    <ChartContext.Provider value={contextValue}>
      <div className="flex-1 w-full h-full [&_.react-flow__handle]:hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          nodesDraggable={false}
          nodesConnectable={false}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.1}
          maxZoom={2}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--border)" />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </ChartContext.Provider>
  );
}
