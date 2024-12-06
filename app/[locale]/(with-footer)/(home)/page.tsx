import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { createClient } from '@/db/supabase/client';
import { getTranslations } from 'next-intl/server';

import { RevalidateOneHour } from '@/lib/constants';
import Faq from '@/components/Faq';
import RecommendNav from '@/components/home/RecommendNav';
import GameCardList from '@/components/webNav/GameCardList';

const ScrollToTop = dynamic(() => import('@/components/page/ScrollToTop'), { ssr: false });

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: 'Metadata.home',
  });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    alternates: {
      canonical: './',
    },
    icons: {
      icon: './favicon.ico',
      apple: './favicon.ico',
    },
  };
}

export const revalidate = RevalidateOneHour;

export default async function Page() {
  const supabase = createClient();
  const t = await getTranslations('Home');
  const [{ data: categoryList }, { data: gameList = [] }] = await Promise.all([
    supabase.from('gs_game_category').select(),
    supabase
      .from('gs_game_info')
      .select()
      .eq('hot_flag', true)
      .order('collection_time', { ascending: false })
      .limit(24),
  ]);
  console.log('categoryList:', categoryList);
  console.log('gameList:', gameList);
  const { data: recommendGameList } = await supabase.from('gs_game_info').select().limit(6);

  const t1 = await getTranslations('Game.detail');
  return (
    <div className='relative w-full'>
      <div className='relative mx-auto flex w-full max-w-[1440px] gap-5 px-8 lg:px-12'>
        <div className='w-4/5'>
          <div className='relative min-h-[800px] w-full overflow-hidden rounded-lg'>
            <iframe
              title={process.env.NEXT_PUBLIC_HOME_GAME_NAME}
              src={process.env.NEXT_PUBLIC_HOME_GAME_URL}
              className='absolute left-0 top-0 h-full w-full border-0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          </div>
          <div className='my-5 flex flex-col text-center lg:mx-auto lg:my-10 lg:gap-1'>
            <h1 className='text-2xl font-bold text-white lg:text-5xl'>{t('title')}</h1>
            <h2 className='text-balance text-xs font-bold text-white lg:text-sm'>{t('subTitle')}</h2>
          </div>
          <div className='mb-10 flex flex-col gap-8 lg:mb-20'>
            <h2 className='text-center text-lg font-semibold lg:text-3xl'>{t('hotGames')}</h2>
            <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
              {gameList && gameList.length > 0 ? (
                <GameCardList dataList={gameList} />
              ) : (
                <div className='text-center text-gray-400'>暂无热门游戏</div>
              )}
            </div>
          </div>
          <Faq />
          <ScrollToTop />
        </div>

        <div className='w-1/5'>
          <RecommendNav
            recommendGameList={recommendGameList!}
            translations={{
              recommended: t1('recommended'),
              moreGames: t1('moreGames'),
            }}
          />
        </div>
      </div>
    </div>
  );
}
