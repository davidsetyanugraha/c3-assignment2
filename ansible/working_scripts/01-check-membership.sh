# Use first argument as node name.
ARG_COORDINATOR_NODENAME=$1

# Set COORDINATOR_NODENAME to the used arguments; if not provided, use 127.0.0.1.
COORDINATOR_NODENAME=${ARG_COORDINATOR_NODENAME:-127.0.0.1}

echo $(curl -s http://admin:password@${COORDINATOR_NODENAME}:5984/_membership)
