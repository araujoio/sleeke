import fsExtra from "fs-extra/esm";
import path from "path";

const templatePath: string = path.join(process.cwd(), "src/templates");
const distPath: string = path.join(process.cwd(), "dist/templates");

const filter = (src: string) => {
  const relative = path.relative(templatePath, src);
  if (!relative) return true;
  const parts = relative.split(path.sep);
  if (
    parts[0] === "node_modules" ||
    parts[0] === ".next" ||
    parts[0] === "bun.lock"
  ) {
    return false;
  }
  return true;
};

if (fsExtra.pathExistsSync(templatePath)) {
  fsExtra.copySync(templatePath, distPath, { filter });
}
