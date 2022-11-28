FROM node:12 as build
WORKDIR /app
ARG SKIP_PREFLIGHT_CHECK
ARG NODE_ENV
ARG REACT_APP_HOTJAR_CODE
ARG REACT_APP_HOTJAR_CODE_VERSION
ARG REACT_APP_METADATA_CATALOG_URL
ARG REACT_APP_NEWSLETTER_EXAMPLE_URL
ARG REACT_APP_TERMS_AND_CONDITIONS_URL
ARG REACT_APP_GATEWAY_PRIVACY_POLICY_URL
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install --silent --legacy-peer-deps
COPY . /app
RUN npm run build

# production environment
FROM nginx:latest
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/
COPY nginx/error_pages /usr/share/nginx/html

EXPOSE 8080
CMD [ "nginx", "-g", "daemon off;"]
