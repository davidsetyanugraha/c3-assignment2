# We don't need this anymore because we have set it during the non-interactive installation mode.
# Create the admin user and password:
# curl -X PUT http://localhost:5984/_node/_local/_config/admins/admin -d '"password"'
# Now, bind the clustered interface to all IP addresses availble on this machine
# curl -u admin:password -X PUT http://localhost:5984/_node/_local/_config/chttpd/bind_address -d '"0.0.0.0"'

# Set the UUID of the node to the first UUID you previously obtained:
curl -u admin:password -X PUT http://localhost:5984/_node/_local/_config/couchdb/uuid -d '"327b9392492df3d19055258f2f0006d3"'

# Finally, set the shared http secret for cookie creation to the second UUID:
curl -u admin:password -X PUT http://localhost:5984/_node/_local/_config/couch_httpd_auth/secret -d '"327b9392492df3d19055258f2f000e3e"'
