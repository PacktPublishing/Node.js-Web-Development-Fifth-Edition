### Set up Node.js from Nodesource
### Install Node.js, MySQL, and related tools

# May need to install Curl
# sudo apt-get update
# sudo apt-get install curl -y

curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y nodejs build-essential mysql-server mysql-client

# May need to install this:
# sudo apt-get install python-is-python3
#
# Rationale, SQLite3 expects to find a command named 'python' when
# building native code.  But on Ubuntu 20.04 that command is not present.
# The python-is-python3 package puts a symlink with that name, but it
# violates the standard promulgated by the Python community.
#
# See: https://techsparx.com/nodejs/install/bootstrap-drops-jquery.html
