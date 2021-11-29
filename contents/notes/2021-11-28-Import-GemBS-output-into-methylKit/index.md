---
slug: '/notes/Import-GemBS-output-into-methylKit'
date: '2021-11-28'
title: 'Import GemBS output into methylKit'
tags: ['RRBS', 'methylKit']
abstract: 'Previously I have preprocessed RRBS data with GemBS, now I want to continue the downstream analysis. The tool I am using is methylKit, so I find a way to import the GemBS output result into methyKit.'
---

I am recently working on a set of RRBS data, I have preprocessed it with [gemBS-rs](https://github.com/heathsc/gemBS-rs), which is fast and super easy to run in my [previous note](https://yuantian1991.github.io/notes/Analysis-RRBS-with-GemBS). The next step is to import the gemBS output into a downstream software, here I am using [methylKit](https://bioconductor.org/packages/release/bioc/html/methylKit.html). methylKit actually does not defaultly support GemBS, but it support Bismark, another famouse bisulfit sequencing mapping tool. However, methylKit does [support a generic file format](https://bioconductor.org/packages/release/bioc/manuals/methylKit/man/methylKit.pdf), which means I just need to prepare files with required column, then it can be imported into methylKit.


```R
# read a generic text file containing CpG methylation values
# let's first look at the content of the file
generic.file=system.file("extdata", "generic1.CpG.txt",package = "methylKit")
read.table(generic.file,header=TRUE)
# And this is how you can read that generic file as a methylKit object
myobj=methRead( generic.file,
pipeline=list(fraction=FALSE,chr.col=1,start.col=2,end.col=2,
coverage.col=4,strand.col=3,freqC.col=5),
sample.id="test1",assembly="hg18")

```

So what I need to do is to figure out how to "fit" GemBS output (extracted CpG file) to methylKit generic import plan.

## 1. Reformat GemBS ENCODE CpG files

According to the methylKit document, it requires "chr", "start", "end", "strand", "coverage", "freqC", and "freqT" columns as input. However, according to the [tutorial of gemBS](http://statgen.cnag.cat/GEMBS/UserGuide/_build/html/pipelineExtract.html), the output have two format, ENCODE format and gemBS format. Between then, **only the ENCODE style file have strand information**. So, to achieve my goal, I want to reformat the ENCODE style files, (those with `_cpg.bed.gz` ending) with above column.

Among them one thing is to calculate **freqC** and **freqT**. In bisulfit conversion, unmethylated cytosine will be converted to uracils (U), then it will be sequenced out as "T", thus freqT represent the "unmethylated ratio". Also, methylated cytosine will be "protected" (or "covered", "attached" whatever similar words) by methyl chemical group, so it will remain to be cytosine, thus freqC represent the ratio of "methylated" sites.

So, in the ENCODE style output of GemBS, the 11th column "Percentage of reads showing methylation" represent the freqC, and we can manually calculate freqT as: 100 - freqC. Below is a script I wrote to do the conversion. By using `data.table` R package, it takes roughtly 5-10 seconds to convert one gemBS output into methylKit readable file format.

```R
# This script read into GemBS's output with MethylKit
# Author: Tian

library(data.table)

## Convert gemBS export ENCODE style CpG bed file into MethylKit Generic style.
cpgFiles <- dir("../1.GemBS_Analysis/result/extract/", recursive=TRUE, full.names=TRUE, pattern="*_cpg.bed.gz$")
baseDIR <- "./reformatedCpG/"

if(!file.exists(baseDIR)) dir.create(baseDIR)

for(fileName in cpgFiles) {

    sampleName <- strsplit(fileName, split=c("/", "_"))[[1]][6]
    message("Formating sample ", sampleName)

    tmpTable <- fread(fileName, skip=1)
    tmpTable <- tmpTable[,c(1,2,3,6,10,11)]
    colnames(tmpTable) <- c("chr", "start", "end", "strand", "coverage", "freqC")
    tmpTable[,"freqT" := 100 - freqC]

    fwrite(tmpTable, paste0(baseDIR, sampleName, "_reformated.CpG.txt"), quote=FALSE, row.names=FALSE, sep="\t")
}
```
All the *_cpg.bed.gz (ENCODE format output) will be converted into a folder called `reformatedCpG` in current dir.

## 2. Read generic files into methylKit

After transforming, the second step is to read the files into R with methyKit. The software provided a function to organize all samples into one large beta matrix, which is perfect for downstream analysis.

```R
cpgFiles <- dir("./reformatedCpG", full.name=TRUE)
sampleNames <- unname(sapply(cpgFiles, function(x) str_extract(x, "(?<=CpG/)(.*)(?=_reformated)")))

myobj <- methRead(as.list(cpgFiles),
                  sample.id=as.list(sampleNames),
                  pipeline=list(fraction=FALSE, chr.col=1, start.col=2, end.col=2,
                                coverage.col=5, strand.col=4, freqC.col=6),
                  assembly="hg38",
                  treatment=pheno,
                  mincov=7)

filtered.myobj <- filterByCoverage(myobj, lo.count=7, lo.perc=NULL, hi.count=NULL, hi.perc=99.9)
filtered.normed.myobj <- normalizeCoverage(filtered.myobj)

meth <- unite(filtered.normed.myobj, destrand=FALSE)
beta <- percMethylation(meth)/100
save(meth,file="meth.rda")
```

By using above script, each reformed CpG file in `reformedCpG` folder can be imported into R via methylKit, and a matrix (`beta` object) can be generated. Note that in `meth` function above, it will select only CpG sites exist in all samples, so if you have many samples (50, or even 100+), it maybe hard to find consensus CpGs, you may adjust `min.per.group` parameter in this function to ask program how many samples need to be "consensus" for a CpG site.