FROM node:20.2.0-bullseye-slim

RUN mkdir -p /usr/src
WORKDIR /usr/src

COPY . /usr/src

ENV WATCHPACK_POLLING true
ENV NEXT_WEBPACK_USEPOLLING true

RUN npm install

EXPOSE 3000
CMD npm run dev
