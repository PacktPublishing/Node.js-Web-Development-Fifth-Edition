docker run  --name db-userauth \
    --env MYSQL_RANDOM_ROOT_PASSWORD=true \
    --env MYSQL_USER=userauth \
    --env MYSQL_PASSWORD=userauth \
    --env MYSQL_DATABASE=userauth \
    --mount type=bind,src=`pwd`/userauth-data,dst=/var/lib/mysql \
    --network authnet \
    -p 3306:3306 \
    mysql/mysql-server:8.0.13


# --volume `pwd`/my.cnf:/etc/my.cnf 
# --env MYSQL_ROOT_HOST=172.0.0.0/255.0.0.0 
