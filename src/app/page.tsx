import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/auth';

export default async function Home() {
  const user = await getUser();
  if (user) {
    redirect('/people');
  } else {
    redirect('/login');
  }
}
