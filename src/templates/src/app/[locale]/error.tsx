"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const t = useTranslations("errors");
  const common = useTranslations("common");

  useEffect(() => {
    console.error("Application error:", error);
    document.title = `${t("internal.title")} | ${common("meta.site-name")}`;
  }, [error, t, common]);

  return (
    <div>
      <h1>{t("internal.title")}</h1>
      <p>{t("internal.description")}</p>
      <button
        type="button"
        onClick={() => unstable_retry()}
        className="cursor-pointer bg-transparent border-none p-0 m-0 [font:inherit] text-blue-500 hover:underline"
      >
        {t("internal.try-again")}
      </button>
    </div>
  );
}