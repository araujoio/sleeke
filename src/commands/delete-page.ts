import { Command } from "commander";
import fs from "node:fs";
import path from "node:path";

import { logger } from "@/utils/logger-service";

export const deletePage = new Command("delete-page")
  .description("Delete an existing page.")
  .argument("<name...>", "The name of the page.")
  .option("-p, --private", "Delete a page in private groups.", false)
  .action(async (names: string[], options: { private: boolean }) => {
    await main(names, options);
  });

async function main(names: string[], options: { private: boolean }): Promise<void> {
  try {
    logger.info(
      `Enumerating pages: ${names.length}, done.`
    );

    const group = options.private ? "private" : "public";
    const rootPath = process.cwd();
    const kitrawPath = path.join(rootPath, "kitraw.json");
    const groupPagesPath = path.join(rootPath, "src", "app", "[locale]", `(${group})`);

    if (!fs.existsSync(kitrawPath)) {
      throw new Error(
        `File ${kitrawPath} does not exist. Make sure you are inside the root directory of a Kitraw project.`
      );
    }

    if (!fs.existsSync(groupPagesPath)) {
      throw new Error(
        `Folder ${groupPagesPath} does not exist. Make sure you are inside the root directory of a Kitraw project.`
      );
    }

    const kitrawConfig = JSON.parse(
      fs.readFileSync(kitrawPath, "utf8")
    );

    let count = 1;

    for (const pageName of names) {
      const pagePath = path.join(groupPagesPath, pageName);

      if (fs.existsSync(pagePath)) {
        fs.rmSync(pagePath, { recursive: true, force: true });

        const routes: string[] = kitrawConfig.routes[`${group}Routes`];
        kitrawConfig.routes[`${group}Routes`] = routes.filter((route: string) => route !== pageName);

        logger.info(
          `Deleting ${count}/${names.length}, ${logger.formatLink(
            path.join(pageName, "page.tsx")
          )}`,
          false
        );
      } else {
        logger.warn(
          `Skipping ${count}/${names.length}, ${logger.formatLink(path.join(pageName, "page.tsx"))}`,
          false
        );
      }

      count++;
    }

    const remainingFiles = fs.readdirSync(groupPagesPath).filter((file) => file !== "layout.tsx" && file !== ".DS_Store");

    if (remainingFiles.length === 0) {
      fs.rmSync(groupPagesPath, { recursive: true, force: true });
    }

    fs.writeFileSync(kitrawPath, JSON.stringify(kitrawConfig, null, 2), "utf8");

    logger.info(
      `Resolving pages: 100% (${names.length}/${names.length}), done.`,
      false
    );

    logger.info(
      `Session: ${logger.getSessionID()}`,
      false
    );

    logger.info(
      `   ${logger.formatLink(logger.getAuditPath())}`,
      false
    );

  } catch (err: unknown) {
    logger.error(
      err instanceof Error ? err.message : "An unknown error occurred."
    );

    process.exit(1);
  }
}