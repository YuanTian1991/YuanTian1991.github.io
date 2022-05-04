---
slug: '/notes/Parallel-in-R'
date: '2022-05-04'
title: 'Parallel in R'
tags: ['R', "paprallel"]
abstract: 'Here is a simple record of how to use multiple ways to do R parallel running.'
---

R is such a handy languages, but the parallel is not. It can't perform like node.js, that in parallel running, each thread must have one core used. Thus, the maxium core is limited by the machine.

There are a couple of ways to do parallel running in R. Previously I always use `doParallel`, but recently I prefer `mclapply`.

## mclapply

Just like below:

```R
library("parallel")

getConversionRate <- function(path) {
    name <- strsplit(path, split="//")[[1]][2]
    message("Working on ", name, "...")

    chh <- fread(glue("{path}/{name}_chh.bed.gz"), skip=1, sep="\t")
    cpg <- fread(glue("{path}/{name}_cpg.bed.gz"), skip=1, sep="\t")
    
    return(c(mean(chh$V11[chh$V10 >= 7]), mean(cpg$V11[cpg$V10 >= 7])))
}

conversionResult <- mclapply(df$path, function(x) getConversionRate(x), mc.cores = 80)
```

Sometimes I noticed that with `mclapply`, if the R program is killed in the middle of running (for example, due to lack of disk space), the threads are still runnning. In that case, I directly kill all threads with:

```bash
sudo killall -u tian
```

## doParallel

The `detectCores()` function is useful to find out total number of cores can be used on the machine.

```R
# load Package
library("doParallel")
# Find out how many cores are available.
detectCores()
# Create cluster with desired number of cores.
cl <- makeCluster(3)
# Reguster cluster
registerDoParallel(cl)
#Find out how many cores are being used
getDoParWorkers()


library(foreach)
x <- foreach(i = df$path, .combine='rbind', .packages=c('data.table', "glue")) %dopar% getConversionRate(i)

registerDoSEQ()
on.exit(stopCluster(cl))
```

The `.package` is vital sine in many case functions for parallel depend on some other packages, so it MUST be exported into each thread.