---
slug: '/notes/Download-SRA-Sequence'
date: '2022-01-17'
title: 'Download SRA Sequence'
tags: ['SRA']
abstract: 'A record of some command can be used for SRA download.'
---

In many cases, I need to download raw SRA Sequence files. Normally these fastq files are large (70+GB). Thus, it's vital to find some solutions for fast downloading. Here are two command I find can be used for SRA download:

## 1. fastq-dump

This command is simple to use, seems reliable but a bit slow.

```bash
fastq-dump --split-files SRR3709202
```

I think above code can be optimised with `parallel` linux program. I will try write on next time I need to download batch SRA files.

## 2.parallel-fastq-dump

parallel-fastq-dump can be installed with `conda`, then used as below. Note that I found that it will fail sometimes, especially when I set thread high, for example 30.

```bash
parallel-fastq-dump --sra-id SRR568016 --threads 10 --outdir out/ --split-files --gzip --tmpdir /data/Tian/myTMP
```