// 立绘, 只收集我自己喜欢的
// If there is any infringement, please contact me for removal
export const IMAGES = [
    // 孤独摇滚tv
    "hitori.png",
    "ikuyo.png",

    // 常轨脱离凸
    "asumi.png",
    "hiyori.png",
    "ameri.png",

    // 千恋*万花
    "murasame.png",
    "mako.png",

    // 星空列车与白的旅行
    "neri.png",
    "noir.png",
]

export const getRandomCharacter = () => {
    return IMAGES[Math.floor(Math.random() * IMAGES.length)]
}