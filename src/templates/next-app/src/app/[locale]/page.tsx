import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const common = await getTranslations({ locale, namespace: "common" });
  return {
    title: `${t("meta.title")} | ${common("meta.site-name")}`,
    description: t("meta.description"),
  };
}

export default function HomePage() {
  const t = useTranslations("home");
  return (
    <div>
      <h1>{t("page.title")}</h1>
    </div>
  )
}