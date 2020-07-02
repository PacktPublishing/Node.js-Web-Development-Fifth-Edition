FROM node:14

RUN apt-get update -y  \
    && apt-get upgrade -y \
    && apt-get -y install curl python build-essential git ca-certificates

ENV DEBUG="users:*" 
ENV PORT="5858" 
ENV SEQUELIZE_CONNECT="sequelize-docker-mysql.yaml" 
ENV REST_LISTEN="0.0.0.0" 
 
RUN mkdir -p /userauth
COPY package.json *.yaml *.mjs /userauth/
WORKDIR /userauth
RUN npm install --unsafe-perm 
 
EXPOSE 5858 
CMD [ "node", "./user-server.mjs" ]
