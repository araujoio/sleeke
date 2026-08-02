import "@/styles/globals.css";
import { ThemeProvider } from "@wrksz/themes/next";
import { notFound } from "next/navigation";
import { getMessages, NextIntlClientProvider, hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { CookieUpdater } from "@/components/cookie-updater";

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: any }>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html suppressHydrationWarning>
      <body className="antialiased">
        <CookieUpdater locale={locale} />
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
