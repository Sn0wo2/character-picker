// 立绘, 只收集我自己喜欢的
// If there is any infringement, please contact me for removal
export const IMAGES = [
    // 孤独摇滚tv
    'hitori.png',
    'ikuyo.png',

    // 常轨脱离凸
    'asumi.png',
    'hiyori.png',
    'ameri.png',

    // 千恋*万花
    'murasame.png',

    // 星空列车与白的旅行
    'neri.png',

    // anemoi
    'shubika.png',
];

export const getRandomCharacter = (list?: string[]) => {
    if (!list || list.length === 0) list = IMAGES;
    return list[Math.floor(Math.random() * list.length)];
};