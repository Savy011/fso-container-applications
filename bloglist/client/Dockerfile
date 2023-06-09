FROM node:18-alpine AS build-stage

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

FROM nginx:1.20-alpine AS serving-stage

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
