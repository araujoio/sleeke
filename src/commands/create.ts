import { existsSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import { copySync } from "fs-extra/esm";

const TEMPLATE_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "templates"
);

function createNewProject(name: string): void {
  const target = resolve(process.cwd(), name);

  if (existsSync(target)) {
    throw new Error("Target directory already exists.", {
      cause: `Failed to create project in ${target} because the path "${target}" already exists.`,
    });
  }

  copySync(TEMPLATE_PATH, target);
  console.log(chalk.green(`Created project in ${target}`));
}

export function main(name: string): void {
  try {
    createNewProject(name);
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`✖ ${error.message}`));
      if (error.cause) console.error(String(error.cause));
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}
