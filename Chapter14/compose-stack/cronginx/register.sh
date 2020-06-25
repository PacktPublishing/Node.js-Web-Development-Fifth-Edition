#!/bin/sh

mkdir -p /webroots/$1/.well-known/acme-challenge

certbot certonly --webroot -w /webroots/$1 -d $1
