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

export async function init(name: string) {
  const target = resolve(process.cwd(), name);
  const templatePath = join(
    dirname(fileURLToPath(import.meta.url)),
    "templates"
  );

  try {
    if (!existsSync(templatePath)) {
      throw new Error(`Source directory ${templatePath} does not exist.`);
    }

    if (existsSync(target)) {
      throw new Error(`Directory ${target} already exists.`);
    }

    copyDirectory(templatePath, target);

    console.log(`Initialized empty project in ${process.cwd()}/${name}`);
    console.log(`Change into the directory: cd ${name}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
