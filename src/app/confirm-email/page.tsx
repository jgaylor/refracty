import Link from 'next/link';

export default function ConfirmEmailPage() {
  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-xs">
        <h1 className="text-3xl font-bold text-center mb-4" style={{ color: 'var(--text-primary)' }}>Check your email</h1>
        <p className="text-center text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          We've sent a confirmation link to your email address. Please click the link to verify your account.
        </p>
        <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          Already confirmed?{' '}
          <Link href="/login" className="link font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

