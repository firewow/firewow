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

# Build kernel module
printf "${INFO}Building kernel module..."
make &>> ./build.log

# Sanity check
if [[ $? -ne 0 ]]; then
	printf "${ERROR} ERROR!\n"
	exit 1
else
	printf "${SUCCESS} success!\n"
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

# variables
TARGET=/lib/modules/$(uname -r)/kernel/drivers/firewow/

# Create target kernel module directory
printf "${INFO}Copying compiled module..."
mkdir -p $TARGET
cp firewow.ko $TARGET

if [[ $? -ne 0 ]]; then
	printf "${ERROR} ERROR!\n"
	exit 1
else
	printf "${SUCCESS} success!\n"
fi

# Load the module
printf "${INFO}Installing kernel module..."
insmod firewow.ko

if [[ $? -ne 0 ]]; then
	printf "${ERROR} ERROR!\n"
	exit 1
else
	printf "${SUCCESS} success!\n"
fi

# Cleans the build objects
printf "${INFO}Cleaning compilation...\n${NC}"
make clean &> /dev/null

printf "${SUCCESS}Build finished!\n${NC}"
