import { getPeople, createSamplePerson } from '@/lib/supabase/people';
import { PeopleList } from '@/components/people/PeopleList';
import { PeoplePageClient } from '@/components/people/PeoplePageClient';

export default async function PeoplePage() {
  let people = await getPeople();

  // If user has no people, create sample person (fallback in case auth callback didn't catch it)
  if (people.length === 0) {
    try {
      const result = await createSamplePerson();
      if (result.success && result.person) {
        // Refresh people list to include the sample person
        people = await getPeople();
      }
    } catch (error) {
      // Don't block page load if sample creation fails
      console.error('Error creating sample person:', error);
    }
  }

  return (
    <div className="px-4">
      <div className="max-w-2xl mx-auto">
        <PeoplePageClient initialPeople={people} />
      </div>
    </div>
  );
}
