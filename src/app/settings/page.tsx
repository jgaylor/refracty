import { getUser } from '@/lib/supabase/auth';
import { getUserProfile } from '@/lib/supabase/profile';
import { redirect } from 'next/navigation';
import { ProfileContent } from '@/components/ProfileContent';

export default async function SettingsPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  const profile = await getUserProfile();

  return (
    <div>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        <ProfileContent user={user} appearance={profile?.appearance} />
      </div>
    </div>
  );
}

