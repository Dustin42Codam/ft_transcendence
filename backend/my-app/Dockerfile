########################BASE########################
FROM node:current-alpine3.16 as base

ENV NODE_ENV=production

WORKDIR /www

COPY package.json package-lock.json tsconfig.json ./

RUN npm config list \
	&& npm outdated \
	&& npm ci \
	&& npm cache clean --force

ENV PATH /www/node_modules/.bin:$PATH
#########################DEV########################
FROM base as development

ENV NODE_ENV=development

RUN npm config list \
	&& npm outdated \
	&& npm install --only=development \
	&& npm cache clean --force

WORKDIR /www/backend

COPY . .

CMD ["nodemon",  "./src/main.ts", "--inspect=0.0.0.0:9229"]
########################TEST########################
FROM dev as test

RUN npm audit

CMD ["npm", "run", "test"]
########################PROD########################
FROM base as production

RUN apk add tini --no-cache

RUN chown node:node node_modules

WORKDIR /www/backend

FROM test as pre-prod

#COPY --from=pre-prod /app /app

HEALTHCHECK CMD curl http://127.0.0.1

USER node

ENTRYPOINT ["tini", "--"]

CMD ["node", "src/main.ts"]
