

### Here we should customize the MySQL installation.

# This can be used to set the root password.  For example this will 
# generate a semi-random-hard-to-guess string for the root password,
# making it incredibly hard for a miscreant to get root access to
# the database server.

# MYSQL_ROOT_PASSWORD=`uuid | md5sum | awk '{print $1}'`
# 
# echo "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASSWORD}'; FLUSH PRIVILEGES;" | sudo mysql --user=root

# If you've set the root password, then this option is required
# --password=${MYSQL_ROOT_PASSWORD}

### Create the database for the UserAuthentication service

sudo mysql --user=root  <<EOF
CREATE DATABASE userauth;
CREATE USER 'userauth'@'localhost' IDENTIFIED BY 'userauth';
GRANT ALL PRIVILEGES ON userauth.* TO 'userauth'@'localhost' WITH GRANT OPTION;
EOF

### Set up the UserAuthentication service code

sudo mkdir -p /opt/userauth
sudo chmod 777 /opt/userauth
(cd /build-users; tar cf - .) | (cd /opt/userauth; tar xf -)
(
    cd /opt/userauth
    rm -rf node_modules package-lock.json users-sequelize.sqlite3
    npm install
)

