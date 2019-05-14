# Ansible stuff

## First things first

### Add your credentials

1. Copy `nectar-credentials.sh.example` to `nectar-credentials.sh`.
2. Open `nectar-credentials.sh`.
3. Change the contents into your real credentials.
4. Save.

Why do we do this? Because we should never commit a secret into Git repository. Username, password, access tokens, should only be kept in local machines.

### Match your key-pairs name to the ones that you use in Nectar

1. Open `host_vars/nectar.yaml`.
2. There is a variable named `instance_key_name`. Change the contents into the name of your key-pair which you have registered in Nectar.
3. Save.

### Match your key-pairs path

1. Open `nectar.yaml`.
2. In line 28, change the value of `ansible_ssh_private_key_file` to your Nectar's private key file.
3. Save.

## Run the ansible script

1. Do `./run-nectar.sh`
2. It will ask for your **local** SUDO password, type in your SUDO password
3. Enjoy the ride!
