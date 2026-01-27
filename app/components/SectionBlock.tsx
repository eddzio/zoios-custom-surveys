"use client"

import React, { useState, useRef, useEffect } from "react";

interface SectionBlockProps {
  name: string;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onNameChange?: (name: string) => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export const SectionBlock: React.FC<SectionBlockProps> = ({
  name,
  canMoveUp = false,
  canMoveDown = false,
  onNameChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editedName.trim()) {
      onNameChange?.(editedName.trim());
    } else {
      setEditedName(name);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 flex items-center gap-8">
      {/* Move buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown?.();
          }}
          disabled={!canMoveDown}
          className={`w-10 h-10 flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-sm ${
            canMoveDown ? 'hover:bg-[var(--bg-neutral)] cursor-pointer' : 'opacity-40 cursor-not-allowed'
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
          className={`w-10 h-10 flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-sm ${
            canMoveUp ? 'hover:bg-[var(--bg-neutral)] cursor-pointer' : 'opacity-40 cursor-not-allowed'
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

      {/* Section name and edit controls */}
      <div className="flex-1 flex items-center gap-6 justify-center">
        {isEditing ? (
          <>
            <div className="flex-1 max-w-[456px]">
              <input
                ref={inputRef}
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full h-10 px-2 bg-[var(--bg-neutral)] rounded-lg text-xl font-semibold text-[var(--label-primary)] focus:outline-none"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  letterSpacing: '-0.4px',
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="h-10 px-4 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--label-primary)] text-base font-medium rounded-lg shadow-sm hover:bg-[var(--bg-neutral)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="h-10 px-4 bg-[var(--control-primary)] text-[var(--control-secondary)] text-base font-medium rounded-lg shadow-sm hover:opacity-90 transition-opacity"
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 max-w-[456px] h-10 px-2 text-left hover:bg-[var(--bg-neutral)] rounded-lg transition-colors"
          >
            <span
              className="text-xl font-semibold text-[var(--label-primary)]"
              style={{
                fontFamily: 'Poppins, sans-serif',
                letterSpacing: '-0.4px',
              }}
            >
              {name}
            </span>
          </button>
        )}
      </div>

      {/* Delete button */}
      <div className="flex items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="w-10 h-10 flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-sm hover:bg-[var(--bg-neutral)]"
          title="Delete section"
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
  );
};
