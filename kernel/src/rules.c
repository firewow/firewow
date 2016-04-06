/**
 * FireWOW Kernel Module
 * @author WoLfulus <wolfulus@gmail.com>
 */

#include "common.h"
#include "utils.h"
#include "rules.h"
#include "file.h"

#include <linux/netfilter_ipv4.h>
#include <linux/ip.h>
#include <linux/tcp.h>
#include <linux/udp.h>
#include <linux/fs.h>
#include <linux/list.h>
#include <linux/semaphore.h>
#include <linux/string.h>

#include <asm/segment.h>
#include <asm/uaccess.h>

#include <linux/buffer_head.h>

/**
 * Variables
 */

static LIST_HEAD(fwow_rules_list);
//static DECLARE_MUTEX(fwow_rules_lock);

/**
 * Rule handler/matcher
 */
unsigned int fwow_rules_filter(struct sk_buff* skb, int direction)
{
    struct fwow_rule*   r;
    struct iphdr*       ip_header;

    if (!skb) {
        return NF_ACCEPT;
    }

    ip_header = (struct iphdr*) skb_network_header(skb);

    // ip_header->saddr;
    // ip_header->daddr;
    // ip_header->protocol;

    list_for_each_entry(r, &fwow_rules_list, list)
    {

    }

    /**
     * Default behaviour
     */
    return NF_ACCEPT;
}

/**
 * Load rules
 */
void fwow_rules_load(void)
{
    // Load rules
}

/**
 * Release rules
 */
void fwow_rules_release(void)
{
    // Release rules
}

/**
 * Initialization
 */
void fwow_rules_initialize(void)
{
	debug("Initializing rules");
    fwow_rules_load();
}

/**
 * Cleanup
 */
void fwow_rules_cleanup(void)
{
    fwow_rules_release();
	debug("Cleaning rules");
}
