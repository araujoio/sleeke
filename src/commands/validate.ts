import fs from "node:fs";
import path from "node:path";
import { createJiti } from "jiti";

type Messages = Record<string, unknown>;
type FlatEntry = [string, unknown];

type ValidationError = {
  locale: string;
  file?: string;
  message: string;
};

type LoadedLocaleFiles = Map<string, Map<string, unknown>>;

type RoutingConfig = {
  locales: string[];
  defaultLocale: string;
};

const LOCALE_DIRECTORY = "src/messages";
const GENERAL_FILE = "(general)";

/**
 * Loads and validates the routing configuration from a TypeScript module.
 */
async function loadRoutingConfig(routingPath: string): Promise<RoutingConfig> {
  const jiti = createJiti(import.meta.url);
  const mod = await jiti.import<{ routing: unknown }>(routingPath);

  const routing = mod.routing as
    { locales?: string[]; defaultLocale?: string } | undefined;

  if (!routing || !Array.isArray(routing.locales) || !routing.defaultLocale) {
    throw new Error("Invalid routing configuration.", {
      cause: `Expected "routing" in "${routingPath}" to export both "locales" and "defaultLocale".`,
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
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    return prefix ? [[prefix, obj]] : [];
  }

  return Object.entries(obj as Messages).flatMap(([key, value]) => {
    const next = prefix ? `${prefix}.${key}` : key;
    return typeof value === "object" && value !== null && !Array.isArray(value)
      ? flatten(value, next)
      : [[next, value] as FlatEntry];
  });
}

function loadMessagesWithSource(dir: string): LoadedLocaleFiles {
  const fileMap: LoadedLocaleFiles = new Map();

  function collect(currentDir: string) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
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
 * Extracts `{placeholder}` names from a translation string.
 */
function extractPlaceholders(value: string): string[] {
  return (value.match(/\{(\w+)\}/g) ?? []).map((m) => m.slice(1, -1));
}

/**
 * Compares a locale against the default, reporting missing keys and
 * placeholder mismatches per file.
 */
function checkLocaleAgainstDefault(
  locale: string,
  defaultLocale: string,
  defaultLoaded: LoadedLocaleFiles,
  localeLoaded: LoadedLocaleFiles | undefined,
  addError: (error: ValidationError) => void
): void {
  if (!localeLoaded) return;

  for (const [file, defaultKeys] of defaultLoaded) {
    const localeKeys = localeLoaded.get(file) ?? new Map();

    for (const [key, sourceValue] of defaultKeys) {
      if (!localeKeys.has(key)) {
        addError({
          locale,
          file,
          message: `Missing translation for "${key}". This key exists in the default locale "${defaultLocale}".`,
        });
        continue;
      }

      if (typeof sourceValue !== "string") continue;

      const localeValue = localeKeys.get(key);
      if (typeof localeValue !== "string") continue;

      const expected = extractPlaceholders(sourceValue);
      const actual = new Set(extractPlaceholders(localeValue));
      const missing = expected.filter((p) => !actual.has(p));

      if (missing.length === 0) continue;

      addError({
        locale,
        file,
        message: `Missing placeholders in "${key}": ${missing
          .map((p) => `{${p}}`)
          .join(
            ", "
          )}. These placeholders exist in the default locale "${defaultLocale}".`,
      });
    }
  }
}

/**
 * Groups errors by locale and file, then prints them to stderr.
 */
function printErrors(errors: ValidationError[]): void {
  const grouped = new Map<string, Map<string, ValidationError[]>>();

  for (const error of errors) {
    const file = error.file ?? GENERAL_FILE;
    const localeGroup =
      grouped.get(error.locale) ?? new Map<string, ValidationError[]>();
    const fileGroup = localeGroup.get(file) ?? [];

    fileGroup.push(error);
    localeGroup.set(file, fileGroup);
    grouped.set(error.locale, localeGroup);
  }

  for (const [locale, files] of grouped) {
    console.error(`Locale: ${locale}`);

    for (const [file, fileErrors] of files) {
      if (file !== GENERAL_FILE) console.error(`\n  ${file}`);
      for (const error of fileErrors) console.error(`    • ${error.message}`);
    }

    console.error();
  }

  console.error(`Found ${errors.length} issue(s).`);
  console.error("Fix the issues above and run the validator again.");
}

/**
 * Validates the i18n setup, checking that every locale mirrors the
 * default locale's keys, files, and placeholders.
 */
export async function validate(): Promise<void> {
  try {
    const routingPath = path.join(process.cwd(), "src", "i18n", "routing.ts");

    if (!fs.existsSync(routingPath)) {
      throw new Error("Routing configuration not found.", {
        cause: `Expected to find "src/i18n/routing.ts" at "${routingPath}". Run this command from the root of a Sleeke project.`,
      });
    }

    const { locales, defaultLocale } = await loadRoutingConfig(routingPath);

    const errors: ValidationError[] = [];
    const loadedByLocale = new Map<string, LoadedLocaleFiles>();
    const addError = (error: ValidationError) => errors.push(error);

    if (locales.length === 0) {
      addError({
        locale: "Configuration",
        message:
          'No locales were configured. Add at least one locale to "routing.locales".',
      });
    }

    for (const locale of locales) {
      const localePath = path.join(process.cwd(), LOCALE_DIRECTORY, locale);

      if (!fs.existsSync(localePath)) {
        addError({
          locale,
          message: `Locale "${locale}" is configured but its directory was not found (${path.join(
            LOCALE_DIRECTORY,
            locale
          )}).`,
        });
        continue;
      }

      const loaded = loadMessagesWithSource(localePath);
      loadedByLocale.set(locale, loaded);

      for (const [file, keys] of loaded) {
        for (const [key, value] of keys) {
          if (typeof value === "string" && value.trim() === "") {
            addError({
              locale,
              file,
              message: `Translation for "${key}" is empty.`,
            });
          }
        }
      }
    }

    const defaultLoaded = loadedByLocale.get(defaultLocale);

    if (!defaultLoaded) {
      addError({
        locale: defaultLocale,
        message: `Default locale "${defaultLocale}" not found.`,
      });
    } else {
      for (const locale of locales) {
        if (locale === defaultLocale) continue;
        checkLocaleAgainstDefault(
          locale,
          defaultLocale,
          defaultLoaded,
          loadedByLocale.get(locale),
          addError
        );
      }
    }

    if (errors.length === 0) {
      console.log("✓ All locale files are valid.");
      return;
    }

    console.error("\n✖ Validation failed\n");
    printErrors(errors);
    process.exit(1);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const cause = error instanceof Error ? error.cause : undefined;

    if (cause !== undefined) {
      console.error(`${message} (${cause})`);
    } else {
      console.error(message);
    }

    process.exit(1);
  }
}
