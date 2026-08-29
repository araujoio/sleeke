import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("home");
  const meta = await getTranslations("meta");

  return {
    title: `${t("title")} | ${meta("title")}`,
  };
}

export default async function Home() {
  const t = await getTranslations("home");
  return (
    <>
      <h1>{t("title")}</h1>
    </>
  );
}
