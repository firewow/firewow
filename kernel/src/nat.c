/**
 * FireWOW Kernel Module
 * @author WoLfulus <wolfulus@gmail.com>
 */

#include "common.h"
#include "utils.h"
#include "nat.h"
#include "file.h"

#include <linux/slab.h>
#include <linux/netfilter_ipv4.h>
#include <linux/ip.h>
#include <linux/timer.h>
#include <linux/module.h>
#include <linux/netfilter.h>
#include <linux/netdevice.h>
#include <linux/if.h>
#include <linux/inetdevice.h>
#include <net/protocol.h>
#include <net/checksum.h>
#include <linux/netfilter_ipv4.h>
#include <linux/netfilter/x_tables.h>
#include <linux/tcp.h>
#include <linux/udp.h>
#include <linux/fs.h>
#include <linux/list.h>
#include <linux/semaphore.h>
#include <linux/string.h>
#include <linux/inet.h>

#include <asm/segment.h>
#include <asm/uaccess.h>
#include <asm/current.h>

#include <linux/buffer_head.h>
#include <linux/types.h>

/**
 * Variables
 */

static int admin_pid = 0;
static int proxy_port = 0;

/*
    if (current->pid == admin_pid)
    {
        debugf("%s (%d) marked as admin. accept by default.",
            current->comm,
            current->pid
        );
        return NF_ACCEPT;
    }
    */

/**
 * Load rules
 */
int fwow_nat_load(void)
{
    struct file* f = NULL;
    ssize_t bufferSize = 0;
    char* buffer = NULL;
    char* running = NULL;
    char* token = NULL;
    char delimiters[] = " \t\r\n";

    ///
    /// Loads instance file
    ///

	debug("opening instance file");

    f = fwow_file_open("/etc/firewow/instance", O_RDONLY, 0);
    if (IS_ERR(f))
    {
        debug("failed to open instance file");
        return 0;
    }

    bufferSize = fwow_file_read(f, &buffer);
    if (buffer != NULL && bufferSize > 0)
    {
        running = buffer;

        while(1)
        {
            /**
             * PID
             */

            token = strsep(&running, delimiters);
            if (token == NULL) {
                debug(">> admin_pid : token failed");
                break;
            }

            if (kstrtoint(token, 10, &admin_pid)) {
                debug(">> admin_pid : conversion failed");
                break;
            }

            debugf(">> admin_pid : %u", admin_pid);

            /**
             * Port
             */

            token = strsep(&running, delimiters);
            if (token == NULL) {
                debug(">> proxy_port : token failed");
                break;
            }

            if (kstrtoint(token, 10, &proxy_port)) {
                debug(">> proxy_port : conversion failed");
                break;
            }

            debugf(">> proxy_port : %u", proxy_port);

            /**
             * Break
             */
            break;
        }

        kfree(buffer);
    }

    fwow_file_close(f);
    return 0;
}

/**
 * Initialization
 */
int fwow_nat_initialize(void)
{
	debug("initializing nat");
    return fwow_nat_load();
}

/**
 * Cleanup
 */
void fwow_nat_cleanup(void)
{
    debug("cleaning nat");
}
