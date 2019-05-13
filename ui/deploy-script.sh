# If key is undefined, it defaults to ~/.ssh/id_rsa.
KEY=${1:-~/.ssh/id_rsa}
# If IP is undefined, it defaults to 172.26.37.235.
IP=${2:-172.26.37.235}

# Build the UI.
make create-symbolic-link
yarn build

# Compress and SCP to host.
tar -czvf build.tar.gz build
scp -i $KEY build.tar.gz ubuntu@$IP:build.tar.gz

# Inside the node.
ssh -i $KEY ubuntu@$IP "
cd /usr/share/nginx/html/
sudo rm -rf *
sudo mv ~/build.tar.gz /usr/share/nginx/html/
sudo tar -xzvf build.tar.gz
cd build/
sudo mv * ../
"
