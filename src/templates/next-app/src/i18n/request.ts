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

  // Carrega as mensagens do idioma atual
  const messages = await loadMessages(locale);

  return { 
    locale, 
    messages,
    getMessageFallback({ namespace, key, error }) {
      const path = [namespace, key].filter((part) => part != null).join('.');

      if (error.code === 'MISSING_MESSAGE') {
        throw new Error(
          `[i18n] Tradução obrigatória faltando: "${path}" no idioma "${locale}".`
        );
      }

      return path;
    }
  };
});
