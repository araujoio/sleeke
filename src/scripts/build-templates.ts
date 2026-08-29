import path from "path";
import { copySync } from "fs-extra/esm";

const src = path.join(process.cwd(), "src/templates");
const dest = path.join(process.cwd(), "dist/templates");

copySync(src, dest);
