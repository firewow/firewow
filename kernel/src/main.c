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

#include "utils.h"
#include "filters.h"

/**
 * License
 */

MODULE_LICENSE("MIT");
MODULE_AUTHOR("João F. Biondo Trinca <wolfulus@gmail.com>");
MODULE_DESCRIPTION("FireWOW Module");

/**
 * Module initialization
 */
int init_module(void)
{
	debug("FireWOW initialization started.");
	fwow_filters_initialize();
	debug("FireWOW initialization finished.");
	return 0; /* ==0: success, !=0: failed */
}

/**
 * Module cleanup
 */
void cleanup_module(void)
{
	debug("FireWOW cleanup started.");
	fwow_filters_cleanup();
	debug("FireWOW cleanup finished.");
}
