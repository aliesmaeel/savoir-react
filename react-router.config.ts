import type { Config } from "@react-router/dev/config";
import { copyFile, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const githubPages = process.env.GITHUB_PAGES === "true";
const githubPagesBase = "/Savoir-website/";

async function rewriteGithubPagesPaths(dir: string) {
  const entries = await readdir(dir);

  await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry);
      const info = await stat(fullPath);

      if (info.isDirectory()) {
        await rewriteGithubPagesPaths(fullPath);
        return;
      }

      if (!/\.(html|js|css)$/.test(entry)) return;

      const source = await readFile(fullPath, "utf8");
      const next = source
        .replace(/(["'`(])\/(images|fonts)\//g, `$1${githubPagesBase}$2/`)
        .replace(/(["'`(])\/(favicon\.ico|comingsoon\.html|savoir_ppsf_tool_4\.html)/g, `$1${githubPagesBase}$2`);

      if (next !== source) {
        await writeFile(fullPath, next);
      }
    })
  );
}

export default {
  basename: githubPages ? githubPagesBase : "/",
  routeDiscovery: githubPages ? { mode: "initial" } : undefined,
  prerender: githubPages ? ["/"] : undefined,
  buildEnd: githubPages
    ? async () => {
        const clientDir = path.resolve("build/client");
        const prerenderedIndex = path.join(clientDir, "Savoir-website/index.html");
        await copyFile(prerenderedIndex, path.join(clientDir, "index.html"));
        await copyFile(prerenderedIndex, path.join(clientDir, "404.html"));
        await rewriteGithubPagesPaths(clientDir);
      }
    : undefined,
  ssr: true,
} satisfies Config;
