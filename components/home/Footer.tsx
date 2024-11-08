import { HTMLAttributeAnchorTarget } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { CONTACT_US_EMAIL } from '@/lib/env';

function InfoLink({
  href,
  title,
  target,
  type,
}: {
  href: string;
  title: string;
  target?: HTMLAttributeAnchorTarget;
  type?: string;
}) {
  return (
    <Link
      href={href}
      title={title}
      className='whitespace-nowrap text-xs text-white/80 transition-all
        duration-300 hover:scale-105 hover:text-white lg:text-sm'
      target={target}
      type={type}
    >
      {title}
    </Link>
  );
}

export default function Footer() {
  const t = useTranslations('Footer');

  const FEATURE_LINKS = [
    {
      title: t('submit'),
      href: 'https://aiguideshub.com/submit',
      target: '_blank',
    },
  ];

  const SUPPORT_LINKS = [
    {
      title: t('privacy'),
      href: '/privacy-policy',
    },
    {
      title: t('termsConditions'),
      href: '/terms-of-service',
    },
    {
      title: t('contactUs'),
      href: `mailto:${CONTACT_US_EMAIL}`,
      type: 'email',
    },
  ];

  return (
    <footer className='w-full bg-gradient-to-b from-[#AAAAFF]/90 to-[#8A8AFF] shadow-lg'>
      <div
        className='mx-auto flex min-h-[200px] max-w-pc flex-col items-center
        justify-between px-6 py-8 lg:h-[180px] lg:flex-row lg:px-8'
      >
        <div className='flex flex-col items-center lg:items-start'>
          <p
            className='font-game text-xl font-bold tracking-wider text-white
            drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] lg:text-[32px]'
          >
            {t('title')}
          </p>
          <p className='mt-2 text-sm text-white/90'>{t('subTitle')}</p>
        </div>

        <div
          className='mt-8 flex flex-col items-center gap-8 lg:mt-0
          lg:flex-row lg:items-start lg:gap-16'
        >
          <div className='flex flex-col gap-3'>
            <p className='font-bold text-white drop-shadow-sm'>{t('feature')}</p>
            {FEATURE_LINKS.map((item) => (
              <InfoLink key={item.href} href={item.href} title={item.title} target={item.target} />
            ))}
          </div>

          <div className='flex flex-col gap-3'>
            <p className='font-bold text-white drop-shadow-sm'>{t('support')}</p>
            {SUPPORT_LINKS.map((item) => (
              <InfoLink key={item.href} href={item.href} title={item.title} type={item.type} />
            ))}
          </div>
        </div>
      </div>

      <div className='flex justify-center border-t border-white/10 py-4'>
        <p className='text-sm text-white/90 transition-colors duration-300 hover:text-white'>
          Copyright 2024 © Cool Guess Game All rights reserved.
        </p>
      </div>
    </footer>
  );
}
