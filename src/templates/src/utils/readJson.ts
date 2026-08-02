import fs from "node:fs/promises";

import type { AbstractIntlMessages } from "next-intl";

export async function readJson(filePath: string): Promise<AbstractIntlMessages> {
  const raw = await fs.readFile(filePath, "utf-8");
  if (!raw.trim()) return {};
  return JSON.parse(raw);
}

