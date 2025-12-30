import { getAllNotesAndInsights } from '@/lib/supabase/insights';
import { InsightsList } from '@/components/insights/InsightsList';
import { getUser } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';

export default async function InsightsPage() {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/e167765d-2db9-4a7f-8487-28e2f87e5d24',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'insights/page.tsx:4',message:'InsightsPage render start',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }
  
  const { items, hasMore } = await getAllNotesAndInsights(20, 0);

  return (
    <div className="px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Insights</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
          All your notes and observations in one place
        </p>
        <InsightsList initialItems={items} initialHasMore={hasMore} />
      </div>
    </div>
  );
}

