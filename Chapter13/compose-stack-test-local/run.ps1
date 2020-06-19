
# docker exec -it %SVC_NOTES% apt-get -y install sqlite3
# docker exec -it --workdir  /notesapp/test -e DEBUG= %SVC_NOTES% npm install

docker exec -it --workdir  /notesapp/test -e DEBUG= %SVC_NOTES% npm run test-notes-memory
docker exec -it --workdir  /notesapp/test -e DEBUG= %SVC_NOTES% npm run test-notes-fs
docker exec -it --workdir  /notesapp/test -e DEBUG= %SVC_NOTES% npm run test-level
docker exec -it --workdir  /notesapp/test -e DEBUG= %SVC_NOTES% npm run test-notes-sqlite3
docker exec -it --workdir  /notesapp/test -e DEBUG= %SVC_NOTES% npm run test-notes-sequelize-sqlite
docker exec -it --workdir  /notesapp/test -e DEBUG= %SVC_NOTES% npm run test-notes-sequelize-mysql
# docker exec -it --workdir  /notesapp/test -e DEBUG= %SVC_NOTES% npm run test-notes-mongodb
