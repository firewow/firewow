/**
 * FireWOW Kernel Module
 * @author WoLfulus <wolfulus@gmail.com>
 */

 #include "common.h"
 #include "utils.h"
 #include "rules.h"

 #include <linux/fs.h>
 #include <linux/string.h>
 #include <asm/segment.h>
 #include <asm/uaccess.h>
 #include <linux/buffer_head.h>

/**
 * Enter segment
 */
void fwow_file_segment_enter(mm_segment_t* segment)
{
    *segment = get_fs();
    set_fs(get_ds());
}

/**
 * Leave segment
 */
void fwow_file_segment_leave(mm_segment_t* segment)
{
    set_fs(*segment);
}

/**
 * File open
 */
struct file* fwow_file_open(const char* name, int flags, umode_t mode)
{
    mm_segment_t fs;
    struct file* f = NULL;
    fwow_file_segment_enter(&fs);
    f = filp_open(name, flags, mode);
    fwow_file_segment_leave(&fs);
    return f;
}

/**
 * File close
 */
void fwow_file_close(struct file* f)
{
    if (f != NULL)
    {
        filp_close(f, NULL);
    }
}

/**
 * File read
 */
ssize_t fwow_file_read(struct file* f, char** buffer)
{
    mm_segment_t fs;
    ssize_t totalSize = 0;

    if (f == NULL)
    {
        return totalSize;
    }

    fwow_file_segment_enter(&fs);

    totalSize = vfs_llseek(f, 0, SEEK_END);
    vfs_llseek(f, 0, 0);
    *buffer = kmalloc(totalSize, GFP_KERNEL);
    vfs_read(f, *buffer, totalSize, &f->f_pos);

    fwow_file_segment_leave(&fs);
    return totalSize;
}
