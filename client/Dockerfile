FROM cypress/base

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

RUN npx cypress install

COPY . .

ENTRYPOINT [ "npx", "cypress", "run"]





