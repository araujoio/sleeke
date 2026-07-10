"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void; }) {
  const t = useTranslations("errors.internal");

  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <a onClick={() => reset()} className="text-blue-500 cursor-pointer hover:underline">
        {t("try-again")}
      </a>
    </div>
  );
}