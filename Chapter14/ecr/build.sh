( cd ../notes && npm run docker-build )
( cd ../users && npm run docker-build )
( cd ../compose-stack/cronginx; docker build -t cronginx:latest . )
