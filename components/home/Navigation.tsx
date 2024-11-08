'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import LoginButton from '@/components/auth/LoginButton';
import SearchForm from '@/components/home/SearchForm';

import BaseImage from '../image/BaseImage';
import LocaleSwitcher from '../LocaleSwitcher';
import MenuBtn from './MenuBtn';
import NavigationDrawer from './NavigationDrawer';

export default function Navigation() {
  const t = useTranslations('Navigation');

  const [open, setOpen] = useState(false);

  return (
    <>
      <header className='sticky left-0 top-0 z-50 flex h-[64px] bg-[#AAAAFF] px-3 sm:px-5 lg:px-0'>
        <nav className='mx-auto flex max-w-pc flex-1 items-center'>
          <div>
            <Link className='hover:opacity-80' href='/' title={t('title')}>
              <BaseImage
                src='/favicon.ico'
                alt={t('title')}
                title={t('title')}
                width={64}
                height={64}
                className='size-12 sm:size-[58px] lg:size-16'
              />
            </Link>
          </div>
          <div className='flex flex-col items-center lg:items-stretch'>
            <p className='animate-pulse font-game text-base font-bold tracking-wider text-white hover:animate-bounce sm:text-xl lg:h-8 lg:text-[32px]'>
              🎮 Cool Guess Game 🎯
            </p>
          </div>
          {/* pc */}
          <div className='hidden w-full max-w-[600px] items-center justify-center px-4 lg:flex'>
            <SearchForm />
          </div>
          {/* 移动端搜索框 */}
          <div className='flex w-full max-w-[200px] items-center justify-center px-2 sm:max-w-[300px] lg:hidden'>
            <SearchForm />
          </div>
          <div className='ml-auto flex h-full items-center gap-x-2 sm:gap-x-[46px]'>
            <div className='flex items-center gap-x-2 sm:gap-x-3'>
              {process.env.NEXT_PUBLIC_CHECK_GOOGLE_LOGIN !== '0' ? <LoginButton /> : null}
            </div>
            <div className='flex items-center gap-x-2 sm:gap-x-3'>
              <LocaleSwitcher />
            </div>
          </div>
          {/* mobile */}
          <div className='ml-2 flex items-center gap-x-2 lg:hidden'>
            <MenuBtn open={open} onClick={() => setOpen(!open)} />
          </div>
        </nav>
      </header>
      <NavigationDrawer open={open} setOpen={setOpen} />
    </>
  );
}
