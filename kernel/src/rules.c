/**
 * FireWOW Kernel Module
 * @author WoLfulus <wolfulus@gmail.com>
 */

#include "common.h"
#include "utils.h"
#include "rules.h"
#include "file.h"

#include <linux/slab.h>
#include <linux/netfilter_ipv4.h>
#include <linux/ip.h>
#include <linux/tcp.h>
#include <linux/udp.h>
#include <linux/fs.h>
#include <linux/list.h>
#include <linux/semaphore.h>
#include <linux/string.h>
#include <linux/inet.h>

#include <asm/segment.h>
#include <asm/uaccess.h>

#include <linux/buffer_head.h>

/**
 * Variables
 */

static LIST_HEAD(fwow_rules_list);
static DEFINE_SEMAPHORE(fwow_rules_list_lock);

/**
 * Create rule
 */
struct fwow_rule* fwow_rule_alloc(void)
{
    struct fwow_rule* rule = NULL;
    rule = (struct fwow_rule*) kmalloc(sizeof(*rule), GFP_KERNEL);
    memset(rule, 0, sizeof(*rule));
    if (rule == NULL)
    {
        debug("failed to allocate rule");
    }
    return rule;
}

/**
 * Create rule
 */
void fwow_rule_free(struct fwow_rule* rule)
{
    if (rule != NULL)
    {
        kfree(rule);
    }
}

/**
 * Adds a rule
 */
void fwow_rule_add(struct fwow_rule* rule)
{
    if (rule != NULL)
    {
        down(&fwow_rules_list_lock);
        list_add_tail(&rule->list, &fwow_rules_list);
        up(&fwow_rules_list_lock);
    }
}

/**
 * Rule handler/matcher
 */
unsigned int fwow_rules_filter(struct sk_buff* skb, int direction)
{
    struct iphdr* ip = NULL;
    struct fwow_rule* r = NULL;
    struct tcphdr* tcp = NULL;
    struct udphdr* udp = NULL;

    int action = NF_ACCEPT;

    uint32 srcaddr = 0;
    uint32 dstaddr = 0;
    uint16 srcport = 0;
    uint16 dstport = 0;

    if (skb == NULL)
    {
        return NF_ACCEPT;
    }

    ///
    /// IP Header
    ///

    ip = ip_hdr(skb);
    if (ip == NULL)
    {
        return NF_ACCEPT;
    }

    ///
    /// Packet parser
    ///

    srcaddr = htonl(ip->saddr);
    dstaddr = htonl(ip->daddr);

    switch (ip->protocol)
    {
    case IPPROTO_TCP:
        {
            tcp = tcp_hdr(skb);
            if (tcp == NULL)
            {
                return NF_ACCEPT;
            }

            srcport = htons(tcp->source);
            dstport = htons(tcp->dest);
        }
        break;

    case IPPROTO_UDP:
        {
            udp = udp_hdr(skb);
            if (udp == NULL)
            {
                return NF_ACCEPT;
            }

            srcport = htons(udp->source);
            dstport = htons(udp->dest);
        }
        break;

    default:
        return NF_ACCEPT;
    }

    ///
    /// Rule matching list
    ///

    down(&fwow_rules_list_lock);

    list_for_each_entry(r, &fwow_rules_list, list)
    {
        if (!FWOW_BIT_CHECK(r->direction, direction))
        {
            continue;
        }

        if (ip->protocol == IPPROTO_TCP && !FWOW_BIT_CHECK(r->protocol, FWOW_RULE_PROTOCOL_TCP))
        {
            continue;
        }

        if (ip->protocol == IPPROTO_UDP && !FWOW_BIT_CHECK(r->protocol, FWOW_RULE_PROTOCOL_UDP))
        {
            continue;
        }

        if (!FWOW_BIT_CHECK(r->flags, FWOW_RULE_FLAG_SRCADDR_ANY))
        {
            if (srcaddr < r->srcaddr_min || srcaddr > r->srcaddr_max)
            {
                continue;
            }
        }

        if (!FWOW_BIT_CHECK(r->flags, FWOW_RULE_FLAG_DSTADDR_ANY))
        {
            if (dstaddr < r->dstaddr_min || dstaddr > r->dstaddr_max)
            {
                continue;
            }
        }

        if (!FWOW_BIT_CHECK(r->flags, FWOW_RULE_FLAG_SRCPORT_ANY))
        {
            if (srcport < r->srcport_min || srcport > r->srcport_max)
            {
                continue;
            }
        }

        if (!FWOW_BIT_CHECK(r->flags, FWOW_RULE_FLAG_DSTPORT_ANY))
        {
            if (dstport < r->dstport_min || dstport > r->dstport_max)
            {
                continue;
            }
        }

        if (r->action == FWOW_RULE_ACTION_DROP)
        {
            action = NF_DROP;
        }
        else if (r->action == FWOW_RULE_ACTION_ACCEPT)
        {
            action = NF_ACCEPT;
        }

        break;
    }

    up(&fwow_rules_list_lock);

    /**
     * Default behaviour
     */
    return action;
}

