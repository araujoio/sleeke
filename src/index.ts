import { Command } from "commander";

const program = new Command();

program
  .name("fluetto")
  .description("Fluetto build multi-language sites")
  .version("1.0.0");

program
  .command("create")
  .description("Create a new project from the Fluetto template")
  .argument("<directory>", "Project directory")
  .action(async (directory) => {
    const { main } = await import("./commands/create.ts");
    await main(directory);
  });

program.parseAsync();
