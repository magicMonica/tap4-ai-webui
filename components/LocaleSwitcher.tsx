'use client';

import { useState } from 'react';
import { languages } from '@/i18n';
import { useLocale } from 'next-intl';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { usePathname, useRouter } from '../app/navigation';
import Icon from './image/Icon';

export default function LocaleSwitcher() {
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [localeVal, setLocaleVal] = useState(currentLocale);

  const onValueChange = (newLocale: string) => {
    setLocaleVal(newLocale);
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Select value={localeVal} defaultValue={currentLocale} onValueChange={onValueChange}>
      <SelectTrigger
        className='flex h-8 w-[80px] items-center gap-1 rounded-lg
        border border-white/30 bg-white/20 px-2
        text-white backdrop-blur-sm transition-all
        duration-300 ease-in-out hover:bg-white/30'
      >
        <Icon src='/icons/global.svg' className='opacity-80' />
        <SelectValue placeholder='locale' className='font-medium'>
          {localeVal.toUpperCase()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        className='rounded-lg border-white/30 bg-[#AAAAFF]/95
        shadow-lg backdrop-blur-md duration-100 animate-in fade-in-80'
      >
        {languages.map((language) => (
          <SelectItem
            value={language.lang}
            key={language.code}
            className='font-medium text-white
              transition-colors duration-200 hover:cursor-pointer hover:bg-white/30
              focus:bg-white/40 focus:text-white'
          >
            {language.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
