---
slug: '/notes/Nanpore-Analysis:-Bonito-for-BaseCalling'
date: '2022-06-02'
title: 'Nanpore Analysis: Bonito for BaseCalling'
tags: ["Nanopore"]
abstract: 'After using Guppy, I was recommended to use Bonito for base calling, it is said that Bonito has pretty high accuracy when compared with old method. More important, it can directly use remora for methylation analysis. Here is a record of how I use bonito for base calling'
---


[Bonito](https://github.com/nanoporetech/bonito) is also an official software provide by Nanopore company, which also use machine learning for base calling. Also, it would integrate with [Remora](https://github.com/nanoporetech/remora). I have check in detail what are the clear difference between Boito and Guppy, but here I quickly recorded the code I need to bonito running.

## 1. Minimap Preparasion

To run Bonito, I need to firstly creart indexed reference. After install of minimap2 and download of hg38.fq.gz, I can run below command for indexing.

```bash
minimap2 -x map-ont -d MT-human-ont.mmi ./hg38.fa.gz
```

## 2. Install Bonito

I encountered some problem when install Bonito as `pip install ont-bonito` seems not working on my server, by checking cuda seting with `nvidia-smi` and the [release page](https://github.com/nanoporetech/bonito/releases), I tried to install with below command:

```bash
pip install -f https://download.pytorch.org/whl/torch_stable.html ont-bonito-cuda113
```
Note that after installation, the software is located in `/home/tian/.local/bin`, which is not in my default exported path, thus I added a line in my `.zshrc` to make it work.

## 3. Run Bonito

After installation of Bonito and preparasion of minimap, now I can run Bonito for base calling. In my case, I am using Bonito for 5mC calling, which will directly use Remora pre-trained model for base calling. One issue I am facing now is the the sequencing data size is too big. Totally there are 7100+ fast5 files. Thus in terms of my server situation. I can only download each 100 of them, then run Bonito, then remove those files.

```R
# This is a scrtipt to automatically download fast5 folder to server, then preprocess them with Bonito.
# Author: Tian

library("glue")

source("./NoticeEmail.R")

# Firstly get list of fast5 files from server.
f5List <- read.csv("./f5List.txt", head=F)
f5List <- as.character(f5List[,1])

# Cut all samples into 72 groups, in this case, each group has 100 files.
batches <- as.numeric(cut(1:length(f5List), 72))

DownloadFolder <- "DownloadedF5"
PreprocessedFolder <- "PreprocessedBAM"

if(!file.exists(DownloadFolder)) dir.create(DownloadFolder)
if(!file.exists(PreprocessedFolder)) dir.create(PreprocessedFolder)

zz <- file("log.txt", open = "wt")
sink(zz ,type = "output")
sink(zz, type = "message")

for(i in 1:72) {
    message("\n =========== Running batch ", i, "...")

    # For each batch, I download it from RDS with rsync.
    targetF5 <- f5List[batches == i]
    targetF5 <- paste0("/mnt/gpfs/live/rd00__/ritd-ag-project-rd00xq-tyuan50/", substr(targetF5, 2, 1000))
    targetF5 <- paste(targetF5, collapse=" ")

    cmd <- glue("sshpass -p 'password' rsync -chavzP --stats regmtyu@ad.ucl.ac.uk@ssh.rd.ucl.ac.uk:'{targetF5}' {DownloadFolder}")
    system(cmd)

    # Run Bonito, here I am using 5mc Model.
    cmd <- glue("nice -n 10 bonito basecaller dna_r9.4.1_e8_sup@v3.3 --device cuda:0 ./{DownloadFolder} --modified-bases 5mc --reference ../S01_Minimap/MT-human-ont.mmi --recursive --alignment-threads 100 > ./{PreprocessedFolder}/5hmC_batch{i}.bam")
    system(cmd)

    # Remove all pre-downloaded file.
    cmd <- "rm -rf ./{DownloadFolder}/*"
    system(cmd)
    
    # Email modification
    NoticeEmail(paste0("Bonito 5hmC Batch ", i , " Done"), "Good it's still running...")
}

sink()
sink()
```

The model `dna_r9.4.1_e8_sup@v3.3` is decided by the sequencing machine and flow cell type. It should be provided in sequencing information directly.

The `--device cuda:0` is setting for GPU. Currently, according to [some github discussion](https://github.com/nanoporetech/bonito/issues/13), Bonito only support only one GPU. In my case I am using only one CUDA for runnning. **I tried to use multiple CUDA for running at the same time but eventually failed**. I guess there is something wrong with the CUDA setting on my server.

There is a email notification for me after each run finish. I implemented it as posted [here](https://yuantian1991.github.io/notes/Send-Email-in-R-with-mailR).

After this setting, after every 5-6 hours, I will have one BAM file generated from each batch. After all the batches are done. I can use Modbam2bed to get 5mC signals.