/**
 * FireWOW Kernel Module
 * @author WoLfulus <wolfulus@gmail.com>
 */

#include "common.h"
#include "utils.h"
#include "rules.h"

#include <linux/netfilter_ipv4.h>
#include <linux/ip.h>
#include <linux/tcp.h>
#include <linux/udp.h>
#include <linux/fs.h>
#include <linux/list.h>
#include <linux/semaphore.h>

/**
 * Variables
 */
static LIST_HEAD(fwow_rules_list);

/**
 * Initialization
 */
void fwow_rules_initialize(void)
{
	debug("Initializing rules");
}

/**
 * Cleanup
 */
void fwow_rules_cleanup(void)
{
	debug("Cleaning rules");
}

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
    //    debug("ALO");


    /**
     * Default behaviour
     */
    return NF_ACCEPT;
}
