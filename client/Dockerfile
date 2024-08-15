FROM cypress/base

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

RUN npx cypress install

COPY . .

RUN chmod +x cypress_test.sh

RUN sed -i 's/\r$//' cypress_test.sh

RUN mkdir -p /var/artifacts

CMD ./cypress_test.sh





