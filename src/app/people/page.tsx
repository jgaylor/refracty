import { getPeople, createSamplePerson } from '@/lib/supabase/people';
import { PeopleList } from '@/components/people/PeopleList';
import { PeoplePageClient } from '@/components/people/PeoplePageClient';
import { getUser } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';

export default async function PeoplePage() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }
  
  let people = await getPeople();

  // If user has no people, create sample person (fallback in case auth callback didn't catch it)
  if (people.length === 0) {
    try {
      const result = await createSamplePerson();
      if (result.success && result.person) {
        // Refresh people list to include the sample person
        people = await getPeople();
      } else {
        console.error('Failed to create sample person:', result.error || 'Unknown error');
      }
    } catch (error) {
      // Don't block page load if sample creation fails
      console.error('Error creating sample person (exception):', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
        });
      }
    }
  }

  return (
    <div>
      <div className="max-w-2xl mx-auto">
        <PeoplePageClient initialPeople={people} />
      </div>
    </div>
  );
}
