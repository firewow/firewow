#!/bin/bash

INFO='\033[1;36m'
SUCCESS='\033[1;32m'
ERROR='\033[0;31m'
DEBUG='\033[0;35m'
NC='\033[0m'

# Sanity check
if [[ $EUID -ne 0 ]]; then
   echo "Please run as root" 1>&2
   exit 1
fi

# Unload module
MODULE="firewow"
if lsmod | grep "$MODULE" &> /dev/null ; then
	printf "${INFO}Unloading kernel module... ${NC}"
	rmmod firewow &> /dev/null
	if [[ $? -ne 0 ]]; then
		printf "${ERROR} ERROR!\n"
		exit 1
	else
		printf "${SUCCESS} success!\n"
	fi
fi

# Variables
TARGET=/lib/modules/$(uname -r)/kernel/drivers/firewow

# Load the module
printf "${INFO}Installing kernel module..."
insmod "${TARGET}/firewow.ko"

if [[ $? -ne 0 ]]; then
	printf "${ERROR} ERROR!\n"
	exit 1
else
	printf "${SUCCESS} success!\n"
fi

printf "${SUCCESS}Reload finished!\n${NC}"
