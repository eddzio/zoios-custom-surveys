"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Users, User, ChevronRight, X, Award } from "react-feather";

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
          <button className="px-4 py-2 text-sm font-medium text-[var(--label-primary)] border-b-2 border-[var(--control-primary)]">
            Columns
          </button>
          <button className="px-4 py-2 text-sm font-medium text-[var(--label-light)] hover:text-[var(--label-primary)] transition-colors">
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
        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            ref={columnsContainerRef}
            className="flex-1 flex overflow-x-auto"
          >
            {columns.map((column, columnIndex) => {
              // Find the parent group for this column (to show the chrome)
              // Only show chrome in the last column
              const isLastColumn = columnIndex === columns.length - 1;
              const parentGroupId = columnIndex > 0 ? selectedPath[columnIndex] : null;
              const parentGroup = parentGroupId
                ? findGroupByPath(categories, selectedPath.slice(0, columnIndex + 1))
                : null;

              return (
                <div
                  key={columnIndex}
                  className="w-64 flex-shrink-0 border-r border-[var(--border)] flex flex-col"
                >
                  <div className="flex-1 overflow-y-auto p-1">
                    {/* Chrome - shows info about the parent group whose children are displayed */}
                    {isLastColumn && parentGroup && (
                      <div className="m-1 mb-2 p-3 bg-[var(--control-secondary)] border border-[var(--border)] rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-[var(--label-primary)]">
                            {parentGroup.name}
                          </span>
                          <div className="flex items-center gap-1 text-[var(--label-light)]">
                            <Users size={14} />
                            <span className="text-xs">
                              {parentGroup.memberCount}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3 text-[var(--label-secondary)]">
                          <User size={14} />
                          <span className="text-sm">
                            {parentGroup.owner || "No owner"}
                          </span>
                        </div>
                        <button
                          onClick={() => handleEditGroup(parentGroup.id)}
                          className="h-10 px-4 bg-[var(--control-secondary)] border border-[var(--border)] text-[var(--label-primary)] text-sm font-medium rounded-lg hover:bg-[var(--bg-neutral)] transition-colors"
                        >
                          Edit group
                        </button>
                      </div>
                    )}
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
      </div>
    </div>
  );
}
