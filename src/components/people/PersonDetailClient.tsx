'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Person, Note } from '@/lib/supabase/people';
import { Insight } from '@/lib/supabase/insights';
import { PersonHeader } from './PersonHeader';
import { InsightsTab } from './InsightsTab';
import { ExpandableNotesCard } from './ExpandableNotesCard';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { useMobileHeader } from '@/components/MobileHeaderProvider';

interface PersonDetailClientProps {
  person: Person;
  initialInsights: Insight[];
  initialNotes: Note[];
}

export function PersonDetailClient({
  person,
  initialInsights,
  initialNotes,
}: PersonDetailClientProps) {
  const router = useRouter();
  const { setConfig } = useMobileHeader();

  const handleDelete = useCallback(async () => {
    try {
      const response = await fetch(`/api/people/${person.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showSuccessToast('Person deleted');
        router.push('/home');
        router.refresh();
      } else {
        throw new Error(result.error || 'Failed to delete person');
      }
    } catch (error) {
      console.error('Error deleting person:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete person';
      showErrorToast(errorMessage);
    }
  }, [person.id, router]);

  // Configure mobile header
  useEffect(() => {
    setConfig({
      pageTitle: person.name,
      moreActions: [
        {
          label: 'Delete person',
          onClick: handleDelete,
          destructive: true,
        },
      ],
    });

    return () => {
      setConfig(null);
    };
  }, [person.name, setConfig, handleDelete]);

  return (
    <div>
      <PersonHeader person={person} onDelete={handleDelete} />

      {/* Expandable Notes Card */}
      <div className="mb-6">
        <ExpandableNotesCard
          personId={person.id}
          initialNotes={initialNotes}
        />
      </div>

      {/* Insights Content */}
      <InsightsTab personId={person.id} initialInsights={initialInsights} />
    </div>
  );
}

