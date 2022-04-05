---
slug: '/notes/Nanopore-Analysis:-Guppy-for-BaseCalling'
date: '2022-04-05'
title: 'Nanopore Analysis: Guppy for BaseCalling'
tags: ['nanopore']
abstract: 'Trying to use Guppy, an official Nanopore provided software for BaseCalling, which means convert "pore signals" into fastq ATCG information. But actually, Guyppy can also do alignment, barcoding, trimming works .etc'
---

Guppy is one of them official base calling software provided by Nanopore, it use machine learning for base calling. Basically my understanding is that it will has been pre-trained to identify what “signal” represent what base “ATCG”, then when the program run, it will classify each signal based on the pre-trained mode. Maybe that’s why it ask use to provided flow-cell type and kit type, because different material/protocol return different ML models. **Guppy can automatically do works like trimming, low-quality reads filtering and estimate methylation probability.**

In theory, Nanopore sequencing can be export directly when sequencing, but according to this [post](https://timkahlke.github.io/LongRead_tutorials/BS_G.html). By doing so, it will delay the process of sequencing, and also I think in many cases, when people do Nanopore sequencing once, they may want to use the data for more downstream analysis from methylation to 5hmC, thus “read-time basecalling” seems not very necessary then. However, this real-time base calling concept could be vital in the future, only after other big issues like storage, speed, accuracy .etc all are solved. In that day, there is maybe no need for Bioinformatician anymore...

Luckily I have GPU support. Note that the CUDA version is 11.4 here.

```bash
tian@slms-ci-beck-02 ~ $ nvidia-smi
Tue Apr  5 00:48:41 2022
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 470.103.01   Driver Version: 470.103.01   CUDA Version: 11.4     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  NVIDIA GeForce ...  Off  | 00000000:01:00.0 Off |                  N/A |
| 30%   41C    P8    21W / 350W |     19MiB / 24265MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
|   1  NVIDIA GeForce ...  Off  | 00000000:21:00.0 Off |                  N/A |
| 30%   36C    P8    21W / 350W |      5MiB / 24268MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
|    0   N/A  N/A      2846      G   /usr/lib/xorg/Xorg                  9MiB |
|    0   N/A  N/A      3059      G   /usr/bin/gnome-shell                8MiB |
|    1   N/A  N/A      2846      G   /usr/lib/xorg/Xorg                  4MiB |
+-----------------------------------------------------------------------------+
tian@slms-ci-beck-02 ~ $
```

There are some preparation work should be done before using Guppy. For example find `flowcell` type and `kit` type. In other word, I think Guppy pre-trained a lot of ML models for different combinations of flowcell and kit, so when use Guppy, we should find out what is our Nanopore data setting. Or another solution is to set default config file. In my case it’s dna_r9.4.1_450bps_hac_prom.

## Installation of Guppy

I don't know why but [the installation page](https://community.nanoporetech.com/docs/prepare/library_prep_protocols/Guppy-protocol/v/gpb_2003_v1_revad_14dec2018/linux-guppy) is hidden in Nanpore Community, seems I need to register to see it. I guess there is some patant protection here, so I won't paste the command here.

## Command for Guppy

I am using version 6.1.1+1f6bfa7f8 for Guppy here.

```
guppy_basecaller -i ../S01_subFast5 \
  -s ./guppyResult \
  -c dna_r9.4.1_450bps_hac_prom.cfg \
  --compress_fastq \
  -a ../S02_Minimap2/MT-human-ont.mmi \
  -x 'auto' \
  --bam_out

```

It seems those runner and number caller is not working now...I need to debug more.

## Output Result

In above code, I set `-s` as “guppyResult”, that’s where all result will be written into. One important file is `sequencing_summary.txt`. It contains informations like chr, start, end, alignment_accuracy, alignment_coverage .etc for each reads. In this file, each row is one read, so totally there are 24000 row. which is exactly what I counted as before. For example, I found out the mean read length in my subset fast5 file is 7930.

Another important thing is `pass` folder.

```bash
tian@slms-ci-beck-02 /scratch1/Tian/Nanopore/S03_Guppy/guppyResult/pass $ ls -lha
total 529M
drwxrwxr-x 2 tian tian 4.0K Apr  5 01:00 .
drwxrwxr-x 5 tian tian  264 Apr  5 01:00 ..
-rw-rw-r-- 1 tian tian  21M Apr  5 00:59 bam_runid_dc2ac203adf3e034d363fe1208fc805805ace1f5_0_0.bam
-rw-rw-r-- 1 tian tian  34M Apr  5 00:59 bam_runid_dc2ac203adf3e034d363fe1208fc805805ace1f5_1_0.bam
-rw-rw-r-- 1 tian tian  35M Apr  5 00:59 bam_runid_dc2ac203adf3e034d363fe1208fc805805ace1f5_2_0.bam
-rw-rw-r-- 1 tian tian  33M Apr  5 01:00 bam_runid_dc2ac203adf3e034d363fe1208fc805805ace1f5_3_0.bam
-rw-rw-r-- 1 tian tian  35M Apr  5 01:00 bam_runid_dc2ac203adf3e034d363fe1208fc805805ace1f5_4_0.bam
-rw-rw-r-- 1 tian tian  34M Apr  5 01:00 bam_runid_dc2ac203adf3e034d363fe1208fc805805ace1f5_5_0.bam
-rw-rw-r-- 1 tian tian  36M Apr  5 00:59 fastq_runid_dc2ac203adf3e034d363fe1208fc805805ace1f5_0_0.fastq
-rw-rw-r-- 1 tian tian  60M Apr  5 00:59 fastq_runid_dc2ac203adf3e034d363fe1208fc805805ace1f5_1_0.fastq
-rw-rw-r-- 1 tian tian  63M Apr  5 00:59 fastq_runid_dc2ac203adf3e034d363fe1208fc805805ace1f5_2_0.fastq
-rw-rw-r-- 1 tian tian  60M Apr  5 00:59 fastq_runid_dc2ac203adf3e034d363fe1208fc805805ace1f5_3_0.fastq
-rw-rw-r-- 1 tian tian  63M Apr  5 01:00 fastq_runid_dc2ac203adf3e034d363fe1208fc805805ace1f5_4_0.fastq
-rw-rw-r-- 1 tian tian  61M Apr  5 01:00 fastq_runid_dc2ac203adf3e034d363fe1208fc805805ace1f5_5_0.fastq
```

So for the output, it looks like it’s based on file index, which means one fast5 file could eventually leads to one bam file. So, I guess if for one folder, there are 100 fast5 files, they all belong to one person (sample), after this step, we actually get 100 small bam files for this person, we should be able to merge them into one large bam file. Here I think Guppy did not take methylation information into consideration? Need to explore more...