import { notFound, redirect } from 'next/navigation';
import { getPersonById, getNotesByPerson } from '@/lib/supabase/people';
import { getInsightsByPerson } from '@/lib/supabase/insights';
import { PersonDetailClient } from '@/components/people/PersonDetailClient';
import { PersonPageHeader } from '@/components/people/PersonPageHeader';
import { getUser } from '@/lib/supabase/auth';

interface PersonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PersonPage({ params }: PersonPageProps) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'people/[id]/page.tsx:13',message:'PersonPage render start',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  
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

