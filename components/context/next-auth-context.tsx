'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export function NextAuthProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider session={null}>{children}</NextAuthSessionProvider>;
}
