import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";
import type { ManifestV3Export } from "@crxjs/vite-plugin";
const { version } = packageJson;

const target = process.env.BUILD_TARGET;

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = "0"] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, "")
  // split into version parts
  .split(/[.-]/);
const json: ManifestV3Export = {
  manifest_version: 3,
  name: "chrome-extension-init-react",
  description: "Chrome Extension Quick Start Project",
  // up to four numbers separated by dots
  version: `${major}.${minor}.${patch}.${label}`,
  // semver is OK in "version_name"
  version_name: version,
  icons: {
    128: "src/assets/icon.png",
  },
  action: {
    default_icon: "src/assets/icon.png",
    default_popup: "src/pages/popup/index.html",
  },
  permissions: ["activeTab", "storage", "contextMenus", "scripting"],
  content_scripts: [
    {
      js: ["src/contentScript/index.tsx"],
      matches: ["*://*/*"],
    },
  ],
  options_page: "src/pages/options/index.html",
  background: {
    service_worker: "src/background.ts",
    type: "module",
  },
};
if (target === "chrome") {
  // do something when target is chorme
}
export default defineManifest(async () => json);
