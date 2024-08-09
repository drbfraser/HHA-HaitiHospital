FROM node:18


WORKDIR /app

COPY . .

RUN cd common

RUN npm ci

RUN npm run build