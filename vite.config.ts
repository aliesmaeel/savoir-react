import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const githubPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  base: githubPages ? "/Savoir-website/" : "/",
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
