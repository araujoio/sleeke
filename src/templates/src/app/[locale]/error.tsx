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
  const meta = useTranslations("meta");

  useEffect(() => {
    console.error("Application error:", error);
    document.title = `${t("server-error.title")} | ${meta("title")}`;
  }, [error, t, meta]);

  return (
    <div>
      <h1>{t("server-error.title")}</h1>
      <p>{t("server-error.description")}</p>
      <button
        type="button"
        onClick={() => unstable_retry()}
        className="cursor-pointer bg-transparent border-none p-0 m-0 [font:inherit] text-blue-500 hover:underline"
      >
        {t("server-error.button-action")}
      </button>
    </div>
  );
}
