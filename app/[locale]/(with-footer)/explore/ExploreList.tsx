import { createClient } from '@/db/supabase/client';

import SearchForm from '@/components/home/SearchForm';
import BasePagination from '@/components/page/BasePagination';
import GameCardList from '@/components/webNav/GameCardList';

import { TagList } from '../(home)/Tag';

const WEB_PAGE_SIZE = 12;

export default async function ExploreList({ pageNum }: { pageNum?: string }) {
  const supabase = createClient();
  const currentPage = pageNum ? Number(pageNum) : 1;

  // start and end
  const start = (currentPage - 1) * WEB_PAGE_SIZE;
  const end = start + WEB_PAGE_SIZE - 1;

  const [{ data: categoryList }, { data: navigationList, count }] = await Promise.all([
    supabase.from('gs_game_category').select(),
    supabase
      .from('gs_game_info')
      .select('*', { count: 'exact' })
      .order('collection_time', { ascending: false })
      .range(start, end),
  ]);

  return (
    <section className='container mx-auto px-4 py-6 lg:py-12'>
      <div className='mx-auto mb-8 max-w-2xl lg:mb-12'>
        <SearchForm />
      </div>

      <div className='mb-8 lg:mb-12'>
        <TagList
          data={(categoryList || []).map((item) => ({
            id: String(item.id),
            name: item.name,
            href: `/query/${item.name}`,
          }))}
        />
      </div>

      {/* 移除 min-height，添加网格容器 */}
      <div className='mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mb-12 lg:grid-cols-4 xl:grid-cols-6'>
        <GameCardList dataList={navigationList || []} />
      </div>

      <div className='flex justify-center'>
        <BasePagination
          currentPage={currentPage}
          pageSize={WEB_PAGE_SIZE}
          total={count!}
          route='/explore'
          subRoute='/page'
          className='py-8'
        />
      </div>
    </section>
  );
}
