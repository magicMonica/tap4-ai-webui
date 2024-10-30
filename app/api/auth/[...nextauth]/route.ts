import { SupabaseAdapter } from '@auth/supabase-adapter';
import NextAuth, { Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// 扩展 Session 类型
interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  }),
  callbacks: {
    async session({ session, user }): Promise<ExtendedSession> {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      } as ExtendedSession;
    },
  },
});

export { handler as GET, handler as POST };
