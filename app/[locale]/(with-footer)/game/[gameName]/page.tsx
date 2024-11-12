import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/db/supabase/client';
import { getTranslations } from 'next-intl/server';

import { CircleArrowRight } from '@/components/icons/CircleArrowRight';
import BaseImage from '@/components/image/BaseImage';
import MarkdownProse from '@/components/MarkdownProse';

type Props = {
  params: { gameName: string };
};

// 生成动态元数据
export async function generateMetadata({ params: { gameName } }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { data: gameList } = await supabase.from('gs_game_info').select().eq('name', gameName);

  const game = gameList?.[0];

  console.log('game', game);
  if (!game) {
    return {
      title: 'Game Not Found',
    };
  }

  return {
    title: `${game.title} - Cool Guess Game`,
    description: game.content,
    openGraph: {
      title: `${game.title} - Cool Guess Game`,
      description: game.content || '',
      images: [game.thumbnail_url || ''],
    },
  };
}

export default async function GameDetailPage({ params: { gameName } }: Props) {
  const supabase = createClient();
  const t = await getTranslations('Game.detail');
  const { data: gameList } = await supabase.from('gs_game_info').select().eq('name', gameName);
  const { data: recommendGameList } = await supabase.from('gs_game_info').select().neq('name', gameName).limit(6);

  if (!gameList || gameList.length === 0) {
    notFound();
  }

  const game = gameList[0];

  return (
    <div className='mx-auto w-full max-w-7xl pb-16'>
      <div className='grid grid-cols-1 gap-8 px-6 lg:grid-cols-[1fr,300px] lg:px-0'>
        {/* 左侧主要内容区域 */}
        <div className='space-y-8'>
          {/* 游戏区域 */}
          <div className='aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-900'>
            <iframe
              src={game.iframe_url || game.original_url || ''}
              className='h-full w-full'
              frameBorder='0'
              allow='gamepad *;'
              title={game.title || ''}
            />
          </div>
          {/* 游戏信息区域 */}
          <div className='mb-8 space-y-6 rounded-lg bg-gray-800/30 p-6 backdrop-blur-xl'>
            <div className='space-y-4'>
              <h1 className='bg-gradient-to-r from-white to-gray-400 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl'>
                {game.title}
              </h1>
              <div className='flex flex-wrap gap-2'>
                {game.category_name?.split(',').map((category: string) => (
                  <span
                    key={category}
                    className='rounded-full bg-gray-700/50 px-3 py-1 text-sm text-gray-200 transition-colors hover:bg-gray-600/50'
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div className='flex items-center gap-6 border-t border-gray-700/50 pt-4'>
              <div className='flex items-center gap-2 text-gray-300'>
                <span>评分:</span>
                <span className='text-yellow-400'>★★★★★</span>
              </div>
            </div>

            <div className='text-lg leading-relaxed text-gray-300'>{game.content}</div>

            <div className='prose prose-invert max-w-none'>
              <h2 className='mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-2xl font-bold text-transparent'>
                {t('introduction')}
              </h2>
              <div className='rounded-lg bg-gray-800/30 p-6'>
                <MarkdownProse markdown={game?.detail || ''} />
              </div>
            </div>
          </div>
        </div>

        {/* 右侧推荐游戏导航栏 */}
        <div className='sticky top-20 mb-8 h-fit space-y-6 overflow-y-auto rounded-lg bg-gray-800/30 p-4 backdrop-blur-xl lg:max-h-[calc(100vh-8rem)]'>
          <h3 className='mb-2 text-xl font-bold text-white'>{t('recommended')}</h3>

          {/* 推荐游戏列表 */}
          <div className='space-y-4'>
            {recommendGameList?.map((item) => (
              <div
                key={item.id}
                className='group flex cursor-pointer gap-3 rounded-lg p-2 transition-all hover:bg-gray-700/30'
              >
                <div className='relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg'>
                  <BaseImage
                    title={item.title || ''}
                    alt={item.title || ''}
                    fill
                    src={item.thumbnail_url || '/placeholder.jpg'}
                    className='object-cover'
                  />
                </div>
                <div className='flex flex-col justify-center'>
                  <h4 className='font-medium text-gray-100 transition-colors group-hover:text-white'>{item.title}</h4>
                </div>
              </div>
            ))}
          </div>

          {/* 更多游戏按钮 */}
          <button
            type='button'
            className='flex w-full items-center justify-center gap-2 rounded-lg bg-gray-700/50 px-4 py-2 text-white transition-all hover:bg-gray-600/50 hover:shadow-lg'
          >
            {t('moreGames')}
            <CircleArrowRight className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  );
}
