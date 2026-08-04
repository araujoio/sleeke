"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useEffect } from "react";

export default function NotFound() {
  const t = useTranslations("errors");
  const common = useTranslations("common");

  useEffect(() => {
    document.title = `${t("not-found.title")} | ${common("meta.site-name")}`;
  }, [t, common]);

  return (
    <div>
      <h1>{t("not-found.title")}</h1>
      <p>{t("not-found.description")}</p>

      <Link href="/" className="cursor-pointer text-blue-500 hover:underline">
        {t("not-found.action")}
      </Link>
    </div>
  );
}