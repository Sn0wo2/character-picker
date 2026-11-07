FROM node:26-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY --chown=node:node package.json LICENSE ./
COPY --chown=node:node build/ ./build/
COPY --chown=node:node public/ ./public/

USER node

EXPOSE 3030

ENTRYPOINT ["node", "build/index.js"]
