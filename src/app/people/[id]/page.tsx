import { notFound, redirect } from 'next/navigation';
import { getPersonById, getNotesByPerson } from '@/lib/supabase/people';
import { getInsightsByPerson } from '@/lib/supabase/insights';
import { PersonDetailClient } from '@/components/people/PersonDetailClient';
import { getUser } from '@/lib/supabase/auth';

interface PersonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PersonPage({ params }: PersonPageProps) {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }
  
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
    <div>
      <div className="max-w-2xl mx-auto">
        <PersonDetailClient
          person={person}
          initialInsights={insights}
          initialNotes={notes}
        />
      </div>
    </div>
  );
}

