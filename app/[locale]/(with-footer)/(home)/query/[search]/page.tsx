import { Suspense } from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { createClient } from '@/db/supabase/client';
import { getTranslations } from 'next-intl/server';

import { RevalidateOneHour } from '@/lib/constants';
import Empty from '@/components/Empty';
import GameCardList from '@/components/webNav/GameCardList';

import { TagList } from '../../Tag';
import Loading from './loading';

const ScrollToTop = dynamic(() => import('@/components/page/ScrollToTop'), { ssr: false });

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: 'Metadata.home',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

export const revalidate = RevalidateOneHour / 2;

export default async function Page({ params }: { params: { search?: string } }) {
  const supabase = createClient();
  const t = await getTranslations('Home');
  const { data: categoryList } = await supabase.from('gs_game_category').select();
  const { data: dataList } = await supabase
    .from('gs_game_info')
    .select()
    .or(
      `detail.ilike.%${decodeURI(params?.search || '')}%,` +
        `title.ilike.%${decodeURI(params?.search || '')}%,` +
        `name.ilike.%${decodeURI(params?.search || '')}%, ` +
        `tag_name.ilike.%${decodeURI(params?.search || '')}%`,
    );
  console.log(`query search: ${dataList?.length}`);

  return (
    <Suspense fallback={<Loading />}>
      <div className='mb-10 mt-5'>
        {params?.search && (
          <TagList
            data={(categoryList || []).map((item) => ({
              id: String(item.id),
              name: item.name,
              href: `/query/${item.name}`,
            }))}
          />
        )}
      </div>
      <section className='flex flex-col gap-5'>
        {dataList && dataList.length > 0 && params?.search ? (
          <>
            <h2 className='mb-1 text-left text-[18px] lg:text-2xl'>{t('result')}</h2>
            <div className='min-h-[400px]'>
              <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                <GameCardList dataList={dataList} />
              </div>
            </div>
          </>
        ) : (
          <Empty title={t('empty')} />
        )}
      </section>
      <ScrollToTop />
    </Suspense>
  );
}
