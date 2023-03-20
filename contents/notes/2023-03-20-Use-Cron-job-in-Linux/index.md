---
slug: '/notes/Use-Cron-job-in-Linux'
date: '2023-03-20'
title: 'Use Cron job in Linux'
tags: ["Linux", "DevOps"]
abstract: 'A new trick, set up automatic cron job for my linux tasks'
---

So I wrote some script, and I want it to be run every hour, I found that I can try use Cron to set it up.

## Start Cron Job

Firstly below command would open a file in tmp folder for me to edit. 

```shell
crontab -e
```

The lines I put will be automatically triggered:

```shell
* * * * * ls /home/tian > /home/tian/test_cron.txt
```

This is a simple example: the command will be triggered every minute, and a file will be exported into my home folder. After edit, save and close it, then the command will be triggered automatically.

If you want to stop it, open it again, remove all the lines, then save and close it.

## Check my Cron Job

Below command works.

```
crontab -l
```