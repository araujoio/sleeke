import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import luxm from "../../../../luxm.json";

const supportedLocales = new Set<string>(luxm.i18n.supportedLocales);

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ locale?: string; path?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "errors" });
  const common = await getTranslations({ locale, namespace: "common" });

  return {
    title: `${t("locale-not-supported.title")} | ${common("meta.site-name")}`,
  };
}

export default async function LocaleNotSupportedPage({ searchParams, params }: Props) {
  const { locale: requestedLocale, path: originalPath } = await searchParams;
  const { locale } = await params;

  // Se o idioma do query param já é suportado, redireciona para a página original
  if (requestedLocale && supportedLocales.has(requestedLocale)) {
    redirect(`/${requestedLocale}${originalPath ?? ''}`);
  }

  const backHref = originalPath ? `/${locale}${originalPath}` : `/${locale}`;

  return <LocaleNotSupportedContent backHref={backHref} />;
}

function LocaleNotSupportedContent({ backHref }: { backHref: string }) {
  const t = useTranslations("errors");

  return (
    <div>
      <h1>{t("locale-not-supported.title")}</h1>
      <p>{t("locale-not-supported.description")}</p>
      <a href={backHref} className="text-blue-500 cursor-pointer hover:underline">
        {t("locale-not-supported.action")}
      </a>
    </div>
  );
}
