import { LoginForm } from '@/components/auth/LoginForm';
import { getUser } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const user = await getUser();
  if (user) {
    redirect('/people');
  }
  
  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-xs">
        <h1 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--text-primary)' }}>Log In</h1>
        <LoginForm />
      </div>
    </div>
  );
}

