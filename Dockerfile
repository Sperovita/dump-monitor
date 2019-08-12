FROM alpine:3.9
LABEL Maintainer="Greg Ransons <gregransons@gmail.com>" \
      Description="Dump Monitor"

# Package Dependancies
RUN apk --no-cache update && \
    apk --no-cache add nodejs npm supervisor yarn shadow

# Copy File Configurations
COPY ./docker-config/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# User, Group, Dir and Perms
ARG UID=1000
ARG GID=33
ARG REPLACEMENT_GID=73
ARG WORKING_DIR_NAME=dump-monitor

RUN if [ $(getent group ${GID}) ] ; then groupmod -g ${REPLACEMENT_GID} $(getent group ${GID} | cut -d: -f1) ; fi && \
    addgroup -S -g ${GID} director && adduser -S -u ${UID} -G director director && \
    chown -R director.director /run && \
    mkdir -p /var/www/${WORKING_DIR_NAME} && \
    chown -R director.director /var/www/${WORKING_DIR_NAME} && \
    mkdir -p /var/www/dump && \
    chown -R director.director /var/www/dump

WORKDIR /var/www/${WORKING_DIR_NAME}

# NPM Packages
ARG DEPLOY=prod
COPY --chown=director:director ./server/ball ./server/package* /var/www/${WORKING_DIR_NAME}/
RUN if [ ${DEPLOY} = prod ] ; then yarn install --production ; fi

# Copy Source
COPY --chown=director:director ./server /var/www/${WORKING_DIR_NAME}/

USER director

EXPOSE 8080

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]


