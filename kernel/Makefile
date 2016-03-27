# Makefile
obj-m := firewow.o
firewow-objs := src/filters.o src/main.o

all:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules
clean:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean
