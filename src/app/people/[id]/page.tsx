import { notFound } from 'next/navigation';
import { getPersonById, getNotesByPerson } from '@/lib/supabase/people';
import { getInsightsByPerson } from '@/lib/supabase/insights';
import { PersonDetailClient } from '@/components/people/PersonDetailClient';
import { PersonPageHeader } from '@/components/people/PersonPageHeader';

interface PersonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = await params;
  const person = await getPersonById(id);

  if (!person) {
    notFound();
  }

  // Fetch insights and notes in parallel
  const [insights, notes] = await Promise.all([
    getInsightsByPerson(id),
    getNotesByPerson(id),
  ]);

  return (
    <div className="px-4">
      <div className="max-w-2xl mx-auto">
        <PersonPageHeader personId={person.id} personName={person.name} />
        <PersonDetailClient
          person={person}
          initialInsights={insights}
          initialNotes={notes}
        />
      </div>
    </div>
  );
}

