FROM node:18

WORKDIR /app

COPY . .

RUN chmod +x cicd_test.sh

CMD ./cicd_test.sh