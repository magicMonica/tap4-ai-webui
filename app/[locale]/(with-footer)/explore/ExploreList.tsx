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
    <div className='container mx-auto px-4'>
      <div className='mb-8 flex w-full items-center justify-center'>
        <SearchForm />
      </div>
      <div className='mb-12'>
        <TagList
          data={(categoryList || []).map((item) => ({
            id: String(item.id),
            name: item.name,
            href: `/category/${item.name}`,
          }))}
        />
      </div>
      <div className='min-h-[400px]'>
        <GameCardList dataList={navigationList!} />
      </div>
      <BasePagination
        currentPage={currentPage}
        pageSize={WEB_PAGE_SIZE}
        total={count!}
        route='/explore'
        subRoute='/page'
        className='my-8 lg:my-12'
      />
    </div>
  );
}
