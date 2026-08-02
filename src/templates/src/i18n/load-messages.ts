import path from "node:path";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";

import { readJson } from "@/utils/readJson";
import type { AbstractIntlMessages } from "next-intl";

const cache = new Map<string, AbstractIntlMessages>();
const isProd = process.env.NODE_ENV === "production";

export async function loadMessages(locale: string): Promise<AbstractIntlMessages> {
  return isProd
    ? loadProductionMessages(locale)
    : loadDevelopmentMessages(locale);
}

async function loadProductionMessages(locale: string): Promise<AbstractIntlMessages> {
  const cached = cache.get(locale);
  if (cached) return cached;

  const filePath = path.join(process.cwd(), "next/server/messages", `${locale}.json`);

  if (!existsSync(filePath)) {
    throw new Error(
      `Failed to initialize application in production.\nMissing localization bundles for locale "${locale}". Run the build before starting the production server.`
    );
  }

  try {
    const messages = await readJson(filePath);
    cache.set(locale, messages);
    return messages;
  } catch (error) {
    throw new Error(
      `Failed to read localization bundle for locale "${locale}".`,
      { cause: error }
    );
  }
}

async function loadDevelopmentMessages(locale: string): Promise<AbstractIntlMessages> {
  const dir = path.join(process.cwd(), "src/locales", locale);

  if (!existsSync(dir)) return {};

  const messages: AbstractIntlMessages = {};
  await collectJsonFiles(dir, messages);
  return messages;
}

async function collectJsonFiles(dir: string, target: AbstractIntlMessages): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await collectJsonFiles(fullPath, target);
    } else if (entry.name.endsWith(".json")) {
      const content = await readJson(fullPath);
      Object.assign(target, content);
    }
  }
}


