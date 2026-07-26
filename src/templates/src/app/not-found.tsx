"use client";

import WireFrame from "@/layout/routes/not-found/wireframe";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    document.title = `Page not found`;
  }, []);

  return (
    <WireFrame/>    
  );
}
