---
slug: '/notes/Copy-R-objects-into-Clipboard'
date: '2020-11-17'
title: 'Copy R objects into Clipboard'
tags: ['R']
abstract: 'This is something I want to do for a long time, to find a way to copy objects from R to clipboard. It is a much better way to export small amount of data in/out R session'
---

Firstly I find this pacakge `clipr`, which is very easy to use:

```R
library(clipr)
 write_clip(mtcars)
```
or directly:

```R
clipr::write_clip(c(1,2,3,4,5))
```

To use above trick on remove computer (like a server), some additional things, like xclip, need to be installed on server:

```bash
sudo yum install xclip -y
```

I am planning to develop a set of online user-super-friendly Bioinformatic tool, which allows user to do analysis directly online. I believe people would not like to always export data from R session to txt file, then upload txt file online, just for a simply plot. So it's great to have a way to directly copy/paste data from R session to clipboard.