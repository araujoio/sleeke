import { Command } from "commander";

const program = new Command();

program
  .name("sleeke")
  .description("Sleeke build sites from validated wireframes")
  .version("1.0.0");

program
  .command("init")
  .description("Create a new project from the Sleeke template")
  .argument("[directory]", "Project directory", ".")
  .action(async (directory) => {
    const { init } = await import("./commands/init.js");
    await init(directory);
  });

program.parseAsync();
