# Enable cluster. This is enabled since we first install couchdb in clustered mode.
# curl -X POST -H "Content-Type: application/json" http://admin:password@35.236.104.122:5984/_cluster_setup -d '{"action": "enable_cluster", "bind_address":"0.0.0.0", "username": "admin", "password":"password", "port": 5984, "node_count": "2", "remote_node": "35.236.104.122", "remote_current_user": "admin", "remote_current_password": "password" }'

# Add node. Do this in the coordinator node.
curl -X POST -H "Content-Type: application/json" http://admin:password@35.236.104.122:5984/_cluster_setup -d '{"action": "add_node", "host":"34.74.154.100", "port": 5984, "username": "admin", "password":"password"}'
