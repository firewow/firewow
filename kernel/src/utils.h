/**
 * FireWOW Kernel Module
 * @author WoLfulus <wolfulus@gmail.com>
 */

#ifndef _FWOW_UTILS
#define _FWOW_UTILS

#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

#define debug(msg)				printk(KERN_INFO " [%s]" msg "\n", __FUNCTION__)

#endif
