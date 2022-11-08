###BASE###
FROM node:18.12.0-alpine3.15 as base

ENV NODE_ENV=production

LABEL maintainer=ft_trancedance

COPY *.json ./

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

COPY . ./frontend

WORKDIR ./frontend

CMD ["npm", "start"] 

###PRE-PROD###
FROM dev as build

ENV NODE_ENV=development

RUN npm install && npm cache clean --force

COPY . .

RUN npm run build

###TEST###
FROM dev as test

CMD ["npm", "run", "test"]

###AUDIT###
FROM test as audit

CMD ["npm", "run", "audit"]

###PROD###
FROM nginx:1.23.2-alpine as prod

COPY --chown=nginx:nginx --from=build ./frontend/build ./build

COPY default.conf /etc/nginx/conf.d/

HEALTHCHECK  --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=3 --spider http://127.0.0.1:4242/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
