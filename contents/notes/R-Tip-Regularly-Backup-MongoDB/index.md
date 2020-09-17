---
slug: "/notes/Regularly-Backup-MongoDB-with-R-script"
date: "2020-07-07"
title: "Regularly Backup MongoDB with R script"
tags: ['R', 'rds', 'github']
abstract: "I am maitaining the GCGR website. So I think it's a good idea to constantly backup the database a bit. So my idea is to regularlly run some R code (because I only good at R), and scp/push dumped file to RDS and github separately."
---

The problem I am facing is I want my GCGR website database get backup regularly. And sadly I am only good at R language.

### How to run some R code regularly?

First issue I need to solve is how to run a functional regularlly? Of course a simple for/while loop should work. But I found a better solution in [Xie's blog](https://yihui.org/en/2017/10/later-recursion/), who recommanded a package called `later`, it could delay the code a bit.

For example, below hello message would be printed after 5 seconds:
```R
librairy('later')
later(~cat("Hello from the past\n"), 5)
```

So the problem is **later could only run once**. Xie proposed that we can employ later function inside our main function. It means, I can write my code into a function, then at the end of the function, run later on the function itself, then a time schedual would be re-arranged at each end of the program.

Below is the code I write to backup my GCGR database:

In below code, main backup functional code is actually bash code, I just pasted the command with a time stamp, then use `system` function to run it.

```R
# This is a script I wrtoe to automatically backup GCGR database file into RDS and my github
# Yuan Tian

library('later')

mongoBackup <- function(intervel = 86400){

  timeStamp <- format(Sys.time(), "%Y-%m-%d-%H-%M-%S")

  message("\n-----------------------------")
  message("Bakckup at ", timeStamp)
  
  backupCommand <- paste0("mongodump --db=GCGRdb --out=./mongodump-", timeStamp)
  system(backupCommand)

  later::later(mongoBackup, intervel)
}

mongoBackup()
```

At the end of the function, a 86400 second "delay" would be set for set for next run.

### Backup to Github

Now I can dump MongoDB file successfully. Next questions is how to store these file into another place. Firstly I would try to push them to my github. **Here I need to set my vm could automatically push to github, by setting SSH key.**

Then modify the code as:
```R
  ...
  system(backupCommand)

  system('git add --all')
  system(paste0("git commit -m 'Backup at ",timeStamp, "'"))
  system("git push origin master")

  later::later(mongoBackup, intervel)
  ...
```

The above code looks super ugly, but it really works...

### Backup to RDS

Finally, I want to also backup it in the RDS. It should not be hard, and should be able to be set automatically.

Firstly I installed `yum install sshpass`.

Then compose below command for RDS `scp`. The code is becoming more than more ugly...
```R
 system(paste0("sshpass -p 'myRDSpassword' scp -r ./mongodump-", timeStamp," regmtyu@ssh.rd.ucl.ac.uk:/mnt/gpfs/home/regmtyu/rd00qp/GCGR_DBbackup"))
```

Finally, I set the time as one week for one backup.