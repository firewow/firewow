#!/bin/bash

# variables
TARGET=/lib/modules/$(uname -r)/kernel/drivers/firewow/

# Build kernel module
make

# Create target kernel module directory
sudo mkdir -p $TARGET
sudo cp firewow.ko $TARGET

# Cleans the build objects
make clean
