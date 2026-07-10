import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("errors.not-found");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <a href="/" className="text-blue-500 cursor-pointer hover:underline">
        {t("action")}
      </a>
    </div>
  );
}
