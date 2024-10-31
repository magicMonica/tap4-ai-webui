'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';

export default function LoginButton() {
  const { data: session } = useSession();

  console.log(session);

  if (session && session.user) {
    return (
      <div className='flex items-center gap-4'>
        <span className='text-sm'>{session.user.name}</span>
        <Button variant='outline' onClick={() => signOut()} className='text-white hover:text-white/70'>
          Log out
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant='outline'
      onClick={() => signIn('google')}
      className='border-neutral-700 bg-transparent text-neutral-100 transition-all hover:bg-neutral-800 hover:text-neutral-100'
    >
      Log in
    </Button>
  );
}
