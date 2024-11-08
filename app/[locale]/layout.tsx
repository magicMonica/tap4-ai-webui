import { NextIntlClientProvider, useMessages } from 'next-intl';

import { Toaster } from '@/components/ui/sonner';
import NextAuthProvider from '@/components/context/next-auth-context';
import Navigation from '@/components/home/Navigation';
import SideNavigation from '@/components/home/SideNavigation';

import './globals.css';

import { Suspense } from 'react';

import GoogleAdScript from '@/components/ad/GoogleAdScript';
import SeoScript from '@/components/seo/SeoScript';

import styles from './GradientBackground.module.css';
import Loading from './loading';

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();

  return (
    <html lang={locale} suppressHydrationWarning className='dark'>
      <body className='bg-tap4-black relative min-h-screen text-white'>
        <div className={styles.gradientBackground} />
        <div className={styles.noiseOverlay} />
        <NextAuthProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className='relative z-10 mx-auto flex min-h-screen max-w-[2000px]'>
              <SideNavigation />
              <div className='flex w-full flex-1 flex-col'>
                <Navigation />
                <main className='flex-1 p-4 md:p-6 lg:p-8'>
                  <Suspense fallback={<Loading />}>{children}</Suspense>
                </main>
              </div>
            </div>
            <Toaster
              position='top-center'
              toastOptions={{
                classNames: {
                  error: 'bg-red-400',
                  success: 'text-green-400',
                  warning: 'text-yellow-400',
                  info: 'bg-blue-400',
                },
              }}
            />
          </NextIntlClientProvider>
          <SeoScript />
          <GoogleAdScript />
        </NextAuthProvider>
      </body>
    </html>
  );
}
