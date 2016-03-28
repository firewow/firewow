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

# Cleans the build objects
printf "${INFO}Cleaning compilation...\n${NC}"
make clean &> /dev/null
rm -f build.log
