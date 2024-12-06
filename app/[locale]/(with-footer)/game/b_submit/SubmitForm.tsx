'use client';

/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { FORM_PLACEHOLDER, WEBSITE_EXAMPLE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Spinning from '@/components/Spinning';

const FormSchema = z.object({
  website: z.string().min(1, { message: 'Website name is required' }),
  url: z.string().url({ message: 'Invalid URL' }),
  iframeUrl: z.string().url({ message: 'Invalid URL' }).optional(),
  originImageUrl: z.string().url({ message: 'Invalid URL' }).optional(),
  detail: z.string().optional(),
});

export default function SubmitForm({ className }: { className?: string }) {
  const t = useTranslations('Submit');
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      website: '',
      url: '',
      iframeUrl: '',
      originImageUrl: '',
      detail: '',
    },
  });

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    // if (!session?.user?.email) {
    //   toast.error(t('pleaseLogin'));
    //   return;
    // }

    let errMsg: any = t('networkError');
    try {
      setLoading(true);
      const response = await fetch('/api/b_g_submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.website,
          url: formData.url,
          iframe_url: formData.iframeUrl,
          origin_image_url: formData.originImageUrl,
          detail: formData.detail,
        }),
      });

      if (!response.ok) {
        errMsg = await response.text();
        throw new Error();
      }
      toast.success(t('success'));
      form.reset();
    } catch (error) {
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('mx-auto max-w-[500px] rounded-lg bg-[#2C2D36] p-6 shadow-lg', 'space-y-6', 'sm:p-8', className)}
      >
        <div className='space-y-4'>
          <FormField
            control={form.control}
            name='website'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium'>{t('website')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder='coolguessgame'
                    className='input-border-pink h-11 rounded-lg border-[0.5px] bg-dark-bg px-4'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-xs' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='url'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium'>{t('url')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={FORM_PLACEHOLDER}
                    className='input-border-pink h-11 rounded-lg border-[0.5px] bg-dark-bg px-4'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-xs' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='iframeUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium'>{t('iframeUrl')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={FORM_PLACEHOLDER}
                    className='input-border-pink h-11 rounded-lg border-[0.5px] bg-dark-bg px-4'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-xs' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='originImageUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium'>{t('originImageUrl')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={FORM_PLACEHOLDER}
                    className='input-border-pink h-11 rounded-lg border-[0.5px] bg-dark-bg px-4'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-xs' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='detail'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium'>{t('detail')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Please describe the game in detail'
                    className='input-border-pink min-h-[120px] rounded-lg border-[0.5px] bg-dark-bg p-4'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-xs' />
              </FormItem>
            )}
          />
        </div>

        <div className='space-y-4 pt-4'>
          <button
            type='submit'
            disabled={loading}
            className={cn(
              'w-full rounded-lg bg-white py-3 font-medium text-black transition-all',
              'hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/20',
              loading && 'cursor-not-allowed opacity-70',
            )}
          >
            {loading ? <Spinning className='size-5' /> : t('submit')}
          </button>
          <p className='text-center text-sm text-white/60'>
            {t('add')} <span className='text-white'>{WEBSITE_EXAMPLE}</span> {t('text')}
          </p>
        </div>
      </form>
    </Form>
  );
}
