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
    uint8   direction;

    uint8   protocol;

    uint32  srcaddr_min;
    uint32  srcaddr_max;

    uint16  srcport_min;
    uint16  srcport_max;

    uint32  dstaddr_min;
    uint32  dstaddr_max;

    uint16  dstport_min;
    uint16  dstport_max;

    uint8   flags;
};

/**
 * Actions
 */
enum {
    FWOW_RULE_ACTION_DROP       = 0,
    FWOW_RULE_ACTION_ACCEPT     = 1
};

/**
 * Directions
 */
enum {
    FWOW_RULE_DIRECTION_IN      = 1,
    FWOW_RULE_DIRECTION_OUT     = 2,
    FWOW_RULE_DIRECTION_BOTH    = 3
};

/**
 * Protocols
 */
enum {
    FWOW_RULE_PROTOCOL_TCP      = 1,
    FWOW_RULE_PROTOCOL_UDP      = 2,
    FWOW_RULE_PROTOCOL_BOTH     = 3
};

/**
 * Flags
 */
enum {
    FWOW_RULE_FLAG_SRCADDR_ANY  = 1,
    FWOW_RULE_FLAG_SRCPORT_ANY  = 2,
    FWOW_RULE_FLAG_DSTADDR_ANY  = 4,
    FWOW_RULE_FLAG_DSTPORT_ANY  = 8
};

/**
 * Methods
 */
int fwow_rules_initialize(void);
void fwow_rules_cleanup(void);
unsigned int fwow_rules_filter(struct sk_buff* skb, int direction);

#endif
