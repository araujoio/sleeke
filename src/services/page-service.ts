
import path from "path";
import fsExtra from "fs-extra/esm";

export class PageService {

  async renamePage(oldName: string, newName: string, isPrivate: boolean): Promise<void> {
    const group: string = isPrivate ? "private" : "public";
    const kitrawPath: string = path.join(process.cwd(), "kitraw.json");
    const kitrawExists: boolean = fsExtra.pathExistsSync(kitrawPath);
  
    if (!kitrawExists) {
      throw new Error(`File ${kitrawPath} does not exist. Make sure you are inside the root directory of a kitraw project.`);
    }

    const oldPagePath: string = path.join(process.cwd(), "src", "app", "[locale]", `(${group})`, oldName);
    const newPagePath: string = path.join(process.cwd(), "src", "app", "[locale]", `(${group})`, newName);
    const oldPageExists: boolean = fsExtra.pathExistsSync(oldPagePath);
    const newPageExists: boolean = fsExtra.pathExistsSync(newPagePath);

    if (!oldPageExists) {
      throw new Error(`Page "${oldName}" does not exist in the ${group} group.`);
    }

    if (newPageExists) {
      throw new Error(`Page "${newName}" already exists in the ${group} group.`);
    }

    fsExtra.moveSync(oldPagePath, newPagePath);

    const kitrawConfig: any = fsExtra.readJsonSync(kitrawPath);

    const routes: Array<string> = kitrawConfig["routes"][group + "Routes"];
    const newRoutes: Array<string> = routes.filter((route: string) => route !== oldName);
    kitrawConfig["routes"][group + "Routes"] = newRoutes;

    fsExtra.outputJsonSync(kitrawPath, kitrawConfig);
  }
}
