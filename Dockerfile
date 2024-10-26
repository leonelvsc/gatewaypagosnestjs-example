# Esto está copiado de la documentacion oficial de CentoOS en DockerHub
# https://hub.docker.com/_/centos/
FROM rockylinux:9

ENV container docker

MAINTAINER "Leonel Franchelli" <lfranchelli@naxs.com.ar>

RUN { \
      echo "[nginx]"; \
      echo "name=nginx repo"; \
      echo "baseurl=http://nginx.org/packages/rhel/9/x86_64/"; \
      echo "gpgcheck=0"; \
      echo "enabled=1"; \
    } > /etc/yum.repos.d/nginx.repo

RUN dnf install -y wget findutils
RUN dnf -y update
RUN curl -sL https://rpm.nodesource.com/setup_18.x | bash -

RUN dnf install -y nginx nodejs
ADD docker/config/nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /etc/nginx/conf.d/*
ADD docker/config/api.conf /etc/nginx/conf.d/api.conf
ADD docker/entrypoint.sh /usr/local/bin/entrypoint.sh
ADD docker/auth/naxs-cloud-555b87b8a53a.json /google-cloud-key-555b87b8a53a.json
ENV NODE_ENV production

COPY --chown=nginx:nginx ./dist /var/www/api/dist
COPY --chown=nginx:nginx ./node_modules /var/www/api/node_modules
WORKDIR /var/www/api
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT /usr/local/bin/entrypoint.sh

EXPOSE 80
