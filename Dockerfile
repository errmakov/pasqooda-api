FROM node:12
WORKDIR /apps/pasqooda-api
#COPY ./ /apps/pasqooda-api
EXPOSE 4040

# Install app dependencies and run application
RUN echo hellopasqooda-api

COPY ./docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT /docker-entrypoint.sh
