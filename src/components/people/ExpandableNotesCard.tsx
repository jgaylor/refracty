'use client';

import { useState, useEffect, useRef } from 'react';
import { Note } from '@/lib/supabase/people';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { NoteItem } from './NoteItem';

interface ExpandableNotesCardProps {
  personId: string;
  initialNotes: Note[];
  onNotesChange?: (count: number) => void;
}

export function ExpandableNotesCard({ personId, initialNotes, onNotesChange }: ExpandableNotesCardProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [loading, setLoading] = useState(false);
  const onNotesChangeRef = useRef(onNotesChange);
  
  // Keep ref in sync with prop
  useEffect(() => {
    onNotesChangeRef.current = onNotesChange;
  }, [onNotesChange]);

  // Simple sync: add new notes from initialNotes, replace when server confirms removals
  useEffect(() => {
    setNotes((prev) => {
      const currentNoteIds = new Set(prev.map(n => n.id));
      const initialNoteIds = new Set(initialNotes.map(n => n.id));
      
      const hasNewNotes = initialNotes.some(note => !currentNoteIds.has(note.id));
      const hasRemovedNotes = initialNotes.length < prev.length;
      
      // When new notes arrive from server, add them (avoid duplicates)
      if (hasNewNotes) {
        const existingIds = new Set(prev.map(n => n.id));
        const newNotes = initialNotes.filter(note => !existingIds.has(note.id));
        const updated = [...newNotes, ...prev];
        return updated;
      }
      // When server confirms removals (fewer notes), replace state
      else if (hasRemovedNotes) {
        return initialNotes;
      }
      return prev;
    });
  }, [initialNotes]);

  // Listen for note added events to update count optimistically
  useEffect(() => {
    const handleNoteAdded = (event: CustomEvent<{ personId: string; note: Note }>) => {
      if (event.detail.personId === personId) {
        setNotes((prev) => {
          // Check if note already exists to avoid duplicates
          if (prev.some(n => n.id === event.detail.note.id)) {
            return prev;
          }
          // Add note to the beginning of the list
          const updated = [event.detail.note, ...prev];
          return updated;
        });
      }
    };

    window.addEventListener('noteAdded', handleNoteAdded as EventListener);
    return () => {
      window.removeEventListener('noteAdded', handleNoteAdded as EventListener);
    };
  }, [personId]);

  // Notify parent when notes count changes (after render phase)
  useEffect(() => {
    onNotesChangeRef.current?.(notes.length);
  }, [notes.length]);

  const handleDeleteNote = async (noteId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/people/${personId}/notes/${noteId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Optimistically remove the note
        setNotes((prev) => {
          const updated = prev.filter((note) => note.id !== noteId);
          return updated;
        });
        showSuccessToast('Note deleted');
      } else {
        throw new Error(result.error || 'Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete note';
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-lg border"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Header */}
      <div
        className="w-full px-4 py-4 flex items-center"
        style={{ color: 'var(--text-primary)' }}
      >
        <span className="text-base font-medium flex items-center gap-2">
          Notes
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            {notes.length}
          </span>
        </span>
      </div>

      {/* Notes List - Always visible */}
      <div>
        {notes.length === 0 ? (
          <div className="px-4 pb-4">
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No notes yet.</p>
          </div>
        ) : (
          <>
            {notes.map((note, index) => (
              <NoteItem
                key={note.id}
                note={note}
                showPersonName={false}
                onDelete={handleDeleteNote}
                isDeleting={loading}
                borderTop={true}
              />
            ))}
          </>
          )}
        </div>
    </div>
  );
}

