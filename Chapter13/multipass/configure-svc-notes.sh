

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
CREATE DATABASE notes;
CREATE USER 'notes'@'localhost' IDENTIFIED BY 'notes';
GRANT ALL PRIVILEGES ON notes.* TO 'notes'@'localhost' WITH GRANT OPTION;
EOF

### Set up the UserAuthentication service code

sudo mkdir -p /opt/notes
sudo chmod 777 /opt/notes
(cd /build-notes; tar cf - .) | (cd /opt/notes; tar xf -)
(
    cd /opt/notes
    rm -rf node_modules package-lock.json *.sqlite3
    npm install
)
