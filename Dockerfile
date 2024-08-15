FROM node:18

WORKDIR /app

COPY . .

RUN chmod +x cicd_test.sh

RUN sed -i 's/\r$//' cicd_test.sh

RUN mkdir -p /var/artifacts

CMD ./cicd_test.sh