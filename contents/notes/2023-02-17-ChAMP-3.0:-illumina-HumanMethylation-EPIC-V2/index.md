---
slug: '/notes/ChAMP-3.0:-illumina-HumanMethylation-EPIC-V2'
date: '2023-02-17'
title: 'ChAMP 3.0: illumina HumanMethylation EPIC V2'
tags: ["ChAMP"]
abstract: 'I am updating the ChAMP with the new illumina Human Methylation Array, V2. Here are some record'
---

It's a big sorry for the community that I delayed this work for about 3 months.

Basically, I don't quite like current ChAMP's code structure, especially the [ChAMPdata package part](https://www.bioconductor.org/packages/release/bioc/html/ChAMP.html), which just holds all array's annotation, which includes 450K, EPIC v1, EPIC v2 (this post is about), and Mouse. And incredibly for each array, there are two R object saved: One `AnnoXXX` for IDAT file parsing, and a `probe.feature.xxx` for downstream analysis...

This must be changed ASAP.

So illumina released [EPIC V2](https://emea.support.illumina.com/array/array_kits/infinium-methylationepic-beadchip-kit/downloads.html) in November last year, which should have some difference when compared with V1. Mostly people emphasized the difference of probes between V1 and V2. However, by preparing manifest to ChAMP-usable R object, I found more things I should look into the coming future. Below are some comparison I did between V1 and V2, along with some issues on annotation side I should address in the future.

### Name ≠ IlmnID

The illumina manifest always contains two columns, **Name** and **IlmnID**. In previous versions (except the mouse one), they are always the same. However, in EPIC V2, they are not exactly the same.

```R
> length(unique(cpg$IlmnID))
[1] 937055
> length(unique(cpg$Name))
[1] 930658
> 
```

I currently don't know why some Names are duplicated yet but will look into that. In ChAMP, I will only use the IlmnID for its uniqueness.

### Number of CpGs

So this is a major difference between V1 and V2. Below comparison shows V2 contains 71137 more CpGs.

```R
> dim(EPICv1)
[1] 865918      4
> dim(EPICv2)
[1] 937055      4
> 
```

