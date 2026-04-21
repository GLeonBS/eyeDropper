import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const manifestPath = resolve(root, "public/manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

manifest.version = pkg.version;
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`manifest.json version synced to ${pkg.version}`);
