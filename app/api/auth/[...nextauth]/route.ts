import { headers } from 'next/headers';
import { createClient } from '@/db/supabase/client';
import { OAuth2Client } from 'google-auth-library';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const googleAuthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET_ID as string,
    }),
    // connect with google api internally
    CredentialsProvider({
      // We will use this id later to specify for what Provider we want to trigger the signIn method
      id: 'googleonetap',
      name: 'google-one-tap',
      // This means that the authentication will be done through a single credential called 'credential'
      credentials: {
        credential: { type: 'text' },
      },
      // @ts-ignore
      authorize: async (credentials) => {
        // These next few lines are simply the recommended way to use the Google Auth Javascript API as seen in the Google Auth docs
        // What is going to happen is that t he Google One Tap UI will make an API call to Google and return a token associated with the user account
        // This token is then passed to the authorize function and used to retrieve the customer information (payload).
        // If this doesn't make sense yet, come back to it after having seen the custom hook.

        const token = credentials!.credential;
        const ticket = await googleAuthClient.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
          throw new Error('Cannot extract payload from signin token');
        }
        const { email, name, picture: image } = payload;
        if (!email) {
          throw new Error('Email not available');
        }
        const user = { email, name, image };
        const headerAll = headers();
        const userIp = headerAll.get('x-forwarded-for');
        await checkAndSaveUser(user.name, user.email, user.image, userIp);
        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const headerAll = headers();
      const userIp = headerAll.get('x-forwarded-for');
      await checkAndSaveUser(user.name, user.email, user.image, userIp);
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session }) {
      if (session) {
        const email = session?.user?.email;
        if (email) {
          session.user = await getUserByEmail(email);
          return session;
        }
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

async function checkAndSaveUser(
  name: string | null | undefined,
  email: string | null | undefined,
  image: string | null | undefined,
  ip: string | null | undefined,
) {
  if (!email) return null;

  const supabase = createClient();

  // 检查用户是否存在
  const { data: existingUser, error: fetchError } = await supabase.from('users').select().eq('email', email).single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw new Error(fetchError.message);
  }

  if (existingUser) {
    // 更新用户信息
    const { error: updateError } = await supabase
      .from('users')
      .update({
        name,
        image,
        ip,
        updated_at: new Date().toISOString(),
      })
      .eq('email', email);

    if (updateError) {
      throw new Error(updateError.message);
    }
    return existingUser;
  }

  // 创建新用户
  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert({
      name,
      email,
      image,
      ip,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (insertError) {
    throw new Error(insertError.message);
  }

  return newUser;
}

async function getUserByEmail(email: string) {
  const supabase = createClient();

  const { data: user, error } = await supabase.from('users').select().eq('email', email).single();

  if (error) {
    throw new Error(error.message);
  }

  return user;
}
