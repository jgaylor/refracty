'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { PersonSelectionModal } from './people/PersonSelectionModal';
import { AddPersonModal } from './people/AddPersonModal';
import { PersonWithNote } from '@/lib/supabase/people';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

const MAX_LENGTH = 144;

export function InsightCapture() {
  const pathname = usePathname();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPersonModal, setShowPersonModal] = useState(false);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [people, setPeople] = useState<PersonWithNote[]>([]);
  const [pendingNoteContent, setPendingNoteContent] = useState<string | null>(null);

  // Extract person ID from pathname if on person detail page
  const personIdMatch = pathname.match(/^\/people\/([^/]+)$/);
  const currentPersonId = personIdMatch ? personIdMatch[1] : null;

  // Determine if we should show the component (exclude /settings and /style-guide)
  const shouldShow = pathname !== '/settings' && pathname !== '/style-guide';

  // Fetch people list when modal opens
  useEffect(() => {
    if (showPersonModal) {
      fetch('/api/people')
        .then((res) => res.json())
        .then((data) => {
          if (data.people) {
            setPeople(data.people);
          }
        })
        .catch((error) => {
          console.error('Error fetching people:', error);
        });
    }
  }, [showPersonModal]);

  // Fetch current person data if on person page (for placeholder)
  const [currentPerson, setCurrentPerson] = useState<{ name: string } | null>(null);
  useEffect(() => {
    if (currentPersonId) {
      // Fetch person data for placeholder
      fetch(`/api/people/${currentPersonId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.person) {
            setCurrentPerson({ name: data.person.name });
          }
        })
        .catch(() => {
          // Silently fail - placeholder will use generic text
        });
    } else {
      setCurrentPerson(null);
    }
  }, [currentPersonId]);

  const handleSubmit = async () => {
    if (!content.trim() || content.length > MAX_LENGTH) return;

    // If on person detail page, submit directly
    if (currentPersonId) {
      await submitNote(currentPersonId, content);
    } else {
      // Show person selection modal
      setShowPersonModal(true);
    }
  };

  const submitNote = async (personId: string, noteContent: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/people/${personId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: noteContent }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setContent('');
        
        // Show success toast with link to person page
        showSuccessToast('Note captured', {
          href: `/people/${personId}`,
          text: 'View person',
        });
        
        router.refresh();
      } else {
        throw new Error(result.error || 'Failed to create note');
      }
    } catch (error) {
      console.error('Error creating note:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create note';
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonSelect = async (personId: string) => {
    setShowPersonModal(false);
    await submitNote(personId, content);
  };

  const handleAddPersonClick = () => {
    // Store the note content so we can submit it after person is created
    setPendingNoteContent(content);
    setShowPersonModal(false);
    setShowAddPersonModal(true);
  };

  const handlePersonAdded = async (personId: string) => {
    // Close both modals
    setShowAddPersonModal(false);
    setShowPersonModal(false);
    
    // Refresh people list
    const response = await fetch('/api/people');
    const data = await response.json();
    if (data.people) {
      setPeople(data.people);
    }
    
    // Auto-select the newly created person and submit the note
    if (pendingNoteContent) {
      await submitNote(personId, pendingNoteContent);
      setPendingNoteContent(null);
    }
  };

  if (!shouldShow) return null;

  const placeholder = currentPerson
    ? `Capture an insight about ${currentPerson.name}...`
    : 'Capture an insight about someone...';

  return (
    <>
      <div className="fixed bottom-0 left-0 md:left-52 right-0 z-40">
        <div className="pl-0 pr-2 md:pl-4 md:pr-2 mb-6">
        <div className="px-4">
            <div className="max-w-3xl mx-auto border-t py-4 rounded-lg shadow-lg" style={{ background: 'var(--bg-gradient)', borderColor: 'var(--border-color)' }}>
            <div className="px-4">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="flex items-center gap-3"
              >
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={content}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (newValue.length <= MAX_LENGTH) {
                        setContent(newValue);
                      }
                    }}
                    disabled={loading}
                    className="input w-full px-4 py-3 pr-20 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    maxLength={MAX_LENGTH}
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {content.length}/{MAX_LENGTH}
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={loading || !content.trim()}
                  className="btn-primary p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  aria-label="Submit insight"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </button>
              </form>
              <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-tertiary)' }}>
                One idea per note keeps things clearer later.
              </p>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Person Selection Modal */}
      <PersonSelectionModal
        isOpen={showPersonModal}
        onClose={() => setShowPersonModal(false)}
        onSelect={handlePersonSelect}
        people={people}
        onAddPerson={handleAddPersonClick}
      />

      {/* Add Person Modal */}
      <AddPersonModal
        isOpen={showAddPersonModal}
        onClose={() => {
          setShowAddPersonModal(false);
          setPendingNoteContent(null);
          // Reopen person selection modal if we have content
          if (content.trim()) {
            setShowPersonModal(true);
          }
        }}
        onPersonAdded={handlePersonAdded}
      />
    </>
  );
}

