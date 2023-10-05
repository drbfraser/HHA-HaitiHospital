FROM node:16

WORKDIR /server

# Install server files from TA
# (avoid using ADD: unpredictable, and seems not to extract on CI/CD server July 2022)
# Note: this does leave behind the extra tar.gz file in a layer
COPY server_build.tar.gz /server
RUN cd /server && tar -xzf server_build.tar.gz && rm server_build.tar.gz

CMD ["npm", "run", "start-prod"]