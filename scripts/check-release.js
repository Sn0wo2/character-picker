import { appendFileSync } from "node:fs"

async function main() {
  for (const name of ["GITHUB_REPOSITORY", "GH_TOKEN", "GITHUB_OUTPUT"]) {
    if (!process.env[name]) throw new Error(`${name} is not set`)
  }

  const tag = process.argv[2] ?? process.env.GITHUB_REF_NAME
  if (!tag) throw new Error("Release tag is not set")

  const repositoryParts = process.env.GITHUB_REPOSITORY.split("/")
  if (repositoryParts.length !== 2 || repositoryParts.some((part) => !part)) {
    throw new Error("GITHUB_REPOSITORY must be in owner/name format")
  }
  const [owner, name] = repositoryParts

  const response = await fetch(process.env.GITHUB_GRAPHQL_URL ?? "https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query($owner: String!, $name: String!, $tag: String!) {
        repository(owner: $owner, name: $name) {
          release(tagName: $tag) { isDraft }
        }
      }`,
      variables: { owner, name, tag },
    }),
    signal: AbortSignal.timeout(30_000),
  })

  if (!response.ok) throw new Error(`Release lookup failed: HTTP ${response.status}`)

  const result = await response.json()
  if (!result || typeof result !== "object" || Array.isArray(result)) {
    throw new Error("Invalid release lookup response")
  }
  if (result.errors !== undefined) {
    if (!Array.isArray(result.errors) || result.errors.some((error) => typeof error?.message !== "string")) {
      throw new Error("Invalid release lookup response")
    }
    if (result.errors.length) throw new Error(result.errors.map((error) => error.message).join("; "))
  }

  const repository = result.data?.repository
  if (
    !repository ||
    typeof repository !== "object" ||
    Array.isArray(repository) ||
    !Object.hasOwn(repository, "release")
  ) {
    throw new Error("Repository lookup failed")
  }

  const release = repository.release
  if (release !== null && (!release || typeof release !== "object" || typeof release.isDraft !== "boolean")) {
    throw new Error("Invalid release lookup response")
  }

  const skip = release !== null && !release.isDraft
  appendFileSync(process.env.GITHUB_OUTPUT, `skip=${skip}\n`)
  const message = skip
    ? `Release ${tag} is already published; skipping.`
    : `Release ${tag} is not published; continuing.`
  console.log(message)
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
