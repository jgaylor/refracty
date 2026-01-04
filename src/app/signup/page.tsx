import { SignupForm } from '@/components/auth/SignupForm';
import { getUser } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';

export default async function SignupPage() {
  const user = await getUser();
  if (user) {
    redirect('/home');
  }
  
  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-xs">
        <h1 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--text-primary)' }}>Sign Up</h1>
        <SignupForm />
      </div>
    </div>
  );
}

