#!/bin/sh

set -x

# docker-compose stop
# docker-compose build
# docker-compose up --force-recreate -d

docker ps
docker network ls

sleep 20


# docker exec -it svc-notes-test apt-get -y install sqlite3

docker exec -it --workdir  /notesapp/test -e DEBUG= svc-notes-test npm install

docker exec -it --workdir  /notesapp/test -e DEBUG= svc-notes-test npm run test-notes-memory
docker exec -it --workdir  /notesapp/test -e DEBUG= svc-notes-test npm run test-notes-fs
docker exec -it --workdir  /notesapp/test -e DEBUG= svc-notes-test npm run test-level
docker exec -it --workdir  /notesapp/test -e DEBUG= svc-notes-test npm run test-notes-sqlite3
docker exec -it --workdir  /notesapp/test -e DEBUG= svc-notes-test npm run test-notes-sequelize-sqlite
docker exec -it --workdir  /notesapp/test -e DEBUG= svc-notes-test npm run test-notes-sequelize-mysql
# docker exec -it --workdir  /notesapp/test -e DEBUG= svc-notes-test npm run test-notes-mongodb

# docker exec -it -e DEBUG= --workdir /userauth/test svc-userauth-test npm install
# docker exec -it -e DEBUG= --workdir /userauth/test svc-userauth-test npm run test

# docker-compose stop
