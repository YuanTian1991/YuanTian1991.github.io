---
slug: "/notes/Backup-and-Restore-MongoDB"
date: "2020-06-28"
title: "Backup and Restore MongoDB"
tags: ['MongoDB']
abstract: "Since I am developing GCGR website, constantly I will need to modify the databse. So I may need to transfer the data from online to offline constantly.  Here I want to record a bit the commands I use to dump data and recover them."
---

My GCGR platform is using MongoDB, so here since I have a new computer, so I need to find a way to Backup and Restore my MongoDB.

After searching online, I find below solution works:

```bash
[yuanti01@gcgr ~]$ mkdir DBbackup
[yuanti01@gcgr ~]$ mongodump --db=GCGRdb --out=DBbackup/mongodump-2013-10-24
2020-02-04T21:00:32.145+0000	writing GCGRdb.celllines to
2020-02-04T21:00:32.145+0000	writing GCGRdb.users to
2020-02-04T21:00:32.145+0000	writing GCGRdb.clinfos to
2020-02-04T21:00:32.354+0000	done dumping GCGRdb.clinfos (1 document)
2020-02-04T21:00:32.625+0000	done dumping GCGRdb.celllines (1802 documents)
2020-02-04T21:00:32.646+0000	done dumping GCGRdb.users (55 documents)
```

In the command `—db` indicates the database I want to backup, and `—out` indicates the directory I want to place the file. So here I think it's done.

Then after fetch data from the online server to my current computer, I need to restore it.

```bash
mongorestore mongodump-2013-10-24
```

Then everything is restored on my computer that I can continue to develop it. Of course there should have many more parameter I did not clear, but currently, these two lines of code is enough for me to use.