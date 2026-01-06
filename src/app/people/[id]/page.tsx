import { notFound, redirect } from 'next/navigation';
import { getPersonById, getNotesByPerson } from '@/lib/supabase/people';
import { getInsightsByPerson } from '@/lib/supabase/insights';
import { PersonDetailClient } from '@/components/people/PersonDetailClient';
import { PersonDetailSkeleton } from '@/components/people/PersonDetailSkeleton';
import { getUser } from '@/lib/supabase/auth';
import { Suspense } from 'react';

interface PersonPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function PersonDetailContent({ id }: { id: string }) {
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
    <PersonDetailClient
      person={person}
      initialInsights={insights}
      initialNotes={notes}
    />
  );
}

export default async function PersonPage({ params }: PersonPageProps) {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }
  
  const { id } = await params;

  return (
    <div>
      <div className="max-w-2xl mx-auto">
        <Suspense fallback={<PersonDetailSkeleton />}>
          <PersonDetailContent id={id} />
        </Suspense>
      </div>
    </div>
  );
}

