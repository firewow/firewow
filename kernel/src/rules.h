/**
 * FireWOW Kernel Module
 * @author WoLfulus <wolfulus@gmail.com>
 */

#ifndef _FWOW_RULES
#define _FWOW_RULES

#include "common.h"
#include <linux/list.h>
#include <linux/netfilter_ipv4.h>

/**
 * Rule structure
 */
struct fwow_rule
{
    struct list_head list;

    uint8   action;
    uint8   protocol;
    uint8   direction;
    uint32  source;
    uint32  destination;
    uint8   flags;
};

/**
 * Flags
 */
enum {
    FWOW_RULE_FLAG_SRCADDR_ALL = 1,
    FWOW_RULE_FLAG_SRCPORT_ALL = 2,
    FWOW_RULE_FLAG_DSTADDR_ALL = 4,
    FWOW_RULE_FLAG_DSTPORT_ALL = 8
};

/**
 * Directions
 */
enum {
    FWOW_RULE_DIRECTION_IN   = 1,
    FWOW_RULE_DIRECTION_OUT  = 2,
    FWOW_RULE_DIRECTION_ALL  = 3
};

/**
 * Protocols
 */
enum {
    FWOW_RULE_PROTOCOL_TCP   = 1,
    FWOW_RULE_PROTOCOL_UDP   = 2,
    FWOW_RULE_PROTOCOL_ALL   = 3
};

/**
 * Actions
 */
enum {
    FWOW_RULE_ACTION_DROP    = 0,
    FWOW_RULE_ACTION_PASS    = 1
};

/**
 * Methods
 */
void fwow_rules_initialize(void);
void fwow_rules_cleanup(void);
unsigned int fwow_rules_filter(struct sk_buff* skb, int direction);

#endif
