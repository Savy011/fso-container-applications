FROM node:18 AS test-stage

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN CI=true npm run test

RUN rm -rf ./node_modules

FROM node:18 AS build-stage

WORKDIR /usr/src/app

COPY --from=test-stage /usr/src/app .

RUN npm install

ENV REACT_APP_BACKEND_URL=http://localhost:8080/api/

RUN npm run build

FROM nginx:1.20-alpine

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
