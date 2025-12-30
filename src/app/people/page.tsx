import { getPeople } from '@/lib/supabase/people';
import { PeopleList } from '@/components/people/PeopleList';
import { PeoplePageClient } from '@/components/people/PeoplePageClient';

export default async function PeoplePage() {
  const people = await getPeople();

  return (
    <div className="px-4">
      <div className="max-w-2xl mx-auto">
        <PeoplePageClient initialPeople={people} />
      </div>
    </div>
  );
}
