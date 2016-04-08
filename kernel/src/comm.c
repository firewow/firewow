/**
 * FireWOW Kernel Module
 * @author WoLfulus <wolfulus@gmail.com>
 */

#include "comm.h"
#include "utils.h"

/**
 * Initialization
 */
int fwow_comm_initialize(void)
{
	debug("initializing communication device");
    return 0;
}

/**
 * Cleanup
 */
void fwow_comm_cleanup(void)
{
	debug("cleaning communication device");
}