/**
 * Release rules
 */
void fwow_rules_release(void)
{
    struct fwow_rule *rule, *temp;
    down(&fwow_rules_list_lock);
    list_for_each_entry_safe(rule, temp, &fwow_rules_list, list)
    {
        list_del(&rule->list);
        fwow_rule_free(rule);
    }
    up(&fwow_rules_list_lock);
}

/**
 * Load rules
 */
int fwow_rules_load(void)
{
    struct file* f = NULL;
    ssize_t bufferSize = 0;
    char* buffer = NULL;
    char* running = NULL;
    char* token = NULL;
    struct fwow_rule rule;
    struct fwow_rule* newrule = NULL;
    char delimiters[] = " \t\r\n";

    uint32 port = 0;

    ///
    /// Cleans current rules for a complete reload
    ///

    fwow_rules_release();

    ///
    /// Loads rules file
    ///

	debug("opening rules file");

    f = fwow_file_open("/etc/firewow/rules", O_RDONLY, 0);
    if (IS_ERR(f))
    {
        debug("failed to open rules file");
        return 0;
    }

    bufferSize = fwow_file_read(f, &buffer);
    if (buffer != NULL && bufferSize > 0)
    {
        running = buffer;

        while (1)
        {
            ///
            /// Zero rule
            ///

            memset(&rule, 0, sizeof(rule));

            ///
            /// Action
            ///

            token = strsep(&running, delimiters);
            if (token == NULL) {
                break;
            }

            rule.action = FWOW_RULE_ACTION_ACCEPT;
            if (!strcmp(token, "drop")) {
                rule.action = FWOW_RULE_ACTION_DROP;
            } else if (!strcmp(token, "accept")) {
                rule.action = FWOW_RULE_ACTION_ACCEPT;
            }

            ///
            /// Direction
            ///

            token = strsep(&running, delimiters);
            if (token == NULL) {
                break;
            }

            rule.direction = FWOW_RULE_DIRECTION_BOTH;
            if (!strcmp(token, "in")) {
                rule.direction = FWOW_RULE_DIRECTION_IN;
            } else if (!strcmp(token, "out")) {
                rule.direction = FWOW_RULE_DIRECTION_OUT;
            } else if (!strcmp(token, "any")) {
                rule.direction = FWOW_RULE_DIRECTION_BOTH;
            }

            ///
            /// Protocol
            ///

            token = strsep(&running, delimiters);
            if (token == NULL) {
                break;
            }

            rule.protocol = FWOW_RULE_PROTOCOL_BOTH;
            if (!strcmp(token, "tcp")) {
                rule.protocol = FWOW_RULE_PROTOCOL_TCP;
            } else if (!strcmp(token, "udp")) {
                rule.protocol = FWOW_RULE_PROTOCOL_UDP;
            } else if (!strcmp(token, "both")) {
                rule.protocol = FWOW_RULE_PROTOCOL_BOTH;
            }

            ///
            /// Source address start
            ///

            token = strsep(&running, delimiters);
            if (token == NULL) {
                break;
            }

            if (!strcmp(token, "*")) {
                rule.flags |= FWOW_RULE_FLAG_SRCADDR_ANY;
            } else {
                rule.srcaddr_min = htonl(in_aton(token));
            }

            ///
            /// Source address end
            ///

            token = strsep(&running, delimiters);
            if (token == NULL) {
                break;
            }

            if (!FWOW_BIT_CHECK(rule.flags, FWOW_RULE_FLAG_SRCADDR_ANY)) {
                if (strcmp(token, "*") != 0) {
                    rule.srcaddr_max = htonl(in_aton(token));
                } else {
                    rule.srcaddr_max = rule.srcaddr_min;
                }
            }

            ///
            /// Source port start
            ///

            token = strsep(&running, delimiters);
            if (token == NULL) {
                break;
            }

            if (!strcmp(token, "*")) {
                rule.flags |= FWOW_RULE_FLAG_SRCPORT_ANY;
            } else {
                if (kstrtoint(token, 10, &port)) {
                    debug("invalid source port (min) detected");
                    break;
                }
                rule.srcport_min = (uint16) port;
            }

            ///
            /// Source port end
            ///

            token = strsep(&running, delimiters);
            if (token == NULL) {
                break;
            }

            if (!FWOW_BIT_CHECK(rule.flags, FWOW_RULE_FLAG_SRCPORT_ANY)) {
                if (kstrtoint(token, 10, &port)) {
                    debug("invalid source port (max) detected");
                    break;
                }
                rule.srcport_max = (uint16) port;
            }

            ///
            /// Dest address start
            ///

            token = strsep(&running, delimiters);
            if (token == NULL) {
                break;
            }

            if (!strcmp(token, "*")) {
                rule.flags |= FWOW_RULE_FLAG_DSTADDR_ANY;
            } else {
                rule.dstaddr_min = htonl(in_aton(token));
            }

            ///
            /// Dest address end
            ///

            token = strsep(&running, delimiters);
            if (token == NULL) {
                break;
            }

            if (!FWOW_BIT_CHECK(rule.flags, FWOW_RULE_FLAG_DSTADDR_ANY)) {
                if (strcmp(token, "*") != 0) {
                    rule.dstaddr_max = htonl(in_aton(token));
                } else {
                    rule.dstaddr_max = rule.dstaddr_min;
                }
            }

            ///
            /// Dest port start
            ///

            token = strsep(&running, delimiters);
            if (token == NULL) {
                break;
            }

            if (!strcmp(token, "*")) {
                rule.flags |= FWOW_RULE_FLAG_DSTPORT_ANY;
            } else {
                if (kstrtoint(token, 10, &port)) {
                    break;
                }
                rule.dstport_min = (uint16) port;
            }

            ///
            /// Dest port end
            ///

            token = strsep(&running, delimiters);
            if (token == NULL) {
                break;
            }

            if (!FWOW_BIT_CHECK(rule.flags, FWOW_RULE_FLAG_DSTPORT_ANY)) {
                if (kstrtoint(token, 10, &port)) {
                    break;
                }
                rule.dstport_max = (uint16) port;
            }

            ///
            /// Add
            ///

            newrule = fwow_rule_alloc();
            if (newrule == NULL)
            {
                debug("failed to alloc new rule");
                break;;
            }

            memcpy(newrule, &rule, sizeof(rule));
            fwow_rule_add(newrule);

        }

        kfree(buffer);
    }
    else
    {
        debug("failed to read rules file");
        if (f != NULL)
        {
            fwow_file_close(f);
        }
        return 0;
    }

    fwow_file_close(f);
    return 0;
}

/**
 * Initialization
 */
int fwow_rules_initialize(void)
{
	debug("initializing rules");
    return fwow_rules_load();
}

/**
 * Cleanup
 */
void fwow_rules_cleanup(void)
{
    debug("cleaning rules");
    fwow_rules_release();
}
