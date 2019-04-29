# Fresh install
sudo apt-get purge couchdb -y

# Uncomment if not first try.
# echo "deb https://apache.bintray.com/couchdb-deb bionic main" | sudo tee -a /etc/apt/sources.list
# curl -L https://couchdb.apache.org/repo/bintray-pubkey.asc | sudo apt-key add -
# sudo apt-get update

# Set the password variable.
COUCHDB_PASSWORD=password

# Set input for the interactive mode.
# Mode: clustered.
# Nodename: couchdb@35.236.104.122 (this vary each node).
# Cookie: should be same for all nodes.
# Bindaddress: 0.0.0.0 (does not bind to anything).
# Password: password for admin.
# Password 2: verify password for admin.
# debconf-set-selections: set input for interactive mode
echo "couchdb couchdb/mode select clustered
couchdb couchdb/mode seen true
couchdb couchdb/nodename string couchdb@35.236.104.122
couchdb couchdb/nodename seen true
couchdb couchdb/cookie string elmo
couchdb couchdb/cookie seen true
couchdb couchdb/bindaddress string 0.0.0.0
couchdb couchdb/bindaddress seen true
couchdb couchdb/adminpass password ${COUCHDB_PASSWORD}
couchdb couchdb/adminpass seen true
couchdb couchdb/adminpass_again password ${COUCHDB_PASSWORD}
couchdb couchdb/adminpass_again seen true" | sudo debconf-set-selections

# We enter non-interactive mode instead of interactive mode here.
# So, the values we inputted earlier will be here.
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y couchdb
