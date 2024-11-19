import { Suspense } from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { createClient } from '@/db/supabase/client';
import { getTranslations } from 'next-intl/server';

import { RevalidateOneHour } from '@/lib/constants';
import { Separator } from '@/components/ui/separator';
import Empty from '@/components/Empty';
import Faq from '@/components/Faq';
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
      <div className='container mx-auto px-4 py-8'>
        <section className='flex flex-col gap-8'>
          {dataList && dataList.length > 0 ? (
            <>
              <h2 className='text-2xl font-bold md:text-3xl lg:text-4xl'>{t('hotGames')}</h2>
              <div className='min-h-[400px] w-full'>
                <GameCardList dataList={dataList} />
              </div>
            </>
          ) : (
            <Empty title={t('empty')} />
          )}
        </section>
        <Separator className='my-16 h-[1px] w-full bg-[#2C2D36]' />
        <Faq />
        <ScrollToTop />
      </div>
    </Suspense>
  );
}
