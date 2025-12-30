'use client';

import Link from 'next/link';
import { PersonWithNote } from '@/lib/supabase/people';

interface PeopleListProps {
  people: PersonWithNote[];
  onPersonClick?: (person: PersonWithNote) => void;
}

export function PeopleList({ people, onPersonClick }: PeopleListProps) {
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (people.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">No people yet. Add someone to get started.</p>
      </div>
    );
  }

  return (
    <div>
      {people.map((person) => {
        const content = (
          <div className="card p-4 cursor-pointer transition-colors hover:bg-opacity-95 hover:shadow-md">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-medium">
                {getInitials(person.name)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
                  {person.name}
                </h3>
                {person.vibe_summary && (
                  <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {person.vibe_summary}
                  </p>
                )}
                {person.first_note && (
                  <p className="text-sm mt-2 italic" style={{ color: 'var(--text-tertiary)' }}>
                    {person.first_note.content}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

        if (onPersonClick) {
          return (
            <div key={person.id} className="mb-4 last:mb-0" onClick={() => onPersonClick(person)}>
              {content}
            </div>
          );
        }

        return (
          <Link key={person.id} href={`/people/${person.id}`} className="block mb-4 last:mb-0">
            {content}
          </Link>
        );
      })}
    </div>
  );
}

