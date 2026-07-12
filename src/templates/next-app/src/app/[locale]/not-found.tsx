"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function NotFound() {
  const t = useTranslations("errors");
  const common = useTranslations("common");

  useEffect(() => {
    document.title = `${t("not-found.title")} | ${common("meta.site-name")}`;
  }, []);

  return (
    <div>
      <h1>{t("not-found.title")}</h1>
      <p>{t("not-found.description")}</p>
      <a href="/" className="text-blue-500 cursor-pointer hover:underline">
        {t("not-found.action")}
      </a>
    </div>
  );
}
