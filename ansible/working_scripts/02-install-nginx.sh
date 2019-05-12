# Uninstall.
# sudo apt-get purge nginx nginx-common

# Reinstall.
sudo apt update
sudo DEBIAN_FRONTEND=noninteractive apt install -y nginx

# Delete the default symbolic link in sites-enabled.
# Otherwise, our sites isn't the default one listening from port 80.
sudo rm /etc/nginx/sites-enabled/default
