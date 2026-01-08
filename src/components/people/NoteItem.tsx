'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Note } from '@/lib/supabase/people';
import { IconButton } from '../IconButton';

interface NoteItemProps {
  note: Note;
  showPersonName?: boolean;
  personName?: string;
  personId?: string;
  onDelete?: (noteId: string) => void;
  isDeleting?: boolean;
  borderTop?: boolean;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
}

export function NoteItem({
  note,
  showPersonName = false,
  personName,
  personId,
  onDelete,
  isDeleting = false,
  borderTop = false,
}: NoteItemProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[aria-label="Note menu"]') && !target.closest('[data-menu-dropdown]')) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(note.id);
      setOpenMenuId(null);
    }
  };

  return (
    <div
      className={`px-4 py-4 group relative ${borderTop ? 'border-t' : ''}`}
      style={{
        borderColor: borderTop ? 'var(--border-color)' : 'transparent',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Primary: Note Content */}
          <p className="text-sm font-normal mb-1" style={{ color: 'var(--text-primary)' }}>
            {note.content}
          </p>

          {/* Secondary: Metadata */}
          <div className="flex items-center gap-2 flex-wrap">
            {showPersonName && personName && personId && (
              <Link
                href={`/people/${personId}`}
                className="text-xs font-medium hover:opacity-80 transition-opacity"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {personName}
              </Link>
            )}
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {formatRelativeTime(note.created_at)}
            </span>
          </div>
        </div>

        {/* Menu Button */}
        {onDelete && (
          <div className="relative flex-shrink-0 self-center">
            <IconButton
              variant="group-hover"
              size="sm"
              onClick={() => setOpenMenuId(openMenuId === note.id ? null : note.id)}
              disabled={isDeleting}
              isActive={openMenuId === note.id}
              aria-label="Note menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </IconButton>

            {/* Dropdown Menu */}
            {openMenuId === note.id && (
              <>
                <div
                  className="fixed inset-0 z-45"
                  onClick={() => {
                    setOpenMenuId(null);
                  }}
                />
                <div
                  data-menu-dropdown
                  className="absolute right-0 mt-1 w-56 rounded-md shadow-lg z-50 border"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1">
                    <button
                      onClick={handleDeleteClick}
                      disabled={isDeleting}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-opacity-50 transition-colors disabled:opacity-50 text-red-600"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      Delete note
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

