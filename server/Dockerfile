# mcro/ci-node-mysql
FROM node:6.9.1
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update \
  && apt-get install -y mysql-server mysql-client libmysqlclient-dev \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

