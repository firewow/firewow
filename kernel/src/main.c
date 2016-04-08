/**
 * FireWOW Kernel Module
 * @author WoLfulus <wolfulus@gmail.com>
 */

#ifndef __KERNEL__
#define __KERNEL__
#endif

#ifndef MODULE
#define MODULE
#endif

#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

#include <linux/proc_fs.h>
#include <linux/string.h>
#include <linux/vmalloc.h>
#include <asm/uaccess.h>

#include "comm.h"
#include "utils.h"
#include "filters.h"
#include "rules.h"

/**
 * Module initialization
 */

int fwow_init(void)
{
	debug("initialization started");
    fwow_rules_initialize();
	fwow_filters_initialize();
	fwow_comm_initialize();
	debug("initialization finished");
	return 0;
}

/**
 * Module cleanup
 */

void fwow_exit(void)
{
	debug("cleanup started");
    fwow_comm_cleanup();
	fwow_filters_cleanup();
    fwow_rules_cleanup();
	debug("cleanup finished");
}

/**
 * Register
 */

module_init(fwow_init);
module_exit(fwow_exit);

/**
 * License
 */

MODULE_LICENSE("MIT");
MODULE_AUTHOR("João F. Biondo Trinca <wolfulus@gmail.com>");
MODULE_DESCRIPTION("FireWOW Module");
