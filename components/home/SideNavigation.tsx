import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function SideNavigation({ className }: { className?: string }) {
  const t = useTranslations('Navigation');

  const menuItems = [
    { icon: '🎮', label: t('home'), href: '/' },
    { icon: '🔥', label: t('hotgames'), href: '/hotgames' },
    { type: 'divider' },
    { icon: '🌍', label: t('worldguessr'), href: '/game/worldguessr' },
    { icon: '🎉', label: t('emoji'), href: '/game/emoji' },
    { icon: '🤔', label: t('guesswho'), href: '/game/guesswho' },
    { icon: '💡', label: t('trivia'), href: '/game/trivia' },
    { icon: '🔤', label: t('wordle'), href: '/game/wordle' },
  ];

  return (
    <nav className={`fixed left-0 top-[64px] z-40 h-fit ${className}`}>
      <div
        className='group my-4 flex w-[60px] flex-col gap-2
        rounded-r-lg border-r-4 border-[#8A8AFF]/50 bg-[#AAAAFF]/20
        p-3 shadow-lg backdrop-blur-sm transition-all duration-300
        hover:z-50 hover:w-[200px] hover:bg-[#AAAAFF]/30'
      >
        {menuItems.map((item) => {
          if (item.type === 'divider') {
            return <div key='divider' className='mx-2 h-[1px] bg-white/20' />;
          }
          return (
            <Link
              key={item.href || ''}
              href={item.href || ''}
              className='flex items-center gap-3 rounded-lg p-2
                transition-all duration-300 hover:bg-white/10'
            >
              <span className='min-w-[28px] text-2xl transition-transform hover:scale-110'>{item.icon}</span>
              <span
                className='overflow-hidden whitespace-nowrap font-medium text-white
                opacity-0 transition-all duration-300 group-hover:opacity-100'
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
