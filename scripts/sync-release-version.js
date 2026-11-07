import { spawnSync } from "node:child_process"
import { appendFileSync } from "node:fs"

function run(command, options = {}) {
  const result = spawnSync(command[0], command.slice(1), { encoding: "utf8", ...options })
  if (result.status !== 0) {
    throw new Error(`\`${command.join(" ")}\` failed: ${result.stderr?.trim() || result.stdout?.trim()}`)
  }
}

function main() {
  for (const name of ["GITHUB_OUTPUT", "VERSION"]) {
    if (!process.env[name]) throw new Error(`${name} is not set`)
  }

  const packageDir = process.env.PACKAGE_DIR ?? "."
  const manifest = packageDir === "." ? "package.json" : `${packageDir}/package.json`

  run(["npm", "pkg", "set", `version=${process.env.VERSION}`], { cwd: packageDir })
  run(["bun", "install"])

  const changed = spawnSync("git", ["diff", "--quiet", "--", manifest, "bun.lock"]).status !== 0
  if (changed) appendFileSync(process.env.GITHUB_OUTPUT, "changed=true\n")
  console.log(
    changed ? `Package version synced to ${process.env.VERSION}.` : `Package version already ${process.env.VERSION}.`,
  )
}

try {
  main()
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
