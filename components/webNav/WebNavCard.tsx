/* eslint-disable react/jsx-no-target-blank */

import Link from 'next/link';
import { GsGameInfo } from '@/db/supabase/types';
import { CircleArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function WebNavCard({ name, thumbnail_url, title, content }: GsGameInfo) {
  const t = useTranslations('Home');

  return (
    <div className='flex h-[180px] flex-col gap-2 rounded-xl bg-secondary/40 p-1 lg:h-[280px]'>
      <Link href={`/game/${name}`} title={title || ''} className='group relative'>
        <img
          src={thumbnail_url || ''}
          alt={title || ''}
          title={title || ''}
          width={288}
          height={162}
          className='aspect-video w-full rounded-xl bg-white/20 transition-opacity hover:opacity-80'
        />
        <div className='absolute inset-0 z-10 hidden items-center justify-center gap-1 rounded-xl bg-black/40 text-xl text-white transition-all duration-300 group-hover:flex'>
          {t('checkDetail')} <CircleArrowRight className='size-4' />
        </div>
      </Link>
      {/* <div className='flex items-center justify-between px-1'>
        <a href={iframe_url || ''} title={title || ''} target='_blank' rel='nofollow' className='transition-opacity hover:opacity-80'>
          <h3 className='line-clamp-1 flex-1 text-xs font-bold lg:text-sm'>{title || ''}</h3>
        </a>
        <a href={iframe_url || ''} title={title || ''} target='_blank' rel='nofollow' className='transition-opacity hover:opacity-80'>
          <SquareArrowOutUpRight className='size-4' />
          <span className='sr-only'>{title || ''}</span>
        </a>
      </div> */}
      <p className='line-clamp-2 px-1 text-xs text-white/70 lg:line-clamp-3'>{content || ''}</p>
    </div>
  );
}
