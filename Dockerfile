FROM node:18

WORKDIR /app

COPY . .

CMD ./cicd_test.sh