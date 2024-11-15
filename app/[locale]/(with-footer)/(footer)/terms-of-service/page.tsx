import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('FooterNavigation.termsConditions');

  return (
    <div
      className='prose mx-auto p-6 pb-16 text-white prose-headings:text-white prose-p:text-gray-100 prose-li:text-gray-100'
      style={{ backgroundColor: '#AAAAFF' }}
    >
      <h1>{t('1-h1')}</h1>
      <p>{t('1-p')}</p>

      <h2>{t('2-h2')}</h2>
      <ul>
        <li>{t('2-p')}</li>
      </ul>

      <h2>{t('3-h2')}</h2>
      <ul>
        <li>{t('3-p')}</li>
        <li>{t('3-p-2')}</li>
      </ul>

      <h2>{t('4-h2')}</h2>
      <ul>
        <li>
          {t('4-p')}{' '}
          <Link
            href='/terms-of-service'
            className='text-blue-400 underline decoration-blue-700/30 transition-colors
              duration-200 hover:text-blue-300 hover:decoration-blue-500/50'
          >
            {t('terms-of-service')}
          </Link>
        </li>
      </ul>

      <h2>{t('5-h2')}</h2>
      <ul>
        <li>{t('5-p')}</li>
      </ul>

      <h2>{t('6-h2')}</h2>
      <ul>
        <li>{t('6-p')}</li>
      </ul>

      <h2>{t('7-h2')}</h2>
      <ul>
        <li>{t('7-p')}</li>
      </ul>

      <p>{t('last-p')}</p>
    </div>
  );
}
