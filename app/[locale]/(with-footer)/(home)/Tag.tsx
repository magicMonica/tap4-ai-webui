import Link from 'next/link';

export function TagItem({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-8 items-center justify-center gap-1 whitespace-nowrap rounded-full bg-gray-100/10 px-4 text-sm font-medium transition-colors hover:bg-gray-100/20'>
      {children}
    </div>
  );
}

export function TagLink({ name, href }: { name: string; href: string }) {
  return (
    <Link href={href} title={name}>
      <TagItem>{name}</TagItem>
    </Link>
  );
}

export function TagList({ data }: { data: { name: string; href: string; id: string }[] }) {
  return (
    <ul className='no-scrollbar flex max-w-full flex-1 items-center justify-center gap-3 overflow-auto pb-1'>
      {data.map((item) => (
        <li key={item.href}>
          <TagLink name={item.name} href={item.href} />
        </li>
      ))}
    </ul>
  );
}
