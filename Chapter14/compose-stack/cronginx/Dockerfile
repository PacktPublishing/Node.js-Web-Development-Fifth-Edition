FROM nginx:stable

# Inspiration:
# https://github.com/robogeek/cronginx

# Install cron, certbot, bash, plus any other dependencies

RUN apt-get update \
    && apt-get install -y cron bash wget certbot \
    && apt-get update -y \
    && mkdir -p /webroots /scripts \
    && rm -f /etc/nginx/conf.d/default.conf

COPY *.sh /scripts/
RUN chmod +x /scripts/*.sh

# /webroots/DOMAIN.TLD/.well-known/... files go here
VOLUME /webroots
# This handles book-keeping files for Letsencrypt
VOLUME /etc/letsencrypt
# This lets folks inject Nginx config files
VOLUME /etc/nginx/conf.d

WORKDIR /scripts

# This installs a Crontab entry which 
# runs "certbot renew" on several days a week at 03:22 AM

RUN echo "22 03 * * 2,7 root /scripts/renew.sh" >/etc/cron.d/certbot-renew

# Run both nginx and cron together
CMD [ "sh", "-c", "cron && nginx -g 'daemon off;'" ]
