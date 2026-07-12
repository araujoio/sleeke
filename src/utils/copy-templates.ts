import fsExtra from "fs-extra/esm";
import path from "path";

const templatePath: string = path.join(process.cwd(), "src", "templates");
const distPath: string = path.join(process.cwd(), "dist", "templates");

if (fsExtra.pathExistsSync(templatePath)) {
  fsExtra.copySync(templatePath, distPath);
}
