FROM caddy:2.7.4

# these paths are relative to the project root, not this folder
ADD caddy/Caddyfile /etc/caddy/Caddyfile

# Extract website (avoid ADD: unpredictable, and seems not to extract on CI/CD server July 2022)
# Note: this does leave behind the extra tar.gz file in a layer
COPY web_build.tar.gz /var/www/
RUN cd /var/www/ && tar -xzf web_build.tar.gz && rm web_build.tar.gz