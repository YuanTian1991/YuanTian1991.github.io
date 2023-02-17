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


### Genome Version

The first vital thing, is <b style="background-color: yellow">the default CHR/MAPINO .etc are based on hg38</b>, previously the EPICv1 was based on hg19. This means that I better provide a hg19 version for user as well.

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

So this is a major difference between V1 and V2. Below comparison shows that EPICv2 have more CpGs then EPICv1. But not all CpGs in V1 are contained in V2. According to the official document from illumina, there are 143467 CpGs removed from EPICv1, and there are 209834 new CpGs added into V2. 



```R
> nrow(EPICv1)
[1] 865918
> nrow(EPICv2)
[1] 937055
> setdiff(rownames(EPICv1), EPICv2$Name) %>% length
[1] 144116
> setdiff(EPICv2$Name, rownames(EPICv1)) %>% length
[1] 208856
> 
```

Below is my code checking, the removed and new-added number seems slightly different, Why? Also, the illumina document listed that:

1. Flagged probes: Approximately 49K probes did not meet performance expectations based on internal Illumina probe-level analysis.
2. Probes with mapping inaccuracies: A subset of approximately 190 probes were identified with inaccurate mapping.

Um...I have a lot of work to do in the future months.

### UCSC vs GENCODEv41

Most analyses in ChAMP focus on CpG, but still, there are some of them are related to genes, so it relies on genome annotation. The default illumina manifest provided two genome annotation, UCSC and GENCODEv41. In my current version of ChAMPdata (2.31.1), I will use UCSC one. Also, currently I will only extract one gene (the first) of a CpG is related with multiple genes.

### Genome Feature Information

In ChAMP's previous annotation, I need to know information like TSS200, TSS1500, Body, Exon .etc. However, I found that in the latest version of the UCSC CpG Island annotation (UCSC_RefGene_Group column), some tags are lost, like below:

```r
> table(EPICv1$feature)

1stExon   3'UTR   5'UTR    Body ExonBnd     IGR TSS1500  TSS200
  26433   21594   73070  318165    5680  249608  107193   65152
>
> table(EPICv2$feature)

           3UTR    5UTR    Exon TSS1500  TSS200 
 614365   13458   29247  101698  122150   56137 
```

So one key piece of information lost is `Body`... without body, I can't correctly annotate what CpGs are in IGR (Intergenic Gene Regions). This issue need to be solved. Also, I quickly checked the GENCODEv41 version feature annotation, it varies a lot when compared with UCSC one...


---

My script for preprocessing is [here](https://github.com/YuanTian1991/ChAMP-Script/blob/master/Manifest2Annotation_EPIC_v2.R). It works and I should get EPICv2 done soon. However, it's vital to re-design the whole structure of ChAMP, along with the annotation supply system.

