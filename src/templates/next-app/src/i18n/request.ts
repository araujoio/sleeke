import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
import { loadMessages } from './load-messages';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale =
    typeof requested === 'string' && hasLocale(routing.locales, requested)
      ? requested
      : routing.defaultLocale;

  return { locale, messages: await loadMessages(locale) };
});
