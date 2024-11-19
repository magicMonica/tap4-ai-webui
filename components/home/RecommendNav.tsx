'use client';

import React from 'react';
import Link from 'next/link';
import { GsGameInfo } from '@/db/supabase/types';

import CircleArrowRight from '@/components/icons/CircleArrowRight';
import BaseImage from '@/components/image/BaseImage';

interface RecommendNavProps {
  recommendGameList: GsGameInfo[];
  translations: {
    recommended: string;
    moreGames: string;
  };
}

function RecommendNav({ recommendGameList, translations }: RecommendNavProps) {
  return (
    <div className='sticky top-20 mb-8 h-fit space-y-6 overflow-y-auto rounded-lg bg-gray-800/40 p-6 shadow-xl backdrop-blur-xl lg:max-h-[calc(100vh-8rem)]'>
      <h2 className='mb-4 text-2xl font-bold tracking-tight text-white'>{translations.recommended}</h2>

      <div className='grid grid-cols-2 gap-6'>
        {recommendGameList?.map((item) => (
          <Link
            key={item.id}
            href={`/game/${item.name}`}
            className='group relative aspect-square w-full overflow-hidden rounded-xl'
          >
            <BaseImage
              title={item.title || ''}
              alt={item.title || ''}
              fill
              src={item.thumbnail_url || '/placeholder.jpg'}
              className='object-cover transition-all duration-500 ease-in-out group-hover:scale-125'
            />
            <div className='absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
              <span className='line-clamp-2 text-center text-sm font-medium text-white'>{item.title}</span>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href='/explore'
        className='active:scale-98 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-700/60 px-5 py-3 font-medium text-white transition-all hover:bg-gray-600/60 hover:shadow-lg'
      >
        {translations.moreGames}
        <CircleArrowRight className='h-5 w-5' />
      </Link>
    </div>
  );
}

export default RecommendNav;
