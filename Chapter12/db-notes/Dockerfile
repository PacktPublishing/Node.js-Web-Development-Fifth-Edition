FROM mysql/mysql-server:8.0

EXPOSE 3306

# COPY my.cnf /etc/

ENV MYSQL_ROOT_PASSWORD="w0rdw0rd"
ENV MYSQL_USER=notes
ENV MYSQL_PASSWORD=notes12345
ENV MYSQL_DATABASE=notes

CMD [ "mysqld", \
        "--character-set-server=utf8mb4", \
        "--collation-server=utf8mb4_unicode_ci", \
        "--bind-address=0.0.0.0" ]