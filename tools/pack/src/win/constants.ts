export const PRODUCT_NAME = "Galyarder Design";
export const DESKTOP_LOG_ECHO_ENV = "GD_DESKTOP_LOG_ECHO";
export const WEB_STANDALONE_HOOK_CONFIG_ENV = "GD_TOOLS_PACK_WEB_STANDALONE_HOOK_CONFIG";
export const WEB_STANDALONE_RESOURCE_NAME = "galyarder-design-web-standalone";
export const ELECTRON_BUILDER_ASAR = false;
export const ELECTRON_BUILDER_BUILD_DEPENDENCIES_FROM_SOURCE = false;
export const ELECTRON_BUILDER_NODE_GYP_REBUILD = false;
export const ELECTRON_BUILDER_NPM_REBUILD = false;
export const ELECTRON_REBUILD_MODE = "sequential" as const;
export const ELECTRON_REBUILD_NATIVE_MODULES = ["better-sqlite3"] as const;
export const ELECTRON_BUILDER_FILE_PATTERNS = [
  "**/*",
  "!**/node_modules/.bin",
  "!**/node_modules/electron{,/**/*}",
  "!**/*.map",
  "!**/*.tsbuildinfo",
  "!**/.next/cache",
  "!**/.next/cache/**",
  "!**/node_modules/better-sqlite3/build/Release/obj",
  "!**/node_modules/better-sqlite3/build/Release/obj/**",
  "!**/node_modules/better-sqlite3/deps",
  "!**/node_modules/better-sqlite3/deps/**",
] as const;
export const NSIS_INSTALLER_LANGUAGE_BY_WEB_LOCALE = {
  en: "en_US",
  fa: "fa_IR",
  "pt-BR": "pt_BR",
  ru: "ru_RU",
  "zh-CN": "zh_CN",
  "zh-TW": "zh_TW",
} as const;
export const INTERNAL_PACKAGES = [
  { directory: "packages/contracts", name: "@galyarder-design/contracts" },
  { directory: "packages/registry-protocol", name: "@galyarder-design/registry-protocol" },
  { directory: "packages/sidecar-proto", name: "@galyarder-design/sidecar-proto" },
  { directory: "packages/sidecar", name: "@galyarder-design/sidecar" },
  { directory: "packages/platform", name: "@galyarder-design/platform" },
  { directory: "packages/agui-adapter", name: "@galyarder-design/agui-adapter" },
  { directory: "packages/plugin-runtime", name: "@galyarder-design/plugin-runtime" },
  { directory: "packages/diagnostics", name: "@galyarder-design/diagnostics" },
  { directory: "packages/host", name: "@galyarder-design/host" },
  { directory: "apps/daemon", name: "@galyarder-design/daemon" },
  { directory: "apps/web", name: "@galyarder-design/web" },
  { directory: "apps/desktop", name: "@galyarder-design/desktop" },
  { directory: "apps/packaged", name: "@galyarder-design/packaged" },
] as const;
