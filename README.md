# character-picker

> Random character on cloudflare worker

~~用来展示在我`Github 主页 README`的脑婆(?)的项目~~

---

[![CI](https://github.com/Sn0wo2/character-picker/actions/workflows/ts.yml/badge.svg)](https://github.com/Sn0wo2/character-picker/actions/workflows/ts.yml)
[![CodeQL Advanced](https://github.com/Sn0wo2/character-picker/actions/workflows/codeql.yml/badge.svg)](https://github.com/Sn0wo2/character-picker/actions/workflows/codeql.yml)
[![Dependabot Updates](https://github.com/Sn0wo2/character-picker/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/Sn0wo2/character-picker/actions/workflows/dependabot/dependabot-updates)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FSn0wo2%2Fcharacter-picker.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FSn0wo2%2Fcharacter-picker?ref=badge_shield)

---

## Demo

> https://picker.me0wo.cc

<img src="https://picker.me0wo.cc" alt="character" width="200">

---

### API

#### `GET /*`

###### Query Parameters

| Name                 | Type      | Required | Description            | Example                       |
|----------------------|-----------|----------|------------------------|-------------------------------|
| custom               | string... | No       | 手动取*character*, 用","分隔 | `hitori.png,hiyori.png`       |
| gradientMoveDuration | number    | No       | 渐变移动动画持续时间 (秒)         | `gradientMoveDuration=5`      |
| colorChangeDuration  | number    | No       | 颜色变化动画持续时间 (秒)         | `colorChangeDuration=3`       |
| gradientStartCY      | string    | No       | 渐变初始Y轴位置               | `gradientStartCY=-50%`        |
| gradientEndCY        | string    | No       | 渐变结束Y轴位置               | `gradientEndCY=100%`          |
| gradientCX           | string    | No       | 渐变中心点X轴位置              | `gradientCX=50%`              |
| gradientR            | string    | No       | 渐变半径                   | `gradientR=55%`               |
| stopColor1           | string    | No       | 渐变颜色1                  | `stopColor1=%23ff0000`        |
| stopColor2           | string    | No       | 渐变颜色2                  | `stopColor2=%2300ff00`        |
| stopColor3           | string    | No       | 渐变颜色3                  | `stopColor3=%230000ff`        |
| stopOffset1          | string    | No       | 渐变颜色1偏移量               | `stopOffset1=0%`              |
| stopOffset2          | string    | No       | 渐变颜色2偏移量               | `stopOffset2=50%`             |
| stopOffset3          | string    | No       | 渐变颜色3偏移量               | `stopOffset3=100%`            |
| fromColor            | string    | No       | 颜色动画起始颜色               | `fromColor=%23000000`         |
| toColor              | string    | No       | 颜色动画结束颜色               | `toColor=%23ffffff`           |
| begin                | string    | No       | 颜色动画开始时间               | `begin=cyMove.end`            |
| keySplines1          | string    | No       | 颜色动画缓动函数               | `keySplines1=0.25+0.1+0.25+1` |
| keySplines2          | string    | No       | 移动动画缓动函数               | `keySplines2=0.25+0.1+0.25+1` |

---

#### `GET /v1/characters`

###### Response

```json
{
  "msg": "/:image",
  "data": {
    "ch1aracters": [
      "hitori.png",
      "ikuyo.png",
      "asumi.png",
      "hiyori.png",
      "ameri.png",
      "murasame.png",
      "mako.png",
      "neri.png",
      "noir.png"
    ]
  }
}
```

---

#### `/:image`

> Response raw image (Require Cloudflare Worker RN)

---

> 如有侵权请发 [Issue](https://github.com/Sn0wo2/character-picker/issues)  
> If there is any infringement, please submit an [Issue](https://github.com/Sn0wo2/character-picker/issues)

---

### ~~开发顺序~~

<details>
<summary>点击展开开发历史</summary>

首先开发了[~~`Sn0wo2/img-302`~~](https://github.com/Sn0wo2/img-302)部署在`Vercel`

随后因为各种原因和`Vercel`需要跑其他的服务而写了个基于`Cloudflare Worker`的[
~~`Sn0wo2/character-img`~~](https://github.com/Sn0wo2/character-img)

发现`302`跳原资源不仅慢还会被源站的缓存策略限制 ~~(而且跑源站流量存在合理性问题)~~

随后开发了此v3项目

- [~~Sn0wo2/img-302~~](https://github.com/Sn0wo2/img-302)
- [~~Sn0wo2/character-img~~](https://github.com/Sn0wo2/character-img)


- [**Sn0wo2/character-picker**](#)

</details>

---

## License

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FSn0wo2%2Fcharacter-picker.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FSn0wo2%2Fcharacter-picker?ref=badge_large)