#!/bin/bash
. ./openrc.sh; ansible-playbook --ask-become-pass runharvest.yaml -i host_vars/onenode.yml -vvv
