import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const IGNORE = new Set([
  "node_modules",
  ".next",
  "bun.lock",
  "next-env.d.ts",
  "package-lock.json",
  "node_modules/.cache",
]);

/**
 * Recursively copies a template directory into a project directory,
 * skipping cache and lock files.
 */
function copyDirectory(src: string, dest: string) {
  mkdirSync(dest, { recursive: true });

  for (const entry of readdirSync(src)) {
    const source = join(src, entry);
    const target = join(dest, entry);

    if (IGNORE.has(entry)) continue;

    if (statSync(source).isDirectory()) {
      copyDirectory(source, target);
      continue;
    }

    copyFileSync(source, target);
  }
}

/**
 * Scaffolds a new project from the bundled template into the given
 * directory name.
 */
export async function init(name: string) {
  const target = resolve(process.cwd(), name);
  const templatePath = join(
    dirname(fileURLToPath(import.meta.url)),
    "templates"
  );

  try {
    if (!existsSync(templatePath)) {
      throw new Error("Template directory is missing from the CLI bundle.", {
        cause: `Expected to find it at "${templatePath}".`,
      });
    }

    if (existsSync(target)) {
      throw new Error("Target directory already exists.", {
        cause: `"${target}" is in the way. Choose a different name or remove it first.`,
      });
    }

    copyDirectory(templatePath, target);

    console.log(`Initialized empty project in ${process.cwd()}/${name}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
