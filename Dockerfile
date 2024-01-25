FROM node:alpine

RUN mkdir -p /usr/src
WORKDIR /usr/src

COPY package*.json ./

ENV NODE_ENV production 
ARG NEXT_PUBLIC_API_V1_URL
ARG NEXT_PUBLIC_HOTJAR_ID

RUN npm install

COPY . .

RUN npm run build

USER root 

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"


CMD npm run start