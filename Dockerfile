FROM node:18

WORKDIR /app

COPY . .

RUN chmod +x cicd_test.sh

#Remove line endings from windows making the script executable

RUN sed -i 's/\r$//' cicd_test.sh

RUN mkdir -p /var/artifacts

CMD ./cicd_test.sh