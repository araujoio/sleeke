import { Command } from "commander";
import { PageService } from "@/services/page-service";
import { logger } from "@/services/logger-service";

export const deletePage = new Command("delete-page")
  .name("delete-page")
  .description("delete a existing page")
  .argument("<name...>", "the name for the page")
  .option("-p, --private", "delete a page in private groups", false)
  .action(async (names: Array<string>, options: { private: boolean }) => main(names, options)
);

async function main(names: Array<string>, options: { private: boolean }) : Promise<void> {
  const pageService = new PageService();

  logger.info(`enumerating pages: ${names.length}, group: ${options.private ? 'private' : 'public'}`, false);
  
  try {
    await pageService.deletePage(names, options.private);
    logger.info(`resolving 100% ${names.length}/${names.length}, done`, false);
    logger.success(`session: ${logger.getSessionID()}, audit: ${logger.formatLink(logger.getAuditPath())}`, false);
  } catch (err: any) {
    logger.error("unexpected error ocurred", err);
    process.exit(1);
  }
}

