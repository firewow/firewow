/**
 * FireWOW Kernel Module
 * @author WoLfulus <wolfulus@gmail.com>
 */

#ifndef _FWOW_NAT
#define _FWOW_NAT

#include "common.h"
#include <linux/list.h>
#include <linux/netfilter_ipv4.h>

/**
 * Methods
 */
int fwow_nat_initialize(void);
void fwow_nat_cleanup(void);

#endif
