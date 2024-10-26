#!/bin/sh

node dist/main & /usr/sbin/nginx -c /etc/nginx/nginx.conf
