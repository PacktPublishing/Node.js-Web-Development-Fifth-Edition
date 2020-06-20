#!/bin/sh

SVC_NOTES=$1
SVC_USERAUTH=$2

# docker exec -it ${SVC_NOTES} apt-get -y install sqlite3
# docker exec -it --workdir  /notesapp/test -e DEBUG= ${SVC_NOTES} rm -rf node_modules
# docker exec -it --workdir  /notesapp/test -e DEBUG= ${SVC_NOTES} npm install

docker exec -it --workdir  /notesapp/test -e DEBUG= ${SVC_NOTES} npm run test-notes-memory
docker exec -it --workdir  /notesapp/test -e DEBUG= ${SVC_NOTES} npm run test-notes-fs
docker exec -it --workdir  /notesapp/test -e DEBUG= ${SVC_NOTES} npm run test-level
docker exec -it --workdir  /notesapp/test -e DEBUG= ${SVC_NOTES} npm run test-notes-sqlite3
docker exec -it --workdir  /notesapp/test -e DEBUG= ${SVC_NOTES} npm run test-notes-sequelize-sqlite
docker exec -it --workdir  /notesapp/test -e DEBUG= ${SVC_NOTES} npm run test-notes-sequelize-mysql
docker exec -it --workdir  /notesapp/test -e DEBUG= ${SVC_NOTES} npm run test-notes-mongodb

# docker exec -it -e DEBUG= --workdir /userauth/test ${SVC_USERAUTH} rm -rf node_modules
# docker exec -it -e DEBUG= --workdir /userauth/test ${SVC_USERAUTH} npm install
docker exec -it -e DEBUG= --workdir /userauth/test ${SVC_USERAUTH} npm run test