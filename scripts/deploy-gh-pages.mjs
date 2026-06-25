import { spawnSync } from "node:child_process";

const isWindows = process.platform === "win32";

function run(command, args, env = {}) {
  const result = spawnSync(command, args, {
    env: { ...process.env, ...env },
    shell: isWindows,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("npm", ["run", "build"], { GITHUB_PAGES: "true" });
run("npx", ["gh-pages", "-d", "build/client", "--dotfiles"]);
