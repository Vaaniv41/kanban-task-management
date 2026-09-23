# Stage 1: Build React application
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# API base URL is supplied during Docker build
ARG REACT_APP_BASEURL
ENV REACT_APP_BASEURL=$REACT_APP_BASEURL

RUN npm run build

# Stage 2: Serve React application
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]