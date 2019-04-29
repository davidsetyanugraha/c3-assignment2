# Use first argument as node name.
ARG_NODENAME=$1

# Set NODENAME to the used arguments; if not provided, use 127.0.0.1.
NODENAME=${ARG_NODENAME:-127.0.0.1}

# Purge the old couchdb to pieces. Uncomment when needed.
# sudo apt-get purge couchdb -y

# Update cache.
sudo apt-get update

# Set the password variable.
COUCHDB_PASSWORD=password

# Set input for the interactive mode.
# Mode: clustered.
# Nodename: couchdb@${NODENAME} (this varies for each node, hence why we use arguments).
# Cookie: should be same for all nodes.
# Bindaddress: 0.0.0.0 (does not bind to anything).
# Password: password for admin.
# Password 2: verify password for admin.
# debconf-set-selections: set input for interactive mode.
echo "couchdb couchdb/mode select clustered
couchdb couchdb/mode seen true
couchdb couchdb/nodename string couchdb@${NODENAME}
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
