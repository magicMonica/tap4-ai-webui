import React from 'react';
import Link from 'next/link';
import { GsGameInfo } from '@/db/supabase/types';

import BaseImage from '@/components/image/BaseImage';

interface GameCardListProps {
  dataList: GsGameInfo[];
}

function GameCardList({ dataList }: GameCardListProps) {
  return dataList?.map((game) => (
    <Link
      key={game.id}
      href={`/game/${game.name}`}
      className='group relative aspect-square overflow-hidden rounded-lg bg-gray-800/30 backdrop-blur-xl'
    >
      <BaseImage
        title={game.title || ''}
        alt={game.title || ''}
        fill
        src={game.thumbnail_url || '/placeholder.jpg'}
        className='object-cover transition-transform group-hover:scale-110'
      />
      <div className='absolute inset-0 flex items-center justify-center bg-black/60 p-2 opacity-0 transition-opacity group-hover:opacity-100'>
        <h3 className='text-center text-sm font-medium text-white'>{game.title}</h3>
      </div>
    </Link>
  ));
}

export default GameCardList;
