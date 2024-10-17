FROM node:alpine

RUN mkdir -p /usr/src
WORKDIR /usr/src

COPY package*.json ./

ARG NEXT_PUBLIC_API_V1_URL
ARG NEXT_PUBLIC_API_V1_IP_URL
ARG NEXT_PUBLIC_WORDPRESS_API_URL
ARG NEXT_PUBLIC_SERVICE_DESK_URL
ARG NEXT_PUBLIC_GATEWAY_URL
ARG NEXT_PUBLIC_HOTJAR_ID
ARG NEXT_PUBLIC_SCHEMA_NAME
ARG NEXT_PUBLIC_SCHEMA_VERSION
ARG NEXT_PUBLIC_GTM_ID
ARG NEXT_PUBLIC_OA_APP_ID
ARG NEXT_PUBLIC_INCLUDE_BANNERS
ARG NEXT_PUBLIC_MEDIA_DOMAIN
ARG NEXT_PUBLIC_MEDIA_STATIC_URL

ENV NODE_ENV production

RUN rm -rf node_modules

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD npm run start