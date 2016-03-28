/**
 * FireWOW Kernel Module
 * @author WoLfulus <wolfulus@gmail.com>
 */

#include "comm.h"
#include "utils.h"

#include <linux/fs.h>
#include <asm/uaccess.h>  /* for put_user */
#include <asm/errno.h>

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
