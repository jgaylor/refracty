import { Person } from '@/lib/supabase/people';

interface PersonHeaderProps {
  person: Person;
}

export function PersonHeader({ person }: PersonHeaderProps) {
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="mb-8">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-xl font-medium">
          {getInitials(person.name)}
        </div>

        {/* Name and Summary */}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            {person.name}
          </h1>
          {person.vibe_summary && (
            <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
              {person.vibe_summary}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

