###BASE###
FROM node:18.12.0-alpine3.15 as base

ENV NODE_ENV=production

LABEL maintainer=ft_trancedance

COPY package.json package-lock.json tsconfig.json ./

RUN apk add tini --no-cache \
	&& npm config list \
	&& npm ci \
#	&& npm outdated \
	&& npm cache clean --force

ENTRYPOINT ["tini", "--"]

###DEV###
FROM base as dev

ENV PATH /node_modules/.bin:$PATH

ENV NODE_ENV=development

RUN npm install && npm cache clean --force

COPY . ./backend

CMD ["nest", "start", "--watch"] 

###PRE-PROD###
FROM dev as build

WORKDIR /backend

RUN npm run build

###TEST###
FROM dev as test

CMD ["npm", "run", "test"]

###AUDIT###
FROM test as audit

CMD ["npm", "run", "audit"]

###PROD###
FROM base as prod

COPY --chown=node:node --from=build ./backend/dist ./dist

COPY .env ./.env

USER node

HEALTHCHECK  --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=3 --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", "./dist/main.js"]
