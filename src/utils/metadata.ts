const LINE_BREAK = /\r?\n/

export const parseMetadata = (value: string) =>
  value
    .split(LINE_BREAK)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("//"))
