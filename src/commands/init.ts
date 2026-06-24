import { Command } from "commander";
import { logger } from "@/utils/logger-service";
import { fileURLToPath } from "url";
import path from "path";
import fsExtra from "fs-extra/esm";

export const init = new Command("init")
  .name("init")
  .description("initialize a new nextjs project")
  .argument("<name>", "the name for the new project.")
  .action(async (name: string) => main(name)
);

async function main(name: string): Promise<void> {
  try {
    const rootPath: string = path.join(process.cwd(), name);
    const templatePath: string = path.join(path.dirname(fileURLToPath(import.meta.url)), "templates", "next-app");

    // check if the folder already exists
    if (fsExtra.pathExistsSync(rootPath)) {
      throw new Error(`Cannot create Kitraw project. The folder "${name}" already exists at "${rootPath}".`);
    }

    fsExtra.copySync(templatePath, rootPath);
    
    logger.info(`Initialized empty next-app project in: ${rootPath}`, false);

  } catch (err: any) {
    logger.error(err.message);
    process.exit(1);
  }
}