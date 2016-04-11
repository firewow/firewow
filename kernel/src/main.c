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
    debug("#######################################################");
	debug("initialization started");

    if (fwow_rules_initialize())
        goto clean1;

    if (fwow_filters_initialize())
        goto clean2;

	if (fwow_comm_initialize())
        goto clean3;

	debug("initialization finished");
	return 0;

clean3:
    fwow_comm_cleanup();
clean2:
    fwow_filters_cleanup();
clean1:
    fwow_rules_cleanup();

    debug("initialization finished with error");
    return -EIO;
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
