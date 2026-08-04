"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useEffect } from "react";

export default function NotFound() {
  const t = useTranslations("errors");
  const meta = useTranslations("meta");

  useEffect(() => {
    document.title = `${t("not-found.title")} | ${meta("title")}`;
  }, [t, meta]);

  return (
    <div>
      <h1>{t("not-found.title")}</h1>
      <p>{t("not-found.description")}</p>

      <Link href="/" className="cursor-pointer text-blue-500 hover:underline">
        {t("not-found.button-action")}
      </Link>
    </div>
  );
}
