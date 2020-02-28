FROM mysql/mysql-server:8.0

EXPOSE 3306

# COPY my.cnf /etc/

ENV MYSQL_ROOT_PASSWORD="w0rdw0rd"
ENV MYSQL_USER=userauth
ENV MYSQL_PASSWORD=userauth
ENV MYSQL_DATABASE=userauth

CMD [ "mysqld", \
        "--character-set-server=utf8mb4", \
        "--collation-server=utf8mb4_unicode_ci", \
        "--bind-address=0.0.0.0" ]
