import { resolveLinuxPaths } from "./tools/pack/src/linux.js";
import { resolveToolPackConfig } from "./tools/pack/src/config.js";
import { access, readdir } from "node:fs/promises";

async function pathExists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const config = await resolveToolPackConfig({
    platform: "linux",
    namespace: "default",
    workspaceRoot: "/home/galyarder/projects/galyarder-design",
  });
  console.log("Config roots:", JSON.stringify(config.roots, null, 2));
  const paths = resolveLinuxPaths(config);
  console.log("Resolved paths:", JSON.stringify(paths, null, 2));
  
  const builderExists = await pathExists(paths.appBuilderOutputRoot);
  console.log("builderOutputRoot exists:", builderExists);
  
  if (builderExists) {
    const entries = await readdir(paths.appBuilderOutputRoot);
    console.log("Directory entries:", entries);
    const appImage = entries.find((entry) => entry.endsWith(".AppImage"));
    console.log("Found AppImage entry:", appImage);
  }
}

main().catch(console.error);
