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
//static DECLARE_MUTEX(fwow_rules_lock);

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
        list_add_tail(&rule->list, &fwow_rules_list);
    }
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

    list_for_each_entry(r, &fwow_rules_list, list)
    {
        debug("checking rule...");
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
    struct file* f = NULL;
    ssize_t bufferSize = 0;
    char* buffer = NULL;
    char* running = NULL;
    char* token = NULL;
    struct fwow_rule rule;
    struct fwow_rule* newrule = NULL;
    char delimiters[] = " \t\r\n";

    uint32 port = 0;

    f = fwow_file_open("/etc/firewow/rules", O_RDONLY, 0);
    if (f == NULL)
    {
        debug("failed to open rules file");
        return;
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
            ///
            memset(&rule, 0, sizeof(rule));

            ///
            /// Action
            ///

            token = strsep(&running, delimiters);
            if (token == NULL) {
                break;
            }
            //debugf("> act \"%s\"", token);

            rule.action = FWOW_RULE_ACTION_PASS;
            if (!strcmp(token, "drop")) {
                rule.action = FWOW_RULE_ACTION_DROP;
            } else if (!strcmp(token, "pass")) {
                rule.action = FWOW_RULE_ACTION_PASS;
            }

            ///
            /// Direction
            ///

            token = strsep(&running, delimiters);
            if (token == NULL) {
                break;
            }
            //debugf("> dir \"%s\"", token);

            rule.direction = FWOW_RULE_DIRECTION_ALL;
            if (!strcmp(token, "in")) {
                rule.direction = FWOW_RULE_DIRECTION_IN;
            } else if (!strcmp(token, "out")) {
                rule.direction = FWOW_RULE_DIRECTION_OUT;
            } else if (!strcmp(token, "all")) {
                rule.direction = FWOW_RULE_DIRECTION_ALL;
            }

            ///
            /// Protocol
            ///

            token = strsep(&running, delimiters);
            if (token == NULL) {
                break;
            }
            //debugf("> proto \"%s\"", token);

            rule.protocol = FWOW_RULE_PROTOCOL_ALL;
            if (!strcmp(token, "tcp")) {
                rule.protocol = FWOW_RULE_PROTOCOL_TCP;
            } else if (!strcmp(token, "udp")) {
                rule.protocol = FWOW_RULE_PROTOCOL_UDP;
            } else if (!strcmp(token, "all")) {
                rule.protocol = FWOW_RULE_PROTOCOL_ALL;
            }

            ///
            /// Source address start
            ///

            token = strsep(&running, delimiters);
            if (token == NULL) {
                break;
            }

            if (!strcmp(token, "*")) {
                rule.flags |= FWOW_RULE_FLAG_SRCADDR_ALL;
            } else {
                rule.srcaddr_min = htonl(in_aton(token));
            }

            //debugf("> src_e \"%s\", int = %u", token, rule.srcaddr_min);

            ///
            /// Source address end
            ///

            token = strsep(&running, delimiters);
            if (token == NULL) {
                break;
            }

            if ((rule.flags & FWOW_RULE_FLAG_SRCADDR_ALL) == 0) {
                if (strcmp(token, "*") != 0) {
                    rule.srcaddr_max = htonl(in_aton(token));
                }
            }

            //debugf("> src_e \"%s\", int = %u", token, rule.srcaddr_max);

            ///
            /// Source port start
            ///

            token = strsep(&running, delimiters);
            if (token == NULL) {
                break;
            }
            //debugf("> src_p_s \"%s\"", token);

            if (!strcmp(token, "*")) {
                rule.flags |= FWOW_RULE_FLAG_SRCPORT_ALL;
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
            //debugf("> src_p_e \"%s\"", token);

            if ((rule.flags & FWOW_RULE_FLAG_SRCPORT_ALL) == 0) {
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
                rule.flags |= FWOW_RULE_FLAG_DSTADDR_ALL;
            } else {
                rule.dstaddr_min = htonl(in_aton(token));
            }

            //debugf("> dst_s \"%s\", int = %u", token, rule.dstaddr_min);

            ///
            /// Dest address end
            ///

            token = strsep(&running, delimiters);
            if (token == NULL) {
                break;
            }

            if ((rule.flags & FWOW_RULE_FLAG_DSTADDR_ALL) == 0) {
                if (strcmp(token, "*") != 0) {
                    rule.dstaddr_max = htonl(in_aton(token));
                }
            }

            //debugf("> dst_e \"%s\", int = %u", token, rule.dstaddr_max);

            ///
            /// Dest port start
            ///

            token = strsep(&running, delimiters);
            if (token == NULL) {
                break;
            }
            //debugf("> dst_p_s \"%s\"", token);

            if (!strcmp(token, "*")) {
                rule.flags |= FWOW_RULE_FLAG_DSTPORT_ALL;
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
            //debugf("> dst_p_e \"%s\"", token);

            if ((rule.flags & FWOW_RULE_FLAG_DSTPORT_ALL) == 0) {
                if (kstrtoint(token, 10, &port)) {
                    break;
                }
                rule.srcport_max = (uint16) port;
            }


            //debugf("> flags %d", rule.flags);

            ///
            /// Add
            ///
            debug("<PLACEHOLDER> add rule to the list.");

        }

        kfree(buffer);
    }
    else
    {
        debug("failed to read rules file");
    }

    fwow_file_close(f);
}

/**
 * Release rules
 */
void fwow_rules_release(void)
{
    struct fwow_rule *rule, *temp;
    list_for_each_entry_safe(rule, temp, &fwow_rules_list, list)
    {
        list_del(&rule->list);
        fwow_rule_free(rule);
    }
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
