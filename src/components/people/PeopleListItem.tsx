'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PersonWithNote } from '@/lib/supabase/people';
import { IconButton } from '../IconButton';
import { ConfirmDialog } from '../ConfirmDialog';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

interface PeopleListItemProps {
  person: PersonWithNote;
  onDelete?: (personId: string) => void;
  onToggleFavorite?: (personId: string, isFavorite: boolean) => void;
  loading?: boolean;
}

export function PeopleListItem({ person, onDelete, onToggleFavorite, loading = false }: PeopleListItemProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [menuAlignRight, setMenuAlignRight] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const getInitials = (name: string) => {
    const trimmed = name.trim();
    if (trimmed.length > 0) {
      return trimmed[0].toUpperCase();
    }
    return '?';
  };

  // Calculate menu position when it opens
  useEffect(() => {
    if (openMenuId === person.id && menuRef.current) {
      const calculatePosition = () => {
        if (!menuRef.current) return;
        
        // Get the button element inside the menuRef div
        const button = menuRef.current.querySelector('button[aria-label="Person menu"]') as HTMLButtonElement;
        if (!button) return;
        
        const buttonRect = button.getBoundingClientRect();
        const menuWidth = 224; // w-56 = 14rem = 224px
        const spacing = 4; // mt-1 = 4px
        const viewportPadding = 8; // Minimum distance from viewport edge
        
        // Try positioning to the left first (preferred for sidebar)
        const leftPosition = buttonRect.left - menuWidth;
        
        // Check if menu would go off the left edge
        if (leftPosition < viewportPadding) {
          // Position to the right instead
          const rightPosition = buttonRect.right;
          // Check if it would go off the right edge
          if (rightPosition + menuWidth > window.innerWidth - viewportPadding) {
            // Align to right edge of viewport
            setMenuPosition({
              top: buttonRect.bottom + spacing,
              left: window.innerWidth - menuWidth - viewportPadding,
            });
          } else {
            // Position to the right of button
            setMenuPosition({
              top: buttonRect.bottom + spacing,
              left: rightPosition,
            });
          }
          setMenuAlignRight(true);
        } else {
          // Position to the left of button (preferred)
          setMenuPosition({
            top: buttonRect.bottom + spacing,
            left: leftPosition,
          });
          setMenuAlignRight(false);
        }
      };

      // Calculate position after a brief delay to ensure DOM is ready
      requestAnimationFrame(() => {
        calculatePosition();
      });

      // Recalculate on scroll and resize
      window.addEventListener('scroll', calculatePosition, true);
      window.addEventListener('resize', calculatePosition);

      return () => {
        window.removeEventListener('scroll', calculatePosition, true);
        window.removeEventListener('resize', calculatePosition);
      };
    } else {
      setMenuPosition(null);
      setMenuAlignRight(false);
    }
  }, [openMenuId, person.id]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (!target.closest('[aria-label="Person menu"]')) {
          setOpenMenuId(null);
        }
      }
    };

    if (openMenuId === person.id) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId, person.id]);

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setDeleteConfirm(false);
    onDelete(person.id);
  };

  const handleToggleFavorite = async () => {
    if (!onToggleFavorite) return;

    setOpenMenuId(null);
    const newFavoriteStatus = !person.is_favorite;
    
    try {
      const response = await fetch(`/api/people/${person.id}/favorite`, {
        method: 'PATCH',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onToggleFavorite(person.id, newFavoriteStatus);
        showSuccessToast(newFavoriteStatus ? 'Added to favorites' : 'Removed from favorites');
      } else {
        throw new Error(result.error || 'Failed to toggle favorite');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to toggle favorite';
      showErrorToast(errorMessage);
    }
  };

  return (
    <>
      <div className="group relative flex items-center gap-3 px-3 py-1.5 rounded-md sidebar-link transition-colors">
        {/* Avatar */}
        <Link
          href={`/people/${person.id}`}
          className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-[10px] font-medium hover:opacity-80 transition-opacity"
        >
          {getInitials(person.name)}
        </Link>

        {/* Name */}
        <Link
          href={`/people/${person.id}`}
          className="flex-1 min-w-0 text-sm font-light truncate"
          style={{ color: 'var(--text-primary)' }}
        >
          {person.name}
        </Link>

        {/* Menu Button */}
        <div className="relative flex-shrink-0" ref={menuRef}>
          <IconButton
            variant="group-hover"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpenMenuId(openMenuId === person.id ? null : person.id);
            }}
            disabled={loading}
            isActive={openMenuId === person.id}
            aria-label="Person menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </IconButton>

          {/* Dropdown Menu */}
          {/* Convention: Sidebar menus use fixed positioning to escape overflow containers.
              This prevents clipping when menus extend beyond sidebar boundaries.
              Other menus (outside sidebar) use absolute positioning with right-0. */}
          {openMenuId === person.id && menuPosition && (
            <>
              <div
                className="fixed inset-0 z-45"
                onClick={() => setOpenMenuId(null)}
              />
              <div
                className="fixed w-56 rounded-md shadow-lg z-50 border"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  top: `${menuPosition.top}px`,
                  left: `${menuPosition.left}px`,
                }}
              >
                <div className="py-1">
                  {/* Add to favorites / Remove from favorites */}
                  {onToggleFavorite && (
                    <button
                      onClick={handleToggleFavorite}
                      disabled={loading}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-tertiary transition-colors disabled:opacity-50"
                      style={{
                        color: 'var(--text-primary)',
                        backgroundColor: 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {person.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                    </button>
                  )}

                  {/* Divider */}
                  {onToggleFavorite && onDelete && (
                    <div
                      className="my-1"
                      style={{ borderColor: 'var(--border-color)', borderTopWidth: '1px' }}
                    />
                  )}

                  {/* Delete */}
                  {onDelete && (
                    <button
                      onClick={() => {
                        setOpenMenuId(null);
                        setDeleteConfirm(true);
                      }}
                      disabled={loading}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-tertiary transition-colors disabled:opacity-50"
                      style={{
                        color: '#ef4444',
                        backgroundColor: 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm}
        title="Delete Person"
        message={`Are you sure you want to delete ${person.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(false)}
      />
    </>
  );
}

