/**
 * FireWOW Kernel Module
 * @author WoLfulus <wolfulus@gmail.com>
 */

#include "utils.h"
#include <linux/netfilter.h>
#include <linux/netfilter_ipv4.h>
#include <linux/ip.h>

#include "rules.h"

/**
 * Variables
 */

static int fwow_hook_registered = 0;
static struct nf_hook_ops fwow_hook_in;
static struct nf_hook_ops fwow_hook_out;

/**
 * Incoming filter
 */

unsigned int fwow_filter_in(
	unsigned int hooknum,
	struct sk_buff *skb,
	const struct net_device *in,
	const struct net_device *out,
	int (*okfn)(struct sk_buff*))
{
	unsigned int ret = fwow_rules_filter(skb, FWOW_RULE_DIRECTION_IN);
    switch(ret)
    {
    case FWOW_RULE_ACTION_DROP:
        return NF_DROP;
    case FWOW_RULE_ACTION_ACCEPT:
        return NF_ACCEPT;
    }
	if ((ret & NF_QUEUE) == NF_QUEUE) {
		return ret;
	}
	return NF_ACCEPT;
}

/**
 * Outgoing filter
 */

unsigned int fwow_filter_out(
	unsigned int hooknum,
	struct sk_buff *skb,
	const struct net_device *in,
	const struct net_device *out,
	int (*okfn)(struct sk_buff*))
{
	unsigned int ret = fwow_rules_filter(skb, FWOW_RULE_DIRECTION_OUT);
    switch(ret)
    {
    case FWOW_RULE_ACTION_DROP:
        return NF_DROP;
    case FWOW_RULE_ACTION_ACCEPT:
        return NF_ACCEPT;
    }
	if ((ret & NF_QUEUE) == NF_QUEUE) {
		return ret;
	}
	return NF_ACCEPT;
}

/**
 * Initialization
 */
int fwow_filters_initialize(void)
{
	debug("registering netfilter hooks");

	fwow_hook_in.hook 		= (nf_hookfn*) fwow_filter_in;
	fwow_hook_in.hooknum 	= NF_INET_PRE_ROUTING;
	fwow_hook_in.pf 		= PF_INET;
	fwow_hook_in.priority 	= NF_IP_PRI_FIRST;
	nf_register_hook(&fwow_hook_in);

	fwow_hook_out.hook 		= (nf_hookfn*) fwow_filter_out;
	fwow_hook_out.hooknum 	= NF_INET_POST_ROUTING;
	fwow_hook_out.pf 		= PF_INET;
	fwow_hook_out.priority 	= NF_IP_PRI_LAST;
	nf_register_hook(&fwow_hook_out);

	fwow_hook_registered = 1;
    return 0;
}

/**
 * Cleanup
 */
void fwow_filters_cleanup(void)
{
	debug("removing netfilter hooks");
	if (fwow_hook_registered)
	{
		nf_unregister_hook(&fwow_hook_in);
		nf_unregister_hook(&fwow_hook_out);
	}
}
