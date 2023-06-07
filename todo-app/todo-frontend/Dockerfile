FROM node:18 as build-stage

WORKDIR /usr/src/app

COPY . .
RUN npm ci --only-production

ENV REACT_APP_BACKEND_URL=http://localhost:3000
RUN npm run build

FROM nginx

COPY --from=build-stage /usr/src//app/build /usr/share/nginx/html
