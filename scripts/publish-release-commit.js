import { spawnSync } from "node:child_process"
import { appendFileSync } from "node:fs"

function git(command, options = {}) {
  const result = spawnSync("git", command, { encoding: "utf8", ...options })
  if (result.status !== 0) {
    throw new Error(`\`git ${command.join(" ")}\` failed: ${result.stderr?.trim() || result.stdout?.trim()}`)
  }
  return result.stdout?.trim()
}

function gitSucceeds(command) {
  return spawnSync("git", command, { encoding: "utf8" }).status === 0
}

function main() {
  for (const name of ["GITHUB_OUTPUT", "VERSION", "GH_TOKEN", "DEFAULT_BRANCH"]) {
    if (!process.env[name]) throw new Error(`${name} is not set`)
  }

  const version = process.env.VERSION
  const tag = `v${version}`
  const defaultBranch = process.env.DEFAULT_BRANCH
  const packageDir = process.env.PACKAGE_DIR ?? "."
  const manifest = packageDir === "." ? "package.json" : `${packageDir}/package.json`
  const push = (...command) => git(["-c", "credential.helper=!gh auth git-credential", "push", ...command])

  git(["config", "user.name", "github-actions[bot]"])
  git(["config", "user.email", "github-actions[bot]@users.noreply.github.com"])
  git(["add", "-u", "--", manifest, "bun.lock"])

  const tagExists = gitSucceeds(["show-ref", "--verify", "--quiet", `refs/tags/${tag}`])
  const staged = !gitSucceeds(["diff", "--cached", "--quiet"])
  if (!staged && tagExists) {
    appendFileSync(process.env.GITHUB_OUTPUT, `sha=${git(["rev-parse", "HEAD"])}\n`)
    console.log(`Tag ${tag} already points at the checked version; nothing to commit.`)
    return
  }

  if (staged) git(["commit", "-m", `chore(release): bump version to ${version}`])
  const releaseSha = git(["rev-parse", "HEAD"])

  if (tagExists) {
    git(["fetch", "origin", defaultBranch])
    git(["checkout", "--detach", "FETCH_HEAD"])
    const picked = spawnSync("git", ["cherry-pick", releaseSha], { encoding: "utf8" })
    if (picked.status !== 0) {
      if (!gitSucceeds(["diff", "--cached", "--quiet"])) {
        throw new Error(`\`git cherry-pick ${releaseSha}\` failed: ${picked.stderr?.trim() || picked.stdout?.trim()}`)
      }
      git(["cherry-pick", "--skip"])
      console.log(`Version bump for ${tag} is already on ${defaultBranch}; nothing to cherry-pick.`)
    } else {
      push("origin", `HEAD:refs/heads/${defaultBranch}`)
      console.log(`Cherry-picked the version bump for ${tag} onto ${defaultBranch}.`)
    }
  } else {
    git(["tag", tag])
    push("--atomic", "origin", `HEAD:refs/heads/${defaultBranch}`, `refs/tags/${tag}`)
    console.log(`Tagged ${tag} and pushed it with ${defaultBranch}.`)
  }

  appendFileSync(process.env.GITHUB_OUTPUT, `sha=${releaseSha}\n`)
}

try {
  main()
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
