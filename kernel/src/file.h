/**
 * FireWOW Kernel Module
 * @author WoLfulus <wolfulus@gmail.com>
 */

#ifndef _FWOW_FILES
#define _FWOW_FILES

#include <linux/fs.h>

struct file* fwow_file_open(const char* name, int flags, umode_t mode);
void fwow_file_close(struct file* f);
ssize_t fwow_file_read(struct file* f, char* buffer, size_t count);
ssize_t fwow_file_readline(struct file* f, char* buffer, size_t count);
#endif
