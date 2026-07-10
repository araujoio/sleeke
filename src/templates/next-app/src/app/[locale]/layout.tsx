import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@/components/theme-provider';
import { routing } from '@/i18n/routing';
import { hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import '@/styles/globals.css';

type Props = { children: React.ReactNode; params: Promise<{locale: string}>; };
 
export default async function RootLayout({children, params}: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  
  const messages = await getMessages();
  
  return (
    <html lang = { locale } suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            { children }
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
