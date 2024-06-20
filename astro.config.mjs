import { defineConfig } from "astro/config";
import path from "path";
import { fileURLToPath } from "url";
import alpine from "@astrojs/alpinejs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, "src");
const jsDir = path.join(srcDir, "js");

// https://astro.build/config
export default defineConfig({
  integrations: [alpine()],
  vite: {
    build: {
      resolve: {
        alias: {
          "~": jsDir,
          "@": srcDir,
        },
      },
      cssCodeSplit: false,
    },
  },
});
