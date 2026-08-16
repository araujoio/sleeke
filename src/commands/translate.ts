import fs from "node:fs";
import path from "node:path";
import { createJiti } from "jiti";

type Messages = Record<string, unknown>;
type FlatEntry = [string, unknown];

type RoutingConfig = {
  locales: string[];
  defaultLocale: string;
};

type QueueItem = {
  locale: string;
  key: string;
  file: string;
  sourceText: string;
};

const LOCALE_DIRECTORY = "src/messages";
const QUEUE_PATH = ".sleeke/translation-queue.json";

/**
 * Loads and validates the routing configuration from a TypeScript module.
 */
async function loadRoutingConfig(routingPath: string): Promise<RoutingConfig> {
  const jiti = createJiti(import.meta.url);
  const mod = await jiti.import<{ routing: unknown }>(routingPath);

  const routing = mod.routing as
    { locales?: string[]; defaultLocale?: string } | undefined;

  if (!routing || !Array.isArray(routing.locales) || !routing.defaultLocale) {
    throw new Error(`Invalid routing configuration in "${routingPath}".`, {
      cause:
        'The "routing" export must contain a "locales" array and a "defaultLocale" string.',
    });
  }

  return {
    locales: routing.locales,
    defaultLocale: routing.defaultLocale,
  };
}

/**
 * Recursively flattens a nested object into dot-separated key-value pairs.
 */
function flatten(obj: unknown, prefix = ""): FlatEntry[] {
  const result: FlatEntry[] = [];

  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    if (prefix) {
      result.push([prefix, obj]);
    }

    return result;
  }

  for (const [key, value] of Object.entries(obj)) {
    const next = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      result.push(...flatten(value, next));
    } else {
      result.push([next, value]);
    }
  }

  return result;
}

/**
 * Recursively loads JSON messages from a locale directory and tracks
 * the source file for each translation key.
 */
function loadMessagesWithSource(
  dir: string
): Map<string, Map<string, unknown>> {
  const fileMap = new Map<string, Map<string, unknown>>();

  function collect(currentDir: string): void {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        collect(fullPath);
        continue;
      }

      if (!entry.name.endsWith(".json")) continue;

      const raw = fs.readFileSync(fullPath, "utf8");
      if (!raw.trim()) continue;

      const content = JSON.parse(raw) as Messages;
      const relativeFile = path.relative(dir, fullPath).replace(/\\/g, "/");

      fileMap.set(
        relativeFile,
        new Map(flatten(content) as [string, unknown][])
      );
    }
  }

  collect(dir);
  return fileMap;
}

/**
 * Generates .sleeke/translation-queue.json with all missing or empty
 * translation keys across locales, compared against the default locale.
 */
export async function translateQueue(): Promise<void> {
  const routingPath = path.join(process.cwd(), "src/i18n/routing.ts");

  if (!fs.existsSync(routingPath)) {
    throw new Error("Routing configuration not found.", {
      cause: `Expected to find "routing.ts" at "${routingPath}".`,
    });
  }

  const { locales, defaultLocale } = await loadRoutingConfig(routingPath);

  const defaultPath = path.join(process.cwd(), LOCALE_DIRECTORY, defaultLocale);

  if (!fs.existsSync(defaultPath)) {
    throw new Error(`Default locale "${defaultLocale}" not found.`, {
      cause: `Expected the locale directory at "${defaultPath}".`,
    });
  }

  const defaultLoaded = loadMessagesWithSource(defaultPath);
  const queue: QueueItem[] = [];

  for (const locale of locales) {
    if (locale === defaultLocale) continue;

    const localePath = path.join(process.cwd(), LOCALE_DIRECTORY, locale);

    const localeLoaded = fs.existsSync(localePath)
      ? loadMessagesWithSource(localePath)
      : new Map();

    for (const [file, defaultKeys] of defaultLoaded) {
      const localeKeys = localeLoaded.get(file) ?? new Map();

      for (const [key, sourceValue] of defaultKeys) {
        if (typeof sourceValue !== "string") continue;

        const currentValue = localeKeys.get(key);
        const isMissing = !localeKeys.has(key);
        const isEmpty =
          typeof currentValue === "string" && currentValue.trim() === "";

        if (!isMissing && !isEmpty) continue;

        queue.push({
          locale,
          file,
          key,
          sourceText: sourceValue,
        });
      }
    }
  }

  fs.mkdirSync(path.dirname(QUEUE_PATH), { recursive: true });

  fs.writeFileSync(
    QUEUE_PATH,
    JSON.stringify({ defaultLocale, items: queue }, null, 2) + "\n"
  );

  console.log(`✓ Queued ${queue.length} translation(s).`);
}

/**
 * Applies a translation to the correct locale file and key,
 * preserving the rest of the file contents.
 */
export function translateSet(
  locale: string,
  file: string,
  key: string,
  value: string
): void {
  if (!key.trim()) {
    throw new Error("Translation key cannot be empty.");
  }

  const localePath = path.join(process.cwd(), LOCALE_DIRECTORY, locale);

  const queueRaw = fs.readFileSync(QUEUE_PATH, "utf8");
  const queue = JSON.parse(queueRaw) as { items: QueueItem[] };

  const item = queue.items.find(
    (item) => item.locale === locale && item.file === file && item.key === key
  );

  if (!item) {
    throw new Error("Translation not found in queue.", {
      cause: `No queued translation exists for locale "${locale}", file "${file}" and key "${key}".`,
    });
  }

  const filePath = path.join(localePath, item.file);

  const raw = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf8")
    : "{}";

  const content = raw.trim() ? (JSON.parse(raw) as Messages) : {};

  const segments = key.split(".");
  let cursor: Record<string, unknown> = content;

  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i];

    if (
      cursor[segment] === null ||
      typeof cursor[segment] !== "object" ||
      Array.isArray(cursor[segment])
    ) {
      cursor[segment] = {};
    }

    cursor = cursor[segment] as Record<string, unknown>;
  }

  cursor[segments[segments.length - 1]] = value;

  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + "\n");

  console.log(`✓ [${locale}] "${key}" translated.`);
}

