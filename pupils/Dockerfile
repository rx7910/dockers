ARG BASE_VERSION
FROM duranx/pupils-base:${BASE_VERSION}

ARG STRAPI_VERSION
RUN yarn global add pupils@${STRAPI_VERSION}

RUN mkdir /srv/app && chown 1000:1000 -R /srv/app

WORKDIR /srv/app

VOLUME /srv/app

COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["pupils", "develop"]
