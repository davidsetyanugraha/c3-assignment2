#!/bin/bash
./nectar-credentials.sh
. ./openrc.sh; ansible-playbook --ask-become-pass nectar.yaml -vvv
