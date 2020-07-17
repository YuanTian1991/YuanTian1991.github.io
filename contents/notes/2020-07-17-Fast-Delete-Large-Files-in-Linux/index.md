---
slug: '/notes/Fast-Delete-Large-Files-in-Linux'
date: '2020-07-17'
title: 'Fast Delete Large Files in Linux'
tags: ['shell']
abstract: 'A way to quickly delete files in Linux. Faster than rm, it could be used when I have a lot of files to delete.'
---

Sometimes I need to delete large amount of files on linux, for example some folders bigger than 200GB. 

The traditional `rm` method is really not fast enough. Then I searcher out a method could do this far quicker:

Assume the folder I want to delete is called `OldFiles`. We firstly enter the directory on the same level of this folder, then create a folder called `/blank`. Then use below code:

```bash
rsync --delete-before -d ./blank/ ./OldFiles/
```

By using this way, we can delete large amount to files really quick, though I don't know why it's that. 