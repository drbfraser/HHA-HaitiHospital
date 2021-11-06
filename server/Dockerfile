#  Dockerfile for Node Express Backend
FROM node:14.17.6

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy app source code
COPY . .

RUN npm run build

# Exports
EXPOSE 5000

CMD ["npm","run","start-prod"]
