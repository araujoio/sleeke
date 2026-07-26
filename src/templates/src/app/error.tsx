"use client";

import { useEffect } from "react";
import WireFrame from "@/layout/routes/server-error/wireframe";

export default function ErrorPage({ error, unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void; }) {
  useEffect(() => {
    document.title = `Something went wrong`;
    console.error("Application error:", error);
  }, [error]);

  return (
    <>
      <WireFrame unstable_retry={unstable_retry} />
    </>
  );
}
