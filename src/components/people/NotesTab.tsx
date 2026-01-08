'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Note } from '@/lib/supabase/people';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { NoteItem } from './NoteItem';

interface NotesTabProps {
  personId: string;
  initialNotes: Note[];
  onNotesChange?: (count: number) => void;
}

export function NotesTab({ personId, initialNotes, onNotesChange }: NotesTabProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Sync notes with initialNotes when it changes, but preserve optimistic updates
  useEffect(() => {
    // Only sync if initialNotes has significantly more items (likely a server refresh)
    // This prevents overwriting optimistic updates but allows syncing after navigation
    const currentNoteIds = new Set(notes.map(n => n.id));
    const initialNoteIds = new Set(initialNotes.map(n => n.id));
    
    // If initialNotes has notes that aren't in current state, sync
    const hasNewNotes = initialNotes.some(note => !currentNoteIds.has(note.id));
    if (hasNewNotes && initialNotes.length >= notes.length) {
      setNotes(initialNotes);
      onNotesChange?.(initialNotes.length);
    }
  }, [initialNotes, notes, onNotesChange]);



  const handleDeleteNote = async (noteId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/people/${personId}/notes/${noteId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Remove note from list
        setNotes((prev) => {
          const updated = prev.filter((note) => note.id !== noteId);
          onNotesChange?.(updated.length);
          return updated;
        });
        showSuccessToast('Note deleted');
        router.refresh();
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
    <div>
      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-500">No notes yet.</p>
        </div>
      ) : (
        <div
          className="rounded-lg border"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)',
          }}
        >
          {notes.map((note, index) => (
            <NoteItem
              key={note.id}
              note={note}
              showPersonName={false}
              onDelete={handleDeleteNote}
              isDeleting={loading}
              borderTop={index > 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
