import { appendFileSync } from "node:fs"

const semverPattern =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/

function main() {
  for (const name of ["GITHUB_OUTPUT", "GITHUB_ENV"]) {
    if (!process.env[name]) throw new Error(`${name} is not set`)
  }

  const raw = process.argv[2] ?? process.env.GITHUB_REF_NAME
  if (!raw) throw new Error("Release version is not set")

  const version = raw.startsWith("v") ? raw.slice(1) : raw
  if (!semverPattern.test(version)) throw new Error(`Invalid semantic version: ${raw}`)

  const prerelease = version.split("+")[0].includes("-")
  const distTag = prerelease ? "next" : "latest"
  appendFileSync(process.env.GITHUB_ENV, `VERSION=${version}\n`)
  appendFileSync(process.env.GITHUB_OUTPUT, `version=${version}\ndist-tag=${distTag}\n`)
  console.log(`Release version ${version} (dist-tag ${distTag})`)
}

try {
  main()
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
