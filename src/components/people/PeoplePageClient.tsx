'use client';

import { useState } from 'react';
import { PersonWithNote } from '@/lib/supabase/people';
import { PeopleList } from './PeopleList';
import { AddPersonModal } from './AddPersonModal';

interface PeoplePageClientProps {
  initialPeople: PersonWithNote[];
}

export function PeoplePageClient({ initialPeople }: PeoplePageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter people based on search query (case-insensitive)
  const filteredPeople = initialPeople.filter((person) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const nameMatch = person.name.toLowerCase().includes(query);
    const vibeMatch = person.vibe_summary?.toLowerCase().includes(query);
    
    return nameMatch || vibeMatch;
  });

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">People</h1>

        {/* Header with Add button and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary px-4 py-2 rounded-md whitespace-nowrap"
          >
            Add Person
          </button>

          <input
            type="search"
            placeholder="Search people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* People List */}
        <PeopleList people={filteredPeople} />
      </div>

      {/* Add Person Modal */}
      <AddPersonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

