'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import LoginButton from '@/components/auth/LoginButton';
import SearchForm from '@/components/home/SearchForm';

import BaseImage from '../image/BaseImage';
import MenuBtn from './MenuBtn';
import NavigationDrawer from './NavigationDrawer';

export default function Navigation() {
  const t = useTranslations('Navigation');

  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  const NavLinks = NAV_LINKS.map((item) => ({
    ...item,
    label: t(`${item.code}`),
  }));

  return (
    <>
      <header className='sticky left-0 top-0 z-50 flex h-[64px] bg-[#AAAAFF] px-4 sm:px-6 lg:px-8'>
        <nav className='mx-auto flex w-full max-w-7xl items-center justify-between'>
          {/* Logo区域 */}
          <div className='flex items-center gap-x-4'>
            <Link className='hover:opacity-80' href='/' title={t('title')}>
              <BaseImage
                src='/favicon.ico'
                alt={t('title')}
                title={t('title')}
                width={64}
                height={64}
                className='size-10 sm:size-12 lg:size-14'
              />
            </Link>
            <p className='animate-pulse font-game text-sm font-bold tracking-wider text-white hover:animate-bounce sm:text-lg lg:text-2xl'>
              🎮 Cool Guess Game 🎯
            </p>
          </div>

          {/* PC导航链接和搜索 */}
          <div className='mx-auto hidden max-w-3xl flex-1 items-center justify-center px-6 lg:flex'>
            <ul className='flex items-center gap-x-8 capitalize'>
              {NavLinks.map((item) => (
                <Link key={item.code} href={item.href} title={item.code}>
                  <li
                    className={cn(
                      'text-white/60 transition-colors hover:text-white',
                      pathname === item.href && 'font-medium text-white',
                      pathname.includes(item.href) && item.href !== '/' && 'font-medium text-white',
                    )}
                  >
                    {item.label}
                  </li>
                </Link>
              ))}
            </ul>
            <div className='ml-6 w-[280px]'>
              <SearchForm />
            </div>
          </div>

          {/* 移动端搜索框 */}
          <div className='mx-auto max-w-[280px] flex-1 lg:hidden'>
            <SearchForm />
          </div>

          {/* 右侧操作区 */}
          <div className='flex items-center gap-x-3 sm:gap-x-4'>
            {process.env.NEXT_PUBLIC_CHECK_GOOGLE_LOGIN !== '0' && <LoginButton />}
            {/* <LocaleSwitcher /> */}
            <div className='lg:hidden'>
              <MenuBtn open={open} onClick={() => setOpen(!open)} />
            </div>
          </div>
        </nav>
      </header>
      <NavigationDrawer open={open} setOpen={setOpen} />
    </>
  );
}
