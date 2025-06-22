# character-pickup

随机从图库中获取一个立绘并展示~

---

## Demo

> https://char.me0wo.top/character

---

### 开发顺序

首先开发了[`Sn0wo2/img-302`](https://github.com/Sn0wo2/img-302)部署在`Vercel`  
随后因为`Vercel`的100k/m serverless请求限制写了个基于`Cloudflare Worker`的[
`Sn0wo2/character-img`](https://github.com/Sn0wo2/character-img)  
发现302跳原资源不仅慢还会被源站的缓存策略限制(而且跑源站流量不道德)  
随后就有了这个项目

- [Sn0wo2/img-302](https://github.com/Sn0wo2/img-302)
- [Sn0wo2/character-img](https://github.com/Sn0wo2/character-img)


- [**Sn0wo2/character-pickup**]()

---

`GET /character`

`GET /v1/characters`

---

> 如有侵权请发 [Issue](issues)  
> If there is any infringement, please submit an [Issue](issue)