'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log('Session status:', status);
    if (status === 'unauthenticated') {
      router.replace('/sign-in');
    }
  }, [status, router]);

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return <p>Redirecting to sign-in...</p>;

  return <div>Welcome to the Dashboard, {session.user.username}</div>;
}
