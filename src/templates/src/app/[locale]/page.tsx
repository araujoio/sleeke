import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("home");
  const meta = await getTranslations("meta");

  return {
    title: `${t("title")} | ${meta("title")}`,
  };
}

export default function Home() {
  const t = useTranslations("home");
  return (
    <>
      <h1>{t("title")}</h1>
    </>
  );
}
