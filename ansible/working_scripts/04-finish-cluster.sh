# Send finish cluster to the coordinator node.
curl -X POST -H "Content-Type: application/json" http://admin:password@35.236.104.122:5984/_cluster_setup -d '{"action": "finish_cluster"}'
