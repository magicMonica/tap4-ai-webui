import Link from 'next/link';
import { createClient } from '@/db/supabase/client';
import { getTranslations } from 'next-intl/server';

import { RevalidateOneHour } from '@/lib/constants';

export const revalidate = RevalidateOneHour;

export default async function Page() {
  const supabase = createClient();
  const t = await getTranslations('Category');

  // 获取所有网站数据
  const { data: navigationList } = await supabase.from('web_navigation').select('category_name');

  // 统计category_name出现次数
  const categoryCount: { [key: string]: number } = {};

  navigationList?.forEach((nav) => {
    if (nav.category_name) {
      let categories: string[];

      if (typeof nav.category_name === 'string') {
        categories = nav.category_name
          .toLowerCase()
          .split(',')
          .map((cat) =>
            cat
              .trim()
              .split(/[-\s]+/)
              .join('-'),
          );
      } else if (Array.isArray(nav.category_name)) {
        categories = nav.category_name;
      } else {
        categories = [nav.category_name];
      }

      categories.forEach((category) => {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
    }
  });

  // 转换为排序后的数组，并过滤掉出现次数<=3的分类
  const sortedCategories = Object.entries(categoryCount)
    .filter(([, count]) => count > 3)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({ name, count }));

  return (
    <div className='mx-auto max-w-pc px-3 py-8 lg:px-0'>
      <h1 className='mb-8 text-center text-2xl font-bold lg:text-4xl'>{t('categoryCount')}</h1>

      <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {sortedCategories.map(({ name, count }) => (
          <Link
            key={name}
            href={`/category/${encodeURIComponent(name)}`}
            className='block transition-opacity hover:opacity-80'
          >
            <div className='flex flex-col items-center justify-center rounded-lg bg-[#2C2D36] p-4'>
              <span className='mb-2 text-lg font-medium'>{name}</span>
              <span className='text-2xl font-bold text-white/80'>{count}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
