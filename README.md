# character-pickup

随机从图库中获取一个立绘并展示~  
~~展示在我的`Github 主页 README`的脑婆~~

---

[![CI](https://github.com/Sn0wo2/character-picker/actions/workflows/ci.yml/badge.svg)](https://github.com/Sn0wo2/character-picker/actions/workflows/ci.yml)
[![CodeQL Advanced](https://github.com/Sn0wo2/character-picker/actions/workflows/codeql.yml/badge.svg)](https://github.com/Sn0wo2/character-picker/actions/workflows/codeql.yml)
[![Dependabot Updates](https://github.com/Sn0wo2/character-picker/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/Sn0wo2/character-picker/actions/workflows/dependabot/dependabot-updates)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FSn0wo2%2Fcharacter-picker.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FSn0wo2%2Fcharacter-picker?ref=badge_shield)

---

## Demo

> https://picker.me0wo.cc/character

---

### 开发顺序

首先开发了[~~`Sn0wo2/img-302`~~](https://github.com/Sn0wo2/img-302)部署在`Vercel`  
随后因为`Vercel`的`100k/m`的`Serverless`请求限制写了个基于`Cloudflare Worker`的[
~~`Sn0wo2/character-img`~~](https://github.com/Sn0wo2/character-img)  
发现`302`跳原资源不仅慢还会被源站的缓存策略限制 ~~(而且跑源站流量不道德)~~  
随后就有了这个项目

- [~~Sn0wo2/img-302~~](https://github.com/Sn0wo2/img-302)
- [~~Sn0wo2/character-img~~](https://github.com/Sn0wo2/character-img)


- [**Sn0wo2/character-pickup**](#)

---

### Installation

Requirements:

- git
- Node.js >= 22(?)
- pnpm

```bash
git clone https://github.com/Sn0wo2/character-pickup.git
cd character-pickup
pnpm install
```

---

### API

#### `GET /character`

###### Query Parameters

| Name   | Type      | Required | Description            | Example                 |
|--------|-----------|----------|------------------------|-------------------------|
| custom | string... | No       | 手动取*character*, 用","分隔 | `hitori.png,hiyori.png` |

---

#### `GET /v1/characters`

###### Response

```json
{
  "msg": "/:image",
  "data": {
    "characters": [
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

---

> 如有侵权请发 [Issue](https://github.com/Sn0wo2/character-picker/issues)  
> If there is any infringement, please submit an [Issue](https://github.com/Sn0wo2/character-picker/issues)

## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FSn0wo2%2Fcharacter-picker.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FSn0wo2%2Fcharacter-picker?ref=badge_large)
=======