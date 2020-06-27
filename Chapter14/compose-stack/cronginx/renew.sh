#!/bin/sh

/usr/bin/certbot renew

kill -HUP `cat /var/run/nginx.pid`