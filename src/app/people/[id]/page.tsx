import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPersonById, getNotesByPerson } from '@/lib/supabase/people';
import { getInsightsByPerson } from '@/lib/supabase/insights';
import { PersonDetailClient } from '@/components/people/PersonDetailClient';

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
        <Link
          href="/people"
          className="inline-flex items-center gap-2 text-sm mb-4 text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to People
        </Link>
        <PersonDetailClient
          person={person}
          initialInsights={insights}
          initialNotes={notes}
        />
      </div>
    </div>
  );
}

