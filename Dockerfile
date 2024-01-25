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

ENV NODE_ENV production 

RUN npm install

COPY . .

RUN npm run build

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
# RUN mkdir -p .next
# RUN chown nextjs:nodejs .next

# USER nextjs 

EXPOSE 3000

CMD npm run start