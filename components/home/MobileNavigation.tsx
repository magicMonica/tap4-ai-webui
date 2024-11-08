'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

export default function MobileNavigation({ className }: { className?: string }) {
  const t = useTranslations('Navigation');

  const menuItems = [
    { icon: '🎮', label: t('home'), href: '/' },
    { icon: '🌍', label: t('worldguessr'), href: '/game/worldguessr' },
    { icon: '🎉', label: t('emoji'), href: '/game/emoji' },
    { icon: '🤔', label: t('guesswho'), href: '/game/guesswho' },
    { icon: '💡', label: t('trivia'), href: '/game/trivia' },
    { icon: '🔤', label: t('wordle'), href: '/game/wordle' },
  ];

  return (
    <nav className={cn('bg-tap4-black/80 z-40 border-t border-white/10 backdrop-blur-md', className)}>
      <div className='flex h-16 items-center justify-around'>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className='flex items-center gap-3 rounded-lg p-2
              transition-all duration-300 hover:bg-white/20'
          >
            <span className='min-w-[28px] text-2xl transition-transform hover:scale-110'>{item.icon}</span>
            <span
              className='overflow-hidden whitespace-nowrap font-medium text-white
              opacity-0 transition-all duration-300 group-hover:opacity-100'
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
