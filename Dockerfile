FROM onfinality/subql-node:latest


#Get NPM packages
FROM node:14-alpine AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

ARG MAX_OLD_SPACE_SIZE=16384
ENV NODE_OPTIONS=--max-old-space-size=${MAX_OLD_SPACE_SIZE}