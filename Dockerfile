FROM node:10-slim as build
WORKDIR /home/node
COPY . /home/node/
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /home/node/dist /usr/share/nginx/html
