

### Set up Node.js from Nodesource
### Install Node.js, MySQL, and related tools

curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y uuid nodejs build-essential mysql-server mysql-client

### Here we should customize the MySQL installation.
###
### For example:  sudo mysql_secure_installation
###
### The following will obfuscate the root password by giving
### it a password that's extremely hard to guess.  The technique
### is to generate a UUID, then compute its MD5 hash.  That gives us
### a semi-random string that's obscure enough for our purposes.
###
### $ uuid | md5sum | awk '{print $1}'
### eb077774e06759bcf6368eaf3cd391fe
###
### However, when this is done we'll have effectively locked ourselves
### out of the root account, and therefore be unable to access
### the administrative tables.

# MYSQL_ROOT_PASSWORD=`uuid | md5sum | awk '{print $1}'`
# 
# echo "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASSWORD}'; FLUSH PRIVILEGES;" | sudo mysql --user=root

# --password=${MYSQL_ROOT_PASSWORD}

### Create the database for the UserAuthentication service

sudo mysql --user=root  <<EOF
CREATE DATABASE notes;
CREATE USER 'notes'@'localhost' IDENTIFIED BY 'notes';
GRANT ALL PRIVILEGES ON notes.* TO 'notes'@'localhost' WITH GRANT OPTION;
EOF

### Set up the UserAuthentication service code

sudo mkdir -p /notes
sudo chmod 777 /notes
(cd /build-notes; tar cf - .) | (cd /notes; tar xf -)
cd /notes
rm -rf node_modules package-lock.json *.sqlite3

npm install

