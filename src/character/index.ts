// @ts-expect-error raw import
import rawIndex from '../../public/.index?raw';

export const IMAGES = (rawIndex as string)
    .split(/\n/)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('//'));

export const getRandomCharacter = (list?: string[]) => {
    if (!list || list.length === 0) list = IMAGES;
    return list[Math.floor(Math.random() * list.length)];
};
