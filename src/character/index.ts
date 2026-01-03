export const IMAGES = (globalThis.CHARACTER_INDEX || '' as string)
    .split(/\n/)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('//'));

export const getRandomCharacter = (list?: string[]) => {
    if (!list || list.length === 0) list = IMAGES;
    return list[Math.floor(Math.random() * list.length)];
};
