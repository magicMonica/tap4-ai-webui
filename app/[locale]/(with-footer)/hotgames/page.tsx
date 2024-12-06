import { Suspense } from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { createClient } from '@/db/supabase/client';
import { getTranslations } from 'next-intl/server';

import { RevalidateOneHour } from '@/lib/constants';
import Empty from '@/components/Empty';
import GameCardList from '@/components/webNav/GameCardList';

import Loading from '../(home)/query/[search]/loading';

const ScrollToTop = dynamic(() => import('@/components/page/ScrollToTop'), { ssr: false });

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: 'Metadata.hotgames',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

export const revalidate = RevalidateOneHour / 2;

export default async function Page() {
  const supabase = createClient();
  const t = await getTranslations('Home');
  const { data: dataList } = await supabase.from('gs_game_info').select().eq('hot_flag', true);

  return (
    <Suspense fallback={<Loading />}>
      <div className='container mx-auto flex justify-center px-4 py-8'>
        <section className='flex w-full max-w-7xl flex-col gap-8'>
          {dataList && dataList.length > 0 ? (
            <>
              <h2 className='text-center text-2xl font-bold md:text-3xl lg:text-4xl'>{t('hotGames')}</h2>
              <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                <GameCardList dataList={dataList} />
              </div>
            </>
          ) : (
            <Empty title={t('empty')} />
          )}
        </section>
        <ScrollToTop />
      </div>
    </Suspense>
  );
}
