/**
 * FireWOW Kernel Module
 * @author WoLfulus <wolfulus@gmail.com>
 */

#ifndef _FWOW_UTILS
#define _FWOW_UTILS

#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>

#define FWOW_BIT_CHECK(obj, flag) ((obj & flag) == flag)

#define FWOW_IP_FORMAT      "%u.%u.%u.%u"
#define FWOW_IP_VALUE(ip)    \
    (((ip) & 0xFF000000) >> 24), \
    (((ip) & 0xFF0000) >> 16), \
    (((ip) & 0xFF00) >> 8), \
    (((ip) & 0xFF))

#define debug(msg)	        printk(KERN_INFO "[firewow][%s] " msg "\n", __FUNCTION__)
#define debugf(msg, ...)    printk(KERN_INFO "[firewow][%s] " msg "\n", __FUNCTION__, __VA_ARGS__)

#endif
